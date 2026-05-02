"use client";

import { useState } from "react";
import { Download, Filter, MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface InventoryItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  category: string;
  branch: string;
  stock: number;
  minStock: number;
  price: number;
  status: string;
}

export default function InventoryClient({ initialInventory }: { initialInventory: InventoryItem[] }) {
  const [search, setSearch] = useState("");

  const filteredInventory = initialInventory.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase()) ||
    item.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#010133]">Inventory Management</h1>
          <p className="text-slate-500 mt-1">Real-time stock tracking across all branches from the database.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="text-slate-600 bg-white shadow-sm border-slate-200">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button className="bg-[#012a2d] hover:bg-[#010133] text-white shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by Product Name, SKU, or Branch..." 
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-[#012a2d]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="text-slate-600 border-slate-200 gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <div className="text-sm font-medium text-slate-500 px-2 border-l border-slate-200 hidden sm:block">
            {filteredInventory.length} items found
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] text-slate-500">Product Info</TableHead>
              <TableHead className="text-slate-500">Branch</TableHead>
              <TableHead className="text-slate-500">Category</TableHead>
              <TableHead className="text-right text-slate-500">Stock Level</TableHead>
              <TableHead className="text-slate-500 text-center">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  No inventory items found in the database. Add some products and allocate stock to branches first.
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#010133]">{item.name}</span>
                      <span className="text-xs text-slate-500">{item.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600">{item.branch}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-[#010133]">{item.stock}</span>
                      <span className="text-[10px] text-slate-400">Min: {item.minStock}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.status === "In Stock" && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 border-none">
                        In Stock
                      </Badge>
                    )}
                    {item.status === "Low Stock" && (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100/80 border-none">
                        Low Stock
                      </Badge>
                    )}
                    {item.status === "Out of Stock" && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100/80 border-none">
                        Out of Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-slate-200">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer">Edit Product</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Adjust Stock</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600">Delete Item</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
