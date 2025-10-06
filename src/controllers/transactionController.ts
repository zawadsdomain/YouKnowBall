import { Request, Response } from 'express';
import { transactionsRef } from '../config/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { transactionService } from '../services/transactionService';

// All Columns in the transactions collection
interface Transaction {
    id: string;
    userId: string;
    playerId: string;
    transactionType: 'buy' | 'sell';
    quantity: number;
    price: number;
    timestamp: Timestamp;
}

export const transactionController = {
    // Get all transactions for the authenticated user
    getAllTransactions: async (req: Request, res: Response): Promise<void> => {
        try {
            // Use authenticated user's ID from middleware
            const userId = req.user?.uid;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }

            // Get all transactions for the authenticated user
            const transactions = await transactionsRef.where('userId', '==', userId).get();
            const transactionsData = transactions.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

            res.json({
                success: true,
                data: transactionsData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching transactions',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    },

    // POST a new transaction
    appendTransaction: async (req: Request, res: Response): Promise<void> => {
        try {
            // Use authenticated user's ID from middleware
            const userId = req.user?.uid;
            const { playerId, transactionType, quantity, price } = req.body;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }

            const result = await transactionService.processTransaction(
                userId,
                playerId,
                transactionType,
                quantity,
                price
            );

            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error processing transaction',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }
};