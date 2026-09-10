import React from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const DEVICE_DATA = [
  { name: "Desktop", value: 65, color: "var(--primary)" },
  { name: "Mobile", value: 25, color: "#10B981" },
  { name: "Tablet", value: 10, color: "#F59E0B" },
]

const DeviceChart: React.FC = () => {
  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">Device Segments</CardTitle>
        <CardDescription className="text-xs">Traffic origins breakdown.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col justify-center items-center h-full max-h-[300px]">
        <div className="h-44 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={DEVICE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                {DEVICE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value) => `${value}%`} contentStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-foreground">100%</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Total Share</span>
          </div>
        </div>
        
        {/* Custom Legend */}
        <div className="flex justify-center gap-4 mt-2 w-full text-xs">
          {DEVICE_DATA.map((d, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-muted-foreground font-medium">{d.name}</span>
              <span className="font-bold text-foreground">{d.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default DeviceChart
