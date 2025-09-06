import { PlayerPerformance, PriceChangeFactors, TierPricing } from '../types/player';
import { TIER_PRICING } from '../config/playerData';

export class PriceChangeEngine {
    // Performance weights for different stats
    private static readonly PERFORMANCE_WEIGHTS = {
        points: 2.0,        // Points are most valuable
        assists: 1.5,       // Playmaking is valuable
        rebounds: 1.2,      // Rebounding is good
        steals: 1.8,        // Defense is valuable
        blocks: 1.6,        // Shot blocking is valuable
        fieldGoalPercentage: 0.5,  // Efficiency matters
        effectiveFieldGoalPercentage: 0.7,  // More important than regular FG%
        minutesPlayed: 0.1  // Playing time matters
    };

    // Calculate performance bonus based on stats
    static calculatePerformanceBonus(performance: PlayerPerformance, tier: string): number {
        const weights = this.PERFORMANCE_WEIGHTS;
        const tierPricing = TIER_PRICING[tier as keyof typeof TIER_PRICING];
        
        // Base performance score
        // multiply each stat by its weight and sum them up
        let performanceScore = 
            (performance.points * weights.points) +
            (performance.assists * weights.assists) +
            (performance.rebounds * weights.rebounds) +
            (performance.steals * weights.steals) +
            (performance.blocks * weights.blocks) +
            (performance.fieldGoalPercentage * weights.fieldGoalPercentage) +
            (performance.effectiveFieldGoalPercentage * weights.effectiveFieldGoalPercentage) +
            (performance.minutesPlayed * weights.minutesPlayed);

        // Normalize by games played
        performanceScore = performanceScore / performance.gamesPlayed;
        
        // Convert to price change (higher tier = bigger impact)
        // get the tier multiplier from tier pricing
        const tierMultiplier = this.getTierMultiplier(tier);
        return Math.round(performanceScore * tierMultiplier);
    }

    // Calculate efficiency penalty i.e shot chucker penalty
    static calculateEfficiencyPenalty(performance: PlayerPerformance, tier: string): number {
        const tierPricing = TIER_PRICING[tier as keyof typeof TIER_PRICING];
        
        // Penalty for poor shooting
        // as of now, the penalty is building as they get worse.
        // FUTURE consideration: don't keep incrementing the penalty, rather have a static penalty for each fg% range.
        let penalty = 0;
        
        if (performance.fieldGoalPercentage < 0.4) {
            penalty += 20;
        }
        if (performance.fieldGoalPercentage < 0.35) {
            penalty += 30;
        }
        
        // Penalty for low minutes (bench player)
        if (performance.minutesPlayed < 20) {
            penalty += 15;
        }
        
        // Penalty for not being a starter
        if (!performance.isStarter) {
            penalty += 25;
        }
        
        return penalty;
    }

    // Calculate role bonus
    static calculateRoleBonus(performance: PlayerPerformance, tier: string): number {
        let bonus = 0;
        
        // Bonus for being a starter
        if (performance.isStarter) {
            bonus += 30;
        }
        
        // Bonus for high minutes (starter role)
        if (performance.minutesPlayed >= 30) {
            bonus += 20;
        }
        
        // Bonus for consistent playing time
        if (performance.gamesPlayed >= 5) {
            bonus += 15;
        }
        
        return bonus;
    }

    // Get tier multiplier for price changes
    private static getTierMultiplier(tier: string): number {
        switch (tier) {
            case 'S': return 8;
            case 'A': return 6;
            case 'B': return 4;
            case 'C': return 3;
            case 'D': return 2;
            case 'E': return 1;
            default: return 2;
        }
    }

    // Main pricing formula = baseGain + performanceBonus - efficiencyPenalty + roleBonus
    static calculatePriceChange(
        currentPrice: number,
        performance: PlayerPerformance,
        tier: string
    ): PriceChangeFactors {
        const tierPricing = TIER_PRICING[tier as keyof typeof TIER_PRICING];
        
        const baseGain = tierPricing.baseGain;
        const performanceBonus = this.calculatePerformanceBonus(performance, tier);
        const efficiencyPenalty = this.calculateEfficiencyPenalty(performance, tier);
        const roleBonus = this.calculateRoleBonus(performance, tier);
        
        let totalChange = baseGain + performanceBonus - efficiencyPenalty + roleBonus;
        
        // Cap the weekly change
        const maxChange = tierPricing.maxWeeklyChange;
        if (Math.abs(totalChange) > maxChange) {
            totalChange = totalChange > 0 ? maxChange : -maxChange;
        }
        
        // Ensure price doesn't go below minimum
        const newPrice = currentPrice + totalChange;
        const minPrice = tierPricing.minPrice;
        if (newPrice < minPrice) {
            totalChange = minPrice - currentPrice;
        }
        
        // return the price change factors for the player
        return {
            baseGain,
            performanceBonus,
            efficiencyPenalty,
            roleBonus,
            totalChange
        };
    }
}
