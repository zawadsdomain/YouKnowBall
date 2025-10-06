import { Router, Request, Response, RequestHandler } from 'express';
import { holdingsController } from '../controllers/holdingsController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

// GET /api/holdings -- Get current user's holdings (protected - requires auth)
router.get('/', authenticateUser as RequestHandler, async (req: Request, res: Response) => {
    await holdingsController.getUserHoldings(req, res);
});

// GET /api/holdings/valuation -- Get current user's portfolio valuation (protected - requires auth)
router.get('/valuation', authenticateUser as RequestHandler, async (req: Request, res: Response) => {
    await holdingsController.getPortfolioValuation(req, res);
});

export default router;