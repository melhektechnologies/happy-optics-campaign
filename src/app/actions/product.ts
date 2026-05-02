"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function createProduct(data: {
  sku: string;
  name: string;
  price: number;
  cost: number;
  categoryId: string;
  supplierId?: string;
  description?: string;
}) {
  try {
    const product = await prisma.product.create({
      data: {
        sku: data.sku,
        name: data.name,
        price: data.price,
        cost: data.cost,
        categoryId: data.categoryId,
        supplierId: data.supplierId,
        description: data.description,
      }
    });
    
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/pos");
    
    return { success: true, data: product };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product. SKU might already exist." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });
    
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/pos");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
