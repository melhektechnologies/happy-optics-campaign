"use client";

import { useState, useMemo } from "react";
import { 
  Barcode, 
  CreditCard, 
  Minus, 
  Plus, 
  Search, 
  ShoppingCart, 
  Trash2, 
  Wallet,
  Zap,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createSale } from "@/app/actions/sale";

interface Product {
  id: string;
  sku: string;
  name: string;
  price: any; // Decimal from Prisma
  inventoryCount: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface POSInterfaceProps {
  products: Product[];
  branchId: string;
  cashierId: string;
}

export default function POSInterface({ products, branchId, cashierId }: POSInterfaceProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const addToCart = (product: Product) => {
    if (product.inventoryCount <= 0) {
      toast.error("Product out of stock");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.inventoryCount) {
          toast.warning("Cannot add more than available stock");
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        if (newQty > item.product.inventoryCount) {
          toast.warning("Limited by available stock");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    const tax = subtotal * 0.15; // 15% tax standard
    return { subtotal, tax, total: subtotal + tax };
  }, [cart]);

  const handleCheckout = async (paymentMethod: "CASH" | "CARD") => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    try {
      const result = await createSale({
        branchId,
        cashierId,
        paymentMethod: paymentMethod === "CASH" ? "CASH" : "CARD",
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: Number(item.product.price)
        })),
        tax: totals.tax
      });

      if (result.success) {
        toast.success("Transaction Completed Successfully", {
          description: `Total: $${totals.total.toFixed(2)}`,
          icon: <Zap className="w-4 h-4 text-emerald-400" />
        });
        setCart([]);
      } else {
        toast.error("Checkout Failed", { description: result.error });
      }
    } catch (err) {
      toast.error("Internal System Error during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-8 h-[75vh]">
      {/* Product Catalog Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Scan Barcode or Search SKU..." 
              className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-pink-500/50 transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="icon" className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10">
            <Barcode className="w-6 h-6" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {filteredProducts.map((p) => (
              <Card 
                key={p.id} 
                className={`group cursor-pointer border-white/5 bg-white/5 hover:bg-white/10 transition-all active:scale-95 ${p.inventoryCount <= 0 ? 'opacity-50 grayscale' : ''}`}
                onClick={() => addToCart(p)}
              >
                <CardContent className="p-4 flex flex-col gap-4">
                  <div className="w-full aspect-square rounded-xl bg-obsidian flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                    {p.name.includes("Beef") ? "🥩" : p.name.includes("Milk") ? "🥛" : p.name.includes("Bread") ? "🍞" : "📦"}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-100 truncate">{p.name}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-black text-pink-400">${Number(p.price).toFixed(2)}</span>
                      <Badge variant="outline" className="text-[10px] border-white/10">
                        {p.inventoryCount} units
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Cart Area */}
      <div className="w-96 flex flex-col bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden">
        <div className="p-6 bg-pink-500/10 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-pink-500" />
            <span className="font-black tracking-tight text-white">Order Terminal</span>
          </div>
          <Badge className="bg-pink-500 text-white border-none">{cart.length} SKUs</Badge>
        </div>

        <ScrollArea className="flex-1 p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-50">
              <Package className="w-12 h-12" />
              <p className="font-medium">Terminal Idle</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 items-center animate-in slide-in-from-right-4 duration-300">
                  <div className="w-12 h-12 rounded-xl bg-obsidian border border-white/10 flex items-center justify-center font-bold">
                    {item.quantity}x
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-sm text-slate-200 truncate">{item.product.name}</h5>
                    <p className="text-pink-400 font-black text-xs">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-obsidian rounded-lg p-1 border border-white/5">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => updateQuantity(item.product.id, -1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-pink-500" onClick={() => updateQuantity(item.product.id, 1)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-6 bg-obsidian/50 border-t border-white/10 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium text-slate-400">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-400">
              <span>Tax (15%)</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-white pt-3 border-t border-white/10">
              <span>Total</span>
              <span className="text-emerald-400">${totals.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              disabled={cart.length === 0 || isProcessing}
              onClick={() => handleCheckout("CASH")}
              className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-white transition-all font-bold"
            >
              <Wallet className="mr-2 w-5 h-5" /> Cash
            </Button>
            <Button 
              disabled={cart.length === 0 || isProcessing}
              onClick={() => handleCheckout("CARD")}
              className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-pink-500 hover:text-white transition-all font-bold shadow-[0_0_20px_rgba(236,72,153,0.2)]"
            >
              <CreditCard className="mr-2 w-5 h-5" /> Card
            </Button>
          </div>

          <Button 
            variant="ghost" 
            className="w-full text-slate-500 hover:text-red-500 hover:bg-red-500/10 font-bold"
            onClick={() => setCart([])}
          >
            <Trash2 className="mr-2 w-4 h-4" /> Clear Terminal
          </Button>
        </div>
      </div>
    </div>
  );
}
