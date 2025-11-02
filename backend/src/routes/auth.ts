import { Router, Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { user, token } = await AuthService.register(req.body);
    res.status(201).json({ message: 'User registered successfully', user: user.getPublicProfile(), token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    res.status(200).json({ message: 'Login successful', user: user.getPublicProfile(), token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// Get profile
router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const user = await AuthService.getUserById(req.user.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ user: user.getPublicProfile() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
