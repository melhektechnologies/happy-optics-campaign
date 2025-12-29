"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function VirtualTourSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Card className="border-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <Image
            src="/brand/clinic.jpg"
            alt="Happy Optics Clinic Virtual Tour"
            fill
            className="object-cover"
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <motion.button
                onClick={() => setIsPlaying(true)}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Play virtual tour"
              >
                <Play className="h-10 w-10 ml-1" fill="currentColor" />
              </motion.button>
            </div>
          )}
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">Virtual Clinic Tour</h3>
            <p className="text-muted-foreground">
              Take a virtual walkthrough of our modern facilities and see why thousands of patients trust Happy Optics.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>4 Locations</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>2 min tour</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Schedule In-Person Visit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

