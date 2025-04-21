import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors 
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                   disabled:opacity-50 disabled:pointer-events-none ring-offset-background
                   ${getVariantClasses(variant)}
                   ${getSizeClasses(size)}
                   ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

function getVariantClasses(variant: string): string {
  switch (variant) {
    case "default":
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    case "destructive":
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    case "outline":
      return "border border-input hover:bg-accent hover:text-accent-foreground";
    case "secondary":
      return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    case "ghost":
      return "hover:bg-accent hover:text-accent-foreground";
    case "link":
      return "underline-offset-4 hover:underline text-primary";
    default:
      return "bg-primary text-primary-foreground hover:bg-primary/90";
  }
}

function getSizeClasses(size: string): string {
  switch (size) {
    case "default":
      return "h-10 py-2 px-4";
    case "sm":
      return "h-9 px-3 rounded-md";
    case "lg":
      return "h-11 px-8 rounded-md";
    case "icon":
      return "h-10 w-10";
    default:
      return "h-10 py-2 px-4";
  }
}

Button.displayName = "Button";

export { Button };
