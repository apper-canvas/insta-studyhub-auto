import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import GradeProgress from "@/components/molecules/GradeProgress";

const CourseCard = ({ course, assignments = [], onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const pendingAssignments = assignments.filter(a => a.status === "pending");
  const completedAssignments = assignments.filter(a => a.status === "completed");

  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="card group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: course.color }}
              />
              <h3 className="text-lg font-semibold text-surface-900 group-hover:text-primary-600 transition-colors">
                {course.name}
              </h3>
            </div>
            <p className="text-sm text-surface-600 mb-1">{course.instructor}</p>
            <p className="text-xs text-surface-500">{course.schedule}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(course)}
            >
              <ApperIcon name="Edit2" className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(course)}
            >
              <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <GradeProgress 
            current={course.currentGrade} 
            target={course.targetGrade}
          />
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ApperIcon name="BookOpen" className="h-4 w-4 text-surface-400" />
                <span className="text-surface-600">{pendingAssignments.length} pending</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="CheckCircle" className="h-4 w-4 text-green-500" />
                <span className="text-surface-600">{completedAssignments.length} done</span>
              </div>
            </div>
            
            <span className={`font-bold text-lg ${getGradeColor(course.currentGrade)}`}>
              {course.currentGrade.toFixed(1)}%
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full justify-center"
          >
            <ApperIcon 
              name={showDetails ? "ChevronUp" : "ChevronDown"} 
              className="h-4 w-4 mr-2" 
            />
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>

          {showDetails && (
            <div className="pt-4 border-t border-surface-200 space-y-3 animate-slide-up">
              <div>
                <h4 className="text-sm font-medium text-surface-700 mb-2">Grade Categories</h4>
                <div className="space-y-2">
                  {course.gradeCategories.map((category, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-surface-600">{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-surface-500">{category.weight}%</span>
                        <Badge variant="primary" className="text-xs">
                          {category.grades.length > 0 
                            ? (category.grades.reduce((a, b) => a + b, 0) / category.grades.length).toFixed(1)
                            : "N/A"
                          }%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;