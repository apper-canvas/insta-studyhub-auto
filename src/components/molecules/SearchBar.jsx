import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className,
  ...props 
}) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={cn("relative", className)}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-4 h-4" 
      />
      <Input
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10"
        {...props}
      />
    </div>
  );
};

export default SearchBar;