import { Router, Response } from 'express';
import { Course, CustomizationSettings } from '../models';
import AuthMiddleware, { AuthRequest } from '../middleware/auth';

const router = Router();
router.use(AuthMiddleware.authenticate);

// Create course
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const course = new Course({ ...req.body, sessionLeadId: req.user.userId });
    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's courses
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const courses = await Course.find({ sessionLeadId: req.user.userId }).sort({ year: -1, semester: -1 });
    res.status(200).json({ courses });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.status(200).json({ course });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update course
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, sessionLeadId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) {
      res.status(404).json({ error: 'Course not found or unauthorized' });
      return;
    }
    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete course
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const course = await Course.findOneAndDelete({ _id: req.params.id, sessionLeadId: req.user.userId });
    if (!course) {
      res.status(404).json({ error: 'Course not found or unauthorized' });
      return;
    }
    // Clean up related data
    await CustomizationSettings.deleteOne({ courseId: req.params.id });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
