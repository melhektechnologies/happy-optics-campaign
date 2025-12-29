import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BranchCardProps {
  name: string;
  location: string;
  phone?: string;
  mapUrl?: string;
  className?: string;
}

export function BranchCard({ name, location, phone, mapUrl, className }: BranchCardProps) {
  return (
    <Card className={cn("transition-all hover:shadow-lg", className)}>
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{location}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <a href={`tel:${phone}`} className="hover:text-primary">
              {phone}
            </a>
          </div>
        )}
        {mapUrl && (
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href={mapUrl} target="_blank" rel="noopener noreferrer">
              View on Map
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

