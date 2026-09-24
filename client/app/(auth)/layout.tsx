import React from "react";

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col selection:bg-accent selection:text-primary">
      {children}
    </div>
  );
}
