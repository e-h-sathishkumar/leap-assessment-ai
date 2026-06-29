"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;

  onConfirm: () => void;

  trigger?: React.ReactNode;
}

export default function ConfirmDialog({
  open,
  onOpenChange,

  title,
  description,

  confirmText = "Confirm",
  cancelText = "Cancel",

  loading = false,

  onConfirm,

  trigger,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>
            {title}
          </DialogTitle>

        </DialogHeader>

        <p className="text-sm text-slate-600">
          {description}
        </p>

        <DialogFooter>

          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            {cancelText}
          </Button>

          <Button
            variant="destructive"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? "Please wait..."
              : confirmText}
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
}