import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, CourseMaterial, PlanningSheet, CustomizationSettings } from '../../types';
import apiService from '../../services/api';
import './Sessions.css';

const CourseView: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [plannings, setPlannings] = useState<PlanningSheet[]>([]);
  const [settings, setSettings] = useState<CustomizationSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'materials' | 'planning' | 'settings'>('materials');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    materialType: 'lecture_notes' as const,
    weekNumber: 1
  });

  // Generation form state
  const [genData, setGenData] = useState({
    weekNumber: 1,
    aiProvider: 'openai' as 'openai' | 'gemini' | 'claude'
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  const loadCourseData = async () => {
    if (!courseId) return;

    try {
      const [courseRes, materialsRes, planningsRes, settingsRes] = await Promise.all([
        apiService.getCourse(courseId),
        apiService.getMaterials(courseId),
        apiService.getAllPlannings(courseId),
        apiService.getSettings(courseId)
      ]);

      setCourse(courseRes.course);
      setMaterials(materialsRes.materials);
      setPlannings(planningsRes.plannings);
      setSettings(settingsRes.settings);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !courseId) return;

    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('courseId', courseId);
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('materialType', uploadData.materialType);
    formData.append('weekNumber', uploadData.weekNumber.toString());

    try {
      await apiService.uploadMaterial(formData);
      setSuccess('Material uploaded successfully!');
      setUploadFile(null);
      setUploadData({ title: '', description: '', materialType: 'lecture_notes', weekNumber: 1 });
      await loadCourseData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload material');
    }
  };

  const handleGeneratePlanning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    setError('');
    setSuccess('');
    setGenerating(true);

    try {
      await apiService.generatePlanning({
        courseId,
        ...genData
      });
      setSuccess('Planning sheet generated successfully!');
      await loadCourseData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate planning');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!window.confirm('Delete this material?')) return;

    try {
      await apiService.deleteMaterial(id);
      await loadCourseData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete material');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !settings) return;

    setError('');
    setSuccess('');

    try {
      await apiService.saveSettings(courseId, settings);
      setSuccess('Settings saved successfully!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save settings');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!course) return <div className="error">Course not found</div>;

  return (
    <div className="course-view">
      <div className="course-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">← Back</button>
        <div>
          <h1>{course.courseCode} - {course.courseName}</h1>
          <p>{course.semester} {course.year}</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="tabs">
        <button
          className={activeTab === 'materials' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('materials')}
        >
          Materials ({materials.length})
        </button>
        <button
          className={activeTab === 'planning' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('planning')}
        >
          Planning Sheets ({plannings.length})
        </button>
        <button
          className={activeTab === 'settings' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'materials' && (
          <div>
            <div className="upload-section">
              <h3>Upload Course Material</h3>
              <form onSubmit={handleUploadSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Week Number</label>
                    <input
                      type="number"
                      value={uploadData.weekNumber}
                      onChange={(e) => setUploadData({ ...uploadData, weekNumber: parseInt(e.target.value) })}
                      min="1"
                      max={course.totalWeeks}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Material Type</label>
                  <select
                    value={uploadData.materialType}
                    onChange={(e) => setUploadData({ ...uploadData, materialType: e.target.value as any })}
                  >
                    <option value="syllabus">Syllabus</option>
                    <option value="lecture_notes">Lecture Notes</option>
                    <option value="textbook">Textbook</option>
                    <option value="slides">Slides</option>
                    <option value="assignments">Assignments</option>
                    <option value="exams">Exams</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>File (PDF, Word, or Text)</label>
                  <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" required />
                </div>
                <button type="submit" className="btn-primary" disabled={!uploadFile}>
                  Upload Material
                </button>
              </form>
            </div>

            <div className="materials-list">
              <h3>Uploaded Materials</h3>
              {materials.length === 0 ? (
                <p className="empty">No materials uploaded yet</p>
              ) : (
                <div className="materials-grid">
                  {materials.map((material) => (
                    <div key={material._id} className="material-card">
                      <div className="material-header">
                        <h4>{material.title}</h4>
                        <span className="week-badge">Week {material.weekNumber}</span>
                      </div>
                      <p className="material-type">{material.materialType.replace('_', ' ')}</p>
                      {material.description && <p className="material-desc">{material.description}</p>}
                      <div className="material-footer">
                        <span className="file-name">{material.fileName}</span>
                        <button onClick={() => handleDeleteMaterial(material._id)} className="btn-delete">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'planning' && (
          <div>
            <div className="generate-section">
              <h3>Generate Planning Sheet</h3>
              <form onSubmit={handleGeneratePlanning}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Week Number</label>
                    <input
                      type="number"
                      value={genData.weekNumber}
                      onChange={(e) => setGenData({ ...genData, weekNumber: parseInt(e.target.value) })}
                      min="1"
                      max={course.totalWeeks}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>AI Provider</label>
                    <select
                      value={genData.aiProvider}
                      onChange={(e) => setGenData({ ...genData, aiProvider: e.target.value as any })}
                    >
                      <option value="openai">OpenAI (GPT-4)</option>
                      <option value="gemini">Google Gemini</option>
                      <option value="claude">Anthropic Claude</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary" disabled={generating}>
                  {generating ? 'Generating...' : 'Generate Planning Sheet'}
                </button>
              </form>
            </div>

            <div className="plannings-list">
              <h3>Generated Planning Sheets</h3>
              {plannings.length === 0 ? (
                <p className="empty">No planning sheets generated yet</p>
              ) : (
                <div className="plannings-grid">
                  {plannings.map((planning) => (
                    <div key={planning._id} className="planning-card">
                      <div className="planning-header">
                        <h4>Week {planning.weekNumber}</h4>
                        <span className="ai-badge">{planning.aiProvider}</span>
                      </div>
                      <p className="planning-abstract">{planning.weeklyAbstract}</p>
                      <div className="planning-stats">
                        <span>{planning.learningObjectives.length} objectives</span>
                        <span>{planning.questions.length} questions</span>
                        <span>{planning.assessmentMethods.length} assessments</span>
                      </div>
                      <button
                        onClick={() => navigate(`/planning/${planning._id}`)}
                        className="btn-primary"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h3>Customization Settings</h3>
            <form onSubmit={handleSaveSettings}>
              <div className="form-group">
                <label>Preferred AI Provider</label>
                <select
                  value={settings?.preferredAiProvider || 'openai'}
                  onChange={(e) => setSettings({ ...settings!, preferredAiProvider: e.target.value as any })}
                >
                  <option value="openai">OpenAI (GPT-4)</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="claude">Anthropic Claude</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Session Duration (minutes)</label>
                  <input
                    type="number"
                    value={settings?.defaultSessionDuration || 90}
                    onChange={(e) => setSettings({ ...settings!, defaultSessionDuration: parseInt(e.target.value) })}
                    min="30"
                    max="240"
                  />
                </div>
                <div className="form-group">
                  <label>Number of Questions</label>
                  <input
                    type="number"
                    value={settings?.numberOfQuestions || 5}
                    onChange={(e) => setSettings({ ...settings!, numberOfQuestions: parseInt(e.target.value) })}
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Difficulty Distribution (%)</label>
                <div className="difficulty-inputs">
                  <div>
                    <label>Easy</label>
                    <input
                      type="number"
                      value={settings?.questionDifficultyMix.easy || 30}
                      onChange={(e) => setSettings({
                        ...settings!,
                        questionDifficultyMix: { ...settings!.questionDifficultyMix, easy: parseInt(e.target.value) }
                      })}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label>Medium</label>
                    <input
                      type="number"
                      value={settings?.questionDifficultyMix.medium || 50}
                      onChange={(e) => setSettings({
                        ...settings!,
                        questionDifficultyMix: { ...settings!.questionDifficultyMix, medium: parseInt(e.target.value) }
                      })}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label>Hard</label>
                    <input
                      type="number"
                      value={settings?.questionDifficultyMix.hard || 20}
                      onChange={(e) => setSettings({
                        ...settings!,
                        questionDifficultyMix: { ...settings!.questionDifficultyMix, hard: parseInt(e.target.value) }
                      })}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Teaching Style</label>
                <select
                  value={settings?.teachingStyle || 'interactive'}
                  onChange={(e) => setSettings({ ...settings!, teachingStyle: e.target.value as any })}
                >
                  <option value="interactive">Interactive</option>
                  <option value="lecture">Lecture</option>
                  <option value="discussion">Discussion</option>
                  <option value="problem-solving">Problem Solving</option>
                  <option value="collaborative">Collaborative</option>
                </select>
              </div>

              <div className="form-group">
                <label>Additional Instructions for AI</label>
                <textarea
                  value={settings?.additionalInstructions || ''}
                  onChange={(e) => setSettings({ ...settings!, additionalInstructions: e.target.value })}
                  rows={4}
                  placeholder="e.g., Focus on practical examples, use simple language for beginners..."
                />
              </div>

              <button type="submit" className="btn-primary">Save Settings</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseView;
