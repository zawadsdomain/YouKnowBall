import { Router, Request, Response } from 'express';
import { holdingsController } from '../controllers/holdingsController';

const router = Router();

// GET /api/holdings -- Get all holdings
router.get('/', async (req: Request, res: Response) => {
    await holdingsController.getAllHoldings(req, res);
});

// GET /api/holdings/:userId -- Get holdings for a specific user
router.get('/:userId', async (req: Request, res: Response) => {
    await holdingsController.getAllHoldings(req, res);
});

export default router;