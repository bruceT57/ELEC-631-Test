# Quick Start Guide - Peer Study Planning Tool

## 5-Minute Setup

### Step 1: Install Dependencies (1 minute)

```bash
cd peer-study-planner/backend
npm install
```

### Step 2: Configure Environment (2 minutes)

```bash
cp .env.example .env
```

Edit `.env` and add **at least ONE** AI provider API key:

```env
# Choose one or more:
OPENAI_API_KEY=sk-proj-your-key-here
# OR
GEMINI_API_KEY=your-gemini-key-here
# OR
CLAUDE_API_KEY=sk-ant-your-key-here

# Set your MongoDB URI (default works for local)
MONGODB_URI=mongodb://localhost:27017/peer-study-planner

# Generate a random JWT secret
JWT_SECRET=your-random-secret-key-123456
```

**Get API Keys:**
- **OpenAI**: https://platform.openai.com/api-keys (recommended)
- **Gemini**: https://makersuite.google.com/app/apikey
- **Claude**: https://console.anthropic.com/

### Step 3: Start MongoDB (1 minute)

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Step 4: Run the Server (1 minute)

```bash
npm run dev
```

You should see:
```
✓ Peer Study Planner API running on http://localhost:5000
✓ Environment: development
✓ Database: Connected
✓ 1 AI provider(s) configured
```

## Test It Out (10 Minutes)

### 1. Register a Session Lead

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lead@university.edu",
    "password": "securepass123",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "studentId": "SL2024001"
  }'
```

**Save the token from the response!**

### 2. Create a Course

```bash
TOKEN="your-token-here"

curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "courseCode": "CS101",
    "courseName": "Introduction to Programming",
    "semester": "Spring",
    "year": 2024,
    "description": "Fundamentals of programming with Python",
    "sessionFrequency": 2,
    "totalWeeks": 15
  }'
```

**Save the course ID from the response!**

### 3. Upload Sample Course Material

Create a sample text file:

```bash
echo "Week 1: Introduction to Programming

Topics:
- Variables and data types
- Basic input/output
- Conditional statements
- Loops

Key Concepts:
- Variables store data
- if/else for decision making
- for and while loops for repetition

Practice Problems:
1. Write a program to calculate average of 3 numbers
2. Check if a number is even or odd
3. Print multiplication table
" > week1_notes.txt
```

Upload it:

```bash
COURSE_ID="your-course-id-here"

curl -X POST http://localhost:5000/api/materials \
  -H "Authorization: Bearer $TOKEN" \
  -F "courseId=$COURSE_ID" \
  -F "title=Week 1 - Programming Basics" \
  -F "description=Introduction to fundamental concepts" \
  -F "materialType=lecture_notes" \
  -F "weekNumber=1" \
  -F "file=@week1_notes.txt"
```

### 4. Configure AI Generation Settings

```bash
curl -X POST http://localhost:5000/api/settings/course/$COURSE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "preferredAiProvider": "openai",
    "defaultSessionDuration": 90,
    "numberOfQuestions": 5,
    "questionDifficultyMix": {
      "easy": 30,
      "medium": 50,
      "hard": 20
    },
    "assessmentPreferences": [
      "Quick Quiz",
      "Live Coding Exercise",
      "Pair Programming",
      "Code Review"
    ],
    "teachingStyle": "interactive",
    "additionalInstructions": "Focus on hands-on coding examples. Students are beginners, so keep explanations simple."
  }'
```

### 5. Generate Your First Planning Sheet! 🎉

```bash
curl -X POST http://localhost:5000/api/planning/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "courseId": "'$COURSE_ID'",
    "weekNumber": 1,
    "aiProvider": "openai"
  }'
```

**The AI will generate:**
- Weekly abstract summarizing the session
- 3-5 learning objectives
- 5 practice questions (with difficulty and time estimates)
- Assessment methods to check understanding
- Additional notes for the session lead

### 6. View the Generated Planning

```bash
curl -X GET "http://localhost:5000/api/planning/course/$COURSE_ID/week/1" \
  -H "Authorization: Bearer $TOKEN" | json_pp
