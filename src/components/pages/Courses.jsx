import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CourseCard from "@/components/organisms/CourseCard";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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
      setFilteredCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  const getCourseAssignments = (courseId) => {
    return assignments.filter(a => a.courseId === courseId);
  };

  const handleDeleteCourse = async (course) => {
    if (window.confirm(`Are you sure you want to delete "${course.name}"? This action cannot be undone.`)) {
      try {
        await courseService.delete(course.Id);
        toast.success("Course deleted successfully!");
        loadData();
      } catch (error) {
        toast.error("Failed to delete course");
      }
    }
  };

  const handleEditCourse = (course) => {
    toast.info("Course editing feature coming soon!");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-surface-900">Courses</h1>
          <p className="text-surface-600 mt-1">
            Manage your courses and track academic progress
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search courses..."
            className="w-full sm:w-64"
          />
          <Button variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg border border-primary-200">
          <div className="flex items-center space-x-2">
            <ApperIcon name="BookOpen" className="h-5 w-5 text-primary-600" />
            <div>
              <p className="text-sm text-primary-600 font-medium">Total Courses</p>
              <p className="text-xl font-bold text-primary-700">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Avg Grade</p>
              <p className="text-xl font-bold text-green-700">
                {courses.length > 0 
                  ? (courses.reduce((sum, c) => sum + c.currentGrade, 0) / courses.length).toFixed(1)
                  : "0.0"
                }%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">Active</p>
              <p className="text-xl font-bold text-yellow-700">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">This Semester</p>
              <p className="text-xl font-bold text-blue-700">{courses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.Id}
              course={course}
              assignments={getCourseAssignments(course.Id)}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      ) : searchQuery ? (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="mx-auto h-12 w-12 text-surface-400 mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No courses found</h3>
          <p className="text-surface-500">
            No courses match your search for "{searchQuery}". Try a different search term.
          </p>
        </div>
      ) : (
        <Empty
          icon="BookOpen"
          title="No courses yet"
          description="Start building your academic profile by adding your first course. Track grades, assignments, and progress all in one place."
          actionLabel="Add Your First Course"
          onAction={() => toast.info("Course creation feature coming soon!")}
        />
      )}

      {searchQuery && filteredCourses.length > 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-surface-600">
            Showing {filteredCourses.length} of {courses.length} courses
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Courses;