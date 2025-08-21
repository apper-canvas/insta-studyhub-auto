import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn("input", className)}
      {...props}
    />
  );
});

Input.displayName = 'Input';

Input.displayName = "Input";

export default Input;