import { PlayerPerformance } from '../types/player';
import { Timestamp } from 'firebase-admin/firestore';

// Generate realistic performance data for simulation
export class TestDataGenerator {
    // Generate performance data for a single player over multiple games
    static generatePlayerPerformance(
        playerId: string,
        tier: string,
        gamesCount: number = 7,
        baseStats: {
            points: number;
            assists: number;
            rebounds: number;
            steals: number;
            blocks: number;
            fieldGoalPercentage: number;
            minutesPlayed: number;
            isStarter: boolean;
        }
    ): PlayerPerformance[] {
        const performances: PlayerPerformance[] = [];
        
        for (let game = 1; game <= gamesCount; game++) {
            // Add some variance to make it realistic
            const variance = 0.2; // 20% variance
            
            const performance: PlayerPerformance = {
                playerId,
                gameDate: Timestamp.fromDate(new Date(Date.now() - (gamesCount - game) * 24 * 60 * 60 * 1000)), // Each game is 1 day apart
                points: Math.round(baseStats.points * (1 + (Math.random() - 0.5) * variance)),
                assists: Math.round(baseStats.assists * (1 + (Math.random() - 0.5) * variance)),
                rebounds: Math.round(baseStats.rebounds * (1 + (Math.random() - 0.5) * variance)),
                steals: Math.round(baseStats.steals * (1 + (Math.random() - 0.5) * variance)),
                blocks: Math.round(baseStats.blocks * (1 + (Math.random() - 0.5) * variance)),
                fieldGoalPercentage: Math.max(0.3, Math.min(0.7, baseStats.fieldGoalPercentage + (Math.random() - 0.5) * 0.1)),
                effectiveFieldGoalPercentage: Math.max(0.35, Math.min(0.75, baseStats.fieldGoalPercentage + (Math.random() - 0.5) * 0.1 + 0.05)),
                minutesPlayed: Math.round(baseStats.minutesPlayed * (1 + (Math.random() - 0.5) * 0.15)),
                isStarter: baseStats.isStarter,
                gamesPlayed: gamesCount
            };
            
            // Ensure minimum values
            performance.points = Math.max(0, performance.points);
            performance.assists = Math.max(0, performance.assists);
            performance.rebounds = Math.max(0, performance.rebounds);
            performance.steals = Math.max(0, performance.steals);
            performance.blocks = Math.max(0, performance.blocks);
            performance.minutesPlayed = Math.max(10, Math.min(48, performance.minutesPlayed));
            
            performances.push(performance);
        }
        
        return performances;
    }

