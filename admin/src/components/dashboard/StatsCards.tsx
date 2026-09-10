import React from "react"
import { DollarSign, Users, CreditCard, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    trend: "+20.1% from last month",
    isPositive: true,
    icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Subscriptions",
    value: "+2,350",
    trend: "+180.1% from last month",
    isPositive: true,
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Sales Completed",
    value: "+12,234",
    trend: "+19.0% from last week",
    isPositive: true,
    icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "Active Users",
    value: "+573",
    trend: "-4.2% from last hour",
    isPositive: false,
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
  },
]

const StatsCards: React.FC = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i} className="border border-border/70 hover:border-primary/30 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {stat.title}
            </span>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              {stat.isPositive ? (
                <span className="flex items-center text-emerald-600 font-medium">
                  <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
                  {stat.trend.split(" ")[0]}
                </span>
              ) : (
                <span className="flex items-center text-rose-600 font-medium">
                  <ArrowDownRight className="h-3 w-3 stroke-[2.5]" />
                  {stat.trend.split(" ")[0]}
                </span>
              )}
              <span className="text-muted-foreground">
                {stat.trend.substring(stat.trend.indexOf(" "))}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default StatsCards
