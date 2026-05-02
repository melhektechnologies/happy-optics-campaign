import { getInventory } from "@/app/actions/inventory";
import InventoryClient from "./InventoryClient";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const response = await getInventory();
  const inventory = response.success && response.data ? response.data : [];

  return <InventoryClient initialInventory={inventory as any} />;
}
