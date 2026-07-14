import { Request, Response } from 'express';
import { usersRef } from '../config/firestore';
import { auth } from '../utils/firestore';

const getUserIdFromReq = (req: Request) => {
    // auth middleware attaches the decoded user to req.user; TS may not know that, so use any.
    return (req as any).user?.uid as string | undefined;
};

const userController = {
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const users = await usersRef.get();
            const usersData = users.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            res.json({ success: true, data: usersData });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching users', error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    },

    getUserById: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const userDoc = await usersRef.doc(userId).get();
            if (!userDoc.exists) return res.status(404).json({ success: false, message: 'User not found' });
            res.json({ success: true, data: userDoc.data() });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching user', error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    },

    getProfile: async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromReq(req);
            if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized: no authenticated user' });
            const userDoc = await usersRef.doc(userId).get();
            if (!userDoc.exists) return res.status(404).json({ success: false, message: 'User profile not found' });
            res.json({ success: true, data: userDoc.data() });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching profile', error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    },

    createUser: async (req: Request, res: Response) => {
        try {
            const { email, password, username } = req.body;
            if (!auth) return res.status(500).json({ success: false, message: 'Firebase Auth not initialized' });
            const userRecord = await auth.createUser({ email, password, displayName: username });
            await usersRef.doc(userRecord.uid).set({ username, email, balance: 10000, createdAt: new Date(), updatedAt: new Date() });
            const token = await auth.createCustomToken(userRecord.uid);
            res.status(201).json({ success: true, message: 'User created successfully', token, data: { uid: userRecord.uid, email: userRecord.email, username: userRecord.displayName, token } });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error creating user', error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    },

    loginUser: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            if (!auth) return res.status(500).json({ success: false, message: 'Firebase Auth not initialized' });
            const userRecord = await auth.getUserByEmail(email);
            const token = await auth.createCustomToken(userRecord.uid);
            res.json({ success: true, token, data: { token, userId: userRecord.uid, email: userRecord.email } });
        } catch (error) {
            res.status(401).json({ success: false, message: 'Invalid credentials', error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    },

    deleteAccount: async (req: Request, res: Response) => {
        try {
            const userId = getUserIdFromReq(req);
            if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

            if (auth) {
                await auth.deleteUser(userId);
            }

            await usersRef.doc(userId).delete();
            res.json({ success: true, message: 'Account deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error deleting account', error: error instanceof Error ? error.message : 'An unknown error occurred' });
        }
    },
};

export default userController;