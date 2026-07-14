import { Router, Request, Response } from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import userController from '../controllers/userController';


const router: Router = Router();

// GET /api/users -- get all users
router.get('/', async (req: Request, res: Response) => {
    await userController.getAllUsers(req, res);
});

// GET /api/users/profile -- get the currently authenticated user
router.get('/profile', authenticateUser, async (req: Request, res: Response) => {
    await userController.getProfile(req, res);
});

// GET /api/users/:userId --- get a single user by UID
router.get('/:userId', async (req: Request, res: Response) => {
    await userController.getUserById(req, res);
});

// POST /api/users/signup -- create a new user
router.post('/signup', async (req: Request, res: Response) => {
    await userController.createUser(req, res);
});

// POST /api/users/login -- login a user
router.post('/login', async (req: Request, res:  Response) => {
    await userController.loginUser(req, res);
})

// DELETE /api/users/delete -- delete the currently authenticated account
router.delete('/delete', authenticateUser, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.uid;
        if (!userId) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; }

        // Importing auth and usersRef here reduces coupling with controller.
        const { auth } = require('../utils/firestore');
        const { usersRef } = require('../config/firestore');

        // Delete from Firebase Auth
        if (auth) {
            await auth.deleteUser(userId);
        }

        // Delete Firestore user doc
        await usersRef.doc(userId).delete();

        res.json({ success: true, message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting account', error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
});

export default router; 