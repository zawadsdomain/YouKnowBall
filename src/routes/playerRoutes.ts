import { Router, Request, Response, RequestHandler } from 'express';
import { playerController } from '../controllers/playerController';

const router = Router();

// GET /api/players -- Get all players
router.get('/', async (req: Request, res: Response) => {
    await playerController.getAllPlayers(req, res);
});

// GET /api/players/:id -- Get a single player
router.get('/:id', async (req: Request, res: Response) => {
    await playerController.getPlayerById(req, res);
});

// POST /api/players/seed -- Seed players (development only)
router.post('/seed', async (req: Request, res: Response) => {
    await playerController.seedPlayers(req, res);
});

// DELETE /api/players/clear -- Clear all players (development only)
router.delete('/clear', async (req: Request, res: Response) => {
    await playerController.clearPlayers(req, res);
});

export default router; 