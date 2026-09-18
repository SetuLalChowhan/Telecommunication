"use client";

import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useAuth } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface GoogleAuthButtonProps {
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function GoogleAuthButton({
  disabled = false,
}: GoogleAuthButtonProps) {
  const { loginWithGoogleCredential, loginWithGoogleCredentialMutation } = useAuth();
  const isGooglePending = loginWithGoogleCredentialMutation.isPending;

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Google authentication failed. Please try again.");
      return;
    }
    try {
      await loginWithGoogleCredential(credentialResponse.credential);
    } catch {
      // Toast notification is automatically managed by useMutationClient
    }
  };

  return (
    <div
      className={`w-full relative flex justify-center items-center min-h-[44px] ${
        disabled ? "pointer-events-none opacity-60" : ""
      }`}
    >
      {isGooglePending ? (
        <div className="w-full h-11 sm:h-12 border border-slate-200 bg-white text-foreground font-medium text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Connecting with Google...</span>
        </div>
      ) : (
        <div className="w-full flex justify-center overflow-hidden rounded-xl [&>div]:w-full [&>div]:flex [&>div]:justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              toast.error("Google sign in was cancelled or failed.");
            }}
            theme="outline"
            size="large"
            shape="rectangular"
            text="continue_with"
            width="380"
          />
        </div>
      )}
    </div>
  );
}
