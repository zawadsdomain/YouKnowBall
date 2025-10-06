import { Router, Request, Response, RequestHandler } from 'express';
import { holdingsController } from '../controllers/holdingsController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

// GET /api/holdings -- Get current user's holdings (protected - requires auth)
router.get('/', authenticateUser as RequestHandler, async (req: Request, res: Response) => {
    await holdingsController.getUserHoldings(req, res);
});

export default router;