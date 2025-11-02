import mongoose, { Document, Schema } from 'mongoose';

/**
 * Material type enumeration
 */
export enum MaterialType {
  SYLLABUS = 'syllabus',
  LECTURE_NOTES = 'lecture_notes',
  TEXTBOOK = 'textbook',
  SLIDES = 'slides',
  ASSIGNMENTS = 'assignments',
  EXAMS = 'exams',
  OTHER = 'other'
}

/**
 * Course Material interface
 */
export interface ICourseMaterial extends Document {
  courseId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  materialType: MaterialType;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  extractedText?: string;
  weekNumber?: number;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Course Material Schema
 */
const CourseMaterialSchema: Schema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    materialType: {
      type: String,
      enum: Object.values(MaterialType),
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    extractedText: {
      type: String
    },
    weekNumber: {
      type: Number,
      min: 1,
      max: 52
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

/**
 * Index for efficient querying
 */
CourseMaterialSchema.index({ courseId: 1, weekNumber: 1 });
CourseMaterialSchema.index({ courseId: 1, materialType: 1 });

export default mongoose.model<ICourseMaterial>('CourseMaterial', CourseMaterialSchema);
