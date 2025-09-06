import { PlayerTier, TierPricing } from '../types/player';

export const TIER_PRICING: Record<PlayerTier, TierPricing> = {
    S: {
        tier: 'S',
        minPrice: 3900,
        maxPrice: 4200,
        baseGain: 75,
        maxWeeklyChange: 300
    },
    A: {
        tier: 'A',
        minPrice: 3000,
        maxPrice: 3800,
        baseGain: 60,
        maxWeeklyChange: 250
    },
    B: {
        tier: 'B',
        minPrice: 2000,
        maxPrice: 2900,
        baseGain: 50,
        maxWeeklyChange: 200
    },
    C: {
        tier: 'C',
        minPrice: 1000,
        maxPrice: 1900,
        baseGain: 40,
        maxWeeklyChange: 150
    },
    D: {
        tier: 'D',
        minPrice: 500,
        maxPrice: 900,
        baseGain: 30,
        maxWeeklyChange: 100
    },
    E: {
        tier: 'E',
        minPrice: 300,
        maxPrice: 499,
        baseGain: 25,
        maxWeeklyChange: 75
    }
};

export const INITIAL_PLAYERS = [
    // Tier S - MVP Caliber
    { name: 'Nikola Jokic', tier: 'S', team: 'DEN', position: 'C', starterPrice: 4100 },
    { name: 'Shai Gilgeous-Alexander', tier: 'S', team: 'OKC', position: 'PG', starterPrice: 4000 },
    { name: 'Giannis Antetokounmpo', tier: 'S', team: 'MIL', position: 'PF', starterPrice: 3950 },
    
    // Tier A - All-NBA
    { name: 'Luka Doncic', tier: 'A', team: 'DAL', position: 'PG', starterPrice: 3700 },
    { name: 'Joel Embiid', tier: 'A', team: 'PHI', position: 'C', starterPrice: 3600 },
    { name: 'Kevin Durant', tier: 'A', team: 'PHX', position: 'SF', starterPrice: 3500 },
    { name: 'LeBron James', tier: 'A', team: 'LAL', position: 'SF', starterPrice: 3400 },
    { name: 'Stephen Curry', tier: 'A', team: 'GSW', position: 'PG', starterPrice: 3300 },
    
    // Tier B - All-Star
    { name: 'Anthony Edwards', tier: 'B', team: 'MIN', position: 'SG', starterPrice: 2800 },
    { name: 'Tyrese Haliburton', tier: 'B', team: 'IND', position: 'PG', starterPrice: 2700 },
    { name: 'Devin Booker', tier: 'B', team: 'PHX', position: 'SG', starterPrice: 2600 },
    { name: 'Jayson Tatum', tier: 'B', team: 'BOS', position: 'SF', starterPrice: 2500 },
    { name: 'Damian Lillard', tier: 'B', team: 'MIL', position: 'PG', starterPrice: 2400 },
    
    // Tier C - Starters
    { name: 'Cade Cunningham', tier: 'C', team: 'DET', position: 'PG', starterPrice: 1800 },
    { name: 'Paolo Banchero', tier: 'C', team: 'ORL', position: 'PF', starterPrice: 1700 },
    { name: 'Scottie Barnes', tier: 'C', team: 'TOR', position: 'SF', starterPrice: 1600 },
    { name: 'Franz Wagner', tier: 'C', team: 'ORL', position: 'SF', starterPrice: 1500 },
    { name: 'Jalen Green', tier: 'C', team: 'HOU', position: 'SG', starterPrice: 1400 },
    
    // Tier D - Bench/Role Players
    { name: 'Immanuel Quickley', tier: 'D', team: 'TOR', position: 'PG', starterPrice: 800 },
    { name: 'Josh Giddey', tier: 'D', team: 'CHI', position: 'PG', starterPrice: 700 },
    { name: 'Jaden Ivey', tier: 'D', team: 'DET', position: 'SG', starterPrice: 600 },
    
    // Tier E - Deep Bench
    { name: 'Malaki Branham', tier: 'E', team: 'SAS', position: 'SG', starterPrice: 400 },
    { name: 'Blake Wesley', tier: 'E', team: 'SAS', position: 'PG', starterPrice: 350 },
    { name: 'Jaden Hardy', tier: 'E', team: 'DAL', position: 'SG', starterPrice: 320 }
];
