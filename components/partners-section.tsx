"use client";

import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/premium-button";
import { ScrollAnimation } from "@/components/scroll-animation";
import { Building2 } from "lucide-react";
import { motion } from "framer-motion";

const partners = [
  {
    name: "Nib International Bank",
    nameAmharic: "ንብ ኢንተርናሽናል ባንክ",
    category: "Banking",
  },
  {
    name: "Awash Insurance",
    nameAmharic: "አዋሽ ኢንሹራንስ",
    category: "Insurance",
  },
  {
    name: "MIDROC Investment Group",
    category: "Investment",
  },
  {
    name: "Ethiopian Insurance Corporation",
    category: "Insurance",
  },
  {
    name: "Queen's",
    category: "Retail",
  },
  {
    name: "Wanza Furnishings Industry P.L.C.",
    nameAmharic: "ዋንዛ",
    category: "Manufacturing",
  },
  {
    name: "Daylight Applied Technologies P.L.C.",
    nameAmharic: "ዴይላይት",
    category: "Technology",
  },
  {
    name: "Addis Ababa Women's Association",
    category: "Non-Profit",
  },
];

export function PartnersSection() {
  return (
    <Section className="bg-muted/30">
      <Container>
        <ScrollAnimation>
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Partners</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Valued Collaboration Partners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;re proud to collaborate with leading organizations across Ethiopia, 
              enabling us to deliver exceptional service and expand our reach.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {partners.map((partner, index) => (
            <ScrollAnimation key={index} delay={index * 0.05} direction="up">
              <motion.div
                whileHover={{ y: -10, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="border-0 bg-card/50 backdrop-blur-sm h-full group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <CardContent className="p-6 text-center relative z-10">
                    <motion.div 
                      className="mb-4 flex justify-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <motion.div 
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6, type: "spring" }}
                      >
                        <Building2 className="h-6 w-6 text-primary" />
                      </motion.div>
                    </motion.div>
                    <h3 className="font-semibold mb-1 text-sm group-hover:text-primary transition-colors">{partner.name}</h3>
                    {partner.nameAmharic && (
                      <p className="text-xs text-muted-foreground mb-2">{partner.nameAmharic}</p>
                    )}
                    <Badge variant="outline" className="text-xs group-hover:border-primary/50 transition-colors">
                      {partner.category}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollAnimation>
          ))}
        </div>

      </Container>
    </Section>
  );
}

