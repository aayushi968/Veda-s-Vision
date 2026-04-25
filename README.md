# Veda's Vision

AI-powered Ayurvedic chatbot for Prakriti assessment and personalized wellness guidance.

## Features

- Chat-based Prakriti questionnaire
- Firestore-backed user history and results
- Firebase Authentication (Google + Email)
- OpenAI-powered wellness recommendations
- Ayurveda-inspired dashboard with report and history

## Structure

- `client/` – React frontend with Tailwind CSS
- `server/` – Node.js + Express API for AI and Firebase admin operations
- `firebase/` – shared Firebase config placeholder

## Setup

### 1. Firebase

1. Create a Firebase project.
2. Enable Authentication (Google, Email/Password).
3. Enable Firestore in test mode or with security rules.
4. Copy the web config.
5. Add the config to `firebase/config.js`.

### 2. Server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
OPENAI_API_KEY=your_openai_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
```

### 3. Client

```bash
cd client
npm install
```

### 4. Run

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

## Deployment

- Frontend: Netlify, Vercel, or any static React host
- Backend: Render, Railway, or Heroku

See `server/README.md` and `client/README.md` for details.
