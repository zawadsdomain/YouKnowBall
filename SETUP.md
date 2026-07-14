# Setup Guide

## Environment Configuration

### Backend (.env)

Create `.env` in the project root with your Firebase credentials:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

### Frontend (frontend/.env.local)

```env
VITE_API_URL=http://localhost:3000/api
```

## Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Download the JSON file and copy values to `.env`

## Local Development

### First-Time Setup

```bash
# Clone repo
git clone <repo-url>
cd YouKnowBall

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Create environment files
cat > .env << 'EOF'
FIREBASE_PROJECT_ID=your-id
FIREBASE_PRIVATE_KEY="your-key"
# ... (see Backend section above)
EOF

cat > frontend/.env.local << 'EOF'
VITE_API_URL=http://localhost:3000/api
EOF
```

### Run Servers

**Terminal 1 - Backend:**
```bash
npm run dev
# Output: Server is running at http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Output: Local: http://localhost:5173
```

### Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Backend Health Check: http://localhost:3000/api/users

## Database Setup

### Create Firestore Collections

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Firestore Database
3. Create collections:
   - `users`
   - `players`
   - `holdings`
   - `transactions`

### Initial Data (Optional)

Run backend seed service to populate test data:

```bash
# Add to src/app.ts if needed
import { seedPlayers } from './services/playerSeedService';
await seedPlayers(); // Runs once on startup
```

## Firebase Auth Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Authentication
3. Enable **Email/Password** provider:
   - Click **Email/Password**
   - Toggle "Enable"
   - Save

## Troubleshooting Setup

### "Firebase Admin not initialized"
- Check `.env` file exists and has all required fields
- Verify `FIREBASE_PRIVATE_KEY` uses `\n` for line breaks
- Restart backend: `npm run dev`

### "Cannot find module '@firebase/auth'"
```bash
cd frontend
npm install
cd ..
```

### Port 3000 Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process (macOS/Linux)
kill -9 <PID>

# Then restart backend
npm run dev
```

### Port 5173 Already in Use
```bash
cd frontend
npm run dev -- --port 5174
```

## Testing Setup

### Manual API Testing with cURL

```bash
# Sign up
curl -X POST http://localhost:3000/api/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "username": "testuser"
  }'

# Login (save token)
TOKEN=$(curl -s -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}' | jq -r '.data.token')

# Get profile
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"

# Delete account
curl -X DELETE http://localhost:3000/api/users/delete \
  -H "Authorization: Bearer $TOKEN"
```

### Testing Frontend Pages

1. **Sign Up:** http://localhost:5173/signup
2. **Login:** http://localhost:5173/login
3. **Dashboard:** http://localhost:5173/dashboard (protected)
4. **Profile:** http://localhost:5173/profile (protected)
5. **Settings:** http://localhost:5173/settings (protected)
6. **Market:** http://localhost:5173/market (protected)

## Production Deployment

### Build Frontend

```bash
cd frontend
npm run build
# Creates dist/ folder

# Preview production build
npm run preview
```

### Build Backend

```bash
npm run build
# Compiles TypeScript to dist/ folder
```

### Deploy to Cloud

- **Frontend:** Deploy `frontend/dist` to Vercel, Netlify, or Firebase Hosting
- **Backend:** Deploy to Heroku, Railway, or Google Cloud Run
- **Database:** Firestore is automatically hosted on Firebase

### Environment Variables for Production

Update `.env` and `frontend/.env.local` with production URLs and credentials before deploying.

## Development Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use meaningful commit messages**
3. **Test locally before pushing**
4. **Keep dependencies updated:** `npm update`
5. **Monitor API logs** for debugging

## Need Help?

- Check [DOCUMENTATION.md](DOCUMENTATION.md) for API reference
- Review error messages in console (frontend) and terminal (backend)
- Verify all environment variables are set
- Check Firebase project configuration

---

Last Updated: July 2026
