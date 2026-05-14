"use client";

import { AlertCircle, FileQuestion, Lock, Loader2, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Consistent loading / empty / error / forbidden states used across the
// dashboard list pages. Keeps copy uniform and accessible.

type BaseProps = {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
};

export function LoadingState({
  title = "Loading…",
  description,
}: Pick<BaseProps, "title" | "description">) {
  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardContent
        className="flex flex-col items-center justify-center gap-3 p-12 text-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-sm font-medium">{title}</div>
        {description ? (
          <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  description,
  action,
}: BaseProps) {
  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
        <Inbox className="h-10 w-10 text-muted-foreground" aria-hidden />
        <div className="text-base font-semibold">{title}</div>
        {description ? (
          <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        ) : null}
        {action ? (
          <Button onClick={action.onClick} variant="outline" className="mt-2">
            {action.label}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again. If the problem continues, contact support.",
  action,
}: BaseProps) {
  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardContent
        className="flex flex-col items-center justify-center gap-3 p-12 text-center"
        role="alert"
      >
        <AlertCircle className="h-10 w-10 text-destructive" aria-hidden />
        <div className="text-base font-semibold">{title}</div>
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        {action ? (
          <Button onClick={action.onClick} className="mt-2">
            {action.label}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function ForbiddenState({
  title = "You don't have access to this",
  description = "Ask your manager to grant the required permission.",
}: BaseProps) {
  return (
    <Card className="border-amber-500/40 bg-amber-500/5">
      <CardContent
        className="flex flex-col items-center justify-center gap-3 p-12 text-center"
        role="alert"
      >
        <Lock className="h-10 w-10 text-amber-500" aria-hidden />
        <div className="text-base font-semibold">{title}</div>
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      </CardContent>
    </Card>
  );
}

export function NotFoundState({
  title = "Not found",
  description = "The page or item you were looking for no longer exists.",
}: BaseProps) {
  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
        <FileQuestion className="h-10 w-10 text-muted-foreground" aria-hidden />
        <div className="text-base font-semibold">{title}</div>
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      </CardContent>
    </Card>
  );
}
