import React from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const BAR_DATA = {
  daily: [
    { name: "00:00", sales: 12 },
    { name: "04:00", sales: 8 },
    { name: "08:00", sales: 24 },
    { name: "12:00", sales: 38 },
    { name: "16:00", sales: 31 },
    { name: "20:00", sales: 45 },
    { name: "24:00", sales: 29 },
  ],
  weekly: [
    { name: "Mon", sales: 120 },
    { name: "Tue", sales: 145 },
    { name: "Wed", sales: 180 },
    { name: "Thu", sales: 130 },
    { name: "Fri", sales: 210 },
    { name: "Sat", sales: 250 },
    { name: "Sun", sales: 195 },
  ],
  monthly: [
    { name: "Jan", sales: 450 },
    { name: "Feb", sales: 510 },
    { name: "Mar", sales: 480 },
    { name: "Apr", sales: 620 },
    { name: "May", sales: 570 },
    { name: "Jun", sales: 690 },
    { name: "Jul", sales: 810 },
  ],
}

interface SalesChartProps {
  range: "daily" | "weekly" | "monthly"
}

const SalesChart: React.FC<SalesChartProps> = ({ range }) => {
  return (
    <Card className="md:col-span-3 border border-border/70 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">Acquisitions & Sales</CardTitle>
        <CardDescription className="text-xs">Product completions count.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BAR_DATA[range]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
              <Bar dataKey="sales" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesChart
