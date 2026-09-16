"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

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
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = (data: ContactFormValues) => {
    setIsSubmitting(true);
    console.log("Contact form submitted:", data);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
      }, 200);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-6 sm:p-8 bg-card rounded-2xl sm:rounded-3xl border border-border/80 shadow-2xl">
        {isSubmitted ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-foreground">
                Message Sent Successfully
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text max-w-xs leading-relaxed">
                Thank you for contacting us. A medical support representative will reach out to you shortly.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => handleClose(false)}
              className="mt-2 rounded-full px-7 h-10 bg-primary hover:bg-primary-dark text-white text-sm font-semibold shadow-xs"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-1.5 text-left mb-2">
              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Contact Medical Support
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-[13px] text-secondary-text leading-relaxed">
                Have a question or need assistance with your booking? Leave a message below.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="fullName" className="text-xs font-semibold text-foreground">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  id="fullName"
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-destructive font-medium">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-semibold text-foreground">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="sarah@example.com"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs font-semibold text-foreground">
                    Phone Number <span className="text-primary">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+880 1700-000000"
                    className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-destructive font-medium">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-xs font-semibold text-foreground">
                  Subject <span className="text-primary">*</span>
                </label>
                <input
                  id="subject"
                  placeholder="e.g. Question regarding cardiology consultation"
                  className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                  {...register("subject")}
                />
                {errors.subject && (
                  <p className="text-[11px] text-destructive font-medium">{errors.subject.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-semibold text-foreground">
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="How can our healthcare team assist you today?"
                  className="w-full p-3.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all resize-none"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-[11px] text-destructive font-medium">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-xs hover:shadow-md hover:shadow-primary/20 transition-all duration-200 disabled:opacity-70 active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
