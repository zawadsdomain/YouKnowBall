import { transactionsRef, holdingsRef, usersRef } from '../config/firestore';
import { db } from '../utils/firestore';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
// this handles all the logic for when a user buys or sells a player -- post validation
// called by the transactionController.ts
export const transactionService = {
    async processTransaction(userId: string, playerId: string, transactionType: 'buy' | 'sell', quantity: number, price: number) {
        // Use Firestore transaction to ensure atomicity and prevent race conditions
        return await db.runTransaction(async (transaction) => {
            // 1. Create transaction record
            const transactionRef = transactionsRef.doc();
            const transactionData = {
                userId,
                playerId,
                transactionType,
                quantity,
                price,
                timestamp: Timestamp.now()
            };
            transaction.set(transactionRef, transactionData);

            // 2. Read and update user's balance
            const userRef = usersRef.doc(userId);
            const userDoc = await transaction.get(userRef);
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

            transaction.update(userRef, { balance: newBalance });

            // 3. Read and update holdings
            const holdingId = `${userId}_${playerId}`;
            const holdingRef = holdingsRef.doc(holdingId);
            const holdingDoc = await transaction.get(holdingRef);

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
                    transaction.delete(holdingRef);
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

                    transaction.update(holdingRef, updatePayload as Record<string, FieldValue>);
                }
            } else {
                if (transactionType === 'sell') {
                    throw new Error('Cannot sell shares you do not own');
                }

                transaction.set(holdingRef, {
                    userId,
                    playerId,
                    quantity,
                    avgPrice: price,
                    mostRecentPurchase: Timestamp.now(),
                    updatedAt: Timestamp.now()
                });
            }

            // Transaction will automatically commit if no errors are thrown
            return {
                transactionId: transactionRef.id,
                newBalance,
                holdingId
            };
        });
    }
}; 