import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 sm:h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 sm:px-4 py-2 text-base text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-slate-400/80 transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-slate-300 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-card dark:border-border dark:focus-visible:ring-primary/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
