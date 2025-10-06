// Middleware to check if user is authenticated. 
import { Request, Response, NextFunction } from 'express';
import { auth } from '../utils/firestore';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

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

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided'
            });
            return;
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify the JWT token
        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const decodedToken = jwt.verify(token, jwtSecret) as { uid: string; email: string };
        
        if (!decodedToken || !decodedToken.uid) {
            logger.warn('Invalid token format', { requestId: req.requestId }, req);
            res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid token format'
            });
            return;
        }

        // Verify the user exists in Firebase
        const userRecord = await auth.getUser(decodedToken.uid);

        // Add the user to the request object
        req.user = {
            uid: userRecord.uid,
            email: userRecord.email,
        };

        logger.debug('User authenticated successfully', { 
            userId: userRecord.uid, 
            email: userRecord.email 
        }, req);

        next();

    } catch (error) {
        logger.error('Authentication failed', error as Error, { requestId: req.requestId }, req);
        res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token'
        });
    }
};