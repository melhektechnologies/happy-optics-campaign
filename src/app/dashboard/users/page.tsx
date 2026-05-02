"use client";

import { MoreHorizontal, Plus, Search, Shield, UserCog, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const MOCK_USERS = [
  { id: "U1", name: "Sarah Jenkins", email: "sarah.j@supernova.com", role: "Super Admin", branch: "All Branches", status: "Active", avatar: "SJ" },
  { id: "U2", name: "Marcus Chen", email: "marcus.c@supernova.com", role: "Branch Manager", branch: "Downtown Main", status: "Active", avatar: "MC" },
  { id: "U3", name: "Aisha Patel", email: "aisha.p@supernova.com", role: "Inventory Manager", branch: "Westside Branch", status: "Active", avatar: "AP" },
  { id: "U4", name: "David Miller", email: "david.m@supernova.com", role: "Cashier", branch: "Downtown Main", status: "Offline", avatar: "DM" },
  { id: "U5", name: "Elena Rodriguez", email: "elena.r@supernova.com", role: "Cashier", branch: "Northside Hub", status: "Suspended", avatar: "ER" },
];

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#010133]">Staff & Users</h1>
          <p className="text-slate-500 mt-1">Manage employee accounts, roles, and branch assignments.</p>
        </div>
        <Button className="bg-[#012a2d] hover:bg-[#010133] text-white shadow-md w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Staff</p>
            <p className="text-2xl font-bold text-[#010133]">124</p>
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Admins</p>
            <p className="text-2xl font-bold text-[#010133]">8</p>
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
            <UserCog className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Roles</p>
            <p className="text-2xl font-bold text-[#010133]">10 Defined</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by name, email, or role..." 
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-[#012a2d]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-500">Employee Details</TableHead>
              <TableHead className="text-slate-500">Role</TableHead>
              <TableHead className="text-slate-500">Assigned Branch</TableHead>
              <TableHead className="text-center text-slate-500">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_USERS.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-slate-200">
                      <AvatarFallback className="bg-[#010133] text-white text-xs">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#010133]">{user.name}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-700 font-medium text-sm">{user.role}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">
                  {user.branch}
                </TableCell>
                <TableCell className="text-center">
                  {user.status === "Active" && <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80 border-none">Active</Badge>}
                  {user.status === "Offline" && <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-none">Offline</Badge>}
                  {user.status === "Suspended" && <Badge className="bg-red-100 text-red-700 hover:bg-red-100/80 border-none">Suspended</Badge>}
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
                      <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Suspend Access</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
