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
      const taxRate = data.tax || 0.15; // 15% VAT
      const taxAmount = subtotal * taxRate;
      const totalAmount = subtotal - discount + taxAmount;
      const netAmount = subtotal - discount;

      // 2. Generate Receipt Number (Branch Code + Timestamp + Random)
      const branch = await tx.branch.findUnique({ where: { id: data.branchId } });
      const branchPrefix = branch?.name.substring(0, 3).toUpperCase() || "BR";
      const receiptNumber = `${branchPrefix}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

      // 3. Create the Sale record
      const sale = await tx.sale.create({
        data: {
          receiptNumber,
          branchId: data.branchId,
          cashierId: data.cashierId,
          paymentMethod: data.paymentMethod,
          totalAmount,
          netAmount,
          taxAmount,
          discount,
          tax: taxRate,
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

      // 4. Update inventory & Check stock
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

      // 5. Create Transaction record for accounting
      await tx.transaction.create({
        data: {
          type: "INCOME",
          amount: totalAmount,
          referenceId: sale.id,
          status: "COMPLETED"
        }
      });

      // 6. Create Audit Log
      await tx.auditLog.create({
        data: {
          userId: data.cashierId,
          action: "SALE_COMPLETED",
          entity: "Sale",
          entityId: sale.id,
          newData: JSON.stringify({ total: totalAmount, receiptNumber })
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
