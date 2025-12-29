"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
  className?: string;
}

export function Testimonial({ quote, author, role, className }: TestimonialProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className={cn("border-0 bg-card/50 backdrop-blur-sm group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden h-full", className)}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        <CardContent className="p-6 relative z-10">
          <motion.div
            className="mb-4 text-primary/20 group-hover:text-primary/40 transition-colors"
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            <Quote className="h-8 w-8" />
          </motion.div>
          <p className="mb-4 text-sm italic text-foreground/90 leading-relaxed">&ldquo;{quote}&rdquo;</p>
          <div className="border-t border-border/50 pt-4">
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{author}</p>
            {role && <p className="text-xs text-muted-foreground mt-1">{role}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

