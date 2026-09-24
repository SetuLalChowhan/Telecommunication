import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DocumentStatus } from "../types";

const badgeBase = "px-2 py-0.5 text-[10px] font-bold shadow-none";

export function DoctorStatusBadge({ verified }: { verified: boolean }) {
  return (
    <Badge
      className={cn(
        badgeBase,
        verified
          ? "bg-emerald-600 text-white hover:bg-emerald-600"
          : "bg-amber-100 text-amber-800 hover:bg-amber-100",
      )}
    >
      {verified ? "Verified" : "Pending"}
    </Badge>
  );
}

const DOCUMENT_STATUS_STYLES: Record<DocumentStatus, string> = {
  APPROVED: "bg-emerald-600 text-white hover:bg-emerald-600",
  PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  REJECTED: "bg-destructive text-destructive-foreground hover:bg-destructive",
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <Badge className={cn(badgeBase, DOCUMENT_STATUS_STYLES[status])}>{status}</Badge>
  );
}
