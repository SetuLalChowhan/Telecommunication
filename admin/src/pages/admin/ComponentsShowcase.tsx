import React, { useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  Info,
  Calendar,
  AlertTriangle,
  Play,
  CheckCircle,
  FileUp,
  FileSpreadsheet,
  Check,
  ChevronDown,
  Clock,
  UserCheck,
  ShieldCheck,
  Database,
  ArrowRight,
  HelpCircle,
  Activity,
  Terminal,
  Server,
  Layers,
  Settings,
  AlertCircle,
  Eye,
  Trash2,
  FolderKanban,
  Flame,
  Globe,
  Sliders,
  DollarSign,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect, type OptionType } from "@/components/ui/MultiSelect"
import { DatePicker } from "@/components/ui/date-picker"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

const COMPONENT_OPTIONS: OptionType[] = [
  { label: "React JS", value: "react" },
  { label: "Tailwind CSS", value: "tailwind" },
  { label: "shadcn/ui", value: "shadcn" },
  { label: "Recharts", value: "recharts" },
  { label: "Redux Toolkit", value: "redux" },
]

// --- Mock FAQ/Accordion Items ---
const FAQ_ITEMS = [
  { q: "How do I switch layout theme modes?", a: "Go to the Settings page, navigate to Preferences, and update the Theme selection menu between Light, Dark, and System states." },
  { q: "How is form validation configured?", a: "Forms are controlled via react-hook-form, bound to client-side input validations using standard Zod schemas." },
]

// --- Mock Audit Logs Table Data ---
const AUDIT_LOGS = [
  { id: "LOG-5421", action: "AUTH_LOGIN", status: "SUCCESS", ip: "192.168.1.1", user: "setu@example.com", time: "2026-07-08 10:15" },
  { id: "LOG-5422", action: "API_ROTATE", status: "WARNING", ip: "10.0.0.4", user: "system_cron", time: "2026-07-08 10:10" },
  { id: "LOG-5423", action: "DB_BACKUP", status: "SUCCESS", ip: "localhost", user: "db_admin", time: "2026-07-08 04:00" },
]

