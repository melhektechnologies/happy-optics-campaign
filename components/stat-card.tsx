import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <Card className={cn("border-0 bg-card/50 backdrop-blur-sm", className)}>
      <CardContent className="p-6 text-center">
        <div className="text-4xl font-bold text-primary sm:text-5xl">{value}</div>
        <div className="mt-2 text-sm font-medium text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

