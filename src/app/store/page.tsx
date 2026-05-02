"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_STORE_PRODUCTS = [
  { id: "1", name: "Premium Wagyu Beef", category: "Meat", price: 45.99, rating: 4.9, image: "🥩", isNew: true },
  { id: "2", name: "Organic Avocados (Pack of 4)", category: "Produce", price: 5.99, rating: 4.7, image: "🥑", isNew: false },
  { id: "3", name: "Artisan Sourdough Bread", category: "Bakery", price: 6.50, rating: 4.8, image: "🍞", isNew: false },
  { id: "4", name: "Columbian Roast Coffee", category: "Pantry", price: 14.99, rating: 4.9, image: "☕", isNew: false },
  { id: "5", name: "Fresh Atlantic Salmon", category: "Seafood", price: 22.99, rating: 4.6, image: "🐟", isNew: true },
  { id: "6", name: "Almond Milk 1L", category: "Dairy", price: 4.49, rating: 4.5, image: "🥛", isNew: false },
  { id: "7", name: "Organic Strawberries", category: "Produce", price: 4.99, rating: 4.8, image: "🍓", isNew: false },
  { id: "8", name: "Extra Virgin Olive Oil", category: "Pantry", price: 18.99, rating: 4.9, image: "🫒", isNew: false },
];

const CATEGORIES = ["All", "Produce", "Meat", "Seafood", "Bakery", "Dairy", "Pantry"];

export default function StorefrontPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = MOCK_STORE_PRODUCTS.filter(p => 
    activeCategory === "All" || p.category === activeCategory
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Store Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/store" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[#012a2d] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-[#010133] hidden sm:block">
                SuperNova Market
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-xl px-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search for groceries, organic food..." 
                className="w-full pl-10 bg-slate-100 border-none rounded-full focus-visible:ring-1 focus-visible:ring-[#012a2d]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#010133] hidden sm:block">
              Sign In
            </Link>
            <Button className="bg-[#010133] hover:bg-[#012a2d] rounded-full px-5 shadow-md flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="font-semibold">$0.00</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-[#012a2d] text-white">
        <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-6">
            <Badge className="bg-[#C89A32] text-[#010133] hover:bg-[#C89A32]/90 border-none px-3 py-1 text-sm font-bold">
              Weekend Special
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Fresh groceries delivered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-[#C89A32]">
                in under 60 minutes.
              </span>
            </h1>
            <p className="text-lg text-slate-300">
              Shop from over 15,000 products. Sourced directly from local farms and premium global brands.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-[#010133] hover:bg-slate-100 rounded-full font-bold px-8">
                Shop Fresh Produce
              </Button>
            </div>
          </div>
          <div className="hidden md:block w-72 h-72 bg-gradient-to-tr from-[#C89A32]/20 to-white/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex flex-col gap-8 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#010133]">Popular Categories</h2>
          <Button variant="ghost" className="text-[#012a2d] font-semibold gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </div>

        {/* Categories Carousel/List */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              className={`rounded-full px-6 transition-all shrink-0 ${
                activeCategory === cat 
                  ? "bg-[#012a2d] text-white border-none shadow-md" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#012a2d]/30"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="border-slate-200 shadow-sm hover:shadow-xl hover:shadow-[#012a2d]/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden group bg-white cursor-pointer relative">
              {product.isNew && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge className="bg-[#C89A32] text-[#010133] hover:bg-[#C89A32] border-none text-[10px] uppercase font-bold tracking-wider">
                    New
                  </Badge>
                </div>
              )}
              <CardContent className="p-0">
                <div className="h-48 bg-slate-50 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
                  {product.image}
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{product.category}</p>
                    <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {product.rating}
                    </div>
                  </div>
                  <h3 className="font-bold text-[#010133] leading-tight line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-extrabold text-[#012a2d]">${product.price.toFixed(2)}</span>
                    <Button size="sm" className="bg-[#010133] hover:bg-[#012a2d] rounded-full h-8 w-8 p-0 flex items-center justify-center shadow-md">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action App Download */}
        <div className="mt-12 bg-gradient-to-r from-slate-100 to-white border border-slate-200 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-[#010133]">Get the SuperNova App</h3>
            <p className="text-slate-500">Track your loyalty points, get exclusive deals, and order groceries right from your pocket.</p>
            <div className="flex justify-center md:justify-start gap-4 pt-2">
              <Button className="bg-[#010133] hover:bg-[#012a2d] rounded-xl px-6 h-12 shadow-md">App Store</Button>
              <Button className="bg-[#010133] hover:bg-[#012a2d] rounded-xl px-6 h-12 shadow-md">Google Play</Button>
            </div>
          </div>
          <div className="w-48 h-48 bg-slate-200 rounded-full flex items-center justify-center text-4xl shadow-inner border-8 border-white">
            📱
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 SuperNova Market. Powered by SuperNova Technologies.</p>
        </div>
      </footer>
    </div>
  );
}
