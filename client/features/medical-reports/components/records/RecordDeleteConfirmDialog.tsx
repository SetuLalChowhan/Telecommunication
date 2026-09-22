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
import { Loader2 } from "lucide-react";

interface RecordDeleteConfirmDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  /** Shown in the description so the user can confirm they picked the right file. */
  fileName?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const RecordDeleteConfirmDialog: React.FC<RecordDeleteConfirmDialogProps> = ({
  isOpen,
  isDeleting,
  fileName,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this document?</AlertDialogTitle>
          <AlertDialogDescription>
            {fileName ? (
              <>
                <span className="font-medium text-foreground break-words">
                  {fileName}
                </span>{" "}
                will be permanently removed from your medical records and from any
                consultation it is attached to. This cannot be undone.
              </>
            ) : (
              "This document will be permanently removed from your medical records. This cannot be undone."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={onConfirm}>
            {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Delete document</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RecordDeleteConfirmDialog;
