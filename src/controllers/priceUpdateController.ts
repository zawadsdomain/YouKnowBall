import { Request, Response } from 'express';
import { PriceUpdateService } from '../services/priceUpdateService';
import { PlayerPerformance } from '../types/player';

export const priceUpdateController = {
    // Update a single player's price
    updatePlayerPrice: async (req: Request, res: Response) => {
        try {
            const { playerId } = req.params;
            const performanceData: PlayerPerformance = req.body;

            // Validate required fields
            if (!performanceData.points || !performanceData.gamesPlayed) {
                return res.status(400).json({
                    success: false,
                    message: 'Performance data must include points and gamesPlayed'
                });
            }

            const result = await PriceUpdateService.updatePlayerPrice(playerId, performanceData);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating player price',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    },

    // Update multiple players' prices (weekly update)
    updateMultiplePlayerPrices: async (req: Request, res: Response) => {
        try {
            const { performanceData, weekNumber = 1, simulationId } = req.body;

            if (!Array.isArray(performanceData) || performanceData.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'performanceData must be a non-empty array'
                });
            }

            const results = await PriceUpdateService.updateMultiplePlayerPrices(
                performanceData,
                weekNumber,
                simulationId
            );
            const summary = PriceUpdateService.getPriceUpdateSummary(results);

            res.json({
                success: true,
                data: {
                    summary,
                    results
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating multiple player prices',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    },

    // Get price update history for a specific player
    getPlayerPriceHistory: async (req: Request, res: Response) => {
        try {
            const { playerId } = req.params;
            const history = await PriceUpdateService.getPlayerPriceHistory(playerId);

            res.json({
                success: true,
                data: history
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching player price history',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    },

    // Get all price update history (with optional filters)
    getAllPriceUpdateHistory: async (req: Request, res: Response) => {
        try {
            const { weekNumber, simulationId, limit = 100 } = req.query;
            
            const history = await PriceUpdateService.getAllPriceHistory(
                weekNumber ? parseInt(weekNumber as string) : undefined,
                simulationId as string,
                parseInt(limit as string)
            );

            res.json({
                success: true,
                data: history
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching price update history',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    },

    // Get price update history (placeholder for future implementation)
    getPriceUpdateHistory: async (req: Request, res: Response) => {
        try {
            // Redirect to the new implementation
            await priceUpdateController.getAllPriceUpdateHistory(req, res);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching price update history',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }
};
