import mongoose, { Document, Schema } from 'mongoose';

/**
 * Question interface
 */
export interface IQuestion {
  questionText: string;
  difficulty: string;
  estimatedTime: number;
  expectedAnswer?: string;
}

/**
 * Assessment method interface
 */
export interface IAssessmentMethod {
  methodName: string;
  description: string;
  duration: number;
}

/**
 * Planning Sheet interface
 */
export interface IPlanningSheet extends Document {
  courseId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  weekNumber: number;
  sessionDate?: Date;
  weeklyAbstract: string;
  learningObjectives: string[];
  questions: IQuestion[];
  assessmentMethods: IAssessmentMethod[];
  additionalNotes?: string;
  aiProvider: string;
  generatedWith?: string;
  isCustomized: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Planning Sheet Schema
 */
const PlanningSheetSchema: Schema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    weekNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 52
    },
    sessionDate: {
      type: Date
    },
    weeklyAbstract: {
      type: String,
      required: true,
      trim: true
    },
    learningObjectives: [
      {
        type: String,
        required: true
      }
    ],
    questions: [
      {
        questionText: { type: String, required: true },
        difficulty: { type: String, required: true },
        estimatedTime: { type: Number, required: true },
        expectedAnswer: { type: String }
      }
    ],
    assessmentMethods: [
      {
        methodName: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: Number, required: true }
      }
    ],
    additionalNotes: {
      type: String,
      trim: true
    },
    aiProvider: {
      type: String,
      enum: ['openai', 'gemini', 'claude'],
      required: true
    },
    generatedWith: {
      type: String
    },
    isCustomized: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

/**
 * Unique compound index
 */
PlanningSheetSchema.index({ courseId: 1, weekNumber: 1 }, { unique: true });

export default mongoose.model<IPlanningSheet>('PlanningSheet', PlanningSheetSchema);
