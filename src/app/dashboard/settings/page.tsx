"use client";

import { Save, Store, Receipt, Bell, Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#010133]">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your supermarket system configurations.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white border border-slate-200 h-12 rounded-xl p-1 shadow-sm mb-6 w-full justify-start overflow-x-auto hidden sm:flex">
          <TabsTrigger value="general" className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-lg px-6">General</TabsTrigger>
          <TabsTrigger value="branches" className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-lg px-6">Branches</TabsTrigger>
          <TabsTrigger value="tax" className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-lg px-6">Tax & Currency</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-100 data-[state=active]:shadow-none rounded-lg px-6">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0 outline-none">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#010133]">Store Profile</CardTitle>
              <CardDescription>
                Update your main supermarket company details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" defaultValue="SuperNova Hypermarket" className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" defaultValue="admin@supernova.com" className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Main Phone</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="www.supernova.com" className="bg-slate-50" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Headquarters Address</Label>
                  <Input id="address" defaultValue="123 Retail Ave, Commerce City, TX 75001" className="bg-slate-50" />
                </div>
              </div>

              <Separator className="bg-slate-100" />

              <div className="flex justify-end gap-4">
                <Button variant="outline" className="text-slate-600">Cancel</Button>
                <Button className="bg-[#012a2d] hover:bg-[#010133]">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="mt-0 outline-none">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#010133]">Tax & Financial Settings</CardTitle>
              <CardDescription>Configure VAT, currency, and payment gateways.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Input id="currency" defaultValue="USD ($)" className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" defaultValue="8.0" className="bg-slate-50" />
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 font-medium text-[#010133] mb-2">
                  <Wallet className="h-5 w-5 text-[#C89A32]" />
                  Stripe Payment Integration
                </div>
                <p className="text-sm text-slate-500 mb-4">Connect your Stripe account to process online orders and POS card transactions.</p>
                <Button variant="outline" className="bg-white border-[#012a2d] text-[#012a2d] hover:bg-[#012a2d] hover:text-white transition-colors">
                  Connect Stripe
                </Button>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" className="text-slate-600">Cancel</Button>
                <Button className="bg-[#012a2d] hover:bg-[#010133]">Save Configurations</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
