# Complete Setup Guide - End to End

Get the Peer Study Planner running in 10 minutes!

## ✅ What You'll Have

By the end of this guide:
- ✅ Backend API server running
- ✅ Frontend web interface running
- ✅ At least one AI provider configured
- ✅ Database connected
- ✅ Full system ready to use

## 📋 Prerequisites

Before starting, install:
1. **Node.js** (v18+): https://nodejs.org/
2. **MongoDB** (v6+): https://www.mongodb.com/try/download/community
3. **Git**: https://git-scm.com/ (if cloning)

## 🚀 Step-by-Step Setup

### Step 1: Install Backend (3 minutes)

```bash
cd peer-study-planner/backend
npm install
```

Expected output: `added X packages` (takes 1-2 minutes)

### Step 2: Configure Environment (2 minutes)

```bash
# Still in backend directory
cp .env.example .env
```

**Edit `.env` file** and add **at least ONE** AI provider API key:

```env
# Choose ONE (or configure all three):

# Option 1: OpenAI (Recommended - $0.02 per planning)
OPENAI_API_KEY=sk-proj-your-actual-key-here

# Option 2: Gemini (Free tier available)
GEMINI_API_KEY=AIzaSyYour-actual-key-here

# Option 3: Claude ($0.01 per planning)
CLAUDE_API_KEY=sk-ant-your-actual-key-here

# Also set:
JWT_SECRET=your-random-secret-key-123456789
```

**Get API Keys:**
- **OpenAI**: https://platform.openai.com/api-keys
- **Gemini**: https://makersuite.google.com/app/apikey
- **Claude**: https://console.anthropic.com/settings/keys

(See AI_SETUP_GUIDE.md for detailed instructions)

### Step 3: Start MongoDB (1 minute)

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect successfully
# Type "exit" to quit
```

### Step 4: Start Backend (1 minute)

```bash
# In backend directory
npm run dev
```

**Expected output:**
```
✓ MongoDB connected successfully
✓ OpenAI initialized  (or Gemini/Claude)
============================================================
✓ Peer Study Planner API running on http://localhost:5000
✓ Environment: development
✓ Database: Connected
✓ 1 AI provider(s) configured
============================================================
```

**Leave this terminal running!**

### Step 5: Install Frontend (2 minutes)

**Open a NEW terminal window:**

```bash
cd peer-study-planner/frontend
npm install
```

Expected output: `added X packages` (takes 1-2 minutes)

### Step 6: Start Frontend (1 minute)

```bash
# Still in frontend directory
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Leave this terminal running too!**

### Step 7: Test the System! 🎉

1. **Open your browser**: http://localhost:3000
2. **Register an account**:
   - Click "Register here"
   - Fill in your details
   - Student ID can be anything (e.g., "SL001")
3. **You're in!** You should see the dashboard

## 🧪 Quick Test

Let's create your first planning sheet:

### 1. Create a Test Course

On the dashboard:
- Click "Create New Course"
- Fill in:
  ```
  Course Code: TEST101
  Course Name: Test Course
  Semester: Fall
  Year: 2024
  Sessions per Week: 2
  Total Weeks: 15
  ```
- Click "Create Course"

### 2. Upload Sample Material

- Click "Manage Course" on your new course
- Make sure you're on the "Materials" tab
- Create a simple text file on your computer:

**test_week1.txt:**
```
Week 1: Introduction to Testing

Topics:
- Unit testing basics
- Test-driven development
- Writing test cases

Key Concepts:
- Tests verify code correctness
- TDD: write tests before code
- Good tests are isolated and repeatable

Practice:
1. Write a test for a calculator function
2. Implement the function to pass the test
3. Refactor and verify tests still pass
```

- Upload this file:
  - Title: "Week 1 - Testing Basics"
  - Week Number: 1
  - Material Type: Lecture Notes
  - Select your text file
  - Click "Upload Material"

### 3. Generate Planning Sheet

- Click the "Planning Sheets" tab
- Fill in generation form:
  - Week Number: 1
  - AI Provider: (your configured one)
- Click "Generate Planning Sheet"
- **Wait 15-30 seconds**
- You'll see success message!
- Click "View Details" on the generated planning

### 4. Review Your Planning! 🎓

You should see:
- ✅ Weekly Abstract
- ✅ Learning Objectives (3-5 items)
- ✅ Practice Questions (5 questions with difficulties)
- ✅ Assessment Methods
- ✅ Additional Notes

