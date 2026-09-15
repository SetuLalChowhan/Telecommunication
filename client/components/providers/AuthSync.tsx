"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/api/client/authClient";
import { useAppDispatch } from "@/redux/hooks";
import { setSession, clearAuth } from "@/redux/slices/authSlice";
import { User } from "@/types";

/**
 * AuthSync Component
 * Keeps Redux authSlice synchronized with Better-Auth session cookies
 */
export default function AuthSync() {
  const dispatch = useAppDispatch();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        dispatch(
          setSession({
            user: session.user as unknown as User,
            token: (session as any).session?.token || null,
          })
        );
      } else {
        dispatch(clearAuth());
      }
    }
  }, [session, isPending, dispatch]);

  return null;
}
