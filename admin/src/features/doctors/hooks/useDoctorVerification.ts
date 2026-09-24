import { useState } from "react";
import { useApproveDoctor, useRejectDoctor } from "../api/doctors.queries";
import type { AdminDoctor } from "../types";

export interface PendingVerification {
  type: "approve" | "reject";
  doctor: AdminDoctor;
}

/**
 * Shared verification flow used by both the doctors table and the detail page.
 *
 * Every mutation passes through a single confirmation step, disables duplicate
 * submission while pending, invalidates the doctors queries on success, and
 * surfaces backend errors through a toast.
 */
export function useDoctorVerification() {
  const [pending, setPending] = useState<PendingVerification | null>(null);
  const approve = useApproveDoctor();
  const reject = useRejectDoctor();

  const cancel = () => setPending(null);

  const confirm = () => {
    if (!pending) return;
    const onSettled = () => setPending(null);

    if (pending.type === "approve") {
      approve.mutate(pending.doctor.id, { onSettled });
    } else {
      reject.mutate({ id: pending.doctor.id }, { onSettled });
    }
  };

  return {
    pending,
    isPending: approve.isPending || reject.isPending,
    requestApprove: (doctor: AdminDoctor) => setPending({ type: "approve", doctor }),
    requestReject: (doctor: AdminDoctor) => setPending({ type: "reject", doctor }),
    cancel,
    confirm,
  };
}

export default useDoctorVerification;
