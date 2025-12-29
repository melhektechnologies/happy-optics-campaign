"use client";

import { Award, Shield, Star, Sparkles, Heart, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const badges = [
  { icon: Award, label: "Certified Optometrists", color: "text-primary" },
  { icon: Shield, label: "Quality Assured", color: "text-accent" },
  { icon: Star, label: "5-Star Rated", color: "text-yellow-500" },
  { icon: Sparkles, label: "Latest Technology", color: "text-primary" },
  { icon: Heart, label: "Personalized Care", color: "text-accent" },
  { icon: Eye, label: "Expert Consultation", color: "text-primary" },
];

const stats = [
  { value: "12+", label: "Years of Excellence" },
  { value: "4", label: "Branches in Addis" },
  { value: "50K+", label: "Patients Served" },
  { value: "100%", label: "Patient Satisfaction" },
];

export function TrustBadges() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <>
      {/* Small Trust Badges */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 mb-12">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <Card className="border-0 bg-card/50 backdrop-blur-sm text-center group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                <CardContent className="p-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${badge.color} transition-colors group-hover:scale-110`} />
                  </motion.div>
                  <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{badge.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Large Stats Cards */}
      <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.15, duration: 0.5, type: "spring" }}
            whileHover={{ y: -12, scale: 1.05 }}
          >
            <Card className="border-0 bg-card/50 backdrop-blur-sm text-center group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <CardContent className="p-6 relative z-10">
                <motion.p
                  className="text-4xl font-bold text-primary mb-2"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}
