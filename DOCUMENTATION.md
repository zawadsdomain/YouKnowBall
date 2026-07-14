# YouKnowBall - Full Stack Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Setup & Installation](#setup--installation)
4. [Running the Application](#running-the-application)
5. [Backend API Reference](#backend-api-reference)
6. [Frontend Routes & Pages](#frontend-routes--pages)
7. [Authentication Flow](#authentication-flow)
8. [Database Schema](#database-schema)
9. [Features](#features)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

**YouKnowBall** is a full-stack web application for managing a fantasy basketball market. Users can:
- Sign up and log in with custom authentication
- View and manage player holdings
- Track account balance and portfolio
- Update player prices via a price engine
- Access a market dashboard with real-time data
- Manage account settings (logout, delete account)

**Tech Stack:**
- **Frontend:** React, TypeScript, Vite, react-router-dom, Axios
- **Backend:** Node.js, Express, TypeScript, Nodemon
- **Database:** Firebase (Firestore for data, Firebase Auth for authentication)
- **Deployment:** Local dev environment (npm scripts)

---

## Architecture

### Project Structure

```
YouKnowBall/
├── frontend/                          # React/Vite frontend application
│   ├── src/
│   │   ├── pages/                     # React page components
│   │   │   ├── Home.tsx               # Home page
│   │   │   ├── SignUp.tsx             # User signup form
│   │   │   ├── Login.tsx              # User login form
│   │   │   ├── Dashboard.tsx          # User dashboard (balance, welcome)
│   │   │   ├── Profile.tsx            # User profile & holdings
│   │   │   ├── Settings.tsx           # Account settings (logout, delete)
│   │   │   ├── Market.tsx             # Market overview
│   │   │   ├── Players.tsx            # Player list
│   │   │   └── *.css                  # Page-specific styles
│   │   ├── services/
│   │   │   └── api.ts                 # Axios HTTP client with interceptors
│   │   ├── App.tsx                    # Main app routing and nav
│   │   ├── App.css                    # Global app styles
│   │   └── main.tsx                   # Entry point
│   ├── dist/                          # Built production files (generated)
│   ├── package.json                   # Frontend dependencies
│   ├── tsconfig.json                  # TypeScript config
│   └── vite.config.ts                 # Vite build config
│
├── src/                               # Node.js/Express backend
│   ├── controllers/
│   │   ├── userController.ts          # User operations (signup, login, profile, delete)
│   │   ├── playerController.ts        # Player management
│   │   ├── holdingsController.ts      # User holdings
│   │   ├── transactionController.ts   # Transaction logic
│   │   └── priceUpdateController.ts   # Price updates
│   ├── routes/
│   │   ├── userRoutes.ts              # User API routes
│   │   ├── playerRoutes.ts            # Player API routes
│   │   ├── holdingsRoutes.ts          # Holdings API routes
│   │   ├── transactionRoutes.ts       # Transaction API routes
│   │   └── priceUpdateRoutes.ts       # Price update API routes
│   ├── middleware/
│   │   ├── authMiddleware.ts          # JWT token validation
│   │   └── validation/                # Request validation
│   │       ├── userValidation.ts
│   │       └── transactionValidation.ts
│   ├── services/
│   │   ├── playerSeedService.ts       # Player data seeding
│   │   ├── priceChangeEngine.ts       # Price change logic
│   │   ├── priceUpdateService.ts      # Price update logic
│   │   ├── testDataGenerator.ts       # Test data generation
│   │   └── transactionService.ts      # Transaction service
│   ├── config/
│   │   ├── firestore.ts               # Firestore collection references
│   │   └── playerData.ts              # Player data constants
│   ├── types/
│   │   └── player.ts                  # TypeScript types
│   ├── utils/
│   │   └── firestore.ts               # Firebase Admin initialization
│   ├── app.ts                         # Express app setup
│   └── package.json                   # Backend dependencies
│
├── README.md                          # Project README
└── DOCUMENTATION.md                   # This file

```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React/Vite)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Pages: Home, SignUp, Login, Dashboard, Profile, Market  │   │
│  │ Services: Axios API Client with Auth Interceptors       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Routes: /api/users, /api/players, /api/holdings, etc.   │   │
│  │ Controllers: Handle business logic                      │   │
│  │ Middleware: Auth validation, request validation         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE (Cloud Services)                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Firestore: users, players, holdings, transactions       │   │
│  │ Firebase Auth: User authentication & tokens             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Setup & Installation

### Prerequisites

- **Node.js** 16+ and **npm** 8+
- **Git** (for version control)
- **Firebase Project** with Firestore and Firebase Auth enabled
- **Environment variables** configured

### Step 1: Clone the Repository

```bash
git clone <repo-url>
cd YouKnowBall
```

### Step 2: Backend Setup

```bash
# Install backend dependencies
npm install

# Create a .env file in the root directory with Firebase credentials
cat > .env << 'EOF'
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_DATABASE_URL=your-database-url
EOF
```

### Step 3: Frontend Setup

```bash
cd frontend

# Install frontend dependencies
npm install

# Create a .env.local file with API URL
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:3000/api
EOF

cd ..
```

### Step 4: Verify Configuration

Ensure `src/utils/firestore.ts` is properly initialized with Firebase Admin credentials.

---

## Running the Application

### Development Mode

**Run backend (from root):**
```bash
npm run dev
```
This starts the Express server with Nodemon on `http://localhost:3000`.

**Run frontend (from root, in a separate terminal):**
```bash
cd frontend && npm run dev
```
This starts the Vite dev server on `http://localhost:5173`.

### Production Build

**Build frontend:**
```bash
cd frontend && npm run build
```

**Build backend (TypeScript compilation):**
```bash
npm run build
```

---

## Backend API Reference

### Base URL
```
http://localhost:3000/api
```

### User Endpoints

#### 1. Sign Up
- **Method:** `POST`
- **Path:** `/users/signup`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "username": "johndoe"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "token": "custom-firebase-token",
    "data": {
      "uid": "user-id",
      "email": "user@example.com",
      "username": "johndoe",
      "token": "custom-firebase-token"
    }
  }
  ```

#### 2. Login
- **Method:** `POST`
- **Path:** `/users/login`
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "custom-firebase-token",
    "data": {
      "token": "custom-firebase-token",
      "userId": "user-id",
      "email": "user@example.com"
    }
  }
  ```

#### 3. Get Profile (Protected)
- **Method:** `GET`
- **Path:** `/users/profile`
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "username": "johndoe",
      "email": "user@example.com",
      "balance": 10000,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  }
  ```

#### 4. Get User by ID
- **Method:** `GET`
- **Path:** `/users/:userId`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "username": "johndoe",
      "email": "user@example.com",
      "balance": 10000
    }
  }
  ```

#### 5. Delete Account (Protected)
- **Method:** `DELETE`
- **Path:** `/users/delete`
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Account deleted"
  }
  ```
- **Side Effects:**
  - Deletes user from Firebase Auth
  - Deletes user document from Firestore
  - Frontend clears token and redirects to signup

#### 6. Get All Users
- **Method:** `GET`
- **Path:** `/users`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "user-id-1",
        "username": "johndoe",
        "email": "user@example.com",
        "balance": 10000
      }
    ]
  }
  ```

### Holdings Endpoints

#### Get Holdings by User ID
- **Method:** `GET`
- **Path:** `/holdings/:userId`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "holding-id",
        "userId": "user-id",
        "playerId": "player-id",
        "quantity": 5,
        "purchasePrice": 100
      }
    ]
  }
  ```

---

## Frontend Routes & Pages

### Public Routes (Unauthenticated Only)

| Path | Component | Description |
|------|-----------|-------------|
| `/signup` | SignUp | User registration form |
| `/login` | Login | User login form |

### Protected Routes (Authenticated Only)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page for authenticated users |
| `/dashboard` | Dashboard | User welcome page with balance display |
| `/profile` | Profile | User profile and holdings view |
| `/market` | Market | Market overview and analytics |
| `/players` | Players | Player list and details |
| `/settings` | Settings | Account settings (logout, delete account) |

### Route Protection

All protected routes redirect unauthenticated users to `/signup`. The authentication check is based on the `authToken` stored in `localStorage`.

---

## Authentication Flow

### How Authentication Works

1. **User Sign Up:**
   - Frontend sends email, password, username to `POST /api/users/signup`
   - Backend creates user in Firebase Auth & Firestore
   - Backend generates custom Firebase token
   - Frontend stores token in `localStorage` as `authToken`
   - Frontend redirects to Dashboard

2. **User Login:**
   - Frontend sends email to `POST /api/users/login`
   - Backend looks up user by email and generates custom token
   - Frontend stores token and redirects to Dashboard

3. **Protected Requests:**
   - Axios request interceptor automatically adds `Authorization: Bearer <token>` header
   - Backend middleware (`authMiddleware.ts`) decodes JWT and validates via Firebase Admin
   - If invalid/expired, response interceptor clears auth and redirects to signup

4. **Logout:**
   - Frontend removes `authToken` from localStorage
   - Frontend redirects to signup

5. **Delete Account:**
   - Frontend calls `DELETE /api/users/delete` (protected)
   - Backend deletes user from Firebase Auth & Firestore
   - Frontend clears token and redirects to signup

### Token Storage

- **Key:** `authToken`
- **Storage:** Browser `localStorage`
- **Format:** Custom Firebase JWT
- **Expiry:** Managed by Firebase (typically 1 hour)

---

## Database Schema

### Firestore Collections

#### `users` Collection
- **Document ID:** Firebase UID
- **Fields:**
  ```typescript
  {
    username: string;
    email: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
  }
  ```

#### `players` Collection
- **Document ID:** Player ID
- **Fields:**
  ```typescript
  {
    name: string;
    position: string;
    team: string;
    price: number;
    priceHistory: number[];
    createdAt: Date;
    updatedAt: Date;
  }
  ```

#### `holdings` Collection
- **Document ID:** Auto-generated
- **Fields:**
  ```typescript
  {
    userId: string;
    playerId: string;
    quantity: number;
    purchasePrice: number;
    createdAt: Date;
    updatedAt: Date;
  }
  ```

#### `transactions` Collection
- **Document ID:** Auto-generated
- **Fields:**
  ```typescript
  {
    userId: string;
    playerId: string;
    type: "buy" | "sell";
    quantity: number;
    price: number;
    totalValue: number;
    createdAt: Date;
  }
  ```

---

## Features

### 1. User Authentication
- Custom signup/login with Firebase Auth
- Secure token-based authentication
- Session persistence via localStorage

### 2. Profile Management
- View user profile and account balance
- View holdings per player
- Delete account functionality with confirmation

### 3. Market & Holdings
- View all players and their prices
- Track personal holdings
- See portfolio value and balance

### 4. Settings
- Logout button
- Delete account button with confirmation
- Error messages for failed operations

### 5. Navigation
- Responsive navbar visible to authenticated users
- Protected routes redirect unauthenticated users
- Clean routing structure with react-router-dom

---

## Troubleshooting

### Frontend Won't Start
**Problem:** `VITE_API_URL` not found
- **Solution:** Create `frontend/.env.local` with `VITE_API_URL=http://localhost:3000/api`

