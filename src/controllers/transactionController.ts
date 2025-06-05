import { Request, Response } from 'express';
import { transactionsRef } from '../config/firestore';
import { Timestamp } from 'firebase-admin/firestore';

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
    // Get all transactions
    getAllTransactions: async (req: Request, res: Response) => {

        try {
            const transactions = await transactionsRef.get(); 
            const transactionsData = transactions.docs.map((doc) => ({ // map thru all transactions in firestore, forming a list of transactions in the format we want. 
                id: doc.id, // id handled by firestore
                ...doc.data()
            }))

            res.json({ // successful fetch
                success: true,
                data: transactionsData
            })
        } catch (error) {
            res.status(500).json({ // error fetching transactions
                success: false,
                message: 'Error fetching transactions',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            })
        }
    },
    // POST a new transaction to the transaction log 
    appendTransaction: async (req: Request, res: Response) => {
        try {
            const { userId, playerId, transactionType, quantity, price } = req.body;

            const transactionRef = await transactionsRef.add({ // 'add' new transaction to firestore
                userId,
                playerId,
                transactionType,
                quantity,
                price,
                timestamp: Timestamp.now()
            });

            const transactionDoc = await transactionRef.get();
            const transactionData = transactionDoc.data();

            res.status(201).json({ // successful creation
                success: true,
                data: transactionData
            });
        } catch (error) {
            res.status(500).json({ // error appending transaction
                success: false,
                message: 'Error appending transaction',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }
    

}