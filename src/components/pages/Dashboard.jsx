import { useState, useEffect } from "react";
import { format, isToday, isTomorrow, isThisWeek, addDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { cn } from "@/utils/cn";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCourse = (courseId) => courses.find(c => c.Id === courseId);

  const getUpcomingAssignments = () => {
    const today = new Date();
    const weekFromNow = addDays(today, 7);
    
    return assignments
      .filter(a => a.status === "pending" && new Date(a.dueDate) <= weekFromNow)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  const getTodayAssignments = () => {
    return assignments.filter(a => a.status === "pending" && isToday(new Date(a.dueDate)));
  };

const getOverallGPA = () => {
    if (courses.length === 0) return 0;
    const validCourses = courses.filter(course => course.current_grade_c != null);
    if (validCourses.length === 0) return 0;
    const totalGrade = validCourses.reduce((sum, course) => sum + (course.current_grade_c || 0), 0);
    return totalGrade / validCourses.length;
  };

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isThisWeek(date)) return format(date, "EEEE");
    return format(date, "MMM dd");
  };

  const getDueDateColor = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return "text-red-600";
    if (isTomorrow(date)) return "text-yellow-600";
    return "text-surface-600";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const upcomingAssignments = getUpcomingAssignments();
  const todayAssignments = getTodayAssignments();
  const overallGPA = getOverallGPA();
  const totalPending = assignments.filter(a => a.status === "pending").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-surface-600 mt-2">
            Welcome back! Here's what's happening with your studies today.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowQuickAdd(true)}
          className="shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Quick Add
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-600 font-medium">Overall GPA</p>
              <p className="text-3xl font-bold text-primary-700">
                {overallGPA.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Courses</p>
              <p className="text-3xl font-bold text-blue-700">{courses.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending Tasks</p>
              <p className="text-3xl font-bold text-yellow-700">{totalPending}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Due Today</p>
              <p className="text-3xl font-bold text-green-700">{todayAssignments.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Assignments */}
        <div className="card">
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-surface-900">Today's Assignments</h2>
              <Badge variant="danger" className="bg-gradient-to-r from-red-100 to-red-200">
                {todayAssignments.length}
              </Badge>
            </div>
          </div>
          
          <div className="p-6">
            {todayAssignments.length > 0 ? (
              <div className="space-y-4">
                {todayAssignments.map((assignment) => {
                  const course = getCourse(assignment.courseId);
                  return (
                    <div
                      key={assignment.Id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-surface-50 to-surface-100 rounded-lg border border-surface-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course?.color || "#gray" }}
                        />
                        <div>
                          <p className="font-medium text-surface-900">{assignment.title}</p>
                          <p className="text-sm text-surface-600">{course?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PriorityBadge priority={assignment.priority} />
                        <span className="text-xs text-red-600 font-medium">
                          {format(new Date(assignment.dueDate), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" className="mx-auto h-8 w-8 text-green-500 mb-2" />
                <p className="text-surface-600">No assignments due today!</p>
                <p className="text-sm text-surface-500">Great job staying on top of your work.</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="card">
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-surface-900">Upcoming Assignments</h2>
              <Badge variant="primary">Next 7 days</Badge>
            </div>
          </div>
          
          <div className="p-6">
            {upcomingAssignments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAssignments.map((assignment) => {
                  const course = getCourse(assignment.courseId);
                  return (
                    <div
                      key={assignment.Id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-surface-50 to-surface-100 rounded-lg border border-surface-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course?.color || "#gray" }}
                        />
                        <div>
                          <p className="font-medium text-surface-900">{assignment.title}</p>
                          <p className="text-sm text-surface-600">{course?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PriorityBadge priority={assignment.priority} />
                        <span className={cn("text-xs font-medium", getDueDateColor(assignment.dueDate))}>
                          {formatDueDate(assignment.dueDate)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <Empty
                icon="Calendar"
                title="No upcoming assignments"
                description="You're all caught up for the next week!"
                actionLabel="Add Assignment"
                onAction={() => setShowQuickAdd(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Course Overview */}
      <div className="card">
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-surface-900">Course Overview</h2>
        </div>
        
        <div className="p-6">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => {
                const coursePendingCount = assignments.filter(
                  a => a.courseId === course.Id && a.status === "pending"
                ).length;
                
                return (
                  <div
                    key={course.Id}
                    className="p-4 bg-gradient-to-r from-surface-50 to-surface-100 rounded-lg border border-surface-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <h3 className="font-medium text-surface-900 truncate">{course.name}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-surface-600">{coursePendingCount} pending</span>
<span className="font-semibold text-lg text-primary-600">
                        {course.current_grade_c != null ? `${course.current_grade_c.toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="mt-2 w-full bg-surface-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((course.currentGrade / course.targetGrade) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty
              icon="BookOpen"
              title="No courses yet"
              description="Start by adding your first course to track your academic progress."
              actionLabel="Add Course"
              onAction={() => {}}
            />
          )}
        </div>
      </div>

      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        courses={courses}
        onSuccess={loadData}
      />
    </div>
  );
};

export default Dashboard;