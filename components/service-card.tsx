"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

export function ServiceCard({ title, description, icon, className }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className={cn("group transition-all hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 relative overflow-hidden h-full", className)}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <CardHeader className="relative z-10">
          {icon && (
            <motion.div 
              className="mb-2 text-4xl"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {icon}
            </motion.div>
          )}
          <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="leading-relaxed">{description}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <motion.div
            className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ x: 4 }}
          >
            <span className="text-sm font-medium mr-2">Learn more</span>
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

