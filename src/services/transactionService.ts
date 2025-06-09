import { transactionsRef, holdingsRef, usersRef } from '../config/firestore';
import { db } from '../utils/firestore';
import { Timestamp } from 'firebase-admin/firestore';

export const transactionService = {
    async processTransaction(userId: string, playerId: string, transactionType: 'buy' | 'sell', quantity: number, price: number) {
        // Start a batch write -- all or nothing. 
        const batch = db.batch();

        // 1. Create transaction record
        const transactionRef = transactionsRef.doc();
        batch.set(transactionRef, {
            userId,
            playerId,
            transactionType,
            quantity,
            price,
            timestamp: Timestamp.now()
        });

        // 2. Update user's balance
        const userRef = usersRef.doc(userId);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        
        if (!userData) {
            throw new Error('User not found');
        }

        const balanceChange = transactionType === 'buy' 
            ? -(price * quantity)  // Negative for buying
            : (price * quantity);  // Positive for selling

        const newBalance = userData.balance + balanceChange;
        
        if (newBalance < 0) {
            throw new Error('Insufficient funds');
        }

        batch.update(userRef, { balance: newBalance });

        // 3. Update holdings
        const holdingId = `${userId}_${playerId}`;
        const holdingRef = holdingsRef.doc(holdingId);
        const holdingDoc = await holdingRef.get();

        if (holdingDoc.exists) {
            const currentHolding = holdingDoc.data();
            if (!currentHolding) {
                throw new Error('Holding data not found');
            }

            if (transactionType === 'sell' && currentHolding.quantity < quantity) {
                throw new Error('Insufficient shares to sell');
            }

            const newQuantity = transactionType === 'buy' 
                ? currentHolding.quantity + quantity 
                : currentHolding.quantity - quantity;

            const newAvgPrice = (currentHolding.avgPrice * currentHolding.quantity + price * quantity) / newQuantity;

            batch.update(holdingRef, {
                quantity: newQuantity,
                avgPrice: newAvgPrice,
                updatedAt: Timestamp.now()
            });
        } else {
            if (transactionType === 'sell') {
                throw new Error('Cannot sell shares you do not own');
            }

            batch.set(holdingRef, {
                userId,
                playerId,
                quantity,
                avgPrice: price,
                mostRecentPurchase: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
        }

        // Commit all changes atomically
        await batch.commit();

        return {
            transactionId: transactionRef.id,
            newBalance,
            holdingId
        };
    }
}; 