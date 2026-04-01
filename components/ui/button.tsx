import { cn } from "@/lib/utils";
import {
  type ButtonHTMLAttributes,
  type ReactElement,
  cloneElement,
  forwardRef,
  isValidElement,
} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

function getButtonClasses(
  variant: ButtonProps["variant"],
  size: ButtonProps["size"],
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    variant === "default" &&
      "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    variant === "outline" &&
      "border border-border bg-transparent hover:bg-muted",
    variant === "ghost" && "hover:bg-muted",
    size === "default" && "h-10 px-5 py-2 text-sm",
    size === "sm" && "h-8 px-3 text-xs",
    size === "lg" && "h-12 px-8 text-base",
    className
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const classes = getButtonClasses(variant, size, className);

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<Record<string, unknown>>, {
        className: cn(
          classes,
          (children as ReactElement<{ className?: string }>).props.className
        ),
        ref,
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
