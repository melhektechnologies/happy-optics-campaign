'use server'

import { z } from 'zod'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const SaleItemSchema = z.object({
  productId: z.string(), // CUID
  quantity: z.number().min(1),
  price: z.number().min(0),
})

const CreateSaleSchema = z.object({
  branchId: z.string(),
  cashierId: z.string(),
  items: z.array(SaleItemSchema).min(1),
  paymentMethod: z.enum(['CASH', 'CARD', 'MOBILE_MONEY']),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0), // Percentage
})

export type CreateSaleInput = z.infer<typeof CreateSaleSchema>

export async function createSale(input: CreateSaleInput) {
  try {
    const validatedData = CreateSaleSchema.parse(input)
    
    // 1. Precise Financial Calculations
    const subtotal = validatedData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const taxAmount = subtotal * (validatedData.tax / 100)
    const totalAmount = subtotal + taxAmount - validatedData.discount
    const netAmount = subtotal - validatedData.discount // Amount before tax

    // 2. Atomic Transaction Block
    const result = await prisma.$transaction(async (tx) => {
      // a. Generate Smart Receipt Number
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '')
      const lastSale = await tx.sale.findFirst({
        where: { branchId: validatedData.branchId },
        orderBy: { createdAt: 'desc' }
      })
      const nextSeq = lastSale ? (parseInt(lastSale.receiptNumber.split('-').pop() || '0') + 1) : 1
      const receiptNumber = `SALE-${validatedData.branchId.slice(-4)}-${dateStr}-${nextSeq.toString().padStart(5, '0')}`

      // b. Create the Sale record
      const sale = await tx.sale.create({
        data: {
          receiptNumber,
          branchId: validatedData.branchId,
          cashierId: validatedData.cashierId,
          totalAmount,
          netAmount,
          taxAmount,
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
        include: { items: true }
      })

      // c. Atomic Inventory Update & Stock Validation
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
          throw new Error(`Critical: Insufficient stock for product ID: ${item.productId}`)
        }

        await tx.inventory.update({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: validatedData.branchId,
            },
          },
          data: {
            quantity: { decrement: item.quantity },
          },
        })
      }

      // d. Financial Ledger Entry
      await tx.transaction.create({
        data: {
          type: 'INCOME',
          amount: totalAmount,
          referenceId: sale.id,
          status: 'COMPLETED'
        }
      })

      // e. Audit Logging
      await tx.auditLog.create({
        data: {
          userId: validatedData.cashierId,
          action: 'SALE_CREATED',
          entity: 'Sale',
          entityId: sale.id,
          newData: { receiptNumber, totalAmount }
        }
      })

      return sale
    })

    revalidatePath('/dashboard/sales')
    revalidatePath('/dashboard/inventory')
    revalidatePath('/dashboard/finance')
    
    return { success: true, data: result }

  } catch (error) {
    console.error('Enterprise Sale Pipeline Failure:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'A critical failure occurred during the transaction.' 
    }
  }
}
