import { Request, Response, NextFunction } from 'express';
import { usersRef, playersRef } from '../../config/firestore';

export const validateTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, playerId, transactionType, quantity, price } = req.body;

        // Check if all required fields are present
        if (!userId || !playerId || !transactionType || !quantity || !price) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields',
                required: ['userId', 'playerId', 'transactionType', 'quantity', 'price']
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
