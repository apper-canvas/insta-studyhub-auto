import { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import CalendarView from "@/components/organisms/CalendarView";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const Calendar = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignmentClick = (assignment) => {
    const course = courses.find(c => c.Id === assignment.courseId);
    toast.info(
      <div>
        <strong>{assignment.title}</strong>
        <br />
        <span className="text-sm">Course: {course?.name}</span>
        <br />
        <span className="text-sm">Priority: {assignment.priority}</span>
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <CalendarView
      assignments={assignments}
      courses={courses}
      onAssignmentClick={handleAssignmentClick}
    />
  );
};

export default Calendar;