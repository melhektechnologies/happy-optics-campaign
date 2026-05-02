import { getProducts } from "@/app/actions/product";
import ProductsClient from "./ProductsClient";

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const response = await getProducts();
  const products = response.success && response.data ? response.data : [];

  return <ProductsClient initialProducts={products as any} />;
}
