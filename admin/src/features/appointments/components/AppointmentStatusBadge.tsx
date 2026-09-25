import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "../types";

const VARIANT: Record<BookingStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export function AppointmentStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge variant={VARIANT[status]} className="text-[10px] font-bold uppercase shadow-none">
      {status}
    </Badge>
  );
}

export default AppointmentStatusBadge;
