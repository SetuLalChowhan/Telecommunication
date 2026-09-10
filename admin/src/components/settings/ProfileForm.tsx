import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, UploadCloud } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  bio: z.string().max(200, "Bio must be less than 200 characters"),
})

type ProfileValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  triggerToast: (msg: string) => void
}

const ProfileForm: React.FC<ProfileFormProps> = ({ triggerToast }) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
  )

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "Setu Lal",
      email: "setu@example.com",
      website: "https://setu.dev",
      bio: "Lead Frontend Engineer based in Dhaka. building pixel-perfect applications.",
    },
  })

  const onSaveProfile = (data: ProfileValues) => {
    console.log("Saving profile data: ", data)
    triggerToast("Profile updated successfully!")
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      triggerToast("New avatar uploaded (Preview state)!")
    }
  }

  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Profile Details</CardTitle>
        <CardDescription className="text-xs">
          Update public identity information visible to coworkers and visitors.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar upload section */}
        <div className="flex flex-col sm:flex-row gap-5 items-center pb-4 border-b border-border/50">
          <div className="relative h-20 w-20 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center shrink-0 shadow-sm">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="font-semibold text-sm text-foreground">Profile Picture</span>
            <span className="text-xs text-muted-foreground mt-0.5 mb-3.5">
              JPG or PNG, max scale of 2MB size limit.
            </span>
            <div className="relative">
              <Button variant="outline" size="sm" className="relative cursor-pointer font-semibold text-xs h-8">
                <UploadCloud className="h-3.5 w-3.5 mr-1.5 opacity-80" />
                Choose New File
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={handleAvatarChange}
                />
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="Jane Doe" {...profileForm.register("fullName")} />
              {profileForm.formState.errors.fullName && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {profileForm.formState.errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="jane@example.com" {...profileForm.register("email")} />
              {profileForm.formState.errors.email && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {profileForm.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="website">Website Link</Label>
            <Input id="website" placeholder="https://website.com" {...profileForm.register("website")} />
            {profileForm.formState.errors.website && (
              <p className="text-xs text-destructive font-medium mt-1">
                {profileForm.formState.errors.website.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Biography</Label>
            <Textarea id="bio" placeholder="Write a short summary about yourself..." className="min-h-[100px]" {...profileForm.register("bio")} />
            {profileForm.formState.errors.bio && (
              <p className="text-xs text-destructive font-medium mt-1">
                {profileForm.formState.errors.bio.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" className="font-semibold text-xs h-9 cursor-pointer">
              Save Profile Updates
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProfileForm
