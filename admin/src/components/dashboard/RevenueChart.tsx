import React from "react"
import { TrendingUp } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const LINE_DATA = {
  daily: [
    { name: "00:00", value: 1200 },
    { name: "04:00", value: 800 },
    { name: "08:00", value: 2100 },
    { name: "12:00", value: 3400 },
    { name: "16:00", value: 2900 },
    { name: "20:00", value: 4100 },
    { name: "24:00", value: 3200 },
  ],
  weekly: [
    { name: "Mon", value: 12000 },
    { name: "Tue", value: 15000 },
    { name: "Wed", value: 18000 },
    { name: "Thu", value: 14000 },
    { name: "Fri", value: 22000 },
    { name: "Sat", value: 26000 },
    { name: "Sun", value: 21000 },
  ],
  monthly: [
    { name: "Jan", value: 45000 },
    { name: "Feb", value: 52000 },
    { name: "Mar", value: 49000 },
    { name: "Apr", value: 63000 },
    { name: "May", value: 58000 },
    { name: "Jun", value: 71000 },
    { name: "Jul", value: 85000 },
  ],
}

interface RevenueChartProps {
  range: "daily" | "weekly" | "monthly"
}

const RevenueChart: React.FC<RevenueChartProps> = ({ range }) => {
  return (
    <Card className="md:col-span-2 border border-border/70 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Revenue Projections
            </CardTitle>
            <CardDescription className="text-xs">
              Financial trends compiled for {range} cycles.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={LINE_DATA[range]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default RevenueChart
