import { Router, Response } from 'express';
import { CustomizationSettings } from '../models';
import AuthMiddleware, { AuthRequest } from '../middleware/auth';

const router = Router();
router.use(AuthMiddleware.authenticate);

// Get settings for course
router.get('/course/:courseId', async (req: AuthRequest, res: Response) => {
  try {
    const settings = await CustomizationSettings.findOne({ courseId: req.params.courseId });
    res.status(200).json({ settings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update settings
router.post('/course/:courseId', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const settings = await CustomizationSettings.findOneAndUpdate(
      { courseId: req.params.courseId },
      { ...req.body, courseId: req.params.courseId, userId: req.user.userId },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ message: 'Settings saved successfully', settings });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
