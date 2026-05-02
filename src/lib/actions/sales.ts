'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const SaleItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().min(1),
  price: z.number().min(0),
})

const CreateSaleSchema = z.object({
  branchId: z.string().uuid(),
  cashierId: z.string().uuid(),
  items: z.array(SaleItemSchema).min(1),
  paymentMethod: z.enum(['CASH', 'CARD', 'MOBILE_MONEY']),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
})

export type CreateSaleInput = z.infer<typeof CreateSaleSchema>

export async function createSale(input: CreateSaleInput) {
  try {
    // 1. Validate Input
    const validatedData = CreateSaleSchema.parse(input)
    
    // 2. Calculate Totals
    const subtotal = validatedData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const totalAmount = subtotal + validatedData.tax - validatedData.discount

    // 3. Execute Database Transaction
    // Transactions ensure that if any part of the sale fails (e.g., inventory update), 
    // the entire operation is rolled back.
    const sale = await prisma.$transaction(async (tx) => {
      // a. Create the Sale record
      const newSale = await tx.sale.create({
        data: {
          branchId: validatedData.branchId,
          cashierId: validatedData.cashierId,
          totalAmount,
          discount: validatedData.discount,
          tax: validatedData.tax,
          paymentMethod: validatedData.paymentMethod,
          items: {
            create: validatedData.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      })

      // b. Update Inventory for each item
      for (const item of validatedData.items) {
        const inventory = await tx.inventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: validatedData.branchId,
            },
          },
        })

        if (!inventory || inventory.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ID: ${item.productId}`)
        }

        await tx.inventory.update({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: validatedData.branchId,
            },
          },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        })
      }

      return newSale
    })

    revalidatePath('/dashboard/sales')
    revalidatePath('/dashboard/inventory')
    
    return { success: true, data: sale }

  } catch (error) {
    console.error('Sale Transaction Error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input data', details: error.errors }
    }
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred during the sale.' 
    }
  }
}
