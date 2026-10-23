# Inclulearn
# IncluLearn – Inclusive E-Learning Platform

## 📌 About the Project

IncluLearn is an inclusive e-learning platform designed to make online education more accessible to students with different disabilities. The platform adapts its interface and learning interactions according to users' accessibility needs, helping them learn more independently.

It provides accessible learning materials, interactive quizzes, progress tracking, voice-based navigation, and other features to support an inclusive learning experience.

## 🎯 Objectives

- Make online education more accessible and inclusive.
- Provide a personalized learning experience based on accessibility preferences.
- Support independent navigation and learning.
- Help learners access courses, quizzes, and learning resources in one place.

## ✨ Features

- **User Authentication:** Sign-up and login functionality.
- **Disability-Based UI Adaptation:** Adapts the interface to different accessibility needs.
- **Voice Navigation:** Supports voice-based interaction where available.
- **Text-to-Speech:** Reads supported content aloud for users who benefit from audio assistance.
- **Accessible Learning:** Provides courses, video lessons, and learning modules.
- **Interactive Quizzes:** Helps learners assess their understanding.
- **Progress Tracking:** Tracks learning progress.
- **Chatbot Assistance:** Provides predefined responses to common user queries.
- **Government Schemes:** Provides links to relevant government schemes and resources.
- **Indian Sign Language Learning:** Includes a section for sign-language learning resources.
- **Admin Features:** Supports course management, depending on the configured admin access.

## 🛠️ Technologies Used

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router
- Context API
- Framer Motion

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas

**Accessibility**
- Web Speech API
- SpeechSynthesis API
- SpeechRecognition API (browser support dependent)

**Authentication**
- bcryptjs
- express-session

## 🏗️ Project Structure

```text
IncluLearn/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/
│   ├── package.json
│   ├── ...
│   └── .env
├── .gitignore
└── README.md
```

*Note: The structure above is illustrative. Adjust it to match your actual folders and files.*

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account or a configured MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Sruthi-sk06/IncluLearn.git
cd IncluLearn
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure the environment variables required by your backend.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

Use the exact variable names expected by your backend code. Never commit real database credentials or secrets to GitHub.

Start the backend using the script configured in `backend/package.json`, for example:

```bash
npm run dev
```

If your project uses a different script, use that instead.

### 3. Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

Keep both the backend and frontend running while using the application.

## 🔄 How It Works

1. Users create an account or log in.
2. Users select or configure their accessibility preferences.
3. The platform adapts supported interface elements to those preferences.
4. Users explore courses, watch learning videos, and complete quizzes.
5. The platform displays learning progress and provides access to additional resources.

## 🌍 Impact

IncluLearn aims to reduce accessibility barriers in digital education by bringing personalized interface adaptations and learning resources together in one platform. It promotes more independent and inclusive learning for students with diverse accessibility needs.

## 🚀 Future Enhancements

- Add AI-powered personalized learning recommendations.
- Expand support for assistive technologies and keyboard navigation.
- Improve multilingual and sign-language learning resources.
- Add more interactive course content and accessibility testing.
- Enhance analytics for tracking learning outcomes.

## 👩‍💻 Developed By

**Sruthi S K and Team**

B.Tech – Information Technology  
Rajalakshmi Engineering College, Chennai

---

*IncluLearn – Making digital education more accessible, inclusive, and personalized.*
