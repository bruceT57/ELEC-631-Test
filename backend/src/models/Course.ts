import mongoose, { Document, Schema } from 'mongoose';

/**
 * Course interface
 */
export interface ICourse extends Document {
  sessionLeadId: mongoose.Types.ObjectId;
  courseCode: string;
  courseName: string;
  semester: string;
  year: number;
  description?: string;
  sessionFrequency: number;
  totalWeeks: number;
  createdAt: Date;
  updatedAt: Date;
  getFullCourseName(): string;
}

/**
 * Course Schema
 */
const CourseSchema: Schema = new Schema(
  {
    sessionLeadId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    courseCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    courseName: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: String,
      required: true,
      enum: ['Fall', 'Spring', 'Summer', 'Winter'],
      index: true
    },
    year: {
      type: Number,
      required: true,
      index: true
    },
    description: {
      type: String,
      trim: true
    },
    sessionFrequency: {
      type: Number,
      default: 2,
      min: 1,
      max: 7
    },
    totalWeeks: {
      type: Number,
      default: 15,
      min: 1,
      max: 52
    }
  },
  {
    timestamps: true
  }
);

/**
 * Method to get full course name
 */
CourseSchema.methods.getFullCourseName = function (): string {
  return `${this.courseCode} - ${this.courseName} (${this.semester} ${this.year})`;
};

/**
 * Compound index for unique course per session lead per semester
 */
CourseSchema.index({ sessionLeadId: 1, courseCode: 1, semester: 1, year: 1 }, { unique: true });

export default mongoose.model<ICourse>('Course', CourseSchema);
