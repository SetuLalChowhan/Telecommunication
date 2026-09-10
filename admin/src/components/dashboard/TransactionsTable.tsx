import React, { useState, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ActivityItem {
  id: string
  user: string
  email: string
  amount: number
  status: "Success" | "Pending" | "Failed"
  date: string
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: "TX1001", user: "Setu Lal", email: "setu@example.com", amount: 250.0, status: "Success", date: "2026-07-07" },
  { id: "TX1002", user: "John Doe", email: "john@example.com", amount: 120.5, status: "Pending", date: "2026-07-08" },
  { id: "TX1003", user: "Alice Smith", email: "alice@example.com", amount: 850.0, status: "Success", date: "2026-07-06" },
  { id: "TX1004", user: "Bob Johnson", email: "bob@example.com", amount: 45.0, status: "Failed", date: "2026-07-05" },
  { id: "TX1005", user: "Emily Davis", email: "emily@example.com", amount: 150.0, status: "Success", date: "2026-07-07" },
  { id: "TX1006", user: "Michael Wilson", email: "mike@example.com", amount: 320.0, status: "Success", date: "2026-07-04" },
  { id: "TX1007", user: "Sarah Miller", email: "sarah@example.com", amount: 95.0, status: "Pending", date: "2026-07-08" },
  { id: "TX1008", user: "David Taylor", email: "david@example.com", amount: 430.0, status: "Failed", date: "2026-07-03" },
]

const TransactionsTable: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortField, setSortField] = useState<"amount" | "date" | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const itemsPerPage = 4

  // Sorting Handler
  const handleSort = (field: "amount" | "date") => {
    const order = sortField === field && sortOrder === "desc" ? "asc" : "desc"
    setSortField(field)
    setSortOrder(order)
    
    const sorted = [...activities].sort((a, b) => {
      let comparison = 0
      if (field === "amount") {
        comparison = a.amount - b.amount
      } else if (field === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      }
      return order === "desc" ? -comparison : comparison
    })
    setActivities(sorted)
  }

  // Pagination calculation
  const totalPages = Math.ceil(activities.length / itemsPerPage)
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return activities.slice(start, start + itemsPerPage)
  }, [activities, page])

  // Row selection handler
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageIds = paginatedItems.map((item) => item.id)
      setSelectedIds(Array.from(new Set([...selectedIds, ...currentPageIds])))
    } else {
      const currentPageIds = paginatedItems.map((item) => item.id)
      setSelectedIds(selectedIds.filter((id) => !currentPageIds.includes(id)))
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    }
  }

  const isAllSelectedOnPage = useMemo(() => {
    if (paginatedItems.length === 0) return false
    return paginatedItems.every((item) => selectedIds.includes(item.id))
  }, [paginatedItems, selectedIds])

  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader className="pb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-bold">Recent Transactions</CardTitle>
          <CardDescription className="text-xs">
            List of transactions. Selected {selectedIds.length} of {activities.length} entries.
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelectedOnPage}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("date")}>
                <div className="flex items-center gap-1.5">
                  Date
                  <ChevronDown className={`h-3 w-3 transition-transform ${sortField === "date" && sortOrder === "asc" ? "rotate-180" : ""}`} />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("amount")}>
                <div className="flex items-center gap-1.5">
                  Amount
                  <ChevronDown className={`h-3 w-3 transition-transform ${sortField === "amount" && sortOrder === "asc" ? "rotate-180" : ""}`} />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => {
              const isSelected = selectedIds.includes(item.id)
              return (
                <TableRow key={item.id} className={isSelected ? "bg-muted/40" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectRow(item.id, !!checked)}
                      aria-label={`Select row ${item.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-foreground">{item.user}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.email}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.date}</TableCell>
                  <TableCell className="text-xs font-bold text-foreground">
                    ${item.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="px-2 py-0.5 text-[10px] font-bold shadow-none"
                      variant={
                        item.status === "Success"
                          ? "default"
                          : item.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Table Footer with pagination controls */}
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold cursor-pointer"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold cursor-pointer"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TransactionsTable
