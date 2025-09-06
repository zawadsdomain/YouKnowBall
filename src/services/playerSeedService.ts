import { playersRef } from '../config/firestore';
import { INITIAL_PLAYERS } from '../config/playerData';
import { Timestamp } from 'firebase-admin/firestore';

// this file - playerSeedService.ts - is used to seed the players into the database and clear the players from the database.
// for development and testing purposes.

export const seedPlayers = async () => {
    try {
        console.log('Starting player seeding...');
        
        const batch = playersRef.firestore.batch();
        
        for (const playerData of INITIAL_PLAYERS) {
            const playerId = playersRef.doc().id; // Generate a unique ID
            
            const player = {
                id: playerId,
                name: playerData.name,
                tier: playerData.tier,
                team: playerData.team,
                position: playerData.position,
                starterPrice: playerData.starterPrice,
                currentPrice: playerData.starterPrice, // Start with starter price
                lastUpdated: Timestamp.now(),
                isActive: true
            };
            
            const playerRef = playersRef.doc(playerId);
            batch.set(playerRef, player);
        }
        
        await batch.commit();
        console.log(`Successfully seeded ${INITIAL_PLAYERS.length} players`);
        
        return {
            success: true,
            message: `Seeded ${INITIAL_PLAYERS.length} players`,
            count: INITIAL_PLAYERS.length
        };
    } catch (error) {
        console.error('Error seeding players:', error);
        throw error;
    }
};

export const clearPlayers = async () => {
    try {
        console.log('Clearing all players...');
        
        const players = await playersRef.get();
        const batch = playersRef.firestore.batch();
        
        players.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        console.log(`Cleared ${players.docs.length} players`);
        
        return {
            success: true,
            message: `Cleared ${players.docs.length} players`,
            count: players.docs.length
        };
    } catch (error) {
        console.error('Error clearing players:', error);
        throw error;
    }
};
