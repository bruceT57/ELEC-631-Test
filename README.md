# Peer Study Planning Tool

An AI-powered tool for peer study session leaders to generate weekly session planning sheets using ChatGPT (OpenAI), Google Gemini, or Claude AI.

## Overview

This tool helps university peer study session leaders create comprehensive weekly planning sheets by:
- Uploading course materials (PDFs, Word documents, text files)
- Generating AI-powered session plans with learning objectives, questions, and assessment methods
- Customizing AI generation based on teaching style and preferences
- Supporting multiple AI providers (OpenAI, Gemini, Claude)

## Features

### Core Features
- **Multi-AI Provider Support**: Choose between OpenAI (GPT-4), Google Gemini, or Anthropic Claude
- **Course Material Upload**: Upload and process PDFs, Word docs, and text files
- **Automatic Text Extraction**: Extract text from uploaded documents for AI analysis
- **AI-Generated Planning Sheets**: Create comprehensive session plans including:
  - Weekly abstract
  - Learning objectives
  - Practice questions (with difficulty levels)
  - Assessment methods
  - Additional notes
- **Customization Settings**: Fine-tune AI generation with:
  - Preferred AI provider
  - Session duration
  - Number of questions
  - Difficulty distribution (easy/medium/hard)
  - Teaching style
  - Custom instructions
- **Week-Specific Materials**: Organize materials by week number
- **Planning History**: View and manage all generated planning sheets
- **Regeneration**: Regenerate plans with different AI providers

### User Features
- Secure authentication
- Multiple courses per session leader
- Semester-based course organization
- Material management
- Planning sheet customization and editing

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **AI Integration**:
  - OpenAI SDK (GPT-4 Turbo)
  - Google Generative AI SDK (Gemini Pro)
  - Anthropic SDK (Claude 3 Sonnet)
- **File Processing**:
  - pdf-parse (PDF extraction)
  - mammoth (Word document extraction)
- **File Upload**: Multer

### Frontend (if implemented)
- React 18 with TypeScript
- Axios for API calls
- React Router for navigation

## Project Structure

```
peer-study-planner/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── models/          # Mongoose models
│   │   ├── services/        # Business logic
│   │   │   ├── AIService.ts         # Multi-provider AI integration
│   │   │   ├── AuthService.ts       # Authentication
│   │   │   ├── PlanningService.ts   # Planning generation
│   │   │   └── FileProcessingService.ts
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   └── index.ts         # Entry point
│   ├── uploads/             # Uploaded files storage
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React frontend (optional)
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- At least ONE AI provider API key:
  - OpenAI API key (recommended)
  - Google Gemini API key
  - Anthropic Claude API key

### 1. Install Dependencies

```bash
cd peer-study-planner/backend
npm install
```

### 2. Configure Environment Variables

Create `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/peer-study-planner
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# AI Provider API Keys (configure at least one)
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
CLAUDE_API_KEY=sk-ant-...

# Default AI Provider (openai, gemini, or claude)
DEFAULT_AI_PROVIDER=openai

# File Upload Settings
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### 3. Obtain AI Provider API Keys

#### OpenAI (ChatGPT)
1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key and add to `.env` as `OPENAI_API_KEY`

#### Google Gemini
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API key"
4. Copy the key and add to `.env` as `GEMINI_API_KEY`

#### Anthropic Claude
1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys section
4. Generate a new API key
5. Copy the key and add to `.env` as `CLAUDE_API_KEY`

### 4. Start MongoDB

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Run the Application

**Development mode:**
```bash
cd backend
npm run dev
```

**Production mode:**
```bash
cd backend
npm run build
npm start
```

### 6. Test the API

```bash
curl http://localhost:5000/health
```

You should see: `{"status":"OK","timestamp":"..."}`

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "session.lead@university.edu",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "studentId": "STU12345"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "session.lead@university.edu",
  "password": "securepassword123"
}
```

Returns:
```json
{
  "message": "Login successful",
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Courses

#### Create Course
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseCode": "CS101",
  "courseName": "Introduction to Computer Science",
  "semester": "Fall",
  "year": 2024,
  "description": "Fundamental concepts of CS",
  "sessionFrequency": 2,
  "totalWeeks": 15
}
```

#### Get All Courses
```http
GET /api/courses
Authorization: Bearer <token>
```

#### Get Course by ID
```http
GET /api/courses/:id
Authorization: Bearer <token>
```

#### Update Course
```http
PUT /api/courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description"
}
```

#### Delete Course
```http
DELETE /api/courses/:id
Authorization: Bearer <token>
```

### Course Materials

#### Upload Material
```http
POST /api/materials
Authorization: Bearer <token>
Content-Type: multipart/form-data

