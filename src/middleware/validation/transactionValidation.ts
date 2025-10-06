import { Request, Response, NextFunction } from 'express';
import { usersRef, playersRef, holdingsRef } from '../../config/firestore';

export const validateTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get userId from authenticated user (set by auth middleware)
        const userId = req.user?.uid;
        const { playerId, transactionType, quantity, price } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }

        // Check if all required fields are present
        if (!playerId || !transactionType || !quantity || !price) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields',
                required: ['playerId', 'transactionType', 'quantity', 'price']
            });
            return; // output the error then return. 
        }

        // Validate transaction type
        if (transactionType !== 'buy' && transactionType !== 'sell') {
            res.status(400).json({
                success: false,
                message: 'Invalid transaction type',
                allowed: ['buy', 'sell']
            });
            return; // output the error then return. 
        }

        // Validate quantity and price are positive numbers
        if (quantity <= 0 || price <= 0) {
            res.status(400).json({
                success: false,
                message: 'Quantity and price must be positive numbers'
            });
            return; // output the error then return. 
        }

        // Check if user exists
        const userDoc = await usersRef.doc(userId).get();
        if (!userDoc.exists) { // if the user row doesn't exist, error bro.
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return; // output the error then return. 
        }

        // Check if player exists
        const playerDoc = await playersRef.doc(playerId).get();
        if (!playerDoc.exists) { // if the player row doesn't exist, why are you trying to buy a g-league player?
            res.status(404).json({
                success: false,
                message: 'Player not found'
            });
            return; // output the error then return. 
        }

        // Validate balance and holdings based on transaction type
        const userData = userDoc.data();
        const transactionCost = price * quantity;

        if (transactionType === 'buy') {
            // Check if user has sufficient balance
            if (userData?.balance < transactionCost) {
                res.status(400).json({
                    success: false,
                    message: 'Insufficient funds',
                    balance: userData?.balance || 0,
                    required: transactionCost,
                    shortfall: transactionCost - (userData?.balance || 0)
                });
                return;
            }
        } else if (transactionType === 'sell') {
            // Check if user has sufficient shares to sell
            const holdingId = `${userId}_${playerId}`;
            const holdingDoc = await holdingsRef.doc(holdingId).get();
            
            if (!holdingDoc.exists) {
                res.status(400).json({
                    success: false,
                    message: 'Cannot sell shares you do not own',
                    holdings: 0,
                    requested: quantity
                });
                return;
            }

            const holdingData = holdingDoc.data();
            if (holdingData?.quantity < quantity) {
                res.status(400).json({
                    success: false,
                    message: 'Insufficient shares to sell',
                    holdings: holdingData?.quantity || 0,
                    requested: quantity,
                    shortfall: quantity - (holdingData?.quantity || 0)
                });
                return;
            }
        }

        // If all validations pass, proceed to the next middleware/controller
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error validating transaction',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
