import { Request, Response } from 'express';
import { playersRef } from '../config/firestore';
import { Player } from '../types/player';
import { seedPlayers, clearPlayers } from '../services/playerSeedService';

export const playerController = {
    // Get all players
    getAllPlayers: async (req: Request, res: Response) => {
        try {
            const players = await playersRef.get();
            const playersData = players.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as Player[];

            res.json({
                success: true,
                data: playersData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching players',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    },

    // Get player by ID
    getPlayerById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const playerDoc = await playersRef.doc(id).get();

            if (!playerDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: 'Player not found'
                });
            }

            const playerData = {
                id: playerDoc.id,
                ...playerDoc.data()
            } as Player;

            res.json({
                success: true,
                data: playerData
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching player',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    },

    // Seed players (for development/testing)
    seedPlayers: async (req: Request, res: Response) => {
        try {
            const result = await seedPlayers();
            res.json({
                success: true,
                message: result.message,
                count: result.count
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error seeding players',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    },

    // Clear players (for development/testing)
    clearPlayers: async (req: Request, res: Response) => {
        try {
            const result = await clearPlayers();
            res.json({
                success: true,
                message: result.message,
                count: result.count
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error clearing players',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }
};