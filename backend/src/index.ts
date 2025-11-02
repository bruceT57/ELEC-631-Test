import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import Database from './config/database';
import config from './config/config';

// Import routes (will create these files next)
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import materialRoutes from './routes/materials';
import planningRoutes from './routes/planning';
import settingsRoutes from './routes/settings';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.app.use(cors({ origin: config.frontendUrl, credentials: true }));
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/courses', courseRoutes);
    this.app.use('/api/materials', materialRoutes);
    this.app.use('/api/planning', planningRoutes);
    this.app.use('/api/settings', settingsRoutes);

    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Error:', err);
      res.status(500).json({
        error: err.message || 'Internal server error',
        ...(config.nodeEnv === 'development' && { stack: err.stack })
      });
    });
  }

  public async start(): Promise<void> {
    try {
      config.validate();
      await Database.connect();

      const fs = require('fs');
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      this.app.listen(config.port, () => {
        console.log('');
        console.log('='.repeat(60));
        console.log(`✓ Peer Study Planner API running on http://localhost:${config.port}`);
        console.log(`✓ Environment: ${config.nodeEnv}`);
        console.log(`✓ Database: Connected`);
        console.log('='.repeat(60));
        console.log('');
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async shutdown(): Promise<void> {
    console.log('\nShutting down gracefully...');
    try {
      await Database.disconnect();
      console.log('✓ Server shut down successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}

const application = new App();
process.on('SIGINT', () => application.shutdown());
process.on('SIGTERM', () => application.shutdown());
application.start();

export default application.app;
