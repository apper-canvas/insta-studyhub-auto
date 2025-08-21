import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AssignmentTable from "@/components/organisms/AssignmentTable";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

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
      setFilteredAssignments(assignmentsData);
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
    let filtered = [...assignments];

    if (searchQuery.trim()) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCourse) {
      filtered = filtered.filter(assignment => assignment.courseId === parseInt(filterCourse));
    }

    if (filterStatus) {
      filtered = filtered.filter(assignment => assignment.status === filterStatus);
    }

    if (filterPriority) {
      filtered = filtered.filter(assignment => assignment.priority === filterPriority);
    }

    setFilteredAssignments(filtered);
  }, [searchQuery, filterCourse, filterStatus, filterPriority, assignments]);

  const handleToggleStatus = async (assignment) => {
    const newStatus = assignment.status === "completed" ? "pending" : "completed";
    
    try {
      await assignmentService.update(assignment.Id, { status: newStatus });
      toast.success(`Assignment marked as ${newStatus}!`);
      loadData();
    } catch (error) {
      toast.error("Failed to update assignment status");
    }
  };

  const handleEditAssignment = (assignment) => {
    toast.info("Assignment editing feature coming soon!");
  };

  const handleDeleteAssignment = async (assignment) => {
    if (window.confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      try {
        await assignmentService.delete(assignment.Id);
        toast.success("Assignment deleted successfully!");
        loadData();
      } catch (error) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCourse("");
    setFilterStatus("");
    setFilterPriority("");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const pendingCount = assignments.filter(a => a.status === "pending").length;
  const completedCount = assignments.filter(a => a.status === "completed").length;
  const highPriorityCount = assignments.filter(a => a.priority === "high" && a.status === "pending").length;
  const overdueCount = assignments.filter(a => {
    return a.status === "pending" && new Date(a.dueDate) < new Date();
  }).length;

  const hasActiveFilters = searchQuery || filterCourse || filterStatus || filterPriority;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-surface-900">Assignments</h1>
          <p className="text-surface-600 mt-1">
            Track and manage all your course assignments
          </p>
        </div>

        <Button 
          variant="primary"
          onClick={() => setShowQuickAdd(true)}
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Assignment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-xl font-bold text-yellow-700">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-xl font-bold text-green-700">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2">
            <ApperIcon name="AlertTriangle" className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm text-red-600 font-medium">High Priority</p>
              <p className="text-xl font-bold text-red-700">{highPriorityCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-accent-50 to-accent-100 p-4 rounded-lg border border-accent-200">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" className="h-5 w-5 text-accent-600" />
            <div>
              <p className="text-sm text-accent-600 font-medium">Overdue</p>
              <p className="text-xl font-bold text-accent-700">{overdueCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-50 p-4 rounded-lg border border-surface-200">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search assignments..."
            className="flex-1 lg:max-w-xs"
            value={searchQuery}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="min-w-[150px]"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.Id} value={course.Id}>
                  {course.name}
                </option>
              ))}
            </Select>

            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="min-w-[130px]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Select>

            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="min-w-[130px]"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>

            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="whitespace-nowrap"
              >
                <ApperIcon name="X" className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-surface-200">
            <span className="text-sm text-surface-600">Active filters:</span>
            {searchQuery && (
              <Badge variant="primary">Search: {searchQuery}</Badge>
            )}
            {filterCourse && (
              <Badge variant="primary">
                Course: {courses.find(c => c.Id === parseInt(filterCourse))?.name}
              </Badge>
            )}
            {filterStatus && (
              <Badge variant="primary">Status: {filterStatus}</Badge>
            )}
            {filterPriority && (
              <Badge variant="primary">Priority: {filterPriority}</Badge>
            )}
          </div>
        )}
      </div>

      {/* Assignment Table */}
      {filteredAssignments.length > 0 ? (
        <div>
          <AssignmentTable
            assignments={filteredAssignments}
            courses={courses}
            onEdit={handleEditAssignment}
            onDelete={handleDeleteAssignment}
            onToggleStatus={handleToggleStatus}
          />
          
          <div className="text-center py-4">
            <p className="text-sm text-surface-600">
              Showing {filteredAssignments.length} of {assignments.length} assignments
            </p>
          </div>
        </div>
      ) : assignments.length === 0 ? (
        <Empty
          icon="FileText"
          title="No assignments yet"
          description="Start tracking your coursework by adding your first assignment. Stay organized and never miss a deadline!"
          actionLabel="Add Your First Assignment"
          onAction={() => setShowQuickAdd(true)}
        />
      ) : (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="mx-auto h-12 w-12 text-surface-400 mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No assignments found</h3>
          <p className="text-surface-500 mb-4">
            No assignments match your current filters. Try adjusting your search criteria.
          </p>
          <Button variant="secondary" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        courses={courses}
        onSuccess={loadData}
      />
    </div>
  );
};

export default Assignments;