**Congratulations! Your system is working!**

## 🎯 What's Running

You should now have TWO terminal windows:

**Terminal 1 - Backend:**
```
http://localhost:5000
Running the API and AI integration
```

**Terminal 2 - Frontend:**
```
http://localhost:3000
Running the web interface
```

**Keep both running** while using the app.

## 🛑 Stopping the System

When you're done:

**Terminal 1 (Backend):** Press `Ctrl + C`
**Terminal 2 (Frontend):** Press `Ctrl + C`

**Stop MongoDB (optional):**
```bash
# macOS
brew services stop mongodb-community

# Linux
sudo systemctl stop mongod

# Windows
net stop MongoDB
```

## 🔄 Restarting Later

**Terminal 1:**
```bash
cd peer-study-planner/backend
npm run dev
```

**Terminal 2:**
```bash
cd peer-study-planner/frontend
npm run dev
```

Your data persists in MongoDB!

## 🐛 Troubleshooting

### Backend won't start

**"EADDRINUSE: port 5000 already in use"**
```bash
# Kill process on port 5000
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**"MongoDB connection failed"**
```bash
# Check if MongoDB is running
mongosh

# If not, start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows
```

**"AI provider not configured"**
- Check .env file has correct API key
- No spaces or quotes around the key
- Restart backend after editing .env

### Frontend won't start

**"EADDRINUSE: port 3000 already in use"**
```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**"Module not found"**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Generation fails

**"AI provider not configured"**
- Check backend .env has API key
- Restart backend server
- Try different AI provider

**"No course materials found"**
- Upload materials for that week first
- Or use any materials (don't set week number)

**"Rate limit exceeded"**
- Wait a minute and try again
- Free tiers have limits
- Upgrade to paid tier or use different provider

### Page won't load

**"Cannot connect to backend"**
- Ensure backend is running on port 5000
- Check backend terminal for errors
- Try refreshing the page

**Stuck on "Loading..."**
- Check browser console (F12) for errors
- Clear browser cache
- Try incognito/private browsing

## 📚 Next Steps

Now that everything works:

1. **Read FRONTEND_GUIDE.md** - Learn all UI features
2. **Read AI_SETUP_GUIDE.md** - Configure all AI providers
3. **Read QUICKSTART.md** - API usage examples
4. **Create real courses** - Add your actual courses
5. **Upload materials** - Add your syllabus and notes
6. **Customize settings** - Tune AI to your teaching style

## 🎓 Production Deployment

For production use:

### Backend
```bash
# Update .env
NODE_ENV=production
JWT_SECRET=<strong-random-secret>

# Build
npm run build

# Run
npm start
```

### Frontend
```bash
# Build
npm run build

# Serve with nginx or similar
# Files will be in: frontend/dist/
```

### MongoDB
- Use MongoDB Atlas (cloud)
- Or run MongoDB in production mode
- Set up backups!

### Hosting Options
- **Heroku**: Easy deployment
- **AWS**: EC2 + RDS/MongoDB Atlas
- **DigitalOcean**: Droplets + MongoDB
- **Vercel**: Frontend (free tier)
- **Railway**: Full-stack (easy setup)

## 💡 Tips

**Performance:**
- OpenAI: Slower but best quality
- Gemini: Fastest, free tier available
- Claude: Great with long materials

**Cost:**
- Gemini free tier: 60/minute, 1500/day
- OpenAI: ~$0.02 per planning
- Claude: ~$0.01 per planning

**Best Practices:**
- Upload materials weekly as course progresses
- Generate plannings 1-2 days before session
- Customize generated content to match your style
- Save settings per course

## 🆘 Still Having Issues?

1. Check all terminals for error messages
2. Verify Node.js version: `node --version` (should be v18+)
3. Verify MongoDB version: `mongod --version` (should be v6+)
4. Check ports 3000 and 5000 are free
5. Try restarting everything from scratch
6. Check README.md for more details

## ✅ Checklist

Before considering setup complete:

- [ ] Backend starts without errors
- [ ] Frontend opens in browser
- [ ] Can register a new account
- [ ] Can create a course
- [ ] Can upload a material
- [ ] Can generate a planning sheet
- [ ] Can view the generated planning

**All checked? You're ready to go! 🚀**

---

**Happy planning! May your peer study sessions be amazing! 🎉**
