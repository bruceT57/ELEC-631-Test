import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { CourseMaterial } from '../models';
import AuthMiddleware, { AuthRequest } from '../middleware/auth';
import FileProcessingService from '../services/FileProcessingService';
import config from '../config/config';

const router = Router();
router.use(AuthMiddleware.authenticate);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (FileProcessingService.isSupportedFileType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

// Upload material
router.post('/', upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.file) {
      res.status(400).json({ error: 'Missing required data' });
      return;
    }

    const extractedText = await FileProcessingService.extractTextFromFile(
      req.file.path,
      req.file.mimetype
    );

    const material = new CourseMaterial({
      courseId: req.body.courseId,
      uploadedBy: req.user.userId,
      title: req.body.title,
      description: req.body.description,
      materialType: req.body.materialType,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      extractedText,
      weekNumber: req.body.weekNumber
    });

    await material.save();
    res.status(201).json({ message: 'Material uploaded successfully', material });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get materials for course
router.get('/course/:courseId', async (req: AuthRequest, res: Response) => {
  try {
    const materials = await CourseMaterial.find({ courseId: req.params.courseId }).sort({ weekNumber: 1, uploadedAt: -1 });
    res.status(200).json({ materials });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete material
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const material = await CourseMaterial.findOneAndDelete({ _id: req.params.id, uploadedBy: req.user.userId });
    if (!material) {
      res.status(404).json({ error: 'Material not found or unauthorized' });
      return;
    }
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
