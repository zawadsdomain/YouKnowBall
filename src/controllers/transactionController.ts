import { Request, Response } from 'express';
import { transactionsRef } from '../config/firestore';
import { holdingsRef } from '../config/firestore';
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

    // Add that transaction to the users' holdings as well. 
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

            if (!transactionData) {
                throw new Error('Transaction data not found');
            }

            // Add that transaction to the users' holdings as well. 
            const holdingId = `${userId}_${playerId}`;
            const holdingRef = holdingsRef.doc(holdingId);
            const holdingDoc = await holdingRef.get();
            // user has a holding for this player.
            if (holdingDoc.exists) {
                // Update existing holding.
                const currentHolding = holdingDoc.data();
                if (!currentHolding) {
                    throw new Error('Holding data not found');
                }
                // For selling, check if user has enough shares
                if (transactionType === 'sell' && currentHolding.quantity < quantity) {
                    throw new Error('Insufficient shares to sell');
                }
                const newQuantity = transactionType === 'buy' ? currentHolding.quantity + quantity
                : currentHolding.quantity - quantity;

                const newAvgPrice = (currentHolding.avgPrice * currentHolding.quantity + price * quantity) / newQuantity;

                await holdingRef.update({
                    quantity: newQuantity,
                    avgPrice: newAvgPrice,
                    updatedAt: Timestamp.now()
                });

            } else {
                // create new holding. 

                // Only allow buying for new holdings.
                if (transactionType === 'sell') {
                    throw new Error('Cannot sell shares you do not own');
                }

                await holdingRef.set({ // uses the holdingId as the document id, as it is setting it here.
                    userId,
                    playerId,
                    quantity: quantity, // always buying -> positive quantity. 
                    avgPrice: price,
                    mostRecentPurchase: transactionType === 'buy' ? transactionData.timestamp : null,
                    updatedAt: Timestamp.now()
                });
            }





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