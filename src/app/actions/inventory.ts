"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInventory() {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: {
          include: {
            category: true,
          }
        },
        branch: true,
      },
      orderBy: {
        product: {
          name: 'asc'
        }
      }
    });
    
    // Transform data for the UI
    const formattedInventory = inventory.map(item => {
      let status = "In Stock";
      if (item.quantity === 0) status = "Out of Stock";
      else if (item.quantity <= item.minStock) status = "Low Stock";

      return {
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        sku: item.product.sku,
        category: item.product.category.name,
        branch: item.branch.name,
        stock: item.quantity,
        minStock: item.minStock,
        price: item.product.price,
        status,
      };
    });

    return { success: true, data: formattedInventory };
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    return { success: false, error: "Failed to fetch inventory data" };
  }
}

export async function adjustStock(inventoryId: string, quantityDelta: number) {
  try {
    const updated = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: {
          increment: quantityDelta
        }
      }
    });
    
    revalidatePath("/dashboard/inventory");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to adjust stock:", error);
    return { success: false, error: "Failed to adjust stock" };
  }
}
