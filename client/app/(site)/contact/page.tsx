"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Send,
  Loader2,
  HelpCircle,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContactMessage } from "@/features/contact";

const contactSchema = z.object({
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

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: submitMessage, isPending: isSubmitting } =
    useSubmitContactMessage({
      onSuccess: () => setIsSubmitted(true),
      onError: (msg) => setErrorMessage(msg),
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
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
      await submitMessage({ ...data, source: "contact-page" });
    } catch {
      // Handled by hook onError
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    reset();
  };

  return (
    <div className="min-h-screen bg-background py-12 sm:py-20">
      <div className="container-page max-w-6xl space-y-14">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-foreground shadow-xs">
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span>24/7 Patient & Doctor Assistance</span>
          </div>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Get in touch with medical support
          </h1>
          <p className="text-sm leading-relaxed text-secondary-text sm:text-base">
            Have a question about a video consultation, digital prescription, or physician verification?
            Our clinical support team is here to assist you.
          </p>
        </div>

        {/* Emergency Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 sm:p-6 text-xs sm:text-sm text-amber-950 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-semibold text-foreground">Medical Emergency Notice:</strong>
              <p className="text-secondary-text">
                DocConnect handles non-emergency teleconsultations. If you are facing chest pain, trauma, or a life-threatening crisis, dial <strong>999</strong> or <strong>911</strong> or visit an emergency room immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-lg font-semibold text-foreground">Message received</h3>
                  <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                    Thank you for reaching out. A dedicated healthcare support coordinator will review your inquiry and respond within 2 hours.
                  </p>
                </div>
                <Button onClick={handleReset} variant="outline" className="mt-2 text-xs font-semibold">
                  Send another inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div className="border-b border-border/80 pb-4">
                  <h2 className="text-base font-semibold text-foreground">Send an inquiry</h2>
                  <p className="text-xs text-secondary-text">Fill out the details below and we will contact you promptly.</p>
                </div>

                {errorMessage && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-xs text-destructive"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-medium text-foreground">
                    Full name <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="e.g. Dr. Sarah Jenkins or John Doe"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.fullName}
                    className="h-10 text-sm"
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] font-medium text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-foreground">
                      Email address <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      disabled={isSubmitting}
                      aria-invalid={!!errors.email}
                      className="h-10 text-sm"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-[11px] font-medium text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-medium text-foreground">
                      Phone number <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+880 1700-000000"
                      disabled={isSubmitting}
                      aria-invalid={!!errors.phone}
                      className="h-10 text-sm"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="text-[11px] font-medium text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs font-medium text-foreground">
                    Inquiry subject <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="subject"
                    placeholder="e.g. Appointment booking question or prescription copy"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.subject}
                    className="h-10 text-sm"
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="text-[11px] font-medium text-destructive">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs font-medium text-foreground">
                    Message <span className="text-primary">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Please explain how our clinical or technical team can help you..."
                    disabled={isSubmitting}
                    aria-invalid={!!errors.message}
                    className="text-sm resize-none"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-[11px] font-medium text-destructive">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl gap-2 transition-all shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Transmitting inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Send inquiry</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Details & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-xs">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Direct Contact Channels
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-secondary-text">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email Support</p>
                    <a href="mailto:support@docconnect.com" className="text-primary hover:underline">
                      support@docconnect.com
                    </a>
                    <p className="text-[11px] text-muted-foreground pt-0.5">Average reply time under 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Telephone Helpdesk</p>
                    <p className="text-foreground font-medium">+880 (02) 880-9900</p>
                    <p className="text-[11px] text-muted-foreground pt-0.5">Toll-free across Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Hours of Operation</p>
                    <p>Clinical Video Consultations: 24/7</p>
                    <p className="text-[11px] text-muted-foreground pt-0.5">Support Desk: 8:00 AM – 11:00 PM BST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Corporate Headquarters</p>
                    <p>Gulshan-2, Dhaka 1212, Bangladesh</p>
                    <p className="text-[11px] text-muted-foreground pt-0.5">DocConnect Telemedicine Healthcare Ltd.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Credentialing Help */}
            <div className="rounded-2xl border border-border bg-muted/40 p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm">
                <Stethoscope className="h-4 w-4" />
                <span>Are you a licensed doctor?</span>
              </div>
              <p className="text-xs text-secondary-text leading-relaxed">
                For questions about BMDC accreditation, document onboarding, and setting up your digital clinical console, email our provider desk at <strong>doctors@docconnect.com</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-8 border-t border-border space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-secondary-text">
              Quick answers to common questions about appointments and platform security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Are doctors verified?
              </h3>
              <p className="text-xs text-secondary-text leading-relaxed">
                Yes. Every physician on DocConnect is verified with the Bangladesh Medical and Dental Council (BMDC) with active registration before accepting consultations.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Are prescriptions accepted?
              </h3>
              <p className="text-xs text-secondary-text leading-relaxed">
                Yes. Prescriptions carry the doctor&apos;s registration number and digital signature and are legally recognized at registered pharmacies and diagnostic centers.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-600" />
                How do refunds work?
              </h3>
              <p className="text-xs text-secondary-text leading-relaxed">
                Appointments cancelled up to 2 hours in advance receive a full credit refund to your account. Technical failures during consultation are also fully reimbursed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

