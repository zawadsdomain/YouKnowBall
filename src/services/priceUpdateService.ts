import { playersRef, priceUpdateHistoryRef } from '../config/firestore';
import { Player, PlayerPerformance, PriceUpdateHistory } from '../types/player';
import { PriceChangeEngine } from './priceChangeEngine';
import { Timestamp } from 'firebase-admin/firestore';

export interface PriceUpdateResult {
    playerId: string;
    playerName: string;
    oldPrice: number;
    newPrice: number;
    priceChange: number;
    factors: {
        baseGain: number;
        performanceBonus: number;
        efficiencyPenalty: number;
        roleBonus: number;
        totalChange: number;
    };
}

// this is where we update the players price based on their performance data using priceChangeEngine.ts
export class PriceUpdateService {
    // Update a single player's price based on performance
    static async updatePlayerPrice(
        playerId: string,
        performance: PlayerPerformance,
        weekNumber: number = 1,
        simulationId?: string
    ): Promise<PriceUpdateResult> {
        try {
            // Get current player data
            const playerDoc = await playersRef.doc(playerId).get();
            if (!playerDoc.exists) {
                throw new Error(`Player ${playerId} not found`);
            }

            const playerData = playerDoc.data() as Player;
            const currentPrice = playerData.currentPrice;
            const tier = playerData.tier;

            // Calculate price change
            const priceFactors = PriceChangeEngine.calculatePriceChange(
                currentPrice,
                performance,
                tier
            );

            const newPrice = currentPrice + priceFactors.totalChange;

            // Update player in database, changing the current price and last updated timestamp
            await playersRef.doc(playerId).update({
                currentPrice: newPrice,
                lastUpdated: Timestamp.now()
            });

            // Record price update history
            const historyId = priceUpdateHistoryRef.doc().id;
            const historyRecord: PriceUpdateHistory = {
                id: historyId,
                playerId,
                playerName: playerData.name,
                tier,
                oldPrice: currentPrice,
                newPrice,
                priceChange: priceFactors.totalChange,
                factors: priceFactors,
                performanceData: performance,
                updateDate: Timestamp.now(),
                weekNumber,
                simulationId
            };

            await priceUpdateHistoryRef.doc(historyId).set(historyRecord);

            return {
                playerId,
                playerName: playerData.name,
                oldPrice: currentPrice,
                newPrice,
                priceChange: priceFactors.totalChange,
                factors: priceFactors
            };
        } catch (error) {
            console.error(`Error updating price for player ${playerId}:`, error);
            throw error;
        }
    }

    // Update multiple players' prices (for weekly updates)
    static async updateMultiplePlayerPrices(
        performanceData: PlayerPerformance[],
        weekNumber: number = 1,
        simulationId?: string
    ): Promise<PriceUpdateResult[]> {
        try {
            console.log(`Starting price update for ${performanceData.length} players...`);
            
            const results: PriceUpdateResult[] = [];
            const batch = playersRef.firestore.batch();

            for (const performance of performanceData) {
                try {
                    const result = await this.updatePlayerPrice(
                        performance.playerId,
                        performance,
                        weekNumber,
                        simulationId
                    );
                    results.push(result);
                } catch (error) {
                    console.error(`Failed to update player ${performance.playerId}:`, error);
                    // Continue with other players even if one fails
                }
            }

            console.log(`Successfully updated ${results.length} players`);
            return results;
        } catch (error) {
            console.error('Error in batch price update:', error);
            throw error;
        }
    }

    // Get price update history for a specific player
    static async getPlayerPriceHistory(playerId: string): Promise<PriceUpdateHistory[]> {
        try {
            const historySnapshot = await priceUpdateHistoryRef
                .where('playerId', '==', playerId)
                .orderBy('updateDate', 'desc')
                .get();

            return historySnapshot.docs.map(doc => doc.data() as PriceUpdateHistory);
        } catch (error) {
            console.error(`Error fetching price history for player ${playerId}:`, error);
            throw error;
        }
    }

    // Get all price update history (with optional filters)
    static async getAllPriceHistory(
        weekNumber?: number,
        simulationId?: string,
        limit: number = 100
    ): Promise<PriceUpdateHistory[]> {
        try {
            let query = priceUpdateHistoryRef.orderBy('updateDate', 'desc').limit(limit);
            
            if (weekNumber !== undefined) {
                query = query.where('weekNumber', '==', weekNumber);
            }
            
            if (simulationId) {
                query = query.where('simulationId', '==', simulationId);
            }

            const historySnapshot = await query.get();
            return historySnapshot.docs.map(doc => doc.data() as PriceUpdateHistory);
        } catch (error) {
            console.error('Error fetching price history:', error);
            throw error;
        }
    }

    // Get price update summary
    static getPriceUpdateSummary(results: PriceUpdateResult[]) {
        const totalPlayers = results.length;
        const priceIncreases = results.filter(r => r.priceChange > 0).length;
        const priceDecreases = results.filter(r => r.priceChange < 0).length;
        const noChange = results.filter(r => r.priceChange === 0).length;
        
        const totalPriceChange = results.reduce((sum, r) => sum + r.priceChange, 0);
        const averageChange = totalPriceChange / totalPlayers;

        return {
            totalPlayers,
            priceIncreases,
            priceDecreases,
            noChange,
            totalPriceChange,
            averageChange,
            results
        };
    }
}
