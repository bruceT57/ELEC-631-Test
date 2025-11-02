import { PlanningSheet, IPlanningSheet, Course, CourseMaterial, CustomizationSettings } from '../models';
import AIService, { AIProvider, IPlanningContext } from './AIService';

/**
 * Planning generation data interface
 */
export interface IPlanningGenerationData {
  courseId: string;
  userId: string;
  weekNumber: number;
  sessionDate?: Date;
  aiProvider?: AIProvider;
  specificMaterialIds?: string[];
}

/**
 * Planning Service class
 */
class PlanningService {
  /**
   * Generate a new planning sheet
   */
  public async generatePlanningSheet(
    data: IPlanningGenerationData
  ): Promise<IPlanningSheet> {
    const { courseId, userId, weekNumber, aiProvider, specificMaterialIds } = data;

    // Check if planning already exists
    const existing = await PlanningSheet.findOne({ courseId, weekNumber });
    if (existing) {
      throw new Error(`Planning sheet for week ${weekNumber} already exists`);
    }

    // Get course information
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    if (course.sessionLeadId.toString() !== userId) {
      throw new Error('Not authorized to generate planning for this course');
    }

    // Get customization settings
    let customization = await CustomizationSettings.findOne({ courseId });

    if (!customization) {
      // Create default customization if not exists
      customization = new CustomizationSettings({
        courseId,
        userId,
        preferredAiProvider: aiProvider || 'openai',
        defaultSessionDuration: 90,
        numberOfQuestions: 5,
        questionDifficultyMix: { easy: 30, medium: 50, hard: 20 },
        assessmentPreferences: ['Quick Quiz', 'Group Discussion', 'Problem Solving'],
        teachingStyle: 'interactive'
      });
      await customization.save();
    }

    // Get course materials
    const materialsQuery: any = { courseId };
    if (specificMaterialIds && specificMaterialIds.length > 0) {
      materialsQuery._id = { $in: specificMaterialIds };
    } else {
      materialsQuery.weekNumber = weekNumber;
    }

    const materials = await CourseMaterial.find(materialsQuery);

    // Prepare context for AI generation
    const context: IPlanningContext = {
      courseCode: course.courseCode,
      courseName: course.courseName,
      weekNumber,
      courseMaterials: materials.map((m) => {
        const textPreview = m.extractedText
          ? m.extractedText.substring(0, 2000)
          : m.description || m.title;
        return `**${m.title}** (${m.materialType}): ${textPreview}`;
      }),
      customization
    };

    // Get previous weeks' topics if available
    const previousPlannings = await PlanningSheet.find({
      courseId,
      weekNumber: { $lt: weekNumber }
    })
      .sort({ weekNumber: -1 })
      .limit(3);

    if (previousPlannings.length > 0) {
      context.previousWeeksTopics = previousPlannings.map((p) => p.weeklyAbstract);
    }

    // Generate planning using AI
    const provider = aiProvider || customization.preferredAiProvider as AIProvider;
    const generatedContent = await AIService.generatePlanning(context, provider);

    // Create planning sheet
    const planningSheet = new PlanningSheet({
      courseId,
      createdBy: userId,
      weekNumber,
      sessionDate: data.sessionDate,
      weeklyAbstract: generatedContent.weeklyAbstract,
      learningObjectives: generatedContent.learningObjectives,
      questions: generatedContent.questions,
      assessmentMethods: generatedContent.assessmentMethods,
      additionalNotes: generatedContent.additionalNotes,
      aiProvider: provider,
      generatedWith: `${provider} AI`,
      isCustomized: false
    });

    await planningSheet.save();
    return planningSheet;
  }

  /**
   * Get planning sheet by week
   */
  public async getPlanningByWeek(
    courseId: string,
    weekNumber: number
  ): Promise<IPlanningSheet | null> {
    return PlanningSheet.findOne({ courseId, weekNumber }).populate('createdBy', '-password');
  }

  /**
   * Get all planning sheets for a course
   */
  public async getAllPlanningsForCourse(courseId: string): Promise<IPlanningSheet[]> {
    return PlanningSheet.find({ courseId })
      .sort({ weekNumber: 1 })
      .populate('createdBy', '-password');
  }

  /**
   * Update planning sheet
   */
  public async updatePlanningSheet(
    planningId: string,
    userId: string,
    updates: Partial<IPlanningSheet>
  ): Promise<IPlanningSheet | null> {
    const planning = await PlanningSheet.findById(planningId);

    if (!planning) {
      throw new Error('Planning sheet not found');
    }

    if (planning.createdBy.toString() !== userId) {
      throw new Error('Not authorized to update this planning sheet');
    }

    // Mark as customized if content is modified
    if (
      updates.weeklyAbstract ||
      updates.learningObjectives ||
      updates.questions ||
      updates.assessmentMethods
    ) {
      updates.isCustomized = true;
    }

    const updated = await PlanningSheet.findByIdAndUpdate(planningId, updates, {
      new: true,
      runValidators: true
    });

    return updated;
  }

  /**
   * Delete planning sheet
   */
  public async deletePlanningSheet(planningId: string, userId: string): Promise<void> {
    const planning = await PlanningSheet.findById(planningId);

    if (!planning) {
      throw new Error('Planning sheet not found');
    }

    if (planning.createdBy.toString() !== userId) {
      throw new Error('Not authorized to delete this planning sheet');
    }

    await PlanningSheet.findByIdAndDelete(planningId);
  }

  /**
   * Regenerate planning sheet
   */
  public async regeneratePlanningSheet(
    planningId: string,
    userId: string,
    aiProvider?: AIProvider
  ): Promise<IPlanningSheet> {
    const existing = await PlanningSheet.findById(planningId);

    if (!existing) {
      throw new Error('Planning sheet not found');
    }

    if (existing.createdBy.toString() !== userId) {
      throw new Error('Not authorized to regenerate this planning sheet');
    }

    // Delete existing and generate new one
    const courseId = existing.courseId.toString();
    const weekNumber = existing.weekNumber;

    await PlanningSheet.findByIdAndDelete(planningId);

    return this.generatePlanningSheet({
      courseId,
      userId,
      weekNumber,
      aiProvider
    });
  }
}

export default new PlanningService();
