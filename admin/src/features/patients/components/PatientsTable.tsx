import { Link } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminPatient } from "../types";

interface PatientsTableProps {
  patients: AdminPatient[];
  onEdit: (patient: AdminPatient) => void;
  onDelete: (patient: AdminPatient) => void;
  isUpdating?: boolean;
}

function initials(name: string | null, email: string): string {
  const source = name?.trim() || email;
  return source.slice(0, 2).toUpperCase();
}

export function PatientsTable({
  patients,
  onEdit,
  onDelete,
  isUpdating = false,
}: PatientsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Blood group</TableHead>
          <TableHead>Bookings</TableHead>
          <TableHead>Reports</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8">
                  {patient.user.image && <AvatarImage src={patient.user.image} alt="" />}
                  <AvatarFallback className="text-[10px] font-bold">
                    {initials(patient.user.name, patient.user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">
                    {patient.user.name ?? "Unnamed patient"}
                  </span>
                  <span className="text-xs text-muted-foreground">{patient.user.email}</span>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {patient.user.phone ?? "—"}
            </TableCell>
            <TableCell>
              {patient.bloodGroup ? (
                <Badge variant="secondary" className="text-[10px] font-semibold shadow-none">
                  {patient.bloodGroup.replace("_", " ")}
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {patient._count.bookings}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {patient._count.medicalReports}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1.5">
                <Button asChild variant="ghost" size="sm" className="h-8 gap-1.5 text-xs cursor-pointer">
                  <Link to={`/dashboard/patients/${patient.id}`}>
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
                  disabled={isUpdating}
                  onClick={() => onEdit(patient)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
                  disabled={isUpdating}
                  onClick={() => onDelete(patient)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PatientsTable;
