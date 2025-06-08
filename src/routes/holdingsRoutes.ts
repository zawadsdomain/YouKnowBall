import { Router, Request, Response } from 'express';
import { holdingsController } from '../controllers/holdingsController';
const router: Router = Router();

// GET all holdings for a specified userID
router.get('/:userId', async (req: Request, res: Response) => {
    await holdingsController.getAllHoldings(req, res);
});

export default router;