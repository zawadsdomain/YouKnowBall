import { Router, Request, Response } from 'express';
import { userController } from '../controllers/userController';

const router: Router = Router();

// GET /api/users -- get all users
router.get('/', async (req: Request, res: Response) => {
    await userController.getAllUsers(req, res);
});

// GET /api/users/:userId --- get a single user
router.get('/:userId', async (req: Request, res: Response) => {
    await userController.getUserById(req, res);
});

export default router; 