// Initialize ApperClient for assignment operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const ASSIGNMENT_TABLE_NAME = 'Assignment';

export const assignmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "courseId" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "description" } },
          { field: { Name: "grade" } },
          { field: { Name: "category" } }
        ],
        orderBy: [
          {
            fieldName: "dueDate",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(ASSIGNMENT_TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
      } else {
        console.error("Error fetching assignments:", error);
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
          { field: { Name: "title" } },
          { field: { Name: "courseId" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "description" } },
          { field: { Name: "grade" } },
          { field: { Name: "category" } }
        ]
      };
      
      const response = await apperClient.getRecordById(ASSIGNMENT_TABLE_NAME, parseInt(Id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error(`Assignment with Id ${Id} not found`);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${Id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching assignment with ID ${Id}:`, error);
      }
      throw error;
    }
  },

  async getByCourse(courseId) {
    try {
      const apperClient = getApperClient();
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "title" } },
          { field: { Name: "courseId" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "priority" } },
          { field: { Name: "status" } },
          { field: { Name: "description" } },
          { field: { Name: "grade" } },
          { field: { Name: "category" } }
        ],
        where: [
          {
            FieldName: "courseId",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ],
        orderBy: [
          {
            fieldName: "dueDate",
            sorttype: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(ASSIGNMENT_TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments by course:", error?.response?.data?.message);
      } else {
        console.error("Error fetching assignments by course:", error);
      }
      throw error;
    }
  },

  async create(assignmentData) {
    try {
      const apperClient = getApperClient();
      const params = {
        records: [
          {
            title: assignmentData.title,
            courseId: parseInt(assignmentData.courseId),
            dueDate: assignmentData.dueDate,
            priority: assignmentData.priority || "medium",
            status: assignmentData.status || "pending",
            description: assignmentData.description || "",
            grade: assignmentData.grade || null,
            category: assignmentData.category || ""
          }
        ]
      };
      
      const response = await apperClient.createRecord(ASSIGNMENT_TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create assignment ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error("Error creating assignment:", error);
      }
      throw error;
    }
  },

  async update(Id, assignmentData) {
    try {
      const apperClient = getApperClient();
      const updateData = {
        Id: parseInt(Id)
      };
      
      // Only include fields that are being updated
      if (assignmentData.title !== undefined) updateData.title = assignmentData.title;
      if (assignmentData.courseId !== undefined) updateData.courseId = parseInt(assignmentData.courseId);
      if (assignmentData.dueDate !== undefined) updateData.dueDate = assignmentData.dueDate;
      if (assignmentData.priority !== undefined) updateData.priority = assignmentData.priority;
      if (assignmentData.status !== undefined) updateData.status = assignmentData.status;
      if (assignmentData.description !== undefined) updateData.description = assignmentData.description;
      if (assignmentData.grade !== undefined) updateData.grade = assignmentData.grade;
      if (assignmentData.category !== undefined) updateData.category = assignmentData.category;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord(ASSIGNMENT_TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update assignment ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
      } else {
        console.error("Error updating assignment:", error);
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
      
      const response = await apperClient.deleteRecord(ASSIGNMENT_TABLE_NAME, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete assignment ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error("Error deleting assignment:", error);
      }
      throw error;
    }
  }
};