import { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import { cn } from "@/utils/cn";

const AssignmentTable = ({ assignments = [], courses = [], onEdit, onDelete, onToggleStatus }) => {
  const [sortField, setSortField] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");

  const getCourse = (courseId) => courses.find(c => c.Id === courseId);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "dueDate") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortField === "courseId") {
      const aCourse = getCourse(aValue);
      const bCourse = getCourse(bValue);
      aValue = aCourse?.name || "";
      bValue = bCourse?.name || "";
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const SortHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:text-surface-700 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ApperIcon 
          name={sortField === field && sortDirection === "desc" ? "ChevronDown" : "ChevronUp"} 
          className={cn(
            "h-4 w-4 transition-opacity",
            sortField === field ? "opacity-100" : "opacity-0 group-hover:opacity-50"
          )}
        />
      </div>
    </th>
  );

  return (
    <div className="bg-surface-50 shadow-sm rounded-xl border border-surface-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-200">
          <thead className="bg-gradient-to-r from-surface-50 to-surface-100">
            <tr>
              <SortHeader field="title">Assignment</SortHeader>
              <SortHeader field="courseId">Course</SortHeader>
              <SortHeader field="dueDate">Due Date</SortHeader>
              <SortHeader field="priority">Priority</SortHeader>
              <SortHeader field="status">Status</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface-50 divide-y divide-surface-200">
            {sortedAssignments.map((assignment) => {
              const course = getCourse(assignment.courseId);
              const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status === "pending";
              
              return (
                <tr 
                  key={assignment.Id} 
                  className={cn(
                    "hover:bg-surface-100 transition-colors",
                    isOverdue && "bg-red-50 hover:bg-red-100"
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ApperIcon 
                          name={assignment.status === "completed" ? "CheckCircle2" : "Circle"} 
                          className={cn(
                            "h-5 w-5 cursor-pointer transition-colors",
                            assignment.status === "completed" 
                              ? "text-green-500 hover:text-green-600" 
                              : "text-surface-400 hover:text-surface-600"
                          )}
                          onClick={() => onToggleStatus?.(assignment)}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-surface-900">
                          {assignment.title}
                        </div>
                        <div className="text-sm text-surface-500 truncate max-w-xs">
                          {assignment.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course && (
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="text-sm text-surface-900">{course.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-surface-900">
                      {format(new Date(assignment.dueDate), "MMM dd, yyyy")}
                    </div>
                    <div className="text-xs text-surface-500">
                      {format(new Date(assignment.dueDate), "h:mm a")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={assignment.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant={assignment.status === "completed" ? "success" : isOverdue ? "danger" : "default"}
                    >
                      {assignment.status === "completed" ? "Completed" : isOverdue ? "Overdue" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                    {assignment.grade !== null ? `${assignment.grade}%` : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(assignment)}
                      >
                        <ApperIcon name="Edit2" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete?.(assignment)}
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {sortedAssignments.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="FileText" className="mx-auto h-12 w-12 text-surface-400 mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No assignments found</h3>
          <p className="text-surface-500">Get started by adding your first assignment.</p>
        </div>
      )}
    </div>
  );
};

export default AssignmentTable;