### Backend Won't Start
**Problem:** Firebase credentials missing
- **Solution:** Create `.env` in root with Firebase credentials
- **Details:** See [Setup & Installation](#setup--installation) section

### "Unauthorized" 401 Errors
**Problem:** Token is invalid or expired
- **Solution:** Re-login. Tokens may expire after 1 hour.

### Delete Account Fails
**Problem:** Account deletion fails silently
- **Solution:** 
  1. Check browser console for error message
  2. Verify user exists in Firestore `users` collection
  3. Ensure user has valid Firebase Auth entry

### CORS Errors
**Problem:** Frontend cannot reach backend
- **Solution:** 
  1. Verify backend is running on `http://localhost:3000`
  2. Check `VITE_API_URL` in `frontend/.env.local`
  3. Verify no firewall blocking localhost requests

### Profile Fetch Returns 404
**Problem:** `GET /api/users/profile` returns 404
- **Solution:** 
  1. Verify token is valid and not expired
  2. Check user document exists in Firestore `users/{uid}`
  3. Re-login and try again

---

## Development Tips

### Adding New Routes

1. Create controller function in `src/controllers/`
2. Add route in `src/routes/`
3. Import route in `src/app.ts`
4. Add route to `app.use()`

### Adding New Frontend Pages

1. Create component in `frontend/src/pages/`
2. Import in `frontend/src/App.tsx`
3. Add route in Routes section
4. Add nav link if needed

### Running Tests (Optional)

Backend and frontend are ready for unit/integration tests. Create test files and add to `package.json` scripts:

```bash
npm test
```

---

## Deployment Considerations

For production deployment:
1. Use environment-specific `.env` files
2. Add CORS headers if frontend and backend are on different domains
3. Implement rate limiting on API endpoints
4. Add request validation middleware
5. Use HTTPS for all communications
6. Store sensitive data (Firebase keys) in secure vaults (e.g., AWS Secrets Manager)
7. Add monitoring and error tracking (e.g., Sentry)

---

## Support & Questions

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages in browser console and server logs
3. Verify all environment variables are set correctly
4. Check Firebase project configuration

---

**Last Updated:** July 2026  
**Version:** 1.0.0
