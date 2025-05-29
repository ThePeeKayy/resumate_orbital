# ResuMate Orbital 

General AI application that uses computer vision and LLMs to meet the complex needs of pre-grad/post/grad Interviews

## 1️⃣ Folder Structure

```
resumate_orbital/
├── src/
│   ├── components/
│   │   ├── auth/                 # login stuff
│   │   ├── dashboard/            # personalised CRUD database
│   │   ├── jobs/                 # job tracking/application
│   │   ├── practice/             # starts a mock interview
│   │   ├── profile/              # user personal profile
│   │   └── answers/              # answers of user's past questions
│   ├── context/                  # Helps firebase Auth
│   ├── services/                 # firebase and openai
│   └── utils/                    # helper functions
├── backend/                      # AI connections with Flask
└── scripts/                      # random scripts
```

## 2️⃣ Auth Features

### ForgotPassword.tsx
Allows users to reset password using firebase inbuilt auth
- `handleSubmit()` - sends reset email 
- Basic form with email input
- Shows success message after sending

### Login.tsx  
Main login page where users sign in
- `handleSubmit()` - checks email/password and logs in
- Redirects to dashboard after successful login
- Has link to register page

### Register.tsx
Sign up page for new users  
- `handleSubmit()` - creates new account
- Redirects using functions

### PrivateRoute.tsx
Wrapper that protects pages that need login
- Checks if user is logged in
- Shows loading spinner while checking
- Redirects to login if not authenticated

### ProfileCheck.tsx
Makes sure user completed their profile before accessing features
- `checkProfile()` - checks if profile exists
- Redirects to profile setup if incomplete
- Shows toast message

## 3️⃣ Dashboard 

### Dashboard.tsx
The main page users see after logging in
- `fetchDashboardData()` - loads user data, recent answers, jobs
- `getJobName()` - gets job title from job ID
- `getCategoryBadgeColor()` - returns different colors for question types
- Shows quick actions, recent answers, job stats
- Has cards for different sections

## 4️⃣ Job Tracking System

### JobTracker.tsx
Page that shows all your job applications
- `fetchJobs()` - loads all jobs from database
- Filter jobs by status (drafted, submitted, interviewing, etc)
- Shows statistics like total jobs, how many interviews, etc.
- Each job is displayed as a card

### JobDetail.tsx
Individual job page where you can see/edit details
- `fetchJobData()` - loads job info and related practice answers
- `handleUpdateJob()` - saves changes to job
- `handleDeleteJob()` - deletes job (with confirmation)
- `startPracticeSession()` - starts practice for this specific job
- Can edit job title, company, description, status, notes

### JobForm.tsx
Form to add new job applications
- `handleSubmit()` - creates new job in database
- Form has fields for job title, company, description, status
- Redirects to job detail page after creating

### JobItem.tsx
Small component that displays job info in a card
- `getStatusColor()` - returns color based on job status
- `formatDate()` - formats dates nicely
- Clickable card that goes to job detail page

## 5️⃣ Practice System (Heavily AI Powered portion)

### PracticeSession.tsx
This is where users actually practice interviews - the core component
- `loadSessionData()` - loads the practice session and user profile
- `generateSessionQuestions()` - uses AI to create personalized questions
- `produceFeedback()` - gets AI feedback from local backend (calls DeepSeek model)
- `saveCurrentAnswer()` - saves user's answer with tags
- `handleNextQuestion()` - moves to next question
- `handleTagToggle()` - manages tags for answers
- Questions are generated based on user profile and job requirements
- Users can add custom tags to their answers

### SessionSetup.tsx  
Page where users configure their practice session
- `handleCategoryToggle()` - selects question categories
- `handleJobChange()` - picks job for job-specific practice
- `handleStartSession()` - creates session and navigates to practice
- Users can choose general practice or job-specific
- Can select categories: Motivational, Behavioral, Technical, Personality

## 6️⃣ Profile Management

### Profile.tsx
Shows user profile and allows editing
- `handleBeautifyProfile()` - uses AI to improve profile content
- `handleSubmit()` - saves profile changes
- Shows education, work experience, skills, projects
- Has AI enhancement feature that improves writing
- Shows before/after comparison when AI enhances profile

### ProfileSetup.tsx
Multi-step form for creating/editing full profile
- `handleResumeUpload()` - parses PDF resume and extracts info
- `trackManualInput()` - tracks which fields user manually edited
- `addEducation()`, `addWorkExperience()`, etc. - manages profile sections
- `handleSubmitProfile()` - saves complete profile
- 7 steps: Basic info, Education, Work Experience, Projects, Skills, Extracurriculars, Review
- Can upload PDF resume and AI extracts information automatically
- Has AI beautification feature

## 7️⃣ Answer Library (Check answer quality)

### AnswerLibrary.tsx
Page where users can view and manage all their saved practice answers
- `toggleTagFilter()` - filters answers by tags (include/exclude)
- `toggleFavorite()` - marks answers as favorites
- `regenerateFeedback()` - gets new AI feedback for existing answers
- `handleDeleteAnswer()` - deletes answers
- Advanced filtering by job, category, tags, favorites, search
- Can edit answers inline
- Shows AI feedback for each answer

## 8️⃣ Layout Components

### Layout.tsx
Basic wrapper component that provides consistent layout
- Just wraps pages with navbar and main content area

### Navbar.tsx
Navigation bar at the top
- `checkProfile()` - determines what nav items to show
- `handleLogout()` - logs user out
- `getNavigationItems()` - builds nav menu based on user state
- Shows different options for new vs returning users
- Mobile responsive hamburger menu

## 9️⃣ Flask Backend

### 7B.py
Limited by my RTX4050 so I have to use LoRA and becareful of trainable parameters
- `parse_args()` - handles command line arguments
- `load_data()` - loads and tokenizes training data
- `main()` - runs the training

## 🔟 User Experience

**Flow of intended usage:**
1. User registers → completes profile setup → gets to dashboard
2. User adds job applications and tracks status
3. User starts practice sessions (general or job-specific)
4. AI generates personalized questions based on profile/job
5. User answers questions and gets AI feedback
6. Answers are saved in library with tags
7. User can filter/search/organize their answer library

**Tech Stack:**
- React + TypeScript for frontend
- Firebase for database and auth
- OpenAI API for AI features
- Custom PyTorch model for local AI
- Tailwind for styling because we are more familiar with inline styling

## 1️⃣1️⃣ Getting Started

```bash
# install stuff
npm install

# set up environment variables 

# start the app
npm start

# train custom model using my argparses (optional)
python 7B.py --data_dir ./data
```

## 1️⃣2️⃣ Important Data Types

- `UserProfile` - all user info
- `Job` - job application data  
- `Answer` - saved practice answers
- `Question` - interview questions
- `PracticeSession` - practice session info

## Misc stuff
- The AI feedback system uses both OpenAI API and local DeepSeek model
- Resume parsing works with PDF files
- All data is stored in Firebase Firestore
- The app is optimized for mobile and desktop by using carefully designed Tailwind md: and sm: attributes
- Users can practice with job-specific questions or general interview prep

A lot of features are not optimized but we are mainly facing roadblocks in hardware and not technical blockades
