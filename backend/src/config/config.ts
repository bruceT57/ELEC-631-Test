import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration class
 */
class Config {
  public readonly port: number;
  public readonly mongoUri: string;
  public readonly jwtSecret: string;
  public readonly jwtExpiresIn: string;
  public readonly nodeEnv: string;
  public readonly frontendUrl: string;

  // AI Provider API Keys
  public readonly openaiApiKey: string;
  public readonly geminiApiKey: string;
  public readonly claudeApiKey: string;
  public readonly defaultAiProvider: string;

  // File Upload Settings
  public readonly maxFileSize: number;
  public readonly uploadDir: string;

  constructor() {
    this.port = parseInt(process.env.PORT || '5000', 10);
    this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/peer-study-planner';
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
    this.claudeApiKey = process.env.CLAUDE_API_KEY || '';
    this.defaultAiProvider = process.env.DEFAULT_AI_PROVIDER || 'openai';

    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10);
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
  }

  /**
   * Validate configuration
   */
  public validate(): void {
    if (!this.jwtSecret || this.jwtSecret === 'default-secret-change-in-production') {
      console.warn('⚠️ Warning: Using default JWT secret. Set JWT_SECRET in production!');
    }

    const aiKeysConfigured = [
      this.openaiApiKey,
      this.geminiApiKey,
      this.claudeApiKey
    ].filter(key => key).length;

    if (aiKeysConfigured === 0) {
      console.warn('⚠️ Warning: No AI provider API keys configured!');
    } else {
      console.log(`✓ ${aiKeysConfigured} AI provider(s) configured`);
    }
  }

  /**
   * Check if AI provider is configured
   */
  public isAiProviderConfigured(provider: string): boolean {
    switch (provider.toLowerCase()) {
      case 'openai':
        return !!this.openaiApiKey;
      case 'gemini':
        return !!this.geminiApiKey;
      case 'claude':
        return !!this.claudeApiKey;
      default:
        return false;
    }
  }
}

export default new Config();