courseId: <course-id>
title: Week 1 Lecture Notes
description: Introduction to algorithms
materialType: lecture_notes
weekNumber: 1
file: <file>
```

**Supported file types:**
- PDF (`.pdf`)
- Word documents (`.docx`, `.doc`)
- Text files (`.txt`)

#### Get Materials for Course
```http
GET /api/materials/course/:courseId
Authorization: Bearer <token>
```

#### Delete Material
```http
DELETE /api/materials/:id
Authorization: Bearer <token>
```

### Planning Sheets

#### Generate Planning Sheet
```http
POST /api/planning/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course-id",
  "weekNumber": 1,
  "aiProvider": "openai",
  "sessionDate": "2024-02-15T14:00:00Z",
  "specificMaterialIds": ["material-id-1", "material-id-2"]
}
```

**Parameters:**
- `courseId` (required): ID of the course
- `weekNumber` (required): Week number (1-52)
- `aiProvider` (optional): "openai", "gemini", or "claude"
- `sessionDate` (optional): Date of the session
- `specificMaterialIds` (optional): Specific materials to use

**Response:**
```json
{
  "message": "Planning sheet generated successfully",
  "planning": {
    "_id": "...",
    "weekNumber": 1,
    "weeklyAbstract": "This week focuses on...",
    "learningObjectives": ["Understand...", "Apply..."],
    "questions": [
      {
        "questionText": "What is...",
        "difficulty": "easy",
        "estimatedTime": 10,
        "expectedAnswer": "..."
      }
    ],
    "assessmentMethods": [
      {
        "methodName": "Quick Quiz",
        "description": "5-minute quiz",
        "duration": 5
      }
    ],
    "additionalNotes": "...",
    "aiProvider": "openai",
    "isCustomized": false,
    "createdAt": "..."
  }
}
```

#### Get Planning for Week
```http
GET /api/planning/course/:courseId/week/:weekNumber
Authorization: Bearer <token>
```

#### Get All Plannings for Course
```http
GET /api/planning/course/:courseId
Authorization: Bearer <token>
```

#### Update Planning
```http
PUT /api/planning/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "weeklyAbstract": "Updated abstract...",
  "questions": [...]
}
```

#### Regenerate Planning
```http
POST /api/planning/:id/regenerate
Authorization: Bearer <token>
Content-Type: application/json

{
  "aiProvider": "claude"
}
```

#### Delete Planning
```http
DELETE /api/planning/:id
Authorization: Bearer <token>
```

### Customization Settings

#### Get Settings for Course
```http
GET /api/settings/course/:courseId
Authorization: Bearer <token>
```

#### Create/Update Settings
```http
POST /api/settings/course/:courseId
Authorization: Bearer <token>
Content-Type: application/json

{
  "preferredAiProvider": "openai",
  "defaultSessionDuration": 90,
  "numberOfQuestions": 5,
  "questionDifficultyMix": {
    "easy": 30,
    "medium": 50,
    "hard": 20
  },
  "assessmentPreferences": ["Quick Quiz", "Group Discussion", "Problem Solving"],
  "teachingStyle": "interactive",
  "additionalInstructions": "Focus on practical examples"
}
```

## Usage Guide

### 1. Register and Login

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lead@university.edu",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Smith",
    "studentId": "STU001"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lead@university.edu",
    "password": "password123"
  }'
```

Save the token from the response.

### 2. Create a Course

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "courseCode": "MATH201",
    "courseName": "Calculus II",
    "semester": "Spring",
    "year": 2024,
    "sessionFrequency": 2,
    "totalWeeks": 15
  }'
```

### 3. Upload Course Materials

```bash
curl -X POST http://localhost:5000/api/materials \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "courseId=COURSE_ID" \
  -F "title=Week 1 - Integration Basics" \
  -F "materialType=lecture_notes" \
  -F "weekNumber=1" \
  -F "file=@/path/to/lecture1.pdf"
