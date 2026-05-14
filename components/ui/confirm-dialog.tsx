"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Small controlled confirmation dialog. Returns a `confirm()` async helper
// and a `<ConfirmDialog />` element you mount in your component tree.
//
// Replaces `window.confirm(...)` which is blocking, ugly, and ignored by
// most browsers in iframes.
//
// Usage:
//   const { confirm, ConfirmDialog } = useConfirm();
//   const yes = await confirm({ title: "Delete?", description: "..." });
//   if (yes) ...
//   return <>... <ConfirmDialog /></>

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type Resolver = (value: boolean) => void;

export function useConfirm() {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<Resolver | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleClose = useCallback(
    (result: boolean) => {
      setOpen(false);
      if (resolver) resolver(result);
      setResolver(null);
    },
    [resolver]
  );

  const ConfirmDialog = useCallback(() => {
    if (!options) return null;
    return (
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) handleClose(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{options.title}</DialogTitle>
            {options.description ? (
              <DialogDescription>{options.description}</DialogDescription>
            ) : null}
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => handleClose(false)}>
              {options.cancelLabel ?? "Cancel"}
            </Button>
            <Button
              variant={options.destructive ? "destructive" : "default"}
              onClick={() => handleClose(true)}
              autoFocus
            >
              {options.confirmLabel ?? "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }, [open, options, handleClose]);

  return { confirm, ConfirmDialog };
}
