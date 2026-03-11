import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-[background-color,border-color,color,box-shadow,transform] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary-400",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive-400",
        outline:
          "border border-border bg-white/90 text-foreground shadow-xs hover:border-secondary-200 hover:bg-white",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary-600",
        ghost: "text-secondary-700 hover:bg-primary-50 hover:text-secondary-800",
        link: "text-secondary-700 underline underline-offset-4 hover:text-secondary-900",
        gradientSecondaryTertiary:
          "bg-linear-to-r from-secondary-700 to-secondary-500 text-white shadow-xs hover:from-secondary-600 hover:to-secondary-400",
        gradientPrimarySecondary:
          "bg-linear-to-r from-primary-500 to-primary-300 text-primary-foreground shadow-xs hover:from-primary-400 hover:to-primary-200",
        tertiary:
          "bg-tertiary-100 text-tertiary-700 shadow-xs hover:bg-tertiary-200",
      },
      size: {
        default: "h-12 px-5 py-3",
        sm: "h-10 px-4",
        lg: "h-14 px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
