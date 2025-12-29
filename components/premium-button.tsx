"use client";

import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ReactNode, React } from "react";

interface PremiumButtonProps extends ButtonProps {
  children: ReactNode;
  showArrow?: boolean;
  glowEffect?: boolean;
}

export function PremiumButton({ 
  children, 
  showArrow = true, 
  glowEffect = true,
  className = "",
  asChild,
  ...props 
}: PremiumButtonProps) {
  // If asChild is true, pass it through to Button which handles it
  if (asChild) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
      >
        <Button
          asChild
          className={`relative overflow-hidden ${glowEffect ? "shadow-lg shadow-primary/20" : ""} ${className}`}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <Button
        className={`relative overflow-hidden ${glowEffect ? "shadow-lg shadow-primary/20" : ""} ${className}`}
        {...props}
      >
        <span className="relative z-10 flex items-center">
          {children}
          {showArrow && (
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="ml-2"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          )}
        </span>
        {glowEffect && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        )}
      </Button>
    </motion.div>
  );
}

