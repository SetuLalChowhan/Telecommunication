import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import modular dashboard sub-components
import StatsCards from "@/components/dashboard/StatsCards"
import RevenueChart from "@/components/dashboard/RevenueChart"
import DeviceChart from "@/components/dashboard/DeviceChart"
import SalesChart from "@/components/dashboard/SalesChart"
import TransactionsTable from "@/components/dashboard/TransactionsTable"

const Dashboard: React.FC = () => {
  const [range, setRange] = useState<"daily" | "weekly" | "monthly">("weekly")

  return (
    <div className="space-y-6">
      {/* Upper header section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Operational review, charts telemetry, and activity checklists.
          </p>
        </div>

        {/* Compact Tabs configuration */}
        <div className="flex items-center gap-2">
          <Tabs value={range} onValueChange={(val: any) => setRange(val)} className="w-auto">
            <TabsList className="bg-muted p-1 rounded-lg h-9">
              <TabsTrigger value="daily" className="text-xs h-7 px-3 py-1 font-medium cursor-pointer">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="text-xs h-7 px-3 py-1 font-medium cursor-pointer">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs h-7 px-3 py-1 font-medium cursor-pointer">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Grid Stats Cards Component */}
      <StatsCards />

      {/* Charts section */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Line Chart Component */}
        <RevenueChart range={range} />

        {/* Donut Chart Component */}
        <DeviceChart />
      </div>

      {/* Bar Chart section */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Bar Chart Component */}
        <SalesChart range={range} />
      </div>

      {/* Table section */}
      <TransactionsTable />
    </div>
  )
}

export default Dashboard
