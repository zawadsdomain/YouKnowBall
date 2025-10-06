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
            // Fetch all holdings (no user filter)
            const holdings = await holdingsRef.get();
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
                message: 'Error fetching all holdings',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            })
        }
    },

    getUserHoldings: async (req: Request, res: Response): Promise<void> => {
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

            // Fetch all holdings for the authenticated user
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
                message: 'Error fetching user holdings',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            })
        }
    }
}