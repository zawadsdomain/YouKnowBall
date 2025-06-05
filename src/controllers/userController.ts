import { Request, Response } from 'express';
import { usersRef } from '../config/firestore';

interface User {
    id: string;  // Changed to string since Firestore uses string IDs
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

        // Implement Firebase fetch for all users.

        const users = await usersRef.get();
        const usersData = users.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))

        res.json({
            success: true,
            data: usersData
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
                id: userId,
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
    }, 

    createUser: async (req: Request, res: Response) => {
        try {
            const { username, email, balance = 10000 } = req.body;

            // Create new user document using usersRef
            const userRef = await usersRef.add({
                username,
                email,
                balance,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Get the created user
            const userDoc = await userRef.get();
            const userData = userDoc.data();

            res.status(201).json({
                success: true,
                data: {
                    id: userRef.id,
                    ...userData
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating user',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }



}