import { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import FormField from "@/components/molecules/FormField";

const COURSE_COLORS = [
  { value: "#8B7FFF", label: "Purple", class: "bg-primary-500" },
  { value: "#FF6B6B", label: "Red", class: "bg-accent-500" },
  { value: "#4ECDC4", label: "Teal", class: "bg-teal-500" },
  { value: "#45B7D1", label: "Blue", class: "bg-blue-500" },
  { value: "#96CEB4", label: "Green", class: "bg-green-500" },
  { value: "#FECA57", label: "Yellow", class: "bg-yellow-500" },
  { value: "#FF9FF3", label: "Pink", class: "bg-pink-500" },
  { value: "#54A0FF", label: "Light Blue", class: "bg-sky-500" },
];

const SEMESTERS = [
  { value: "Fall 2024", label: "Fall 2024" },
  { value: "Spring 2024", label: "Spring 2024" },
  { value: "Summer 2024", label: "Summer 2024" },
  { value: "Fall 2023", label: "Fall 2023" },
  { value: "Spring 2025", label: "Spring 2025" },
];

export default function AddCourseModal({ isOpen, onClose, onCourseAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    credits: "",
    instructor: "",
    semester: "Fall 2024",
    color: "#8B7FFF",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
    }
    
    if (!formData.code.trim()) {
      newErrors.code = "Course code is required";
    }
    
    if (!formData.credits || isNaN(formData.credits) || formData.credits < 1 || formData.credits > 6) {
      newErrors.credits = "Credits must be a number between 1 and 6";
    }
    
    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    
    setLoading(true);
    
    try {
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits),
        currentGrade: 0,
        gradeCategories: []
      };
      
      await onCourseAdded(courseData);
      
      // Reset form
      setFormData({
        name: "",
        code: "",
        credits: "",
        instructor: "",
        semester: "Fall 2024",
        color: "#8B7FFF",
        description: ""
      });
      
      toast.success("Course added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-50 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-surface-900">Add New Course</h2>
              <p className="text-sm text-surface-600 mt-1">Create a new course to track your academic progress</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={loading}
              className="p-2"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Course Name"
                error={errors.name}
                required
              >
                <Input
                  type="text"
                  placeholder="e.g., Introduction to Psychology"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={loading}
                />
              </FormField>

              <FormField
                label="Course Code"
                error={errors.code}
                required
              >
                <Input
                  type="text"
                  placeholder="e.g., PSYC 101"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  disabled={loading}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Credits"
                error={errors.credits}
                required
              >
                <Input
                  type="number"
                  min="1"
                  max="6"
                  placeholder="3"
                  value={formData.credits}
                  onChange={(e) => handleInputChange("credits", e.target.value)}
                  disabled={loading}
                />
              </FormField>

              <FormField
                label="Semester"
                required
              >
                <Select
                  value={formData.semester}
                  onChange={(e) => handleInputChange("semester", e.target.value)}
                  disabled={loading}
                >
                  {SEMESTERS.map(semester => (
                    <option key={semester.value} value={semester.value}>
                      {semester.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <FormField
              label="Instructor"
              error={errors.instructor}
              required
            >
              <Input
                type="text"
                placeholder="e.g., Dr. Sarah Johnson"
                value={formData.instructor}
                onChange={(e) => handleInputChange("instructor", e.target.value)}
                disabled={loading}
              />
            </FormField>

            <FormField label="Course Color">
              <div className="flex flex-wrap gap-2">
                {COURSE_COLORS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleInputChange("color", color.value)}
                    disabled={loading}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color.value 
                        ? "border-surface-900 scale-110" 
                        : "border-surface-300 hover:border-surface-500"
                    } ${color.class}`}
                    title={color.label}
                  />
                ))}
              </div>
            </FormField>

            <FormField label="Description (Optional)">
              <textarea
                className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
                rows="3"
                placeholder="Brief description of the course..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                disabled={loading}
              />
            </FormField>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Adding Course...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Course
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}