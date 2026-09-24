import { Link } from "react-router-dom";
import { Check, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DoctorStatusBadge } from "./DoctorStatusBadge";
import type { AdminDoctor } from "../types";

interface DoctorsTableProps {
  doctors: AdminDoctor[];
  onApprove: (doctor: AdminDoctor) => void;
  onReject: (doctor: AdminDoctor) => void;
  isUpdating?: boolean;
}

/** The single doctors table implementation — no V2 / DataTable duplicates. */
export function DoctorsTable({
  doctors,
  onApprove,
  onReject,
  isUpdating = false,
}: DoctorsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Doctor</TableHead>
          <TableHead>Specialties</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Bookings</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctors.map((doctor) => (
          <TableRow key={doctor.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">
                  {doctor.user.name ?? "Unnamed doctor"}
                </span>
                <span className="text-xs text-muted-foreground">{doctor.user.email}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {doctor.specialties.length > 0 ? (
                  doctor.specialties.map((link) => (
                    <Badge
                      key={link.specialtyId}
                      variant="secondary"
                      className="text-[10px] font-semibold shadow-none"
                    >
                      {link.specialty.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {doctor.experienceYears} yr
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">{doctor.fee}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {doctor._count.bookings}
            </TableCell>
            <TableCell>
              <DoctorStatusBadge verified={doctor.verified} />
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1.5">
                <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs cursor-pointer">
                  <Link to={`/dashboard/doctors/${doctor.id}`}>
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
                  disabled={doctor.verified || isUpdating}
                  onClick={() => onApprove(doctor)}
                >
                  <Check className="h-3.5 w-3.5" />
                  Verify
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
                  disabled={isUpdating}
                  onClick={() => onReject(doctor)}
                >
                  <X className="h-3.5 w-3.5" />
                  Reject
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DoctorsTable;
