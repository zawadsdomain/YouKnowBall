// Middleware to check if user is authenticated. 
import { Request, Response, NextFunction } from 'express';
import { auth } from '../utils/firestore';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                uid: string;
                email?: string;


                // Add other properties as needed. + check if the ones above are needed.
                // Do not add password. 
            };
        }
    }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided'
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Decode the token to get the user ID
        const decodedToken = jwt.decode(token) as { uid: string };
        
        if (!decodedToken || !decodedToken.uid) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid token format'
            });
        }

        // Verify the user exists in Firebase
        const userRecord = await auth.getUser(decodedToken.uid);

        // Add the user to the request object
        req.user = {
            uid: userRecord.uid,
            email: userRecord.email,
        };

        next();

    } catch (error) {
        console.error('Auth error: ', error);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token'
        });
    }
};