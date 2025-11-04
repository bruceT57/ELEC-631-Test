import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Course } from '../../types';
import apiService from '../../services/api';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    semester: 'Fall' as 'Fall' | 'Spring' | 'Summer' | 'Winter',
    year: new Date().getFullYear(),
    description: '',
    sessionFrequency: 2,
    totalWeeks: 15
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { courses } = await apiService.getCourses();
      setCourses(courses);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await apiService.createCourse(formData);
      setShowCreateForm(false);
      setFormData({
        courseCode: '',
        courseName: '',
        semester: 'Fall',
        year: new Date().getFullYear(),
        description: '',
        sessionFrequency: 2,
        totalWeeks: 15
      });
      await loadCourses();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create course');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await apiService.deleteCourse(id);
      await loadCourses();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete course');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Peer Study Planner</h1>
        <div className="user-info">
          <span>Welcome, {user?.firstName} {user?.lastName}!</span>
          <button onClick={logout} className="btn-secondary">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <h2>My Courses</h2>
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
            {showCreateForm ? 'Cancel' : 'Create New Course'}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-form-card">
            <h3>Create New Course</h3>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Course Code</label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    placeholder="e.g., CS101"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Course Name</label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                    placeholder="e.g., Introduction to Programming"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Semester</label>
                  <select name="semester" value={formData.semester} onChange={handleChange}>
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Winter">Winter</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="2020"
                    max="2030"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of the course"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sessions per Week</label>
                  <input
                    type="number"
                    name="sessionFrequency"
                    value={formData.sessionFrequency}
                    onChange={handleChange}
                    min="1"
                    max="7"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Weeks</label>
                  <input
                    type="number"
                    name="totalWeeks"
                    value={formData.totalWeeks}
                    onChange={handleChange}
                    min="1"
                    max="52"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary">Create Course</button>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <h3>No courses yet</h3>
            <p>Create your first course to start generating planning sheets!</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-header">
                  <h3>{course.courseCode}</h3>
                  <span className="semester-badge">{course.semester} {course.year}</span>
                </div>
                <h4>{course.courseName}</h4>
                {course.description && <p className="course-description">{course.description}</p>}
                <div className="course-stats">
                  <span>{course.sessionFrequency}x per week</span>
                  <span>{course.totalWeeks} weeks</span>
                </div>
                <div className="course-actions">
                  <button
                    onClick={() => navigate(`/course/${course._id}`)}
                    className="btn-primary"
                  >
                    Manage Course
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
