import axios, { AxiosInstance } from 'axios';
import {
  User,
  Course,
  CourseMaterial,
  PlanningSheet,
  CustomizationSettings,
  AuthResponse,
  LoginCredentials,
  RegisterData
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async getProfile(): Promise<{ user: User }> {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // Courses
  async createCourse(data: Partial<Course>): Promise<{ course: Course }> {
    const response = await this.api.post('/courses', data);
    return response.data;
  }

  async getCourses(): Promise<{ courses: Course[] }> {
    const response = await this.api.get('/courses');
    return response.data;
  }

  async getCourse(id: string): Promise<{ course: Course }> {
    const response = await this.api.get(`/courses/${id}`);
    return response.data;
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<{ course: Course }> {
    const response = await this.api.put(`/courses/${id}`, data);
    return response.data;
  }

  async deleteCourse(id: string): Promise<void> {
    await this.api.delete(`/courses/${id}`);
  }

  // Materials
  async uploadMaterial(formData: FormData): Promise<{ material: CourseMaterial }> {
    const response = await this.api.post('/materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async getMaterials(courseId: string): Promise<{ materials: CourseMaterial[] }> {
    const response = await this.api.get(`/materials/course/${courseId}`);
    return response.data;
  }

  async deleteMaterial(id: string): Promise<void> {
    await this.api.delete(`/materials/${id}`);
  }

  // Planning
  async generatePlanning(data: {
    courseId: string;
    weekNumber: number;
    aiProvider?: string;
    sessionDate?: string;
    specificMaterialIds?: string[];
  }): Promise<{ planning: PlanningSheet }> {
    const response = await this.api.post('/planning/generate', data);
    return response.data;
  }

  async getPlanning(courseId: string, weekNumber: number): Promise<{ planning: PlanningSheet }> {
    const response = await this.api.get(`/planning/course/${courseId}/week/${weekNumber}`);
    return response.data;
  }

  async getAllPlannings(courseId: string): Promise<{ plannings: PlanningSheet[] }> {
    const response = await this.api.get(`/planning/course/${courseId}`);
    return response.data;
  }

  async updatePlanning(id: string, data: Partial<PlanningSheet>): Promise<{ planning: PlanningSheet }> {
    const response = await this.api.put(`/planning/${id}`, data);
    return response.data;
  }

  async regeneratePlanning(id: string, aiProvider?: string): Promise<{ planning: PlanningSheet }> {
    const response = await this.api.post(`/planning/${id}/regenerate`, { aiProvider });
    return response.data;
  }

  async deletePlanning(id: string): Promise<void> {
    await this.api.delete(`/planning/${id}`);
  }

  // Settings
  async getSettings(courseId: string): Promise<{ settings: CustomizationSettings | null }> {
    const response = await this.api.get(`/settings/course/${courseId}`);
    return response.data;
  }

  async saveSettings(courseId: string, data: Partial<CustomizationSettings>): Promise<{ settings: CustomizationSettings }> {
    const response = await this.api.post(`/settings/course/${courseId}`, data);
    return response.data;
  }
}

export default new ApiService();
