import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogout } from "@/features/auth/api/auth.queries";

const Unauthorized = () => {
  const logout = useLogout();

  return (
    <Card className="border border-border/80 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Access denied</CardTitle>
        <CardDescription className="text-center text-xs">
          Your account does not have administrator access to this dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full font-medium cursor-pointer"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          {logout.isPending ? "Signing out…" : "Sign out"}
        </Button>
        <Button asChild variant="ghost" className="w-full font-medium">
          <Link to="/">Back to home</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default Unauthorized;
