// Initialize Firebase Admin SDK 
// This is used to interact with the Firebase Firestore database.
import admin from 'firebase-admin';
import path from 'path';

const serviceAccount = require(path.join(process.cwd(), 'serviceAccountKey.json'));

console.log('Service Account:', {
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email
});

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
    console.log('Firebase Admin initialized successfully');
} catch (error) {
    console.error('Firebase Admin initialization error:', error);
}

const db = admin.firestore();

export { db };
export const auth = admin.auth();