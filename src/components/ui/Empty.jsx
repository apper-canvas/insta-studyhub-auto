import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "BookOpen", 
  title = "Nothing here yet", 
  description = "Get started by adding your first item", 
  actionLabel = "Add New",
  onAction,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-surface-900 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} variant="primary" className="animate-bounce-soft">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;