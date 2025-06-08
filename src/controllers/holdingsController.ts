import { Request, Response } from 'express';
import { holdingsRef } from '../config/firestore';

interface Holding { 
    userId: string;
    playerId: string;
    quantity: number;
    avgPrice: number;
    mostRecentPurchase: string;
}

// this should only be used to fetch the users holdings. 

export const holdingsController = {

    getAllHoldings: async (req: Request, res: Response) => {

        try {
            const { userId } = req.body; 

            // Fetch all holdings for the specified user
            const holdings = await holdingsRef.where('userId', '==', userId).get();
            const holdingsData = holdings.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))

            res.json({
                success: true,
                data: holdingsData
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching this users holdings',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            })
        }
    }
}