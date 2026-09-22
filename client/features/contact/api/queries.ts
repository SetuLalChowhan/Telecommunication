"use client";

import { useMutation } from "@tanstack/react-query";
import { submitContactMessage } from "./client";
import { ContactMessage, ContactMessageInput } from "../types";

/** Extracts a human-readable message from a rejected mutation. */
export function getContactErrorMessage(error: unknown): string {
  const err = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  const raw = err?.response?.data?.message || err?.message;
  if (Array.isArray(raw)) return raw.join(", ");
  return raw || "Could not send your message. Please try again.";
}

/**
 * Submit a contact inquiry.
 *
 * The caller owns the success UI; this hook only handles the request and the
 * error message extraction so every entry point (home, footer, consult page)
 * reports failures identically.
 */
export function useSubmitContactMessage(options?: {
  onSuccess?: (message: ContactMessage) => void;
  onError?: (message: string) => void;
}) {
  return useMutation<ContactMessage, unknown, ContactMessageInput>({
    mutationFn: (input) => submitContactMessage(input),
    onSuccess: (data) => options?.onSuccess?.(data),
    onError: (error) => options?.onError?.(getContactErrorMessage(error)),
  });
}