```

### 4. Configure Customization Settings

```bash
curl -X POST http://localhost:5000/api/settings/course/COURSE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "preferredAiProvider": "openai",
    "numberOfQuestions": 7,
    "questionDifficultyMix": {
      "easy": 20,
      "medium": 60,
      "hard": 20
    },
    "teachingStyle": "problem-solving"
  }'
```

### 5. Generate Planning Sheet

```bash
curl -X POST http://localhost:5000/api/planning/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "courseId": "COURSE_ID",
    "weekNumber": 1,
    "aiProvider": "openai"
  }'
```

### 6. View Generated Planning

```bash
curl -X GET http://localhost:5000/api/planning/course/COURSE_ID/week/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## AI Provider Comparison

| Feature | OpenAI (GPT-4) | Google Gemini | Claude |
|---------|----------------|---------------|---------|
| **Cost** | $$ | $ | $$ |
| **Speed** | Fast | Very Fast | Fast |
| **Quality** | Excellent | Good | Excellent |
| **Context** | 128K tokens | 32K tokens | 200K tokens |
| **JSON Mode** | Yes | Partial | No (manual) |
| **Best For** | Structured output | Quick generation | Long documents |

**Recommendation**: Start with OpenAI (GPT-4) for best results, or use Gemini for faster/cheaper generation.

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### AI Provider Errors

**OpenAI "Insufficient Quota"**:
- Check your OpenAI account billing
- Verify API key is correct
- Try a different provider

**Gemini "API Key Invalid"**:
- Ensure API key is from Google AI Studio
- Check for trailing spaces in .env file

**Claude "Authentication Error"**:
- Verify API key format starts with `sk-ant-`
- Check Anthropic console for key status

### File Upload Issues

**"Unsupported file type"**:
- Only PDF, DOCX, DOC, and TXT files are supported
- Check file MIME type

**"File too large"**:
- Default limit is 10MB
- Increase `MAX_FILE_SIZE` in .env

### Planning Generation Fails

**"No course materials found"**:
- Upload materials for the specific week
- Or specify `specificMaterialIds` in the request

**"Invalid AI response format"**:
- AI provider returned unexpected format
- Try regenerating with a different provider
- Check if API key has sufficient credits

## Database Schema

### User
```typescript
{
  email: string;
  password: string;        // hashed
  firstName: string;
  lastName: string;
  studentId: string;
}
```

### Course
```typescript
{
  sessionLeadId: ObjectId;
  courseCode: string;
  courseName: string;
  semester: 'Fall' | 'Spring' | 'Summer' | 'Winter';
  year: number;
  description?: string;
  sessionFrequency: number;  // sessions per week
  totalWeeks: number;
}
```

### CourseMaterial
```typescript
{
  courseId: ObjectId;
  uploadedBy: ObjectId;
  title: string;
  materialType: 'syllabus' | 'lecture_notes' | 'textbook' | 'slides' | 'assignments' | 'exams' | 'other';
  fileName: string;
  filePath: string;
  extractedText?: string;
  weekNumber?: number;
}
```

### PlanningSheet
```typescript
{
  courseId: ObjectId;
  createdBy: ObjectId;
  weekNumber: number;
  weeklyAbstract: string;
  learningObjectives: string[];
  questions: Question[];
  assessmentMethods: AssessmentMethod[];
  aiProvider: 'openai' | 'gemini' | 'claude';
  isCustomized: boolean;
}
```

### CustomizationSettings
```typescript
{
  courseId: ObjectId;
  userId: ObjectId;
  preferredAiProvider: 'openai' | 'gemini' | 'claude';
  defaultSessionDuration: number;
  numberOfQuestions: number;
  questionDifficultyMix: {
    easy: number;
    medium: number;
    hard: number;
  };
  assessmentPreferences: string[];
  teachingStyle: string;
  additionalInstructions?: string;
}
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation on all endpoints
- File type validation
- File size limits
- Authorization checks

## Performance Optimizations

- MongoDB indexing on frequently queried fields
- Text extraction caching in database
- Efficient file storage
- Connection pooling

## License

MIT License

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in server logs
3. Verify all environment variables are set correctly
4. Ensure at least one AI provider is configured

---

**Built with modern web technologies and AI integration**
