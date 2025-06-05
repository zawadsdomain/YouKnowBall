// Connects to the Firestore db.
// Initializes the references to the collections in the db -- used in the controllers to be imported. 
import { db } from '../utils/firestore';

// Collection references
export const usersRef = db.collection('users');
export const playersRef = db.collection('players');


export const transactionsRef = db.collection('transactions');
export const portfoliosRef = db.collection('portfolios');

// You can add more collection references as needed 