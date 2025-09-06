import { Timestamp } from 'firebase-admin/firestore';

export type PlayerTier = 'S' | 'A' | 'B' | 'C' | 'D' | 'E';

export interface Player {
    id: string;
    name: string;
    tier: PlayerTier;
    team: string;
    position: string;
    starterPrice: number;
    currentPrice: number;
    lastUpdated: Timestamp;
    isActive: boolean;
}

export interface PlayerPerformance {
    playerId: string;
    gameDate: Timestamp;
    points: number;
    assists: number;
    rebounds: number;
    steals: number;
    blocks: number;
    fieldGoalPercentage: number;
    effectiveFieldGoalPercentage: number;
    minutesPlayed: number;
    isStarter: boolean;
    gamesPlayed: number;
}

export interface PriceChangeFactors {
    baseGain: number;
    performanceBonus: number;
    efficiencyPenalty: number;
    roleBonus: number;
    totalChange: number;
}

export interface TierPricing {
    tier: PlayerTier;
    minPrice: number;
    maxPrice: number;
    baseGain: number;
    maxWeeklyChange: number;
}

export interface PriceUpdateHistory {
    id: string;
    playerId: string;
    playerName: string;
    tier: PlayerTier;
    oldPrice: number;
    newPrice: number;
    priceChange: number;
    factors: PriceChangeFactors;
    performanceData: PlayerPerformance;
    updateDate: Timestamp;
    weekNumber: number;
    simulationId?: string;
}
