"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDayOffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayOffDate?: string;
  onConfirm: () => void;
}

export const DeleteDayOffDialog: React.FC<DeleteDayOffDialogProps> = ({
  open,
  onOpenChange,
  dayOffDate,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-foreground">
            Remove this day off?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-secondary-text leading-relaxed">
            Removing {dayOffDate} will make this date available for patient appointment bookings again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-3 gap-2">
          <AlertDialogCancel className="h-9.5 px-4 rounded-xl text-xs">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="h-9.5 px-4 rounded-xl text-xs font-semibold bg-destructive hover:bg-destructive/90"
          >
            Remove Day Off
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDayOffDialog;
