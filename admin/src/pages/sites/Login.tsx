import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Loader2, KeyRound, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { describeApiError } from "@/lib/api/error"
import { useLogin, useSession } from "@/features/auth/api/auth.queries"
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login.schema"

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const { isAuthenticated, isPending: isSessionPending } = useSession()

  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Already signed in — no reason to show the form again.
  if (isAuthenticated && !isSessionPending) {
    return <Navigate to={from} replace />
  }

  const onSubmit = async (data: LoginFormValues) => {
    setFormError(null)
    try {
      await login.mutateAsync(data)
      navigate(from, { replace: true })
    } catch (error) {
      // The server message is surfaced verbatim (e.g. invalid credentials),
      // normalized through the shared error helper.
      setFormError(describeApiError(error))
    }
  }

  return (
    <Card className="border border-border/80 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center text-xs">
          Enter your credentials to access the admin workspace
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

          {/* Email field */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                className={`pl-9 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`pl-9 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
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

          <Button type="submit" className="w-full mt-2 font-medium cursor-pointer" disabled={login.isPending}>
            {login.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Signing you in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 border-t pt-4 text-center">
        <div className="text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/" className="text-primary hover:underline font-semibold">
            View landing details
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default Login