    // Generate test data for multiple players
    static generateTestPerformanceData(): { playerId: string; performances: PlayerPerformance[] }[] {
        const testData = [
            // Tier S - MVP Caliber
            {
                playerId: 'oTEpFPZTayI2NtsA2xFq', // Nikola Jokic
                baseStats: { points: 28, assists: 12, rebounds: 8, steals: 2, blocks: 1, fieldGoalPercentage: 0.65, minutesPlayed: 35, isStarter: true }
            },
            {
                playerId: 'fWEqEchGdOIec0glrN8n', // Shai Gilgeous-Alexander
                baseStats: { points: 32, assists: 8, rebounds: 5, steals: 2, blocks: 1, fieldGoalPercentage: 0.58, minutesPlayed: 36, isStarter: true }
            },
            {
                playerId: 'kd6lBAHQmoG34tjEtyRk', // Giannis Antetokounmpo
                baseStats: { points: 30, assists: 6, rebounds: 12, steals: 1, blocks: 2, fieldGoalPercentage: 0.62, minutesPlayed: 34, isStarter: true }
            },
            
            // Tier A - All-NBA
            {
                playerId: 'AH6yhwvgGZe0B2pJo2yE', // Luka Doncic
                baseStats: { points: 35, assists: 10, rebounds: 8, steals: 1, blocks: 1, fieldGoalPercentage: 0.55, minutesPlayed: 37, isStarter: true }
            },
            {
                playerId: 'qw8pe1Yfpc52QOjF2Ug6', // Joel Embiid
                baseStats: { points: 32, assists: 4, rebounds: 11, steals: 1, blocks: 3, fieldGoalPercentage: 0.60, minutesPlayed: 33, isStarter: true }
            },
            {
                playerId: '7f6YPOl5tWVBiRF8ggAi', // Kevin Durant
                baseStats: { points: 28, assists: 6, rebounds: 7, steals: 1, blocks: 2, fieldGoalPercentage: 0.58, minutesPlayed: 35, isStarter: true }
            },
            
            // Tier B - All-Star
            {
                playerId: 'yWyqIzCjx0goiJDBVsGP', // Anthony Edwards
                baseStats: { points: 26, assists: 5, rebounds: 6, steals: 2, blocks: 1, fieldGoalPercentage: 0.52, minutesPlayed: 34, isStarter: true }
            },
            {
                playerId: 'uiZ1xmNnQoXgdNNOAtrl', // Tyrese Haliburton
                baseStats: { points: 22, assists: 12, rebounds: 4, steals: 2, blocks: 1, fieldGoalPercentage: 0.54, minutesPlayed: 35, isStarter: true }
            },
            
            // Tier C - Starters
            {
                playerId: '8NCYSWEZsN89ssRBIgYd', // Cade Cunningham
                baseStats: { points: 20, assists: 8, rebounds: 5, steals: 1, blocks: 1, fieldGoalPercentage: 0.48, minutesPlayed: 32, isStarter: true }
            },
            {
                playerId: 'ZJ5WyYVS9XeSLQpBdczk', // Paolo Banchero
                baseStats: { points: 18, assists: 4, rebounds: 8, steals: 1, blocks: 1, fieldGoalPercentage: 0.50, minutesPlayed: 30, isStarter: true }
            },
            
            // Tier D - Bench/Role Players
            {
                playerId: '6DoidTYGsWrAL1LY0I6O', // Immanuel Quickley
                baseStats: { points: 12, assists: 4, rebounds: 3, steals: 1, blocks: 0, fieldGoalPercentage: 0.45, minutesPlayed: 22, isStarter: false }
            },
            {
                playerId: 'PkwzlsVrkLTADxNFkzo4', // Josh Giddey
                baseStats: { points: 10, assists: 6, rebounds: 5, steals: 1, blocks: 0, fieldGoalPercentage: 0.42, minutesPlayed: 20, isStarter: false }
            },
            
            // Tier E - Deep Bench
            {
                playerId: 'IqFURDHB2KYMrVFH9gVK', // Malaki Branham
                baseStats: { points: 6, assists: 2, rebounds: 2, steals: 0, blocks: 0, fieldGoalPercentage: 0.40, minutesPlayed: 15, isStarter: false }
            },
            {
                playerId: '7VL1Lwlv46VXfVYvrnTr', // Blake Wesley
                baseStats: { points: 4, assists: 1, rebounds: 1, steals: 0, blocks: 0, fieldGoalPercentage: 0.38, minutesPlayed: 12, isStarter: false }
            }
        ];

        return testData.map(data => ({
            playerId: data.playerId,
            performances: this.generatePlayerPerformance(data.playerId, 'B', 7, data.baseStats)
        }));
    }

    // Generate performance data for a specific week
    static generateWeekPerformance(weekNumber: number): PlayerPerformance[] {
        const testData = this.generateTestPerformanceData();
        const weekPerformances: PlayerPerformance[] = [];
        
        testData.forEach(data => {
            // Use the performance from the specified week (1-7)
            const weekIndex = Math.min(weekNumber - 1, data.performances.length - 1);
            const performance = data.performances[weekIndex];
            weekPerformances.push(performance);
        });
        
        return weekPerformances;
    }
}
