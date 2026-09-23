"use client";

import React, { useState } from "react";
import { Calendar, Video, CheckCircle2, AlertCircle, Loader2, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { connectGoogle } from "@/features/doctors/api/client";

interface DoctorGoogleTabProps {
  isConnected: boolean;
  connectedAt?: string | null;
  isLoading: boolean;
  onRefresh: () => void;
  onDisconnect: () => Promise<void>;
  isDisconnecting: boolean;
}

export const DoctorGoogleTab: React.FC<DoctorGoogleTabProps> = ({
  isConnected,
  connectedAt,
  isLoading,
  onRefresh,
  onDisconnect,
  isDisconnecting,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    onSuccess: async (codeResponse) => {
      setIsConnecting(true);
      try {
        await connectGoogle(codeResponse.code);
        toast.success("Google Calendar & Meet successfully connected!");
        onRefresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to connect Google account");
      } finally {
        setIsConnecting(false);
      }
    },
    onError: (errorResponse) => {
      toast.error(`Google authentication cancelled or failed: ${errorResponse.error_description || "Unknown error"}`);
      setIsConnecting(false);
    },
  });

  return (
    <div className="space-y-4">
      <div className="panel space-y-5 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Google Calendar & Meet</h3>
                <p className="text-xs text-muted-foreground">
                  Synchronize confirmed consultations and generate verified Google Meet links.
                </p>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isConnected
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Not Connected</span>
              </>
            )}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Video className="h-4 w-4 text-primary" />
            <span>How Automated Video Appointments Work</span>
          </div>
          <p>
            When connected, whenever a patient books and confirms a video consultation, TeleHealth automatically creates a scheduled event on your Google Calendar with a dedicated Google Meet room.
          </p>
          {isConnected && connectedAt && (
            <p className="text-emerald-600 dark:text-emerald-400 font-medium">
              Active integration connected on {new Date(connectedAt).toLocaleDateString()}.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          {isConnected ? (
            <Button
              type="button"
              variant="outline"
              disabled={isDisconnecting || isLoading}
              onClick={onDisconnect}
              className="h-10 px-4 rounded-xl text-destructive border-destructive/20 hover:bg-destructive/10 gap-2 font-medium"
            >
              {isDisconnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Unlink className="h-4 w-4" />
              )}
              <span>Disconnect Google Calendar</span>
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isConnecting || isLoading}
              onClick={() => googleLogin()}
              className="h-10 px-5 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2 shadow-sm"
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Connect with Google</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
