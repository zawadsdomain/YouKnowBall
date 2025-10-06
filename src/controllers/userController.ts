import { Request, Response } from 'express';
import { usersRef } from '../config/firestore';
import { auth } from '../utils/firestore';
import { Auth } from 'firebase-admin/auth';
import jwt from 'jsonwebtoken';

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

            // Get user document
            const userDoc = await usersRef.doc(userId).get();
            if (!userDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const userData = userDoc.data();
            
            res.json({
                success: true, 
                data: userData
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching user',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }, 

    createUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, username } = req.body;

            // Create user in Firebase Auth
            const userRecord = await auth.createUser({
                email,
                password,
                displayName: username
            });

            // Create user document in Firestore
            await usersRef.doc(userRecord.uid).set({
                username,
                email,
                balance: 10000, // starting balance
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // Create a JWT token for immediate login
            const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
            const token = jwt.sign(
                { 
                    uid: userRecord.uid,
                    email: userRecord.email 
                },
                jwtSecret,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    token,
                    uid: userRecord.uid,
                    email: userRecord.email,
                    username: userRecord.displayName
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating user',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    },

    loginUser: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            
            // Get user by email
            const userRecord = await auth.getUserByEmail(email);
            
            // Create a JWT token for testing (in production, you'd verify password)
            const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
            const token = jwt.sign(
                { 
                    uid: userRecord.uid,
                    email: userRecord.email 
                },
                jwtSecret,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                data: { 
                    token,
                    userId: userRecord.uid,
                    email: userRecord.email
                }
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            });
        }
    }



}