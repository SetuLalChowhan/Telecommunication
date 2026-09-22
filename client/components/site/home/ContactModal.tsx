"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useSubmitContactMessage } from "@/features/contact";
import type { ContactSource } from "@/features/contact";

const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(7, { message: "Please enter a valid phone number." }),
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** Page the inquiry originated from, stored with the message. */
  source?: ContactSource;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onOpenChange,
  source = "home",
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: submitMessage, isPending: isSubmitting } =
    useSubmitContactMessage({
      onSuccess: () => setIsSubmitted(true),
      onError: (message) => setErrorMessage(message),
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setErrorMessage(null);

    try {
      await submitMessage({ ...data, source });
    } catch {
      // The message is surfaced through the hook's onError handler; the form
      // stays filled in so the visitor does not retype their inquiry.
    }
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setErrorMessage(null);
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
      }, 200);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        {isSubmitted ? (
          <DialogBody className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                Message sent
              </h3>
              <p className="mx-auto max-w-xs text-xs leading-relaxed text-muted-foreground">
                A medical support representative will reach out to you shortly.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => handleClose(false)}
              className="h-8 rounded-md px-3 text-xs font-semibold"
            >
              Close
            </Button>
          </DialogBody>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Contact medical support</DialogTitle>
              <DialogDescription>
                Have a question or need help with a booking? Leave a message.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex min-h-0 flex-1 flex-col"
            >
              <DialogBody>
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive"
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-medium text-foreground">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  id="fullName"
                  placeholder="e.g. Sarah Jenkins"
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/15"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-destructive font-medium">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-foreground">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="sarah@example.com"
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/15"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-medium text-foreground">
                    Phone Number <span className="text-primary">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+880 1700-000000"
                    className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/15"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-destructive font-medium">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-medium text-foreground">
                  Subject <span className="text-primary">*</span>
                </label>
                <input
                  id="subject"
                  placeholder="e.g. Question regarding cardiology consultation"
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/15"
                  {...register("subject")}
                />
                {errors.subject && (
                  <p className="text-[11px] text-destructive font-medium">{errors.subject.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-medium text-foreground">
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="How can our healthcare team assist you today?"
                  className="w-full resize-none rounded-md border border-border bg-card p-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/15"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-[11px] text-destructive font-medium">{errors.message.message}</p>
                )}
              </div>

              </DialogBody>

              <DialogFooter>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <span>Send message</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
