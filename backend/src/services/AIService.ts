import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import config from '../config/config';
import { ICustomizationSettings } from '../models';

/**
 * AI Provider type
 */
export type AIProvider = 'openai' | 'gemini' | 'claude';

/**
 * Planning generation context interface
 */
export interface IPlanningContext {
  courseCode: string;
  courseName: string;
  weekNumber: number;
  courseMaterials: string[];
  customization: ICustomizationSettings;
  previousWeeksTopics?: string[];
}

/**
 * Generated planning structure
 */
export interface IGeneratedPlanning {
  weeklyAbstract: string;
  learningObjectives: string[];
  questions: Array<{
    questionText: string;
    difficulty: string;
    estimatedTime: number;
    expectedAnswer?: string;
  }>;
  assessmentMethods: Array<{
    methodName: string;
    description: string;
    duration: number;
  }>;
  additionalNotes?: string;
}

/**
 * AI Service class for multi-provider support
 */
class AIService {
  private openaiClient: OpenAI | null = null;
  private geminiClient: GoogleGenerativeAI | null = null;
  private claudeClient: Anthropic | null = null;

  constructor() {
    this.initializeProviders();
  }

  /**
   * Initialize AI provider clients
   */
  private initializeProviders(): void {
    if (config.openaiApiKey) {
      this.openaiClient = new OpenAI({
        apiKey: config.openaiApiKey
      });
      console.log('✓ OpenAI initialized');
    }

    if (config.geminiApiKey) {
      this.geminiClient = new GoogleGenerativeAI(config.geminiApiKey);
      console.log('✓ Gemini initialized');
    }

    if (config.claudeApiKey) {
      this.claudeClient = new Anthropic({
        apiKey: config.claudeApiKey
      });
      console.log('✓ Claude initialized');
    }
  }

  /**
   * Generate planning sheet using specified AI provider
   */
  public async generatePlanning(
    context: IPlanningContext,
    provider?: AIProvider
  ): Promise<IGeneratedPlanning> {
    const selectedProvider = provider || (config.defaultAiProvider as AIProvider);

    if (!config.isAiProviderConfigured(selectedProvider)) {
      throw new Error(`AI provider "${selectedProvider}" is not configured`);
    }

    const prompt = this.buildPrompt(context);

    try {
      switch (selectedProvider) {
        case 'openai':
          return await this.generateWithOpenAI(prompt);
        case 'gemini':
          return await this.generateWithGemini(prompt);
        case 'claude':
          return await this.generateWithClaude(prompt);
        default:
          throw new Error(`Unsupported AI provider: ${selectedProvider}`);
      }
    } catch (error: any) {
      console.error(`Error generating with ${selectedProvider}:`, error.message);
      throw new Error(`Failed to generate planning: ${error.message}`);
    }
  }

  /**
   * Build comprehensive prompt for AI generation
   */
  private buildPrompt(context: IPlanningContext): string {
    const {
      courseCode,
      courseName,
      weekNumber,
      courseMaterials,
      customization,
      previousWeeksTopics
    } = context;

    return `You are an AI assistant helping create a peer study session planning sheet for a university course.

**Course Information:**
- Course: ${courseCode} - ${courseName}
- Week Number: ${weekNumber}
- Session Duration: ${customization.defaultSessionDuration} minutes
- Teaching Style: ${customization.teachingStyle}

**Course Materials for This Week:**
${courseMaterials.map((material, idx) => `${idx + 1}. ${material}`).join('\n')}

${previousWeeksTopics ? `**Previous Weeks Topics:**\n${previousWeeksTopics.join(', ')}` : ''}

**Customization Preferences:**
- Number of Questions: ${customization.numberOfQuestions}
- Difficulty Mix: ${customization.questionDifficultyMix.easy}% easy, ${customization.questionDifficultyMix.medium}% medium, ${customization.questionDifficultyMix.hard}% hard
- Preferred Assessment Methods: ${customization.assessmentPreferences.join(', ')}
${customization.additionalInstructions ? `- Additional Instructions: ${customization.additionalInstructions}` : ''}

**Required Output (JSON format only):**
Generate a peer study session planning sheet with the following structure:

{
  "weeklyAbstract": "A concise 2-3 sentence summary of what will be covered this week",
  "learningObjectives": ["objective 1", "objective 2", "objective 3"],
  "questions": [
    {
      "questionText": "The question text",
      "difficulty": "easy|medium|hard",
      "estimatedTime": minutes_as_number,
      "expectedAnswer": "Brief expected answer or key points"
    }
  ],
  "assessmentMethods": [
    {
      "methodName": "Name of assessment method",
      "description": "How to use this method",
      "duration": minutes_as_number
    }
  ],
  "additionalNotes": "Any additional tips or notes for the session lead"
}

**Important Guidelines:**
1. Generate exactly ${customization.numberOfQuestions} questions
2. Follow the specified difficulty distribution
3. Questions should progress from basic understanding to application
4. Assessment methods should check different levels of understanding
5. Ensure all content is relevant to the course materials provided
6. Make questions specific and actionable
7. Provide practical assessment methods that fit within the session duration

Respond ONLY with valid JSON. Do not include any markdown formatting or code blocks.`;
  }

