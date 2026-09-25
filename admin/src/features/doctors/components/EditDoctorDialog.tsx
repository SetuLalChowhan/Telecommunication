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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateDoctor } from "../api/doctors.queries";
import type { UpdateDoctorPayload } from "../types";

/** The editable subset of a doctor — satisfied by both the list row and detail. */
export interface EditableDoctor {
  id: string;
  slug: string | null;
  experienceYears: number;
  fee: string;
  bio: string | null;
  bmdcNumber: string | null;
  designation: string | null;
  hospitalAffiliation: string | null;
  clinicAddress: string | null;
}

function toFormState(doctor: EditableDoctor) {
  return {
    experienceYears: String(doctor.experienceYears ?? 0),
    fee: doctor.fee ?? "",
    bmdcNumber: doctor.bmdcNumber ?? "",
    designation: doctor.designation ?? "",
    hospitalAffiliation: doctor.hospitalAffiliation ?? "",
    clinicAddress: doctor.clinicAddress ?? "",
    slug: doctor.slug ?? "",
    bio: doctor.bio ?? "",
  };
}

/** Mounted with `key={doctor.id}` so a new doctor resets the form without an effect. */
function DoctorForm({ doctor, onClose }: { doctor: EditableDoctor; onClose: () => void }) {
  const updateDoctor = useUpdateDoctor();
  const [form, setForm] = useState(() => toFormState(doctor));

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const payload: UpdateDoctorPayload = {
      experienceYears: form.experienceYears === "" ? undefined : Number(form.experienceYears),
      fee: form.fee === "" ? undefined : Number(form.fee),
      bmdcNumber: form.bmdcNumber.trim() || undefined,
      designation: form.designation.trim() || undefined,
      hospitalAffiliation: form.hospitalAffiliation.trim() || undefined,
      clinicAddress: form.clinicAddress.trim() || undefined,
      slug: form.slug.trim() || undefined,
      bio: form.bio.trim() || undefined,
    };

    updateDoctor.mutate({ id: doctor.id, payload }, { onSuccess: onClose });
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="doctor-experience">Experience (years)</Label>
          <Input
            id="doctor-experience"
            type="number"
            min={0}
            value={form.experienceYears}
            onChange={(e) => set("experienceYears", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="doctor-fee">Consultation fee</Label>
          <Input
            id="doctor-fee"
            type="number"
            min={0}
            value={form.fee}
            onChange={(e) => set("fee", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="doctor-bmdc">BMDC number</Label>
          <Input id="doctor-bmdc" value={form.bmdcNumber} onChange={(e) => set("bmdcNumber", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="doctor-designation">Designation</Label>
          <Input id="doctor-designation" value={form.designation} onChange={(e) => set("designation", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="doctor-hospital">Hospital</Label>
          <Input
            id="doctor-hospital"
            value={form.hospitalAffiliation}
            onChange={(e) => set("hospitalAffiliation", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="doctor-slug">Public slug</Label>
          <Input id="doctor-slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="doctor-clinic">Clinic address</Label>
          <Input id="doctor-clinic" value={form.clinicAddress} onChange={(e) => set("clinicAddress", e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="doctor-bio">Biography</Label>
          <Textarea id="doctor-bio" rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-2">
        <Button variant="outline" className="cursor-pointer" onClick={onClose}>
          Cancel
        </Button>
        <Button className="cursor-pointer" disabled={updateDoctor.isPending} onClick={handleSubmit}>
          {updateDoctor.isPending ? "Saving…" : "Save changes"}
        </Button>
      </DialogFooter>
    </>
  );
}

interface EditDoctorDialogProps {
  doctor: EditableDoctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDoctorDialog({ doctor, open, onOpenChange }: EditDoctorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit doctor</DialogTitle>
          <DialogDescription>
            Update the doctor's public profile. Verification status is managed separately.
          </DialogDescription>
        </DialogHeader>

        {doctor && <DoctorForm key={doctor.id} doctor={doctor} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

export default EditDoctorDialog;
