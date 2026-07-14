# 🏀 You Know Ball

A full-stack fantasy basketball stock market application where users can manage virtual player portfolios, track balances, and compete in real-time markets.

## Quick Start

### Prerequisites
- Node.js 16+, npm 8+
- Firebase project with Firestore & Auth enabled

### Setup (5 minutes)

```bash
# 1. Install dependencies
npm install
cd frontend && npm install && cd ..

# 2. Configure environment
# Backend: create .env in root with Firebase credentials
# Frontend: create frontend/.env.local
echo "VITE_API_URL=http://localhost:3000/api" > frontend/.env.local

# 3. Run both servers
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

**Access the app:** http://localhost:5173

## Features

✅ User Authentication (Signup/Login with Firebase)  
✅ Profile Management & Account Deletion  
✅ Portfolio & Holdings Tracking  
✅ Market Overview with Player Prices  
✅ Real-time Balance Display  
✅ Protected Routes & Session Persistence  

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, TypeScript, Vite, Axios |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | Firebase (Firestore + Auth) |
| **Styling** | CSS3 |

## Project Structure

```
YouKnowBall/
├── frontend/                 # React/Vite frontend
│   ├── src/pages/           # SignUp, Login, Dashboard, Profile, Settings, Market
│   ├── src/services/        # API client
│   └── vite.config.ts
├── src/                      # Node.js/Express backend
│   ├── controllers/         # User, Player, Holdings, Transaction logic
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth & validation
│   ├── services/            # Business logic
│   └── app.ts              # Express setup
├── DOCUMENTATION.md         # Full API & architecture docs
└── README.md               # This file
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/users/signup` | ❌ | Create user |
| POST | `/api/users/login` | ❌ | Login user |
| GET | `/api/users/profile` | ✅ | Get current user |
| DELETE | `/api/users/delete` | ✅ | Delete account |
| GET | `/api/holdings/:userId` | ❌ | Get user holdings |

## Authentication

- **Method:** Custom Firebase JWT tokens
- **Storage:** Browser localStorage (`authToken`)
- **Flow:** 
  1. User signs up → Backend creates Firebase Auth user & custom token
  2. Token sent to frontend and stored
  3. Axios interceptor adds `Authorization: Bearer <token>` to all requests
  4. Backend validates token via Firebase Admin SDK

## Usage Examples

### Sign Up
```bash
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "johndoe"
  }'
```

### Get Profile (requires token)
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <your-token>"
```

### Delete Account (requires token)
```bash
curl -X DELETE http://localhost:3000/api/users/delete \
  -H "Authorization: Bearer <your-token>"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check `.env` has Firebase credentials |
| Frontend "API not found" | Verify `frontend/.env.local` has `VITE_API_URL` |
| Login fails | Ensure user exists (check Firestore `users` collection) |
| Delete account fails | Verify user UID matches in Auth & Firestore |

## Development Commands

```bash
# Backend
npm run dev          # Start dev server with nodemon
npm run build        # Build TypeScript

# Frontend
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Full Documentation

For detailed API reference, architecture diagrams, database schema, and advanced setup:
👉 See [DOCUMENTATION.md](DOCUMENTATION.md)

## Project Status

- ✅ Full-stack authentication
- ✅ User profile management
- ✅ Account deletion with confirmation
- ✅ Protected routes & session persistence
- ✅ Responsive UI
- 🔄 Player trading system (in progress)
- 🔄 Price update engine (in progress)

## Credits

Built with ❤️ for fantasy basketball enthusiasts
