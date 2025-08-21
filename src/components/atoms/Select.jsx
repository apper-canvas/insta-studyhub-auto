import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children,
  className, 
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "input appearance-none bg-white",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;