import { useEffect, useRef, useState } from "react";
import { UploadCloud, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorState } from "@/components/common/States";
import { useSession } from "@/features/auth/api/auth.queries";
import { useUpdateProfile } from "../api/settings.queries";
import type { UpdateProfilePayload } from "../types";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

/**
 * Mounted with `key={user.id}` so the fields always seed from the loaded user
 * without a reset effect.
 */
function ProfileForm({ user }: { user: NonNullable<ReturnType<typeof useSession>["user"]> }) {
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Revoke any preview URL created for the local file on unmount.
  useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    },
    [],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFieldError("Please choose an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setFieldError("Image must be 5MB or smaller.");
      return;
    }

    setFieldError(null);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setImageFile(file);
    setPreview(url);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload: UpdateProfilePayload = {
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      dateOfBirth: dateOfBirth || undefined,
    };

    updateProfile.mutate({ payload, image: imageFile });
  };

  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-5 border-b pb-5 sm:flex-row">
        <Avatar className="h-20 w-20">
          {(preview ?? user.image) && <AvatarImage src={preview ?? user.image ?? undefined} alt="" />}
          <AvatarFallback className="text-lg font-bold">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div>
            <p className="text-sm font-semibold text-foreground">Profile picture</p>
            <p className="text-xs text-muted-foreground">JPG, PNG or WEBP · up to 5MB.</p>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 cursor-pointer text-xs font-semibold"
          >
            <label>
              <UploadCloud className="mr-1.5 h-3.5 w-3.5 opacity-80" />
              Choose file
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </Button>
          {imageFile && (
            <p className="text-xs text-muted-foreground">
              Selected: <span className="font-medium text-foreground">{imageFile.name}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="profile-name">Full name</Label>
          <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-email">Email address</Label>
          <Input id="profile-email" value={user.email} disabled />
          <p className="text-xs text-muted-foreground">
            Email is managed by your login provider and cannot be edited here.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-phone">Phone</Label>
          <Input id="profile-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="profile-dob">Date of birth</Label>
          <Input
            id="profile-dob"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <div className="flex h-9 items-center">
            <Badge variant="secondary" className="text-[10px] font-bold shadow-none">
              {user.role}
            </Badge>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Email status</Label>
          <div className="flex h-9 items-center">
            <Badge
              variant={user.emailVerified ? "default" : "outline"}
              className="text-[10px] font-bold shadow-none"
            >
              {user.emailVerified ? "VERIFIED" : "UNVERIFIED"}
            </Badge>
          </div>
        </div>
      </div>

      {fieldError && <p className="text-xs font-medium text-destructive">{fieldError}</p>}

      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-9 cursor-pointer text-xs font-semibold"
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? "Saving…" : "Save profile"}
        </Button>
      </div>
    </form>
  );
}

export function ProfileSection() {
  const { user, isPending, isError, error, refetch } = useSession();

  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Profile details</CardTitle>
        <CardDescription className="text-xs">
          Your identity as stored on the server. Saved with an authenticated request.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <ErrorState error={error} onRetry={() => refetch()} title="Unable to load your profile" />
        ) : isPending || !user ? (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            Loading profile…
          </div>
        ) : (
          <ProfileForm key={user.id} user={user} />
        )}
      </CardContent>
    </Card>
  );
}

export default ProfileSection;
