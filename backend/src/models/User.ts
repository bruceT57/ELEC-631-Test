import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User interface
 */
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentId: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getPublicProfile(): object;
}

/**
 * User Schema
 */
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Pre-save middleware to hash password
 */
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

/**
 * Method to compare password
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Method to get public profile
 */
UserSchema.methods.getPublicProfile = function (): object {
  return {
    id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    studentId: this.studentId,
    createdAt: this.createdAt
  };
};

export default mongoose.model<IUser>('User', UserSchema);
