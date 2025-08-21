import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default", 
  className, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface-100 text-surface-700",
    primary: "bg-primary-100 text-primary-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    high: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",
    medium: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300",
    low: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;