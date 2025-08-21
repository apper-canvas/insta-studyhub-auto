import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PriorityBadge = ({ priority }) => {
  const config = {
    high: { variant: "high", icon: "AlertCircle", text: "High" },
    medium: { variant: "medium", icon: "Clock", text: "Medium" },
    low: { variant: "low", icon: "CheckCircle2", text: "Low" }
  };

  const { variant, icon, text } = config[priority] || config.medium;

  return (
    <Badge variant={variant} className="inline-flex items-center gap-1">
      <ApperIcon name={icon} className="w-3 h-3" />
      {text}
    </Badge>
  );
};

export default PriorityBadge;