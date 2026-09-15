import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col selection:bg-accent selection:text-primary">
      {children}
    </div>
  );
}
