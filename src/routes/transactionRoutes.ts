import { Router, Request, Response, RequestHandler } from 'express';
import { transactionController } from '../controllers/transactionController';
import { validateTransaction } from '../middleware/validation/transactionValidation';
import { authenticateUser } from '../middleware/authMiddleware';

const router: Router = Router();

// Apply middleware to all routes
router.use(authenticateUser as RequestHandler);

// GET all transactions
router.get('/', async (req: Request, res: Response) => {
    await transactionController.getAllTransactions(req, res);
});

// POST new transaction (with validation)
router.post('/', validateTransaction, async (req: Request, res: Response) => {
    await transactionController.appendTransaction(req, res);
});

export default router;