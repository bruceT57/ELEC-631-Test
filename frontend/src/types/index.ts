export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentId: string;
  createdAt: string;
}

export interface Course {
  _id: string;
  sessionLeadId: string;
  courseCode: string;
  courseName: string;
  semester: 'Fall' | 'Spring' | 'Summer' | 'Winter';
  year: number;
  description?: string;
  sessionFrequency: number;
  totalWeeks: number;
  createdAt: string;
  updatedAt: string;
}

export type MaterialType = 'syllabus' | 'lecture_notes' | 'textbook' | 'slides' | 'assignments' | 'exams' | 'other';

export interface CourseMaterial {
  _id: string;
  courseId: string;
  uploadedBy: string;
  title: string;
  description?: string;
  materialType: MaterialType;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  extractedText?: string;
  weekNumber?: number;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  questionText: string;
  difficulty: string;
  estimatedTime: number;
  expectedAnswer?: string;
}

export interface AssessmentMethod {
  methodName: string;
  description: string;
  duration: number;
}

export interface PlanningSheet {
  _id: string;
  courseId: string;
  createdBy: string;
  weekNumber: number;
  sessionDate?: string;
  weeklyAbstract: string;
  learningObjectives: string[];
  questions: Question[];
  assessmentMethods: AssessmentMethod[];
  additionalNotes?: string;
  aiProvider: 'openai' | 'gemini' | 'claude';
  generatedWith?: string;
  isCustomized: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomizationSettings {
  _id?: string;
  courseId: string;
  userId: string;
  preferredAiProvider: 'openai' | 'gemini' | 'claude';
  defaultSessionDuration: number;
  numberOfQuestions: number;
  questionDifficultyMix: {
    easy: number;
    medium: number;
    hard: number;
  };
  assessmentPreferences: string[];
  teachingStyle: 'interactive' | 'lecture' | 'discussion' | 'problem-solving' | 'collaborative';
  additionalInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentId: string;
}
