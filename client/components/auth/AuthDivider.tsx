import React from "react";

interface AuthDividerProps {
  text?: string;
}

export default function AuthDivider({ text = "or continue with" }: AuthDividerProps) {
  return (
    <div className="relative my-6 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-3 text-secondary-text/80 font-medium tracking-wider">
          {text}
        </span>
      </div>
    </div>
  );
}
