import prisma from "@/lib/prisma"
import POSInterface from "@/components/pos/POSInterface"
import { AlertCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function POSPage() {
  try {
    // In a real production app, these would come from the authenticated session
    // For this implementation, we fetch the first available branch and cashier for demonstration
    const branch = await prisma.branch.findFirst()
    const cashier = await prisma.user.findFirst({
      where: { role: 'CASHIER' }
    })

    if (!branch || !cashier) {
      return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-4">
          <AlertCircle className="w-12 h-12 text-amber-500" />
          <h2 className="text-xl font-bold">System Configuration Required</h2>
          <p className="max-w-md text-center">
            Please ensure at least one branch and one cashier user exist in the database to initialize the POS system.
          </p>
        </div>
      )
    }

    // Fetch products with their inventory counts for this branch
    const productsData = await prisma.product.findMany({
      include: {
        inventory: {
          where: { branchId: branch.id }
        }
      }
    })

    const products = productsData.map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      price: p.price,
      inventoryCount: p.inventory[0]?.quantity || 0
    }))

    return (
      <div className="p-8 bg-slate-50 min-h-screen">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Point of Sale</h1>
            <p className="text-slate-500 font-medium">Branch: {branch.name} | Cashier: {cashier.firstName} {cashier.lastName}</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">System Status</div>
            <div className="text-sm font-bold text-green-600 flex items-center gap-2 justify-end">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              Live & Secure
            </div>
          </div>
        </header>

        <POSInterface 
          products={products} 
          branchId={branch.id} 
          cashierId={cashier.id} 
        />
      </div>
    )
  } catch (error) {
    console.error('POS Page Load Error:', error)
    return (
      <div className="p-12 text-center text-red-500 font-bold">
        Failed to load POS System. Please check database connectivity.
      </div>
    )
  }
}
