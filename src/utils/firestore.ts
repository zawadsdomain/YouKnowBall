// Initialize Firebase Admin SDK 
// This is used to interact with the Firebase Firestore database.
import admin from 'firebase-admin';
import * as serviceAccount from '../../serviceAccountKey.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const db = admin.firestore();

export { db };