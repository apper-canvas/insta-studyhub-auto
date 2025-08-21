import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const CalendarView = ({ assignments = [], courses = [], onAssignmentClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  const getCourse = (courseId) => courses.find(c => c.Id === courseId);

  const getAssignmentsForDate = (date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return assignments.filter(assignment => {
      const assignmentDate = format(new Date(assignment.dueDate), "yyyy-MM-dd");
      return assignmentDate === dateString;
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="bg-surface-50 rounded-xl border border-surface-200 overflow-hidden">
        {/* Month Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-surface-200">
          <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)}>
            <ApperIcon name="ChevronLeft" className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-primary-800">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)}>
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
          </Button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 bg-surface-100 border-b border-surface-200">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-xs font-medium text-surface-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0">
          {days.map(day => {
            const dayAssignments = getAssignmentsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[100px] p-2 border-b border-r border-surface-200 transition-colors",
                  isCurrentMonth ? "bg-surface-50 hover:bg-surface-100" : "bg-surface-200",
                  isTodayDate && "bg-primary-50 border-primary-300"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 text-sm font-medium rounded-full mb-1",
                  isTodayDate 
                    ? "bg-primary-500 text-white" 
                    : isCurrentMonth 
                      ? "text-surface-900" 
                      : "text-surface-400"
                )}>
                  {format(day, "d")}
                </div>

                <div className="space-y-1">
                  {dayAssignments.slice(0, 3).map(assignment => {
                    const course = getCourse(assignment.courseId);
                    return (
                      <div
                        key={assignment.Id}
                        onClick={() => onAssignmentClick?.(assignment)}
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate"
                        style={{ 
                          backgroundColor: course?.color + "20",
                          borderLeft: `3px solid ${course?.color || "#gray"}`
                        }}
                      >
                        {assignment.title}
                      </div>
                    );
                  })}
                  {dayAssignments.length > 3 && (
                    <div className="text-xs text-surface-500 pl-1">
                      +{dayAssignments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-surface-900">Calendar</h1>
          <p className="text-surface-600 mt-1">View your assignments and deadlines</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-surface-200 rounded-lg p-1">
            <Button
              variant={view === "month" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
            >
              Week
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Display */}
      {view === "month" && renderMonthView()}

      {/* Legend */}
      <div className="bg-surface-50 rounded-lg p-4 border border-surface-200">
        <h3 className="text-sm font-medium text-surface-900 mb-3">Course Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {courses.map(course => (
            <div key={course.Id} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: course.color }}
              />
              <span className="text-sm text-surface-700 truncate">{course.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;