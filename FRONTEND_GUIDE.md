# Frontend User Guide

Complete guide to using the Peer Study Planner web interface.

## Getting Started

### Installation

```bash
cd peer-study-planner/frontend
npm install
```

### Running the Frontend

```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

Make sure the backend is running on port 5000 before starting the frontend.

## User Interface Overview

### 1. Authentication

#### Register
- Navigate to http://localhost:3000
- Click "Register here"
- Fill in:
  - First Name & Last Name
  - Student ID (your university ID)
  - Email address
  - Password (min 6 characters)
- Click "Register"
- You'll be automatically logged in and redirected to the dashboard

#### Login
- Navigate to http://localhost:3000
- Enter your email and password
- Click "Login"
- You'll be redirected to your dashboard

### 2. Dashboard

The dashboard is your main hub showing all your courses.

#### Create a New Course
1. Click "Create New Course" button
2. Fill in the form:
   - **Course Code**: e.g., "CS101", "MATH201"
   - **Course Name**: Full course title
   - **Semester**: Fall, Spring, Summer, or Winter
   - **Year**: Current or upcoming year
   - **Description**: Brief course description (optional)
   - **Sessions per Week**: How many peer study sessions (default: 2)
   - **Total Weeks**: Course duration (default: 15)
3. Click "Create Course"

#### Manage Courses
- **View Course**: Click "Manage Course" to access course details
- **Delete Course**: Click "Delete" (will ask for confirmation)

### 3. Course Management

Click on any course to access three main tabs:

#### Tab 1: Materials

**Upload Course Materials:**
1. Fill in the upload form:
   - **Title**: Descriptive name for the material
   - **Week Number**: Which week this material covers (1-52)
   - **Material Type**: Select from dropdown:
     - Syllabus
     - Lecture Notes
     - Textbook
     - Slides
     - Assignments
     - Exams
     - Other
   - **Description**: Optional details
   - **File**: Choose PDF, Word doc, or text file
2. Click "Upload Material"

**Supported File Types:**
- PDF (.pdf)
- Word documents (.docx, .doc)
- Text files (.txt)

**Material Features:**
- Text is automatically extracted from documents
- Organized by week number
- Easy to delete materials you no longer need

#### Tab 2: Planning Sheets

**Generate a Planning Sheet:**
1. Fill in the generation form:
   - **Week Number**: Week to generate for
   - **AI Provider**: Choose your AI:
     - OpenAI (GPT-4) - Most reliable
     - Google Gemini - Fast and free
     - Anthropic Claude - Best for long materials
2. Click "Generate Planning Sheet"
3. Wait 10-30 seconds for AI to generate

**Generated Planning Includes:**
- **Weekly Abstract**: Summary of the session
- **Learning Objectives**: 3-5 clear goals
- **Practice Questions**: With difficulty levels and time estimates
- **Assessment Methods**: Ways to check understanding
- **Additional Notes**: Tips for session leads

**View Planning Details:**
- Click "View Details" on any planning card
- See full formatted planning sheet
- Print or export for use in your session

**Planning Actions:**
- **Regenerate**: Create a new version with different AI
- **Print**: Print-friendly format for handouts
- **Edit**: Customize any part of the generated content

#### Tab 3: Settings

Customize how AI generates your planning sheets:

**AI Provider Settings:**
- **Preferred AI Provider**: Default AI to use
- Choose based on:
  - OpenAI: Best quality
  - Gemini: Free tier available
  - Claude: Best with long documents

**Session Configuration:**
- **Session Duration**: Minutes (30-240)
  - Affects how much content is generated
  - Influences question complexity
- **Number of Questions**: How many practice questions (1-20)
  - More questions = longer session prep time
  - AI distributes across difficulty levels

**Difficulty Distribution:**
Set the percentage mix:
- **Easy**: % of easy questions (0-100)
- **Medium**: % of medium questions (0-100)
- **Hard**: % of hard questions (0-100)

*Example:* 30% easy, 50% medium, 20% hard

**Teaching Style:**
Select your preferred approach:
- **Interactive**: Back-and-forth with students
- **Lecture**: More structured presentation
- **Discussion**: Student-led conversations
- **Problem Solving**: Focus on working through problems
- **Collaborative**: Group work emphasis

**Additional Instructions:**
- Free-form text field
- Give specific directions to the AI
- Examples:
  - "Focus on practical coding examples"
  - "Use simple language for beginners"
  - "Include real-world applications"
  - "Emphasize conceptual understanding"

Click "Save Settings" to apply changes to future generations.

## Typical Workflow

### Week-by-Week Planning

**Week 1: Setup**
1. Register/Login
2. Create course
3. Upload syllabus and Week 1 materials
4. Configure settings for your teaching style
5. Generate Week 1 planning sheet

**Week 2-15: Ongoing**
1. Upload materials for upcoming week
2. Generate planning sheet
3. Review and customize if needed
4. Print or export for your session
5. Use during peer study session

### Before Each Session
1. Log in to dashboard
2. Open your course
3. Go to Planning Sheets tab
4. Find the week's planning
5. Click "View Details"
6. Review the generated content
7. Print or keep open on your device
8. Use as a guide during your session

### After Trying Different AI Providers
1. Generate planning with OpenAI
2. If not satisfied, click "Regenerate"
3. Choose a different provider (Gemini or Claude)
4. Compare results
5. Use the best version

## Tips for Best Results

### 1. Upload Quality Materials
- **More is better**: Upload slides, notes, textbook excerpts
- **Organize by week**: Helps AI find relevant content
- **Include context**: Add descriptions to materials
- **Keep updated**: Upload new materials as available

### 2. Fine-Tune Settings
- **Start with defaults**: Test before customizing
- **Adjust based on students**: Change difficulty mix for class level
- **Update instructions**: Add specific needs as you discover them
- **Experiment with AI providers**: Each has strengths

### 3. Customize Generated Content
- AI provides a great starting point
- Edit questions to match your style
- Add your own examples
- Adjust time estimates based on experience

### 4. Build a Library
- Generate all weeks at once if materials ready
- Keep previous weeks' plannings
- Reuse successful formats
- Learn what works with your students

## Troubleshooting

### Can't Upload File
- Check file size (max 10MB)
- Verify file type (PDF, DOC, DOCX, TXT only)
- Try a different browser
- Check internet connection

### Generation Fails
- **Error: "AI provider not configured"**
  - Backend needs API key in .env
  - Check backend console for errors
  - Try different AI provider

- **Error: "No course materials found"**
  - Upload materials for that week first
  - Or materials with no week number (uses all)

- **Error: "Planning sheet already exists"**
  - Delete existing planning first
  - Or use regenerate instead

### Planning Sheet Looks Odd
- Try regenerating with different AI
- Check your settings (might be too extreme)
- Ensure materials are relevant to week
- Add more specific instructions in settings

### Session Times Don't Match
- Update "Session Duration" in settings
- Regenerate planning sheets
- AI will adjust question count and timing

### Questions Too Easy/Hard
- Adjust difficulty distribution in settings
- Regenerate planning sheet
- Consider your student level when setting percentages

## Keyboard Shortcuts

- **Ctrl/Cmd + P**: Print current planning sheet
- **Esc**: Close modals/forms
- **Tab**: Navigate between form fields

## Browser Compatibility

**Fully Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features by Browser:**
- **File Upload**: All browsers
- **Print**: All browsers
- **PDF Viewing**: Chrome, Firefox, Edge (native)

## Mobile Experience

The interface is responsive and works on mobile devices:

**Phone (Portrait):**
- Optimized single-column layout
- Touch-friendly buttons
- Simplified navigation

**Tablet:**
- Two-column layout where appropriate
- Better for reviewing materials
- Easier for editing

**Best Experience:**
- Desktop/Laptop for creating and uploading
- Tablet for reviewing during sessions
- Mobile for quick checks on-the-go

## Data & Privacy

**What's Stored:**
- Your account information (email, name, student ID)
- Course details you create
- Uploaded materials (files and extracted text)
- Generated planning sheets
- Your customization settings

**What's Sent to AI:**
- Course materials (text extracted from files)
- Your customization preferences
- Course/week context
- **NOT sent**: Personal information, passwords, emails

**Data Security:**
- Passwords are hashed (not stored in plain text)
- JWT token authentication
- Files stored on server (not shared)
- AI providers process content per their privacy policies

**Deleting Data:**
- Delete materials: Removes from database and server
- Delete course: Removes all associated data
- Delete account: Not yet implemented (contact admin)

## Advanced Usage

### Batch Generation
1. Upload all materials at once
2. Set week numbers appropriately
3. Generate plannings for multiple weeks
4. Review and customize as needed

### Compare AI Outputs
1. Generate Week 1 with OpenAI
2. Generate Week 2 with Gemini
3. Generate Week 3 with Claude
4. Note which style you prefer
5. Set as default in settings

### Reusing Past Plannings
1. View previous semester's plannings
2. Note successful patterns
3. Use similar settings for new course
4. Copy good questions/assessments manually

### Team Teaching
1. Share course code and login
2. Multiple leads can access same course
3. Coordinate who generates which weeks
4. Each can customize their approach

## Feedback & Support

**Found a Bug?**
- Note what you were doing
- Check browser console (F12)
- Check if backend is running
- Report with reproduction steps

**Feature Request?**
- Note what you'd like to see
- Explain the use case
- Suggest how it would work

**AI Generated Weird Content?**
- Try a different AI provider
- Add more specific instructions in settings
- Check if uploaded materials are relevant
- Sometimes regenerating fixes it

## Future Features (Roadmap)

- **Export Planning Sheets**: PDF, Word, Markdown
- **Template Library**: Pre-made settings for common courses
- **Collaboration**: Share courses with co-leads
- **Analytics**: Track which questions work best
- **Mobile App**: Native iOS/Android apps
- **Offline Mode**: Work without internet

---

**Ready to create amazing peer study sessions! 🎓**
