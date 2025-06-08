import { Router, Request, Response } from 'express';
import { playerController } from '../controllers/playerController';

const router = Router();

// GET /api/players -- Get all players
router.get('/', async (req: Request, res: Response) => {
    await playerController.getAllPlayers(req, res);
});


// GET /api/players/:playerId -- Get a single player
router.get('/:playerId', async (req: Request, res: Response) => {
  await playerController.getPlayerById(req, res);
});

// POST /api/players/ -- Create a new player
router.post('/', async (req: Request, res: Response) => {
    await playerController.createPlayer(req, res);
})



export default router; 