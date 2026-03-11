import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold tracking-[-0.01em] transition-[background-color,border-color,color] focus:outline-hidden focus:ring-2 focus:ring-ring/40 focus:ring-offset-0",
  {
    variants: {
      variant: {
        default:
          "border-primary-200 bg-primary-100 text-secondary-800 hover:bg-primary-200",
        primary:
          "border-primary-200 bg-primary-100 text-secondary-800 hover:bg-primary-200",
        secondary:
          "border-secondary-200 bg-secondary-50 text-secondary-700 hover:bg-secondary-100",
        tertiary:
          "border-tertiary-200 bg-tertiary-100 text-tertiary-700 hover:bg-tertiary-200",
        accent:
          "border-accent-200 bg-accent-100 text-accent-700 hover:bg-accent-200",
        destructive:
          "border-destructive-200 bg-destructive-100 text-destructive-600 hover:bg-destructive-200",
        outline: "border-border bg-white/80 text-foreground hover:bg-white",
        muted: "border-muted-200 bg-muted-50 text-muted-700 hover:bg-muted-100",
      },
      size: {
        s: "px-3 py-1 text-[13px]",
        m: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "s"
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size = 's', ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
