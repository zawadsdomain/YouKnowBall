import { Router, Request, Response } from 'express';
import { priceUpdateController } from '../controllers/priceUpdateController';

const router = Router();

// PUT /api/price-updates/:playerId -- Update a single player's price
router.put('/:playerId', async (req: Request, res: Response) => {
    await priceUpdateController.updatePlayerPrice(req, res);
});

// POST /api/price-updates/batch -- Update multiple players' prices (weekly update)
router.post('/batch', async (req: Request, res: Response) => {
    await priceUpdateController.updateMultiplePlayerPrices(req, res);
});

// GET /api/price-updates/history -- Get price update history
router.get('/history', async (req: Request, res: Response) => {
    await priceUpdateController.getAllPriceUpdateHistory(req, res);
});

// GET /api/price-updates/history/:playerId -- Get price update history for specific player
router.get('/history/:playerId', async (req: Request, res: Response) => {
    await priceUpdateController.getPlayerPriceHistory(req, res);
});

export default router;
