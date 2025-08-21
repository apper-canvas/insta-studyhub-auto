// Initialize ApperClient for course operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const COURSE_TABLE_NAME = 'course_c';

export const courseService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name" } },
          { field: { Name: "instructor" } },
          { field: { Name: "color" } },
          { field: { Name: "schedule" } },
          { field: { Name: "semester" } },
          { field: { Name: "targetGrade" } },
          { field: { Name: "currentGrade" } },
          { field: { Name: "gradeCategories" } }
        ],
        orderBy: [
          {
            fieldName: "name",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(COURSE_TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
      } else {
        console.error("Error fetching courses:", error);
      }
      throw error;
    }
  },

  async getById(Id) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name" } },
          { field: { Name: "instructor" } },
          { field: { Name: "color" } },
          { field: { Name: "schedule" } },
          { field: { Name: "semester" } },
          { field: { Name: "targetGrade" } },
          { field: { Name: "currentGrade" } },
          { field: { Name: "gradeCategories" } }
        ]
      };
      
      const response = await apperClient.getRecordById(COURSE_TABLE_NAME, parseInt(Id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error(`Course with Id ${Id} not found`);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching course with ID ${Id}:`, error);
      }
      throw error;
    }
  },

  async create(courseData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [
          {
            name: courseData.name,
            instructor: courseData.instructor,
            color: courseData.color,
            schedule: courseData.schedule,
            semester: courseData.semester,
            targetGrade: parseInt(courseData.targetGrade || 90),
            currentGrade: parseInt(courseData.currentGrade || 0),
            gradeCategories: courseData.gradeCategories || []
          }
        ]
      };
      
      const response = await apperClient.createRecord(COURSE_TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create course ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message);
      } else {
        console.error("Error creating course:", error);
      }
      throw error;
    }
  },

  async update(Id, courseData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [
          {
            Id: parseInt(Id),
            name: courseData.name,
            instructor: courseData.instructor,
            color: courseData.color,
            schedule: courseData.schedule,
            semester: courseData.semester,
            targetGrade: courseData.targetGrade !== undefined ? parseInt(courseData.targetGrade) : undefined,
            currentGrade: courseData.currentGrade !== undefined ? parseInt(courseData.currentGrade) : undefined,
            gradeCategories: courseData.gradeCategories
          }
        ]
      };
      
      const response = await apperClient.updateRecord(COURSE_TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update course ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
      } else {
        console.error("Error updating course:", error);
      }
      throw error;
    }
  },

  async delete(Id) {
    try {
      const apperClient = getApperClient();
      const params = {
        RecordIds: [parseInt(Id)]
      };
      
      const response = await apperClient.deleteRecord(COURSE_TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete course ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
      } else {
        console.error("Error deleting course:", error);
      }
      throw error;
    }
}
};