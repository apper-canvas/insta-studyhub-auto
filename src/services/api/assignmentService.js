import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const assignmentService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getById(Id) {
    await delay(200);
    const assignment = assignments.find(a => a.Id === parseInt(Id));
    if (!assignment) {
      throw new Error(`Assignment with Id ${Id} not found`);
    }
    return { ...assignment };
  },

  async getByCourse(courseId) {
    await delay(200);
    return assignments.filter(a => a.courseId === parseInt(courseId)).map(a => ({ ...a }));
  },

  async create(assignmentData) {
    await delay(400);
    const maxId = assignments.length > 0 ? Math.max(...assignments.map(a => a.Id)) : 0;
    const newAssignment = {
      Id: maxId + 1,
      status: "pending",
      grade: null,
      ...assignmentData
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(Id, assignmentData) {
    await delay(400);
    const index = assignments.findIndex(a => a.Id === parseInt(Id));
    if (index === -1) {
      throw new Error(`Assignment with Id ${Id} not found`);
    }
    assignments[index] = { ...assignments[index], ...assignmentData };
    return { ...assignments[index] };
  },

  async delete(Id) {
    await delay(300);
    const index = assignments.findIndex(a => a.Id === parseInt(Id));
    if (index === -1) {
      throw new Error(`Assignment with Id ${Id} not found`);
    }
    assignments.splice(index, 1);
    return true;
  }
};