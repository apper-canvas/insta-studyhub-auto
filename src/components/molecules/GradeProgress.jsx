import { cn } from "@/utils/cn";

const GradeProgress = ({ current = 0, target = 0, className }) => {
  // Safely convert to numbers and handle undefined/null values
  const safeCurrentValue = Number(current) || 0;
  const safeTargetValue = Number(target) || 0;
  
  const percentage = safeTargetValue > 0 ? Math.min((safeCurrentValue / safeTargetValue) * 100, 100) : 0;
  const isOnTrack = safeCurrentValue >= safeTargetValue;
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-surface-600">Grade Progress</span>
<span className={cn("font-semibold", isOnTrack ? "text-green-600" : "text-yellow-600")}>
          {safeCurrentValue.toFixed(1)}% / {safeTargetValue}%
        </span>
      </div>
      <div className="w-full bg-surface-200 rounded-full h-2">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            isOnTrack 
              ? "bg-gradient-to-r from-green-500 to-green-400" 
              : "bg-gradient-to-r from-yellow-500 to-yellow-400"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default GradeProgress;