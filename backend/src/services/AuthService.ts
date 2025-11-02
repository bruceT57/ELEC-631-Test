import jwt from 'jsonwebtoken';
import { User, IUser } from '../models';
import config from '../config/config';

export interface ITokenPayload {
  userId: string;
  email: string;
}

export interface IRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentId: string;
}

class AuthService {
  public async register(data: IRegisterData): Promise<{ user: IUser; token: string }> {
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { studentId: data.studentId }]
    });

    if (existingUser) {
      throw new Error('User with this email or student ID already exists');
    }

    const user = new User(data);
    await user.save();

    const token = this.generateToken(user);
    return { user, token };
  }

  public async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  public generateToken(user: IUser): string {
    const payload: ITokenPayload = {
      userId: user._id.toString(),
      email: user.email
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
  }

  public verifyToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, config.jwtSecret) as ITokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  public async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).select('-password');
  }
}

export default new AuthService();