  /**
   * Generate planning with OpenAI (GPT-4)
   */
  private async generateWithOpenAI(prompt: string): Promise<IGeneratedPlanning> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

    const completion = await this.openaiClient.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert educational content creator. Generate peer study planning sheets in JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return this.parseAndValidateResponse(content);
  }

  /**
   * Generate planning with Google Gemini
   */
  private async generateWithGemini(prompt: string): Promise<IGeneratedPlanning> {
    if (!this.geminiClient) {
      throw new Error('Gemini client not initialized');
    }

    const model = this.geminiClient.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(
      prompt + '\n\nRemember: Respond with ONLY valid JSON, no markdown.'
    );

    const response = await result.response;
    const content = response.text();

    if (!content) {
      throw new Error('No content received from Gemini');
    }

    // Remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/g, '');
    }

    return this.parseAndValidateResponse(cleanContent);
  }

  /**
   * Generate planning with Anthropic Claude
   */
  private async generateWithClaude(prompt: string): Promise<IGeneratedPlanning> {
    if (!this.claudeClient) {
      throw new Error('Claude client not initialized');
    }

    const message = await this.claudeClient.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Remove markdown code blocks if present
    let cleanContent = content.text.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```\n?/g, '');
    }

    return this.parseAndValidateResponse(cleanContent);
  }

  /**
   * Parse and validate AI response
   */
  private parseAndValidateResponse(content: string): IGeneratedPlanning {
    try {
      const parsed = JSON.parse(content);

      // Validate required fields
      if (!parsed.weeklyAbstract || typeof parsed.weeklyAbstract !== 'string') {
        throw new Error('Missing or invalid weeklyAbstract');
      }

      if (!Array.isArray(parsed.learningObjectives) || parsed.learningObjectives.length === 0) {
        throw new Error('Missing or invalid learningObjectives');
      }

      if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error('Missing or invalid questions');
      }

      if (!Array.isArray(parsed.assessmentMethods) || parsed.assessmentMethods.length === 0) {
        throw new Error('Missing or invalid assessmentMethods');
      }

      // Validate each question
      parsed.questions.forEach((q: any, idx: number) => {
        if (!q.questionText || !q.difficulty || typeof q.estimatedTime !== 'number') {
          throw new Error(`Invalid question at index ${idx}`);
        }
      });

      // Validate each assessment method
      parsed.assessmentMethods.forEach((am: any, idx: number) => {
        if (!am.methodName || !am.description || typeof am.duration !== 'number') {
          throw new Error(`Invalid assessment method at index ${idx}`);
        }
      });

      return parsed as IGeneratedPlanning;
    } catch (error: any) {
      console.error('Failed to parse AI response:', content);
      throw new Error(`Invalid AI response format: ${error.message}`);
    }
  }

  /**
   * Test AI provider connection
   */
  public async testProvider(provider: AIProvider): Promise<boolean> {
    try {
      const testPrompt = 'Respond with: {"status": "ok"}';

      switch (provider) {
        case 'openai':
          if (!this.openaiClient) return false;
          await this.openaiClient.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 10
          });
          return true;

        case 'gemini':
          if (!this.geminiClient) return false;
          const model = this.geminiClient.getGenerativeModel({ model: 'gemini-pro' });
          await model.generateContent(testPrompt);
          return true;

        case 'claude':
          if (!this.claudeClient) return false;
          await this.claudeClient.messages.create({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 10,
            messages: [{ role: 'user', content: testPrompt }]
          });
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error(`Provider ${provider} test failed:`, error);
      return false;
    }
  }
}

export default new AIService();
