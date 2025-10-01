import { transactionsRef, holdingsRef, usersRef } from '../config/firestore';
import { db } from '../utils/firestore';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
// this handles all the logic for when a user buys or sells a player -- post validation
// called by the transactionController.ts
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

            const currentQuantity = currentHolding.quantity;

            if (transactionType === 'sell' && currentQuantity < quantity) {
                throw new Error('Insufficient shares to sell');
            }

            const isBuy = transactionType === 'buy';
            const newQuantity = isBuy
                ? currentQuantity + quantity
                : currentQuantity - quantity;

            if (newQuantity < 0) {
                throw new Error('Holdings cannot be negative');
            }

            if (newQuantity === 0) {
                batch.delete(holdingRef);
            } else {
                const updatePayload: Record<string, unknown> = {
                    quantity: newQuantity,
                    updatedAt: Timestamp.now()
                };

                if (isBuy) {
                    const totalCost = currentHolding.avgPrice * currentQuantity + price * quantity;
                    updatePayload.avgPrice = totalCost / newQuantity;
                    updatePayload.mostRecentPurchase = Timestamp.now();
                } else {
                    updatePayload.avgPrice = currentHolding.avgPrice;
                }

                batch.update(holdingRef, updatePayload as Record<string, FieldValue>);
            }
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