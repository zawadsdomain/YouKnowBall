// Initialize Firebase Admin SDK 
// This is used to interact with the Firebase Firestore database.
import admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let serviceAccount: any;

try {
    // Try to load from serviceAccountKey.json file first
    serviceAccount = require(path.join(process.cwd(), 'serviceAccountKey.json'));
} catch (error) {
    // Fall back to environment variables
    serviceAccount = {
        type: 'service_account',
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    };

    if (!serviceAccount.private_key || !serviceAccount.project_id) {
        console.warn('⚠️  Firebase credentials not found. Please set up Firebase configuration.');
        console.warn('   1. Get your service account key from Firebase Console');
        console.warn('   2. Either: Place serviceAccountKey.json in the root directory');
        console.warn('      OR: Set environment variables (see .env.example)');
    }
}

try {
    if (serviceAccount.private_key && serviceAccount.project_id) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL
        });
        console.log('✅ Firebase Admin initialized successfully');
    } else {
        console.warn('⚠️  Skipping Firebase initialization - credentials incomplete');
    }
} catch (error) {
    if (admin.apps.length === 0) {
        console.error('❌ Firebase Admin initialization error:', error);
    }
}

const db = admin.firestore();

export { db };
export const auth = admin.apps.length > 0 ? admin.auth() : null;