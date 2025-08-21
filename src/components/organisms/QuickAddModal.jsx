import { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import { assignmentService } from "@/services/api/assignmentService";

const QuickAddModal = ({ isOpen, onClose, courses = [], onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    description: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.courseId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await assignmentService.create({
        ...formData,
        courseId: parseInt(formData.courseId),
        dueDate: new Date(formData.dueDate).toISOString()
      });
      
      toast.success("Assignment added successfully!");
      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error("Failed to add assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      courseId: "",
      dueDate: "",
      priority: "medium",
      description: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-surface-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface-50 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-surface-200">
          <h2 className="text-xl font-semibold font-display text-surface-900">
            Quick Add Assignment
          </h2>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="Assignment Title *"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter assignment title"
          />

          <div>
            <Label htmlFor="courseId">Course *</Label>
            <Select
              id="courseId"
              value={formData.courseId}
              onChange={(e) => handleChange("courseId", e.target.value)}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.Id} value={course.Id}>
                  {course.name}
                </option>
              ))}
            </Select>
          </div>

          <FormField
            label="Due Date *"
            id="dueDate"
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
          />

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="input min-h-[80px] resize-none"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Optional description..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Add Assignment
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;