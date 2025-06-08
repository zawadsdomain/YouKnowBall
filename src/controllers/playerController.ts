import { Request, Response } from 'express';
import { playersRef } from '../config/firestore';
interface Player {
    id: string;
    name: string;
    team: string;
    position: string;
    currentPrice: number;

    stats: {
        points: number;
        rebounds: number;
        assists: number;
        // add more stats later.
    }

}

export const playerController = {


    getAllPlayers: async (req: Request, res: Response) => {
        try {
            const players = await playersRef.get();
            const playersData = players.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));

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

    getPlayerById: async (req: Request, res: Response) => {
        try {
            const { playerId } = req.params;

            // TODO: implement firebase fetch for player by id. For now, return mock data.

            const mockPlayer: Player = {
                id: playerId,
                name: 'Cade Cunningham',
                team: 'Detroit Pistons',
                position: 'PG',
                currentPrice: 10000,
                stats: {
                    points: 20,
                    rebounds: 5,
                    assists: 10
                }
            };

            if(!mockPlayer) {
                return res.status(404).json({
                    success: false,
                    message: 'Player not found'

                });
            }



            res.json({
                success: true,
                data: mockPlayer
              });
            } catch (error) {
              res.status(500).json({
                success: false,
                message: 'Error fetching player',
                error: error instanceof Error ? error.message : 'Unknown error'
              });
            }
          },

          createPlayer: async (req: Request, res: Response) => {
            try {
                const { name, team, position, currentPrice, stats } = req.body;

                const playerData = {
                    name,
                    team,
                    position,
                    currentPrice: currentPrice || 1000,
                    stats: stats || {
                        points: 0,
                        rebounds: 0,
                        assists: 0
                    }
                };

                const playerRef = await playersRef.add(playerData);
                const playerDoc = await playerRef.get();

                res.status(201).json({
                    success: true,
                    data: {
                        id: playerDoc.id,
                        ...playerData
                    }
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Error creating player',
                    error: error instanceof Error ? error.message : 'An unknown error occurred'
                });
            }
          }
};