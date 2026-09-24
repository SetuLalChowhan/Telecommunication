import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link, useSearchParams } from "react-router-dom"
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { describeApiError } from "@/lib/api/error"
import { useResetPassword } from "@/features/auth/api/auth.queries"

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof schema>

const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [searchParams] = useSearchParams()
  const resetPassword = useResetPassword()

  const token = searchParams.get("token")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    if (!token) return
    setFormError(null)
    try {
      await resetPassword.mutateAsync({ newPassword: values.password, token })
      setIsSuccess(true)
    } catch (error) {
      setFormError(describeApiError(error))
    }
  }

  // The token arrives in the emailed link (`?token=...`). Without it the page
  // cannot do anything useful, so say so instead of failing silently.
  if (!token) {
    return (
      <Card className="border border-border/80 shadow-lg text-center">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Invalid reset link</CardTitle>
          <CardDescription className="text-xs">
            This password reset link is missing its token or has expired.
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-4">
          <Button asChild className="w-full font-medium cursor-pointer">
            <Link to="/forgot-password">Request a new link</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (isSuccess) {
    return (
      <Card className="border border-border/80 shadow-lg text-center">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Password Reset Complete</CardTitle>
          <CardDescription className="text-xs">
            Your password has been successfully updated. You can now log in using your new credentials.
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-4">
          <Button asChild className="w-full font-medium cursor-pointer">
            <Link to="/login">Sign In Now</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="border border-border/80 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
        <CardDescription className="text-center text-xs">
          Choose a strong, secure password containing at least 6 characters
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive"
            >
              {formError}
            </div>
          )}

          {/* Password field */}
          <div className="space-y-1.5">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`pl-9 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/80 hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password field */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`pl-9 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive font-medium mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full font-medium cursor-pointer" disabled={resetPassword.isPending}>
            {resetPassword.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-4">
        <Link
          to="/login"
          className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          Cancel and return to login
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ResetPassword
