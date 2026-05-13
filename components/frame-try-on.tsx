"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const frameStyles = [
  { id: 1, name: "Classic Round", image: "/gallery/frame-1.jpg" },
  { id: 2, name: "Modern Square", image: "/gallery/frame-2.jpg" },
  { id: 3, name: "Aviator", image: "/gallery/frame-3.jpg" },
  { id: 4, name: "Cat Eye", image: "/gallery/frame-4.jpg" },
];

export function FrameTryOn() {
  const [selectedFrame, setSelectedFrame] = useState<number | null>(null);

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Virtual Frame Try-On</CardTitle>
        </div>
        <Badge variant="outline" className="w-fit">
          Coming Soon
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          {selectedFrame ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full h-full"
            >
              <Image
                src={frameStyles.find(f => f.id === selectedFrame)?.image || "/gallery/frame-1.jpg"}
                alt="Frame preview"
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </motion.div>
          ) : (
            <div className="text-center space-y-4">
              <Camera className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <p className="font-semibold mb-2">Try Frames Virtually</p>
                <p className="text-sm text-muted-foreground">
                  Upload your photo or use your camera to see how frames look on you
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {frameStyles.map((frame) => (
            <motion.button
              key={frame.id}
              onClick={() => setSelectedFrame(frame.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedFrame === frame.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="aspect-square relative mb-2">
                <Image
                  src={frame.image}
                  alt={frame.name}
                  fill
                  className="object-contain rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <p className="text-sm font-medium">{frame.name}</p>
            </motion.button>
          ))}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          * Virtual try-on is launching soon. For now, visit our clinic for in-person frame fitting.
        </p>
      </CardContent>
    </Card>
  );
}

