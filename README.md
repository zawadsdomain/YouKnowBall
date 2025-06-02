# You Know Ball 🏀

A virtual stock market for NBA players where users can buy and sell player "shares" using virtual currency.

## Project Overview

You Know Ball is a fantasy stock market application that allows users to:
- Create an account and receive virtual currency
- Buy and sell NBA player "shares"
- Track their portfolio performance
- Compete with other users

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: Firebase (Firestore/Realtime Database)
- **Authentication**: Firebase Authentication
- **Language**: TypeScript

## Project Structure

```
src/
├── config/      # Configuration files
├── controllers/ # Route controllers
├── middleware/  # Custom middleware
├── models/      # Data models
├── routes/      # API routes
├── services/    # Business logic
├── utils/       # Utility functions
└── app.ts       # Express app setup
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory (see `.env.example`)
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm test`: Run tests

## License

ISC