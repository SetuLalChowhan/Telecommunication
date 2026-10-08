import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[30px] border px-3 py-1 text-xs font-medium tracking-[0.24px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#dddcdd] text-[#28262a]",
        secondary:
          "border-transparent bg-[#f3f1eb] text-[#28262a]",
        destructive:
          "border-transparent bg-destructive/15 text-destructive",
        outline: "border-[#dddcdd] text-foreground bg-transparent",
        sage: "border-transparent bg-[#c8dfaa] text-[#28262a]",
        sky: "border-transparent bg-[#97cde5] text-[#28262a]",
        success:
          "border-transparent bg-[#c8dfaa]/40 text-[#28262a]",
        warning:
          "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        info:
          "border-transparent bg-[#97cde5] text-[#28262a]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
