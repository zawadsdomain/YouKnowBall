import { Router, Request, Response, RequestHandler } from 'express';
import { transactionController } from '../controllers/transactionController';
import { validateTransaction } from '../middleware/validation/transactionValidation';
import { authenticateUser } from '../middleware/authMiddleware';

const router: Router = Router();

// GET all transactions (protected - requires auth)
router.get('/', authenticateUser as RequestHandler, async (req: Request, res: Response) => {
    await transactionController.getAllTransactions(req, res);
});

// POST new transaction (protected - requires auth and validation)
router.post('/', authenticateUser as RequestHandler, validateTransaction as RequestHandler, async (req: Request, res: Response) => {
    await transactionController.appendTransaction(req, res);
});

export default router;