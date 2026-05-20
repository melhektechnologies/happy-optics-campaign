import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shimmer-loader bg-muted/65 rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
