import { Router, Request, Response, RequestHandler } from 'express';
import { holdingsController } from '../controllers/holdingsController';
import { authenticateUser } from '../middleware/authMiddleware';

const router: Router = Router();

// Apply middleware to all routes here.
router.use(authenticateUser as RequestHandler);

// GET all holdings for a specified userID
router.get('/:userId', async (req: Request, res: Response) => {
    await holdingsController.getAllHoldings(req, res);
});

export default router;