// --- Mock Team Member Data ---
const TEAM_MEMBERS = [
  { name: "Setu Lal", role: "Lead Engineer", status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=64&auto=format&fit=crop" },
  { name: "Sarah Connor", role: "UI Designer", status: "In Meeting", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop" },
  { name: "John Doe", role: "DevOps specialist", status: "Offline", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&auto=format&fit=crop" },
]

// --- Mock Projects Board Table Data ---
interface ProjectItem {
  id: string
  name: string
  logo: string
  category: string
  ownerName: string
  ownerAvatar: string
  ownerEmail: string
  status: "active" | "review" | "paused"
  progress: number
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "PRJ-101",
    name: "Acme Next-Node Portal",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=64&auto=format&fit=crop",
    category: "Web Application",
    ownerName: "Setu Lal",
    ownerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=64&auto=format&fit=crop",
    ownerEmail: "setu@example.com",
    status: "active",
    progress: 82,
  },
  {
    id: "PRJ-102",
    name: "Payment Gateway Core API",
    logo: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=64&auto=format&fit=crop",
    category: "Infrastructure Services",
    ownerName: "Sarah Connor",
    ownerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop",
    ownerEmail: "sarah@example.com",
    status: "review",
    progress: 45,
  },
  {
    id: "PRJ-103",
    name: "Mobile CRM Application",
    logo: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=64&auto=format&fit=crop",
    category: "iOS/Android Apps",
    ownerName: "John Doe",
    ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&auto=format&fit=crop",
    ownerEmail: "john@example.com",
    status: "paused",
    progress: 15,
  },
]

const ComponentsShowcase: React.FC = () => {
  // Demo states
  const [selectedMulti, setSelectedMulti] = useState<string[]>(["react", "shadcn"])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [radioVal, setRadioVal] = useState("option-1")
  const [switchVal, setSwitchVal] = useState(true)
  const [checkboxVal, setCheckboxVal] = useState(false)
  const [selectVal, setSelectVal] = useState("standard")
  const [isLoadingDemo, setIsLoadingDemo] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Custom Slider state
  const [sliderVal, setSliderVal] = useState(65)

  // Project Table state
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  // Dropzone Simulator states
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  // Accordion active indexes
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const triggerLoading = () => {
    setIsLoadingDemo(true)
    setTimeout(() => setIsLoadingDemo(false), 2000)
  }

  // Trigger Simulated File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
      setUploadProgress(0)
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null) return 0
          if (prev >= 100) {
            clearInterval(interval)
            showToast(`${file.name} uploaded successfully!`)
            return 100
          }
          return prev + 20
        })
      }, 200)
    }
  }

  const handleSelectAllProjects = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(PROJECTS_DATA.map((p) => p.id))
    } else {
      setSelectedProjects([])
    }
  }

  const handleSelectProject = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProjects([...selectedProjects, id])
    } else {
      setSelectedProjects(selectedProjects.filter((p) => p !== id))
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">UI Components Catalog</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Interactive developer playground showcasing every UI primitive and advanced telemetry layouts.
        </p>
      </div>

      {/* Local Toast alerts */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 p-3.5 rounded-xl bg-primary text-primary-foreground shadow-lg border border-border animate-in slide-in-from-bottom-5">
          <CheckCircle className="h-4.5 w-4.5 stroke-[2.5] text-primary-foreground" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Alert Callouts & Banners Section */}
      <Card className="border border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Callouts & Alert Banners</CardTitle>
          <CardDescription className="text-xs">Contextual message containers for user alerts.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
            <div>
              <span className="font-bold">Operational Success</span>
              <p className="text-emerald-700/90 mt-0.5">Settings have been securely committed to local storage cache.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-600" />
            <div>
              <span className="font-bold">Pending Synchronizations</span>
              <p className="text-amber-700/90 mt-0.5">2 files are queued for cloud backup integration pipeline.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-600" />
            <div>
              <span className="font-bold">Security Discrepancies</span>
              <p className="text-rose-700/90 mt-0.5">Authentication keys require manual rotation configurations.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs">
            <Info className="h-4.5 w-4.5 shrink-0 text-blue-600" />
            <div>
              <span className="font-bold">Operational Logs Cache</span>
              <p className="text-blue-700/90 mt-0.5">Automatic rotations occur on weekly schedules.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================
          2. COMPREHENSIVE DATA TABLES WITH IMAGES & DETAILS
         ======================================================== */}
      <Card className="border border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            Comprehensive Projects Board
          </CardTitle>
          <CardDescription className="text-xs">
            A proper data table showcasing images, progress meters, badge statuses, and item descriptions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProjects.length === PROJECTS_DATA.length}
                    onCheckedChange={handleSelectAllProjects}
                    aria-label="Select all projects"
                  />
                </TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Lead Owner</TableHead>
                <TableHead>Completeness</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PROJECTS_DATA.map((project) => {
                const isSelected = selectedProjects.includes(project.id)
                return (
                  <TableRow key={project.id} data-state={isSelected ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectProject(project.id, !!checked)}
                        aria-label={`Select ${project.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={project.logo}
                          alt={project.name}
                          className="h-10 w-10 rounded-lg border border-border/60 object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-foreground block truncate">{project.name}</span>
                          <span className="text-xs text-muted-foreground block truncate">{project.category}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={project.ownerAvatar}
                          alt={project.ownerName}
                          className="h-7 w-7 rounded-full object-cover border border-border"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-foreground block truncate">{project.ownerName}</span>
                          <span className="text-[10px] text-muted-foreground block truncate">{project.ownerEmail}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="w-48">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-foreground">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              project.progress > 70
                                ? "bg-emerald-500"
                                : project.progress > 40
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            )}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 border capitalize",
                          project.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : project.status === "review"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => showToast(`Viewing ${project.name}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer" onClick={() => showToast(`Delete action on ${project.name}`)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ========================================================
          3. RICH CARD CONFIGURATIONS SHOWCASE
         ======================================================== */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card Type 1: User Profile Card */}
        <Card className="border border-border/70 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="h-20 bg-gradient-to-r from-primary to-primary/60 relative w-full shrink-0">
            <div className="absolute -bottom-7 left-6 h-14 w-14 rounded-full border-2 border-background overflow-hidden bg-muted">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=128&auto=format&fit=crop" alt="User Card Profile" className="h-full w-full object-cover" />
            </div>
          </div>
          <CardContent className="pt-9 pb-4 px-6 flex-1">
            <h4 className="font-bold text-sm text-foreground">Setu Lal</h4>
            <span className="text-xs text-muted-foreground block">Lead Frontend Architect</span>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Design and code clean, responsive dashboards using Tailwind, Radix UI, and React.
            </p>
          </CardContent>
          <CardFooter className="border-t bg-muted/20 px-6 py-3 flex gap-2 justify-end">
            <Button size="sm" variant="outline" className="h-8 text-xs font-semibold cursor-pointer" onClick={() => showToast("Profile settings opened!")}>Configure</Button>
            <Button size="sm" className="h-8 text-xs font-semibold cursor-pointer" onClick={() => showToast("Direct connection request sent!")}>Connect</Button>
          </CardFooter>
        </Card>

        {/* Card Type 2: Project Metric/Summary Card */}
        <Card className="border border-border/70 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border-emerald-200">
                In Progress
              </Badge>
              <Flame className="h-4.5 w-4.5 text-primary" />
            </div>
            <CardTitle className="text-base font-bold pt-1.5">Gateway Engine</CardTitle>
            <CardDescription className="text-xs">Database clusters optimizations.</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-muted-foreground">API Sync Status</span>
              <span className="text-foreground">78% Complete</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "78%" }} />
            </div>
            {/* Avatar Group */}
            <div className="flex -space-x-2 mt-4 overflow-hidden">
              <img className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-background object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=64&auto=format&fit=crop" alt="Member A" />
              <img className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-background object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&auto=format&fit=crop" alt="Member B" />
              <img className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-background object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&auto=format&fit=crop" alt="Member C" />
              <div className="inline-flex items-center justify-center h-6.5 w-6.5 rounded-full ring-2 ring-background bg-muted text-[9px] font-bold text-muted-foreground">+2</div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/20 px-6 py-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Commit: 24cf8a2</span>
            <Link to="/dashboard" className="text-primary hover:underline flex items-center gap-0.5">
              Details <ArrowRight className="h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>

        {/* Card Type 3: Tier/Billing Plan Card */}
        <Card className="border-2 border-primary shadow-md flex flex-col justify-between relative bg-card">
          <div className="absolute top-2.5 right-2.5">
            <Badge className="bg-primary text-primary-foreground text-[8px] font-bold uppercase py-0.5 px-2">Popular</Badge>
          </div>
          <CardHeader className="pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Corporate Team</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-foreground">$149</span>
              <span className="text-xs text-muted-foreground">/ month</span>
            </div>
            <CardDescription className="text-xs pt-1">
              For teams requiring strict access controls and telemetry logs.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Check className="h-3.5 w-3.5 text-primary shrink-0 stroke-[2.5]" />
              <span className="text-foreground">Unlimited active projects</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Check className="h-3.5 w-3.5 text-primary shrink-0 stroke-[2.5]" />
              <span className="text-foreground">Dedicated DB nodes integrations</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Check className="h-3.5 w-3.5 text-primary shrink-0 stroke-[2.5]" />
              <span className="text-foreground">24/7 Priority support hotline</span>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/20 px-6 py-3">
            <Button className="w-full text-xs font-bold cursor-pointer h-8" onClick={() => showToast("Upgrade process triggered!")}>Upgrade Tier</Button>
          </CardFooter>
        </Card>
      </div>

      {/* ========================================================
          4. CORE INPUTS & SLIDERS GRID
         ======================================================== */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Selection togglers */}
        <Card className="border border-border/70 shadow-sm hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold">Selection Toggles & Sliders</CardTitle>
            <CardDescription className="text-xs">Checkbox selections, Switch triggers, and custom Sliders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3.5">
                <Switch id="switch-demo" checked={switchVal} onCheckedChange={setSwitchVal} />
                <label htmlFor="switch-demo" className="text-sm font-semibold text-foreground cursor-pointer">
                  Toggle Switch: {switchVal ? "Active" : "Inactive"}
                </label>
              </div>

              <div className="flex items-center gap-3.5">
                <Checkbox id="checkbox-demo" checked={checkboxVal} onCheckedChange={(val) => setCheckboxVal(!!val)} />
                <label htmlFor="checkbox-demo" className="text-sm font-semibold text-foreground cursor-pointer">
                  Checkbox Choice: {checkboxVal ? "Checked" : "Unchecked"}
                </label>
              </div>
            </div>

            <Separator />

            {/* Custom Slider component */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-primary" />
                  Numerical Range Slider
                </label>
                <span className="font-extrabold text-foreground">{sliderVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Radio Options</label>
              <RadioGroup value={radioVal} onValueChange={setRadioVal} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-1" id="r1" />
                  <label htmlFor="r1" className="text-sm font-medium text-foreground cursor-pointer">Option A</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-2" id="r2" />
                  <label htmlFor="r2" className="text-sm font-medium text-foreground cursor-pointer">Option B</label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Dropdowns & Selects */}
        <Card className="border border-border/70 shadow-sm hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold">Select & Popovers</CardTitle>
            <CardDescription className="text-xs">Dropdown items and dates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Single Select</label>
                <Select value={selectVal} onValueChange={setSelectVal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Account</SelectItem>
                    <SelectItem value="enterprise">Enterprise Tier</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Date Picker</label>
                <DatePicker value={selectedDate} onChange={setSelectedDate} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Multi-Select Popover</label>
              <MultiSelect
                options={COMPONENT_OPTIONS}
                selected={selectedMulti}
                onChange={setSelectedMulti}
                placeholder="Choose technologies..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================
          5. METERS, STEPPERS, & SELF-ALIGNING TIMELINES
         ======================================================== */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Progress & Meters */}
        <Card className="border border-border/70 shadow-sm hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold">Meters & Telemetry</CardTitle>
            <CardDescription className="text-xs">Visual load states and usage ratios.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Storage Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-primary" />
                  Disk Space
                </span>
                <span className="font-bold text-foreground">65% Used</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: "65%" }} />
              </div>
            </div>

            {/* Memory Usage Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">RAM Cache Load</span>
                <span className="font-bold text-emerald-600">32% Load</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: "32%" }} />
              </div>
            </div>

            {/* Linear Step Indicator */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Step Completion Flow</span>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Verify</span>
                <span>Review</span>
                <span>Launch</span>
              </div>
              <div className="w-full bg-muted h-1.5 rounded-full flex overflow-hidden">
                <div className="bg-primary flex-1 border-r border-background" />
                <div className="bg-primary flex-1 border-r border-background" />
                <div className="bg-muted flex-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chronological Activity Feed / Timeline - FIXED VERTICAL LINE CASE */}
        <Card className="border border-border/70 shadow-sm hover:border-primary/20 transition-all md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold">Activity Timeline</CardTitle>
            <CardDescription className="text-xs">Log audit timeline feed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="w-0.5 flex-1 bg-border my-2"></div>
              </div>
              <div className="pb-6 pt-0.5">
                <span className="text-xs font-bold text-foreground block">Two-Factor Authentication Enabled</span>
                <p className="text-[11px] text-muted-foreground mt-0.5">Admin profile security policies successfully synced.</p>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" /> Just now
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="w-0.5 flex-1 bg-border my-2"></div>
              </div>
              <div className="pb-6 pt-0.5">
                <span className="text-xs font-bold text-foreground block">Authorized Login from Dhaka, BD</span>
                <p className="text-[11px] text-muted-foreground">Logged in via Opera Browser - IP: 103.45.2.1.</p>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" /> 2 hours ago
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                {/* Last item: omit/hide line or display small helper */}
                <div className="w-0.5 flex-1 bg-transparent my-2"></div>
              </div>
              <div className="pb-2 pt-0.5">
                <span className="text-xs font-bold text-foreground block">System API Key Rotation Pending</span>
                <p className="text-[11px] text-muted-foreground">Production tokens are due to rotate in 24 hours.</p>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" /> 1 day ago
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================
          5. INPUTS, FILE UPLOADS, & OVERLAYS
         ======================================================== */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Dropzone with Upload progress simulator */}
        <Card className="border border-border/70 shadow-sm hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold">Enhanced Upload Dropzone</CardTitle>
            <CardDescription className="text-xs">Drag files with live upload indicators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border/80 hover:border-primary/50 transition-colors rounded-xl p-5 text-center cursor-pointer bg-muted/10 relative">
              <input type="file" className="hidden" id="enhanced-dropzone" onChange={handleFileUpload} />
              <label htmlFor="enhanced-dropzone" className="cursor-pointer flex flex-col items-center">
                <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm font-semibold text-foreground">Choose files to upload</span>
                <span className="text-xs text-muted-foreground mt-0.5">Drag files here or browse. Max scale: 10MB</span>
              </label>
            </div>

            {uploadedFile && uploadProgress !== null && (
              <div className="p-3.5 border rounded-lg bg-muted/30 flex flex-col gap-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground truncate max-w-[70%]">{uploadedFile}</span>
                  <span className="font-bold text-primary">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Collapsible FAQ/Accordions */}
        <Card className="border border-border/70 shadow-sm hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold">Accordions & FAQ</CardTitle>
            <CardDescription className="text-xs">Expandable detail drawers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openAccordion === idx
              return (
                <div key={idx} className="border border-border rounded-lg overflow-hidden transition-all bg-card shadow-sm">
                  <button
                    onClick={() => setOpenAccordion(isOpen ? null : idx)}
                    className="w-full p-3.5 flex items-center justify-between font-semibold text-xs text-foreground text-left hover:bg-muted/40 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4.5 w-4.5 text-primary opacity-80" />
                      {item.q}
                    </span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform text-muted-foreground", isOpen && "rotate-180")} />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200 bg-muted/20 border-t border-border",
                      isOpen ? "max-h-40 opacity-100 p-4" : "max-h-0 opacity-0 p-0 border-t-0"
                    )}
                  >
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Dialog & Confirm overlays */}
        <Card className="border border-border/70 shadow-sm hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold">Overlays & Modals</CardTitle>
            <CardDescription className="text-xs">Dialog and AlertDialog confirm layouts.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {/* Standard Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full text-xs font-semibold cursor-pointer">Open Modal Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configure Component Workspace</DialogTitle>
                  <DialogDescription>
                    Fill settings specifications for component parameters.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Project Name</label>
                    <Input placeholder="Next-Node Dashboard" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                  </DialogClose>
                  <Button onClick={() => { setDialogOpen(false); showToast("Workspace details updated!"); }}>
                    Save Configuration
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Custom AlertDialog */}
            <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full text-xs font-semibold cursor-pointer">Trigger Alert Action</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[400px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Destructive Action Warning
                  </DialogTitle>
                  <DialogDescription className="text-xs pt-1">
                    Are you absolutely sure you want to delete these logs? This action is permanent and cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => { setAlertDialogOpen(false); showToast("Logs deleted successfully!"); }}
                  >
                    Confirm Deletion
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================
          6. MORE TABLES & VISUAL DIRECTORY
         ======================================================== */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Table Type 1: Striped Audit Logs Table */}
        <Card className="border border-border/70 shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold">Striped Audit Logs Table</CardTitle>
            <CardDescription className="text-xs">Borders and zebra styling list tracking activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">ID</TableHead>
                  <TableHead className="font-bold">Event</TableHead>
                  <TableHead className="font-bold">User</TableHead>
                  <TableHead className="font-bold">Time</TableHead>
                  <TableHead className="font-bold text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AUDIT_LOGS.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/20 odd:bg-muted/5">
                    <TableCell className="font-mono text-xs">{log.id}</TableCell>
                    <TableCell className="font-semibold text-xs text-foreground">{log.action}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.user}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.time}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={cn(
                          "text-[9px] px-1.5 py-0.5",
                          log.status === "SUCCESS"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
                            : log.status === "WARNING"
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200"
                            : "bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200"
                        )}
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Compact Lists & Team Members status */}
        <Card className="border border-border/70 shadow-sm hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold">Team Directory</CardTitle>
            <CardDescription className="text-xs">Compact status list of coworkers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {TEAM_MEMBERS.map((member, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 border rounded-lg bg-card shadow-sm hover:shadow transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={member.avatar} alt={member.name} className="h-8.5 w-8.5 rounded-full border object-cover" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-foreground block truncate">{member.name}</span>
                    <span className="text-[9px] text-muted-foreground block truncate">{member.role}</span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[8px] px-1.5 py-0 shadow-none border shrink-0",
                    member.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : member.status === "In Meeting"
                      ? "bg-amber-50 text-amber-700 border-amber-100"
                      : "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {member.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 7. SKELETONS & TOOLTIPS */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tooltips & Badges */}
        <Card className="border border-border/70 shadow-sm hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold">Visual Tooltips & Badges</CardTitle>
            <CardDescription className="text-xs">Status tags and helper hovers.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-6 items-center">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-muted-foreground uppercase block">Status Badges</span>
              <div className="flex flex-wrap gap-1.5">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-muted-foreground uppercase block">Tooltips Hover</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 flex gap-1.5 text-xs font-semibold cursor-pointer">
                      <Info className="h-4 w-4" />
                      Hover Me
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold text-xs">System Telemetry info pop!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Skeleton Loaders */}
        <Card className="border border-border/70 shadow-sm hover:border-primary/20 transition-all">
          <CardHeader>
            <CardTitle className="text-base font-bold">Skeleton Loading States</CardTitle>
            <CardDescription className="text-xs">Pulse animations simulating content load.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">Simulate API Loading</span>
              <Button variant="outline" size="sm" className="h-7 text-xs font-medium cursor-pointer" onClick={triggerLoading} disabled={isLoadingDemo}>
                <Play className="h-3 w-3 mr-1" /> Trigger Pulse
              </Button>
            </div>
            
            {isLoadingDemo ? (
              <div className="flex items-center space-x-4 p-3 border rounded-xl animate-in fade-in">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-3 w-[40%]" />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 p-3 border border-border/60 rounded-xl bg-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground">Spreadsheet_Template.csv</h4>
                  <p className="text-xs text-muted-foreground">Ready to export. Loaded 2,500 rows.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ComponentsShowcase
