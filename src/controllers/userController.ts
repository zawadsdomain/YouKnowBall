import { Request, Response } from 'express';

interface User {
    id: number;
    username: string; 
    email: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    // todo: add holdings into its own holdings interface in its own controller/routes

}

export const userController = {

    getAllUsers: async (req: Request, res: Response) => {
    try {

        // TODO: Implement Firebase fetch for all users. For now, return mock data.

        const mockUsers: User[] = [
            {
                id: 1,
                username: 'John Doe',
                email: 'john.doe@example.com',
                balance: 1000,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                username: 'Jane Smith',
                email: 'jane.smith@example.com',
                balance: 1500,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                username: 'Zawad Chowdhury',
                email: 'zawadchowdhury@example.com',
                balance: 10000,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        res.json({
            success: true,
            data: mockUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }


        
    
},

    getUserById: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            // TODO: Implement Firebase fetch for user by id. For now, return mock data.

            const mockUser: User = {
                id: parseInt(userId),
                username: 'John Doe',
                email: 'john.doe@example.com',
                balance: 1000,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            res.json({
                success: true, 
                data: mockUser
            });

        } catch (error) {
            res.status(500).json({
                success:false,
                message: 'Error fetching user',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }

}