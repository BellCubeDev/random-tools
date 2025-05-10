import { maxNewAssignPointsForStatInALevelPerClassTier, ZaneClassTier, type ZaneStat } from "./StatsTypes";

export function statEligibleForCatchup(
    stat: ZaneStat,
    classTier: ZaneClassTier,
    classLevel: number,
    recentGrowthPoints: number,
): boolean {
    const maxNewAssignPointsForStatInALevel = maxNewAssignPointsForStatInALevelPerClassTier[classTier];
    let catchupThreshold = Infinity;
    switch (classTier) {
        case ZaneClassTier.BASIC:
            catchupThreshold = classLevel;
            break;
        case ZaneClassTier.ADVANCED:
            catchupThreshold = 20 + classLevel;
            break;
        case ZaneClassTier.PROMOTED:
            catchupThreshold = 40 + classLevel;
            break;
    }
    return (stat.points + recentGrowthPoints + maxNewAssignPointsForStatInALevel) < catchupThreshold;
}
