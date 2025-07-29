# LifeMap - Personal Development Platform

## Overview

LifeMap is a comprehensive personal development platform designed specifically for Nigerian youth (ages 13-25). The platform provides structured guidance through self-discovery assessments, goal tracking, mentorship connections, and curated learning resources.

**Live Demo:** [Demo Video Link](https://youtu.be/aur8RwOXcB8)

## Problem Statement

Young adults in Nigeria often struggle with:
- Lack of structured personal development guidance
- Limited access to mentorship and coaching
- Difficulty in setting and tracking meaningful goals
- Scattered learning resources without personalization
- No centralized platform for holistic growth

## Solution

LifeMap addresses these challenges by providing:
- **Self-Discovery Assessment**: Comprehensive quiz to identify strengths and growth areas
- **Goal Management**: Structured goal setting and progress tracking
- **Mentorship Platform**: Connect with experienced mentors
- **Learning Hub**: Curated resources based on user preferences
- **Progress Analytics**: Visual insights into personal growth journey

## Live Application

**Access the platform:** [https://lifemap-87152.web.app](https://lifemap-87152.web.app)

### Demo Credentials
- **Email:** Peternnamchukwu@gmail.com
- **Password:** Peterobi1$

## Technology Stack

- **Frontend:** React.js 18, CSS3, HTML5
- **Backend:** Firebase (Authentication, Firestore, Hosting)
- **Database:** Firebase Firestore (NoSQL)
- **Authentication:** Firebase Auth
- **Deployment:** Firebase Hosting

## Key Features

### Implemented Features
1. **User Authentication**
   - Email/password registration and login
   - Secure session management
   - User profile management

2. **Self-Discovery Assessment**
   - Interactive personality quiz
   - Personalized results and recommendations
   - Growth area identification

3. **Goal Management System**
   - Create and track personal development goals
   - Progress visualization
   - Goal categorization

4. **Learning Resources Hub**
   - Curated content library (books, videos, articles)
   - Category-based filtering
   - Personalized recommendations based on quiz results

5. **User Dashboard**
   - Motivational quotes and progress summary
   - Quick access to all features
   - Responsive design for all devices

### Planned Features
- Mentorship matching system
- Progress analytics with charts
- Community forums
- Mobile app (React Native)
- Offline functionality

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/lifemap-app.git
cd lifemap-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password method)
3. Create a Firestore database
4. Copy your Firebase configuration
5. Replace the config in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Step 4: Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### Step 5: Build for Production
```bash
npm run build
```

### Step 6: Deploy to Firebase (Optional)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy
```

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React.js      │    │   Firebase      │    │   Firestore     │
│   Frontend      │◄──►│   Auth & API    │◄──►│   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Database Schema
```
users/
  └── {userId}/
      ├── name: string
      ├── email: string
      ├── age: number
      ├── quizResults: object
      ├── quizCompleted: boolean
      └── createdAt: timestamp

goals/
  └── {goalId}/
      ├── userId: string
      ├── title: string
      ├── category: string
      ├── progress: number
      ├── completed: boolean
      └── createdAt: timestamp
```

## Video Demonstration

[📺 Watch the full demo video](your-video-link-here)

## Documentation

- **SRS Document:** [System Requirements Specification](https://docs.google.com/document/d/1XFLIXShOJP-FkXoggqkksg6ODjZvgVL-TWVA_jpu5wQ/edit)
- **Project Proposal:** [Initial concept and mission](link-to-proposal)

## Testing

### Run Tests
```bash
npm test
```

### Build Verification
```bash
npm run build
# Check build folder for production files
```

### Browser Testing
Tested and verified on:
- Chrome 90+
- Firefox 85+
- Mobile browsers (Android/iOS)

## Troubleshooting

### Common Issues

1. **Firebase Configuration Error**
   ```
   Error: Firebase configuration not found
   ```
   **Solution:** Ensure your Firebase config is properly set in `src/firebase.js`

2. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Authentication Issues**
   - Verify Firebase Authentication is enabled
   - Check email/password method is activated
   - Ensure authorized domains include your deployment URL

4. **Deployment Issues**
   ```bash
   # Ensure you're logged into Firebase
   firebase login
   
   # Reinitialize if needed
   firebase init hosting
   ```

