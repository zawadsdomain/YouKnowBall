import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Route imports
import userRoutes from './routes/userRoutes';
import playerRoutes from './routes/playerRoutes';
import transactionRoutes from './routes/transactionRoutes';
import holdingsRoutes from './routes/holdingsRoutes';
import priceUpdateRoutes from './routes/priceUpdateRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/holdings', holdingsRoutes);
app.use('/api/price-updates', priceUpdateRoutes);

// Basic route for testing
app.get('/api/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to You Know Ball API 🏀' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app; 