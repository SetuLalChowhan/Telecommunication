"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { useAuth } from "@/features/auth/api/queries";

const registerSchema = z
  .object({
    role: z.enum(["PATIENT", "DOCTOR"]),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(6, "Please enter a valid phone number (min 6 digits)")
      .max(20, "Phone number is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  role: "PATIENT" | "DOCTOR";
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ role }) => {
  const { register: registerAuth, registerMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isLoading = registerMutation.isPending;
  const serverError = registerMutation.error?.message;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  // Keep form role in sync with tab
  React.useEffect(() => {
    setValue("role", role);
  }, [role, setValue]);

  const passwordVal = watch("password") || "";
  const passwordRules = useMemo(
    () => ({
      hasLength: passwordVal.length >= 8,
      hasUppercase: /[A-Z]/.test(passwordVal),
      hasNumber: /[0-9]/.test(passwordVal),
    }),
    [passwordVal]
  );

  const strengthPercent = useMemo(() => {
    const passed = Object.values(passwordRules).filter(Boolean).length;
    return (passed / 3) * 100;
  }, [passwordRules]);

  const onSubmit = async (values: RegisterFormValues) => {
    await registerAuth({
      email: values.email,
      password: values.password,
      name: `${values.firstName} ${values.lastName}`,
      phone: values.phone.trim(),
      role: values.role,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">First Name</Label>
          <Input
            {...register("firstName")}
            disabled={isLoading}
            placeholder="John"
            className="h-10 rounded-xl text-sm"
          />
          {errors.firstName && (
            <p className="text-[11px] text-destructive font-medium">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">Last Name</Label>
          <Input
            {...register("lastName")}
            disabled={isLoading}
            placeholder="Doe"
            className="h-10 rounded-xl text-sm"
          />
          {errors.lastName && (
            <p className="text-[11px] text-destructive font-medium">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">Email Address</Label>
          <Input
            type="email"
            {...register("email")}
            disabled={isLoading}
            placeholder="john.doe@example.com"
            className="h-10 rounded-xl text-sm"
          />
          {errors.email && (
            <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">Phone Number</Label>
          <Input
            type="tel"
            {...register("phone")}
            disabled={isLoading}
            placeholder="+880 1712-345678"
            className="h-10 rounded-xl text-sm"
          />
          {errors.phone && (
            <p className="text-[11px] text-destructive font-medium">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-foreground">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            disabled={isLoading}
            placeholder="••••••••"
            className="h-10 rounded-xl pr-10 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[11px] text-destructive font-medium">{errors.password.message}</p>
        )}
      </div>

      {passwordVal && (
        <PasswordStrengthIndicator
          rules={passwordRules}
          strengthPercent={strengthPercent}
        />
      )}

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-foreground">Confirm Password</Label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            disabled={isLoading}
            placeholder="••••••••"
            className="h-10 rounded-xl pr-10 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-[11px] text-destructive font-medium">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex items-start gap-2.5 pt-1">
        <Checkbox
          id="terms"
          disabled={isLoading}
          onCheckedChange={(checked) => setValue("agreeToTerms", checked === true)}
          className="mt-0.5 rounded-md"
        />
        <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
          I agree to the{" "}
          <Link href="/terms" className="text-primary underline hover:text-primary-dark font-medium">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary underline hover:text-primary-dark font-medium">
            Privacy Policy
          </Link>
        </label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-[11px] text-destructive font-medium">{errors.agreeToTerms.message}</p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold gap-2 shadow-sm shadow-primary/20"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </Button>
    </form>
  );
};
