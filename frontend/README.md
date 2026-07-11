# You Know Ball - Frontend

React + TypeScript frontend for the You Know Ball NBA virtual stock market application.

## Complete Setup Guide for New Device

Follow these steps to get the entire project running on a new device.

### Prerequisites
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **A terminal** (Terminal on macOS, PowerShell on Windows, or any Linux terminal)

### Step 1: Clone the Repository

```bash
git clone https://github.com/zawadsdomain/YouKnowBall.git
cd YouKnowBall
```

### Step 2: Set Up the Backend

The backend is in the root directory.

1. Install backend dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Update `.env` with your Firebase credentials:
   - Get these from your Firebase Console at https://console.firebase.google.com/
   - Add your Firebase API keys and project details

### Step 3: Set Up the Frontend

The frontend is in the `frontend/` directory.

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Create `.env` file in the frontend directory:
```bash
cp .env.example .env
```

4. Update `.env` with your Firebase and API configuration:
```
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 4: Run the Project

You'll need **two terminal windows** - one for backend, one for frontend.

**Terminal 1 - Backend:**
```bash
# Make sure you're in the root directory: /path/to/YouKnowBall
cd /path/to/YouKnowBall
npm run dev
```
The backend will start at `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
# Make sure you're in the frontend directory: /path/to/YouKnowBall/frontend
cd /path/to/YouKnowBall/frontend
npm run dev
```
The frontend will start at `http://localhost:5173`

### Step 5: Access the Application

Open your browser and navigate to `http://localhost:5173/` to see the application.

## Development Commands

### Backend
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Run production build
- `npm run lint` - Check code quality
- `npm run test` - Run tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality

## Troubleshooting

### Port Already in Use
- Backend (port 3000): If occupied, update the port in `src/app.ts`
- Frontend (port 5173): Vite will automatically use next available port

### Firebase Errors
- Make sure `.env` files are correctly filled with Firebase credentials
- Check that Firebase project is active and not deleted

### Dependencies Issues
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Make sure Node.js version is 16 or higher: `node --version`

### Backend Not Connecting
- Ensure backend is running first (Terminal 1)
- Check that `VITE_API_URL` in frontend `.env` matches your backend URL
- Look for error messages in the browser console (F12)

## Project Structure

```
YouKnowBall/
├── src/                    # Backend source code
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── utils/
├── frontend/               # Frontend React app
│   ├── src/
│   │   ├── config/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── components/
│   │   └── App.tsx
│   ├── .env
│   └── package.json
├── .env
├── package.json
└── README.md
```

## Getting Started with Development

### Working on the Backend
1. Edit files in `src/` directory
2. Changes auto-reload with `npm run dev`
3. Check `src/app.ts` for main server setup

### Working on the Frontend
1. Edit files in `frontend/src/` directory
2. Changes auto-reload with `npm run dev`
3. Check [frontend/README.md](frontend/README.md) for more details

## Features

- 🏀 Browse NBA players and their stock prices
- 💼 Manage your portfolio
- 💰 Buy and sell player shares
- 📊 Track portfolio performance

## Technologies

- **Backend**: Node.js + Express.js with TypeScript
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: Firebase (Firestore/Realtime Database)
- **Authentication**: Firebase Authentication
- **Routing**: React Router (frontend), Express (backend)
- **HTTP Client**: Axios

## API Integration

The frontend communicates with the backend API at `http://localhost:3000/api`. Make sure the backend server is running before starting the frontend.

