import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdatePatient } from "../api/patients.queries";
import type { BloodGroup, Gender, UpdatePatientPayload } from "../types";

const GENDERS: Gender[] = ["MALE", "FEMALE", "OTHER"];

const BLOOD_GROUPS: BloodGroup[] = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];

/** The subset of a patient this form can edit; satisfied by list rows and detail. */
export interface EditablePatient {
  id: string;
  address: string | null;
  gender: Gender | null;
  bloodGroup: BloodGroup | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  user: { name: string | null; email: string; phone: string | null; dateOfBirth?: string | null };
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  bloodGroup: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

function toFormState(patient: EditablePatient): FormState {
  return {
    name: patient.user.name ?? "",
    email: patient.user.email ?? "",
    phone: patient.user.phone ?? "",
    dateOfBirth: patient.user.dateOfBirth ? patient.user.dateOfBirth.slice(0, 10) : "",
    address: patient.address ?? "",
    gender: patient.gender ?? "",
    bloodGroup: patient.bloodGroup ?? "",
    emergencyContactName: patient.emergencyContactName ?? "",
    emergencyContactPhone: patient.emergencyContactPhone ?? "",
  };
}

/**
 * The form body. It is mounted with a `key` equal to the patient id, so opening
 * a different patient remounts it with fresh initial state — no reset effect
 * (and no cascading render) required.
 */
function PatientForm({
  patient,
  onClose,
}: {
  patient: EditablePatient;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(patient));
  const updatePatient = useUpdatePatient();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const payload: UpdatePatientPayload = {
      name: form.name.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
      address: form.address.trim() || undefined,
      gender: (form.gender || undefined) as Gender | undefined,
      bloodGroup: (form.bloodGroup || undefined) as BloodGroup | undefined,
      emergencyContactName: form.emergencyContactName.trim() || undefined,
      emergencyContactPhone: form.emergencyContactPhone.trim() || undefined,
    };

    updatePatient.mutate({ id: patient.id, payload }, { onSuccess: onClose });
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="patient-name">Full name</Label>
          <Input id="patient-name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="patient-email">Email</Label>
          <Input
            id="patient-email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="patient-phone">Phone</Label>
          <Input id="patient-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="patient-dob">Date of birth</Label>
          <Input
            id="patient-dob"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => set("dateOfBirth", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Gender</Label>
          <Select value={form.gender} onValueChange={(value) => set("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Not set" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Blood group</Label>
          <Select value={form.bloodGroup} onValueChange={(value) => set("bloodGroup", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Not set" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_GROUPS.map((group) => (
                <SelectItem key={group} value={group}>
                  {group.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="patient-address">Address</Label>
          <Input
            id="patient-address"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="patient-emg-name">Emergency contact</Label>
          <Input
            id="patient-emg-name"
            value={form.emergencyContactName}
            onChange={(e) => set("emergencyContactName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="patient-emg-phone">Emergency phone</Label>
          <Input
            id="patient-emg-phone"
            value={form.emergencyContactPhone}
            onChange={(e) => set("emergencyContactPhone", e.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-2">
        <Button variant="outline" className="cursor-pointer" onClick={onClose}>
          Cancel
        </Button>
        <Button className="cursor-pointer" disabled={updatePatient.isPending} onClick={handleSubmit}>
          {updatePatient.isPending ? "Saving…" : "Save changes"}
        </Button>
      </DialogFooter>
    </>
  );
}

interface EditPatientDialogProps {
  patient: EditablePatient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPatientDialog({ patient, open, onOpenChange }: EditPatientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit patient</DialogTitle>
          <DialogDescription>
            Update the patient's account and profile details. Changes are saved to the server.
          </DialogDescription>
        </DialogHeader>

        {patient && (
          <PatientForm
            key={patient.id}
            patient={patient}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditPatientDialog;
