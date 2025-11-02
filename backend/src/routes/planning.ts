import { Router, Response } from 'express';
import PlanningService from '../services/PlanningService';
import AuthMiddleware, { AuthRequest } from '../middleware/auth';

const router = Router();
router.use(AuthMiddleware.authenticate);

// Generate planning sheet
router.post('/generate', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const planning = await PlanningService.generatePlanningSheet({
      ...req.body,
      userId: req.user.userId
    });
    res.status(201).json({ message: 'Planning sheet generated successfully', planning });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get planning for specific week
router.get('/course/:courseId/week/:weekNumber', async (req: AuthRequest, res: Response) => {
  try {
    const planning = await PlanningService.getPlanningByWeek(
      req.params.courseId,
      parseInt(req.params.weekNumber)
    );
    if (!planning) {
      res.status(404).json({ error: 'Planning sheet not found' });
      return;
    }
    res.status(200).json({ planning });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all plannings for course
router.get('/course/:courseId', async (req: AuthRequest, res: Response) => {
  try {
    const plannings = await PlanningService.getAllPlanningsForCourse(req.params.courseId);
    res.status(200).json({ plannings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update planning
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const planning = await PlanningService.updatePlanningSheet(req.params.id, req.user.userId, req.body);
    if (!planning) {
      res.status(404).json({ error: 'Planning sheet not found' });
      return;
    }
    res.status(200).json({ message: 'Planning sheet updated successfully', planning });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Regenerate planning
router.post('/:id/regenerate', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const planning = await PlanningService.regeneratePlanningSheet(
      req.params.id,
      req.user.userId,
      req.body.aiProvider
    );
    res.status(200).json({ message: 'Planning sheet regenerated successfully', planning });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete planning
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await PlanningService.deletePlanningSheet(req.params.id, req.user.userId);
    res.status(200).json({ message: 'Planning sheet deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
