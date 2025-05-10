import { getCapsForStat, ZaneClassTier, ZaneStatType, type ZaneStatSheet, type ZaneStatTypeGrowth } from "./StatsTypes";
import type { ZaneNextStatSheet } from "./useStatState";

export function gainZaneStatSheetLevel(
    nextStatSheet: ZaneNextStatSheet,
    classTier: ZaneClassTier,
) {
    switch (classTier) {
        case ZaneClassTier.BASIC:
            nextStatSheet.classData.basic.setLevelNext(level => level + 1);
            break;
        case ZaneClassTier.ADVANCED:
            nextStatSheet.classData.advanced.setLevelNext(level => level + 1);
            break;
        case ZaneClassTier.PROMOTED:
            nextStatSheet.classData.promoted.setLevelNext(level => level + 1);
            break;
    }
}

export function growZaneStatSheetStats(
    nextStatSheet: ZaneNextStatSheet,
    classTier: ZaneClassTier,
) {
    switch (classTier) {
        case ZaneClassTier.PROMOTED:
            nextStatSheet.classData.promoted.doubleGrowthStats.forEach(stat => {
                growStat(nextStatSheet.stats[stat], classTier);
            });
        // eslint-disable-next-line no-fallthrough
        case ZaneClassTier.ADVANCED:
            nextStatSheet.classData.advanced.growthStats.forEach(stat => {
                growStat(nextStatSheet.stats[stat], classTier);
            });
        // eslint-disable-next-line no-fallthrough
        case ZaneClassTier.BASIC:
            nextStatSheet.classData.basic.growthStats.forEach(stat => {
                growStat(nextStatSheet.stats[stat], classTier);
            });
    }
}

export function addZaneStatSheetPoints(
    nextStatSheet: ZaneNextStatSheet,
    classTier: ZaneClassTier,
) {
    const classLevel = classTier === ZaneClassTier.BASIC ? nextStatSheet.classData.basic.level : classTier === ZaneClassTier.ADVANCED ? nextStatSheet.classData.advanced!.level : nextStatSheet.classData.promoted!.level;

    if (classLevel === 1) {
        switch (classTier) {
            case ZaneClassTier.BASIC:
                nextStatSheet.setUnallocatedPoints(45);
                break;
            case ZaneClassTier.ADVANCED:
                nextStatSheet.setUnallocatedPoints(25 - nextStatSheet.classData.basic.level);
                break;
            case ZaneClassTier.PROMOTED:
                nextStatSheet.setUnallocatedPoints(50 - (2 * nextStatSheet.classData.advanced.level));
                break;
        }
    } else {
        switch (classTier) {
            case ZaneClassTier.BASIC:
                nextStatSheet.setUnallocatedPoints(3);
                nextStatSheet.setAvailableCatchups(2);
                break;
            case ZaneClassTier.ADVANCED:
                nextStatSheet.setUnallocatedPoints(4);
                nextStatSheet.setAvailableCatchups(2);
                break;
            case ZaneClassTier.PROMOTED:
                nextStatSheet.setUnallocatedPoints(6);
                nextStatSheet.setAvailableCatchups(2);
                break;
        }
    }
}

function growStat(
    stat: ZaneNextStatSheet['stats'][ZaneStatTypeGrowth],
    classTier: ZaneClassTier,
) {
    const cap = getCapsForStat(stat, classTier);
    if (stat.points >= cap.hard) return;

    const randomValue = Math.random();
    if (randomValue >= stat.growthPercentagePoints / 100) {
        stat.setGrowthPercentNext(p => p + 25);
        return;
    }

    stat.setPointsNext(p => p + 1);
    stat.setTotalGrownNext(p => p + 1);
    stat.setRecentlyGrownPoints(p => p + 1);
    stat.setGrowthPercentNext(50);
}

export function increaseHitAndManaPoints(nextStatSheet: ZaneNextStatSheet, _classTier: ZaneClassTier, isClassUp: boolean) {
    console.log('Increasing hit and mana points', { nextStatSheet, _classTier, isClassUp});
    if (isClassUp) {
        nextStatSheet.setHitPointsNext(p => p + 10 + nextStatSheet.stats.vitality.points);
        nextStatSheet.setManaPointsNext(p => p + 10 + nextStatSheet.stats.mind.points);
    } else {
        nextStatSheet.setHitPointsNext(p => p + Math.floor(nextStatSheet.stats.vitality.points / 2));
        nextStatSheet.setManaPointsNext(p => p + Math.floor(nextStatSheet.stats.mind.points / 2));
    }
}
