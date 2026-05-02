"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSale(data: {
  branchId: string;
  cashierId: string;
  paymentMethod: "CASH" | "CARD";
  items: { productId: string; quantity: number; price: number }[];
  discount?: number;
  tax?: number;
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Calculate totals
      const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discount = data.discount || 0;
      const tax = data.tax || (subtotal * 0.15); // standard 15% tax
      const totalAmount = subtotal - discount + tax;

      // 2. Create the Sale record
      const sale = await tx.sale.create({
        data: {
          branchId: data.branchId,
          cashierId: data.cashierId,
          paymentMethod: data.paymentMethod,
          totalAmount,
          discount,
          tax,
          status: "COMPLETED",
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      // 3. Update inventory & Check stock
      for (const item of data.items) {
        const inventory = await tx.inventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: data.branchId
            }
          }
        });

        if (!inventory || inventory.quantity < item.quantity) {
          throw new Error(`Insufficient stock for item: ${item.productId}`);
        }

        await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });
      }

      // 4. Create Audit Log
      await tx.auditLog.create({
        data: {
          userId: data.cashierId,
          action: "SALE_COMPLETED",
          entity: "Sale",
          entityId: sale.id,
          newData: JSON.stringify({ total: totalAmount, itemsCount: data.items.length })
        }
      });

      return sale;
    });

    revalidatePath("/dashboard/pos");
    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/reports");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Sale transaction failed:", error);
    return { success: false, error: error.message || "Failed to process sale." };
  }
}
