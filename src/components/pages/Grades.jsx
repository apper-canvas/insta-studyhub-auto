import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { cn } from "@/utils/cn";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGradeCalculator, setShowGradeCalculator] = useState(false);

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

  const getOverallGPA = () => {
    if (courses.length === 0) return 0;
    const totalGrade = courses.reduce((sum, course) => sum + course.currentGrade, 0);
    return totalGrade / courses.length;
  };

  const getGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    
    courses.forEach(course => {
      if (course.currentGrade >= 90) distribution.A++;
      else if (course.currentGrade >= 80) distribution.B++;
      else if (course.currentGrade >= 70) distribution.C++;
      else if (course.currentGrade >= 60) distribution.D++;
      else distribution.F++;
    });
    
    return distribution;
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return { grade: "A", color: "text-green-600" };
    if (percentage >= 80) return { grade: "B", color: "text-blue-600" };
    if (percentage >= 70) return { grade: "C", color: "text-yellow-600" };
    if (percentage >= 60) return { grade: "D", color: "text-orange-600" };
    return { grade: "F", color: "text-red-600" };
  };

  const getCourseAssignments = (courseId) => {
    return assignments.filter(a => a.courseId === courseId && a.grade !== null);
  };

  const selectedCourseData = selectedCourse 
    ? courses.find(c => c.Id === parseInt(selectedCourse))
    : null;

  const selectedCourseAssignments = selectedCourseData 
    ? getCourseAssignments(selectedCourseData.Id)
    : [];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const overallGPA = getOverallGPA();
  const gradeDistribution = getGradeDistribution();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-surface-900">Grades</h1>
          <p className="text-surface-600 mt-1">
            Track your academic performance and calculate grade targets
          </p>
        </div>

        <Button 
          variant="primary"
          onClick={() => setShowGradeCalculator(!showGradeCalculator)}
        >
          <ApperIcon name="Calculator" className="w-4 h-4 mr-2" />
          Grade Calculator
        </Button>
      </div>

      {/* Overall Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary-800">Overall GPA</h3>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-700 mb-1">
              {overallGPA.toFixed(1)}%
            </p>
            <p className="text-lg font-medium text-primary-600">
              {getLetterGrade(overallGPA).grade} Average
            </p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Grade Distribution</h3>
          <div className="space-y-3">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={cn("font-bold text-lg", getLetterGrade(grade === "A" ? 95 : grade === "B" ? 85 : grade === "C" ? 75 : grade === "D" ? 65 : 50).color)}>
                    {grade}
                  </span>
                  <span className="text-surface-600">Grade</span>
                </div>
                <Badge variant="primary">{count}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-surface-600">Total Courses</span>
              <span className="font-semibold text-surface-900">{courses.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-surface-600">Highest Grade</span>
              <span className="font-semibold text-green-600">
                {courses.length > 0 ? `${Math.max(...courses.map(c => c.currentGrade)).toFixed(1)}%` : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-surface-600">Lowest Grade</span>
              <span className="font-semibold text-red-600">
                {courses.length > 0 ? `${Math.min(...courses.map(c => c.currentGrade)).toFixed(1)}%` : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-surface-600">Courses Above Target</span>
              <span className="font-semibold text-blue-600">
                {courses.filter(c => c.currentGrade >= c.targetGrade).length} / {courses.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grades */}
      <div className="card">
        <div className="p-6 border-b border-surface-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-surface-900">Course Grades</h2>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="max-w-xs"
            >
              <option value="">All Courses Overview</option>
              {courses.map((course) => (
                <option key={course.Id} value={course.Id}>
                  {course.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="p-6">
          {courses.length > 0 ? (
            selectedCourse ? (
              /* Individual Course Details */
              selectedCourseData && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: selectedCourseData.color }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-surface-900">
                        {selectedCourseData.name}
                      </h3>
                      <p className="text-surface-600">{selectedCourseData.instructor}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-surface-50 to-surface-100 p-4 rounded-lg border border-surface-200">
                      <p className="text-sm text-surface-600 font-medium mb-1">Current Grade</p>
                      <p className={cn("text-2xl font-bold", getLetterGrade(selectedCourseData.currentGrade).color)}>
                        {selectedCourseData.currentGrade.toFixed(1)}%
                      </p>
                      <p className="text-sm text-surface-500">
                        {getLetterGrade(selectedCourseData.currentGrade).grade} Grade
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-surface-50 to-surface-100 p-4 rounded-lg border border-surface-200">
                      <p className="text-sm text-surface-600 font-medium mb-1">Target Grade</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {selectedCourseData.targetGrade}%
                      </p>
                      <p className="text-sm text-surface-500">
                        {selectedCourseData.currentGrade >= selectedCourseData.targetGrade ? "Target Met!" : "In Progress"}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-surface-50 to-surface-100 p-4 rounded-lg border border-surface-200">
                      <p className="text-sm text-surface-600 font-medium mb-1">Graded Items</p>
                      <p className="text-2xl font-bold text-surface-900">
                        {selectedCourseAssignments.length}
                      </p>
                      <p className="text-sm text-surface-500">Assignments</p>
                    </div>
                  </div>

                  {/* Grade Categories */}
                  <div>
                    <h4 className="text-lg font-medium text-surface-900 mb-4">Grade Categories</h4>
                    <div className="space-y-4">
                      {selectedCourseData.gradeCategories.map((category, index) => {
                        const categoryAvg = category.grades.length > 0 
                          ? category.grades.reduce((sum, grade) => sum + grade, 0) / category.grades.length
                          : 0;
                        
                        return (
                          <div key={index} className="bg-gradient-to-r from-surface-50 to-surface-100 p-4 rounded-lg border border-surface-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-surface-900">{category.name}</h5>
                              <div className="flex items-center space-x-2">
                                <Badge variant="primary">{category.weight}%</Badge>
                                <span className={cn("font-bold", getLetterGrade(categoryAvg).color)}>
                                  {category.grades.length > 0 ? `${categoryAvg.toFixed(1)}%` : "N/A"}
                                </span>
                              </div>
                            </div>
                            
                            {category.grades.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {category.grades.map((grade, gradeIndex) => (
                                  <Badge key={gradeIndex} variant="secondary">
                                    {grade}%
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )
            ) : (
              /* All Courses Overview */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => {
                  const letterGrade = getLetterGrade(course.currentGrade);
                  const isAboveTarget = course.currentGrade >= course.targetGrade;
                  
                  return (
                    <div key={course.Id} className="bg-gradient-to-r from-surface-50 to-surface-100 p-6 rounded-lg border border-surface-200 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                          <div>
                            <h3 className="font-medium text-surface-900">{course.name}</h3>
                            <p className="text-sm text-surface-600">{course.instructor}</p>
                          </div>
                        </div>
                        <Badge variant={isAboveTarget ? "success" : "warning"}>
                          {isAboveTarget ? "On Track" : "Below Target"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={cn("text-2xl font-bold", letterGrade.color)}>
                            {course.currentGrade.toFixed(1)}%
                          </p>
                          <p className="text-sm text-surface-600">
                            Target: {course.targetGrade}%
                          </p>
                        </div>
                        <div className={cn("text-3xl font-bold", letterGrade.color)}>
                          {letterGrade.grade}
                        </div>
                      </div>
                      
                      <div className="mt-4 w-full bg-surface-200 rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            isAboveTarget 
                              ? "bg-gradient-to-r from-green-500 to-green-400" 
                              : "bg-gradient-to-r from-yellow-500 to-yellow-400"
                          )}
                          style={{ 
                            width: `${Math.min((course.currentGrade / course.targetGrade) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <Empty
              icon="TrendingUp"
              title="No grades to display"
              description="Start tracking your academic performance by adding courses and completing assignments."
              actionLabel="Add Course"
              onAction={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Grades;