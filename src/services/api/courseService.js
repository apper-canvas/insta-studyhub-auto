import coursesData from "@/services/mockData/courses.json";

let courses = [...coursesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const courseService = {
  async getAll() {
    await delay(300);
    return [...courses];
  },

  async getById(Id) {
    await delay(200);
    const course = courses.find(c => c.Id === parseInt(Id));
    if (!course) {
      throw new Error(`Course with Id ${Id} not found`);
    }
    return { ...course };
  },

  async create(courseData) {
    await delay(400);
    const maxId = courses.length > 0 ? Math.max(...courses.map(c => c.Id)) : 0;
    const newCourse = {
      Id: maxId + 1,
      gradeCategories: [],
      currentGrade: 0,
      ...courseData
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(Id, courseData) {
    await delay(400);
    const index = courses.findIndex(c => c.Id === parseInt(Id));
    if (index === -1) {
      throw new Error(`Course with Id ${Id} not found`);
    }
    courses[index] = { ...courses[index], ...courseData };
    return { ...courses[index] };
  },

  async delete(Id) {
    await delay(300);
    const index = courses.findIndex(c => c.Id === parseInt(Id));
    if (index === -1) {
      throw new Error(`Course with Id ${Id} not found`);
    }
    courses.splice(index, 1);
    return true;
  }
};