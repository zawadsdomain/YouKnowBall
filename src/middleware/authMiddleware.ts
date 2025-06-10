// Middleware to check if user is authenticated. 
import { Request, Response, NextFunction } from 'express';
import { auth } from '../utils/firestore';

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

        const idToken = authHeader.split('Bearer ')[1];

        const decodedToken = await auth.verifyIdToken(idToken);

        // Add the user to the request object
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
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