import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Route imports
import userRoutes from './routes/userRoutes';
import playerRoutes from './routes/playerRoutes';
import transactionRoutes from './routes/transactionRoutes';
import holdingsRoutes from './routes/holdingsRoutes';
import priceUpdateRoutes from './routes/priceUpdateRoutes';

// Middleware imports
import { requestLoggingMiddleware, errorLoggingMiddleware } from './middleware/loggingMiddleware';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (should be early in the chain)
app.use(requestLoggingMiddleware);

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

app.get('/', (req: Request, res: Response) => {
  res.json({message: "You are connected to the backend"});
});

// Error handling middleware (should be last)
app.use(errorLoggingMiddleware);

// Start server
app.listen(port, () => {
  logger.info(`Server started successfully`, { port, environment: process.env.NODE_ENV || 'development' });
});

export default app; 