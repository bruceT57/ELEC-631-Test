import { Request, Response, NextFunction } from 'express';
import AuthService, { ITokenPayload } from '../services/AuthService';

export interface AuthRequest extends Request {
  user?: ITokenPayload;
}

class AuthMiddleware {
  public authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const token = authHeader.substring(7);
      const payload = AuthService.verifyToken(token);
      req.user = payload;

      next();
    } catch (error: any) {
      res.status(401).json({ error: error.message || 'Unauthorized' });
    }
  };
}

export default new AuthMiddleware();
