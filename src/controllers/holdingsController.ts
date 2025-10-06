import { Request, Response } from 'express';
import { holdingsRef, playersRef, usersRef } from '../config/firestore';

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
    },

    getPortfolioValuation: async (req: Request, res: Response): Promise<void> => {
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

            // Get user's balance
            const userDoc = await usersRef.doc(userId).get();
            if (!userDoc.exists) {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            const userData = userDoc.data();
            const cashBalance = userData?.balance || 0;

            // Get user's holdings
            const holdings = await holdingsRef.where('userId', '==', userId).get();
            
            let totalHoldingsValue = 0;
            const holdingsBreakdown: Array<{
                playerId: string;
                playerName: string;
                quantity: number;
                avgPrice: number;
                currentPrice: number;
                currentValue: number;
                unrealizedGainLoss: number;
                unrealizedGainLossPercent: number;
            }> = [];

            // Calculate value for each holding
            for (const holdingDoc of holdings.docs) {
                const holdingData = holdingDoc.data();
                const playerId = holdingData.playerId;
                const quantity = holdingData.quantity;
                const avgPrice = holdingData.avgPrice;

                // Get current player price
                const playerDoc = await playersRef.doc(playerId).get();
                if (!playerDoc.exists) {
                    // Skip holdings for players that no longer exist
                    continue;
                }
                const playerData = playerDoc.data();
                const currentPrice = playerData?.currentPrice || 0;
                const playerName = playerData?.name || 'Unknown Player';

                const currentValue = quantity * currentPrice;
                const unrealizedGainLoss = currentValue - (quantity * avgPrice);
                const unrealizedGainLossPercent = avgPrice > 0 ? (unrealizedGainLoss / (quantity * avgPrice)) * 100 : 0;

                totalHoldingsValue += currentValue;

                holdingsBreakdown.push({
                    playerId,
                    playerName,
                    quantity,
                    avgPrice,
                    currentPrice,
                    currentValue,
                    unrealizedGainLoss,
                    unrealizedGainLossPercent
                });
            }

            const totalPortfolioValue = cashBalance + totalHoldingsValue;

            res.json({
                success: true,
                data: {
                    totalPortfolioValue,
                    cashBalance,
                    totalHoldingsValue,
                    holdingsBreakdown,
                    summary: {
                        totalHoldings: holdingsBreakdown.length,
                        totalUnrealizedGainLoss: holdingsBreakdown.reduce((sum, holding) => sum + holding.unrealizedGainLoss, 0),
                        totalUnrealizedGainLossPercent: totalHoldingsValue > 0 ? 
                            (holdingsBreakdown.reduce((sum, holding) => sum + holding.unrealizedGainLoss, 0) / totalHoldingsValue) * 100 : 0
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error calculating portfolio valuation',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }
}