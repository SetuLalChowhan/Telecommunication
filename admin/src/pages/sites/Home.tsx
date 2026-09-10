import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Shield, Activity, Zap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const Home: React.FC = () => {
  return (
    <div className="w-full py-12 flex flex-col items-center">
      {/* Badge Header */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
        <Sparkles className="h-3 w-3" />
        <span>Next-Generation Control Panel</span>
      </div>

      {/* Hero Headings */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground text-center tracking-tight leading-tight max-w-xl">
        Manage everything in{" "}
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          one beautiful place
        </span>
      </h1>
      
      <p className="mt-4 text-sm sm:text-base text-muted-foreground text-center max-w-md">
        An elegant, responsive React Admin Panel built with Tailwind CSS, shadcn/ui primitives, and Recharts. Focus on your business logic while we handle the UI.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3.5 mt-8 w-full max-w-xs sm:max-w-none">
        <Button asChild size="lg" className="w-full sm:w-auto font-medium shadow-md cursor-pointer">
          <Link to="/login" className="flex items-center gap-2">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-medium cursor-pointer">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full max-w-3xl">
        <Card className="border border-border/60 hover:border-primary/45 transition-colors">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Extreme Speed</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Fitted with state-of-the-art caching and data fetching optimizations.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 hover:border-primary/45 transition-colors">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Secure by Design</h3>
            <p className="text-xs text-muted-foreground mt-1">
              End-to-end token validation with fully schema-checked data boundaries.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border/60 hover:border-primary/45 transition-colors">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Rich Telemetry</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Beautiful real-time chart projections displaying usage stats.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Home