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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this day off?</AlertDialogTitle>
          <AlertDialogDescription>
            Removing {dayOffDate} will make this date available for patient
            appointment bookings again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Remove day off
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDayOffDialog;
