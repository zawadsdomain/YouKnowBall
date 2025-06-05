import { Router, Request, Response } from 'express';
import { transactionController } from '../controllers/transactionController';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
    await transactionController.getAllTransactions(req, res);
});


router.post('/', async (req: Request, res: Response) => {
    await transactionController.appendTransaction(req, res);
});


export default router;