```

## Example Generated Output

```json
{
  "planning": {
    "weekNumber": 1,
    "weeklyAbstract": "This week introduces fundamental programming concepts including variables, data types, and control structures. Students will learn to write basic Python programs using conditionals and loops.",
    "learningObjectives": [
      "Understand and use different data types in Python",
      "Write programs using if/else conditional statements",
      "Implement loops to solve repetitive tasks",
      "Debug basic syntax errors in Python code"
    ],
    "questions": [
      {
        "questionText": "Write a program that asks for three numbers and prints their average.",
        "difficulty": "easy",
        "estimatedTime": 10,
        "expectedAnswer": "Use input() to get numbers, convert to float, calculate sum/3, print result"
      },
      {
        "questionText": "Create a program that checks if a user's input number is even or odd.",
        "difficulty": "medium",
        "estimatedTime": 15,
        "expectedAnswer": "Use modulo operator (%), if n%2==0 then even, else odd"
      },
      {
        "questionText": "Write a program to print a multiplication table for a given number using a for loop.",
        "difficulty": "medium",
        "estimatedTime": 20,
        "expectedAnswer": "Use for i in range(1,11): print(f'{num} x {i} = {num*i}')"
      }
    ],
    "assessmentMethods": [
      {
        "methodName": "Quick Quiz",
        "description": "5-question multiple choice quiz on data types and syntax",
        "duration": 10
      },
      {
        "methodName": "Live Coding Exercise",
        "description": "Students code along to create a simple calculator program",
        "duration": 20
      },
      {
        "methodName": "Pair Programming",
        "description": "Students work in pairs to solve loop-based challenges",
        "duration": 25
      }
    ],
    "additionalNotes": "Start with simple examples before moving to loops. Have debugging exercises ready for common syntax errors. Encourage peer discussion during pair programming.",
    "aiProvider": "openai",
    "isCustomized": false
  }
}
```

## Try Different AI Providers

### Regenerate with Gemini

```bash
PLANNING_ID="your-planning-id-here"

curl -X POST "http://localhost:5000/api/planning/$PLANNING_ID/regenerate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"aiProvider": "gemini"}'
```

### Regenerate with Claude

```bash
curl -X POST "http://localhost:5000/api/planning/$PLANNING_ID/regenerate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"aiProvider": "claude"}'
```

## Customize the Generated Planning

```bash
curl -X PUT "http://localhost:5000/api/planning/$PLANNING_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "weeklyAbstract": "Updated abstract with more detail...",
    "questions": [
      {
        "questionText": "Your custom question here",
        "difficulty": "hard",
        "estimatedTime": 30,
        "expectedAnswer": "Expected solution..."
      }
    ]
  }'
```

## Tips for Best Results

### 1. Upload Quality Materials
- Include lecture slides, notes, or textbook excerpts
- More detailed materials = better AI generation
- Organize by week number for automatic selection

### 2. Fine-Tune Settings
- Adjust difficulty mix based on your students' level
- Set realistic question counts for your session duration
- Use additionalInstructions for specific requirements

### 3. Iterate
- Generate initial plan
- Review and customize as needed
- Regenerate with different AI if not satisfied

### 4. Weekly Workflow
```bash
# 1. Upload week's materials
curl -F "weekNumber=2" -F "file=@week2.pdf" ...

# 2. Generate planning
curl -d '{"weekNumber": 2}' ...

# 3. Review and customize
curl -X PUT -d '{"additionalNotes": "..."}' ...

# 4. Use in session!
```

## Common Use Cases

### Multiple Sessions Per Week

```json
{
  "sessionFrequency": 2,
  "totalWeeks": 15
}
```

Generate separate plannings:
- Week 1, Session 1 (review/intro)
- Week 1, Session 2 (practice/deep dive)

### Different Course Types

**Math Course:**
```json
{
  "teachingStyle": "problem-solving",
  "assessmentPreferences": ["Whiteboard Work", "Problem Sets", "Peer Explanation"]
}
```

**Literature Course:**
```json
{
  "teachingStyle": "discussion",
  "assessmentPreferences": ["Group Discussion", "Critical Analysis", "Text Interpretation"]
}
```

**Lab Course:**
```json
{
  "teachingStyle": "hands-on",
  "assessmentPreferences": ["Lab Exercise", "Demo", "Troubleshooting Challenge"]
}
```

## Troubleshooting

**"AI provider not configured"**
- Check .env has the API key
- Restart server after adding key
- Verify key is valid

**"Planning sheet already exists"**
- Delete existing: `curl -X DELETE /api/planning/:id`
- Or use regenerate endpoint

**"No course materials found"**
- Upload materials for that week
- Or don't specify weekNumber in materials (uses all)

**Server won't start**
- Check MongoDB is running: `mongosh`
- Check port 5000 is free: `lsof -i :5000`
- Check .env file exists and is valid

## Next Steps

1. **Add More Courses**: Create courses for all subjects you lead
2. **Upload Materials**: Add all your course content
3. **Experiment**: Try different AI providers and settings
4. **Customize**: Edit generated plans to match your style
5. **Iterate**: Regenerate if results aren't perfect

## Advanced Usage

### Batch Upload Materials

```bash
for file in week*.pdf; do
  week=$(echo $file | grep -o '[0-9]\+')
  curl -F "weekNumber=$week" -F "file=@$file" ...
done
```

### Export Planning to JSON

```bash
curl "http://localhost:5000/api/planning/course/$COURSE_ID" \
  -H "Authorization: Bearer $TOKEN" > all_plannings.json
```

### Compare AI Providers

Generate same week with all three:
```bash
# OpenAI
curl -d '{"weekNumber":1,"aiProvider":"openai"}' ... > openai.json

# Gemini
curl -d '{"weekNumber":2,"aiProvider":"gemini"}' ... > gemini.json

# Claude
curl -d '{"weekNumber":3,"aiProvider":"claude"}' ... > claude.json
```

---

**You're all set! Start generating planning sheets and save hours of prep time! 🚀**
