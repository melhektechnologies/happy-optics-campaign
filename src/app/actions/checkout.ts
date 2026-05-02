"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { CartItem } from "@/store/useCartStore"
import { revalidatePath } from "next/cache"

export async function processCheckout(items: CartItem[], branchId: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized access to POS systems.")

  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0
    let taxAmount = 0

    // 1. Validate Stock & Calculate Totals
    for (const item of items) {
      const inventory = await tx.inventory.findUnique({
        where: { productId_branchId: { productId: item.id, branchId } },
        include: { product: true }
      })

      if (!inventory || inventory.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${item.name}`)
      }

      totalAmount += item.price * item.quantity
      taxAmount += (item.price * item.taxRate) * item.quantity

      // 2. Decrement Stock
      await tx.inventory.update({
        where: { id: inventory.id },
        data: { quantity: { decrement: item.quantity } }
      })
    }

    const netAmount = totalAmount + taxAmount

    // 3. Create Sale Record
    const sale = await tx.sale.create({
      data: {
        branchId,
        cashierId: (session.user as any).id,
        totalAmount: totalAmount,
        netAmount: netAmount,
        taxAmount: taxAmount,
        receiptNumber: `BR-${branchId.slice(-4)}-${Date.now()}`,
        status: "COMPLETED",
        paymentMethod: "CASH", // Default for now, should be passed from frontend
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })

    // 4. Record Financial Transaction
    await tx.transaction.create({
      data: {
        type: "INCOME",
        amount: netAmount,
        referenceId: sale.id,
        status: "COMPLETED"
      }
    })

    // 5. Log Audit
    await tx.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: "POS_CHECKOUT",
        entity: "Sale",
        entityId: sale.id,
        newData: { totalAmount, itemsCount: items.length }
      }
    })

    revalidatePath("/dashboard")
    revalidatePath("/inventory")

    return { success: true, saleId: sale.id, receiptNumber: sale.receiptNumber }
  })
}
