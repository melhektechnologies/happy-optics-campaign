"use client";

import { useState } from "react";
import { Download, Filter, MoreHorizontal, Plus, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  cost: number;
  category: { name: string };
  supplier?: { name: string };
}

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [search, setSearch] = useState("");

  const filteredProducts = initialProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#010133]">Product Catalog</h1>
          <p className="text-slate-500 mt-1">Manage real product master data, pricing, and suppliers from the database.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="text-slate-600 bg-white shadow-sm border-slate-200">
            <Download className="mr-2 h-4 w-4" />
            Import/Export
          </Button>
          <Button className="bg-[#012a2d] hover:bg-[#010133] text-white shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by Product Name or SKU..." 
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-[#012a2d]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="text-slate-600 border-slate-200 gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            Category Filter
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] text-slate-500">Product Info</TableHead>
              <TableHead className="text-slate-500">Category</TableHead>
              <TableHead className="text-right text-slate-500">Cost Price</TableHead>
              <TableHead className="text-right text-slate-500">Selling Price</TableHead>
              <TableHead className="text-slate-500 text-center">Margin</TableHead>
              <TableHead className="text-center text-slate-500">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                  No products found in the database.
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => {
                const margin = (((product.price - product.cost) / product.price) * 100).toFixed(1);
                return (
                  <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#010133]">{product.name}</span>
                        <span className="text-xs text-slate-500 font-mono mt-0.5">{product.sku}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-600">{product.category?.name || "Uncategorized"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-500">
                      ${product.cost.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-[#010133]">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-[#C89A32] bg-[#C89A32]/10 border-[#C89A32]/20">
                        {margin}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 border-none">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border-slate-200">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit Product</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
