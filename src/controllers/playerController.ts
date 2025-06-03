import { Request, Response } from 'express';

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

            // TODO: Implement Firebase fetch for all players. For now, return mock data.

            const mockPlayers: Player[] = [
                {
                    id: '1',
                    name: 'Cade Cunningham',
                    team: 'Detroit Pistons',
                    position: 'PG',
                    currentPrice: 10000,
                    stats: {
                        points: 20,
                        rebounds: 5,
                        assists: 10
                    }
                },

                {
                    id: '2', 
                    name: 'Jaden McDaniels',
                    team: 'Minnesota Timberwolves',
                    position: 'PF',
                    currentPrice: 5000,
                    stats: {
                        points: 15,
                        rebounds: 7,
                        assists: 3
                    }
                }
            ];

            res.json({
                success: true,
                data: mockPlayers
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
          }
};