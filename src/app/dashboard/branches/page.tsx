"use client";

import { MapPin, Phone, Search, Store, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_BRANCHES = [
  { id: "B1", name: "Downtown Main", location: "123 Retail Ave, NY", phone: "+1 (555) 111-2222", employees: 45, status: "Active", revenue: "$1.2M" },
  { id: "B2", name: "Westside Branch", location: "456 West Blvd, NY", phone: "+1 (555) 333-4444", employees: 24, status: "Active", revenue: "$850K" },
  { id: "B3", name: "Northside Hub", location: "789 North Rd, NY", phone: "+1 (555) 555-6666", employees: 32, status: "Active", revenue: "$920K" },
  { id: "B4", name: "East End Express", location: "321 East St, NY", phone: "+1 (555) 777-8888", employees: 12, status: "Maintenance", revenue: "$400K" },
];

export default function BranchesPage() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#010133]">Branch Management</h1>
          <p className="text-slate-500 mt-1">Manage multiple store locations and their performance.</p>
        </div>
        <Button className="bg-[#012a2d] hover:bg-[#010133] text-white shadow-md w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add New Branch
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search branches by name or location..." 
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-[#012a2d]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_BRANCHES.map((branch) => (
          <Card key={branch.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#012a2d]/10 rounded-lg group-hover:bg-[#012a2d]/20 transition-colors">
                    <Store className="h-5 w-5 text-[#012a2d]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#010133]">{branch.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {branch.location}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400"/> Contact</span>
                  <span className="font-medium">{branch.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-400"/> Employees</span>
                  <span className="font-medium">{branch.employees} Active Staff</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600 pt-3 border-t border-slate-100 mt-3">
                  <span className="font-medium text-[#010133]">YTD Revenue</span>
                  <span className="font-bold text-[#012a2d]">{branch.revenue}</span>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="w-full text-[#010133] border-slate-200 hover:bg-slate-50">
                  View Details
                </Button>
                {branch.status === "Active" ? (
                  <Button variant="secondary" className="w-auto px-3 bg-green-50 text-green-700 hover:bg-green-100 pointer-events-none border-none">
                    Active
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-auto px-3 bg-amber-50 text-amber-700 hover:bg-amber-100 pointer-events-none border-none">
                    Maint.
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
