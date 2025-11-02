import mongoose, { Document, Schema } from 'mongoose';

/**
 * Customization Settings interface
 */
export interface ICustomizationSettings extends Document {
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  preferredAiProvider: string;
  defaultSessionDuration: number;
  numberOfQuestions: number;
  questionDifficultyMix: {
    easy: number;
    medium: number;
    hard: number;
  };
  assessmentPreferences: string[];
  teachingStyle: string;
  additionalInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Customization Settings Schema
 */
const CustomizationSettingsSchema: Schema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    preferredAiProvider: {
      type: String,
      enum: ['openai', 'gemini', 'claude'],
      default: 'openai'
    },
    defaultSessionDuration: {
      type: Number,
      default: 90,
      min: 30,
      max: 240
    },
    numberOfQuestions: {
      type: Number,
      default: 5,
      min: 1,
      max: 20
    },
    questionDifficultyMix: {
      easy: { type: Number, default: 30, min: 0, max: 100 },
      medium: { type: Number, default: 50, min: 0, max: 100 },
      hard: { type: Number, default: 20, min: 0, max: 100 }
    },
    assessmentPreferences: [
      {
        type: String
      }
    ],
    teachingStyle: {
      type: String,
      default: 'interactive',
      enum: ['interactive', 'lecture', 'discussion', 'problem-solving', 'collaborative']
    },
    additionalInstructions: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICustomizationSettings>('CustomizationSettings', CustomizationSettingsSchema);
