import { z } from "zod";

export enum ZaneStatType {
    /** Directly increases damage with weapons. Reduces the burden of heavy weapons. */
    STRENGTH = 'strength',
    /** Directly increases damage with magic. */
    MAGIC = 'magic',
    /** This determines how likely you are to hit with attacks, and impacts critical hit rate. */
    SKILL = 'skill',
    /** Determines how often you will get an additional attack, and impacts your evasion. */
    SPEED = 'speed',
    /** Increases hit rate and increases evasion. High luck can prevent critical hits. */
    LUCK = 'luck',
    /** Reduces incoming weapon damage. */
    DEFENSE = 'defense',
    /** Reduces incoming magic damage. */
    RESISTANCE = 'resistance',
    /** Determines mana growth / level. */
    MIND = 'mind',
    /** Determines hit point growth / level. */
    VITALITY = 'vitality',

    /**
     * Move costs 1 point to increase at character creation, and infantry have a maximum of 6 movement.
     * The movement cap for Infantry is increased by 1 for each 10 SPD you have.
     *
     * Movement can’t be increased after character creation, except during Advancement.
     *
     * The minimum recommended movement is 5. Please note, some Armor may reduce movement.
     */
    MOVEMENT = 'movement',
}

export enum ZaneClassTier {
    BASIC = 'Basic',
    ADVANCED = 'Advanced',
    PROMOTED = 'Promoted',
}

export const maxNewAssignPointsForStatInALevelPerClassTier = {
    [ZaneClassTier.BASIC]: 1,
    [ZaneClassTier.ADVANCED]: 1,
    [ZaneClassTier.PROMOTED]: 2,
} as const satisfies Record<ZaneClassTier, number>;

const ZaneStatSchemaBase = z.object({
    /** Number of total points in the skill, accounting for both growth and manual assignment */
    points: z.int().min(0).default(0),
});

const ZaneStatSchemaGrowing = ZaneStatSchemaBase.extend({
    /** Percentage points; e.g. 13% would correlate to a value of 13 */
    growthPercentagePoints: z.int().min(0).max(100).default(50),
    /** Number of times this stat has grown by 1 point */
    totalGrownPoints: z.int().min(0).default(0),
    /** Number of points to automatically assign to this stat when leveling up */
    pointsToAutoAssign: z.int().min(0).default(0),
    /**
     * Whether to count grown points toward the auto-assign cap
     *
     * For example, if autoAssignedPoints = 3 and the stat grew 2 this level, only assign 1 additional point.
    */
    countGrownPointsTowardAutoAssign: z.boolean().default(false),
});

const statObjectsByType = {
    strength: ZaneStatSchemaGrowing,
    magic: ZaneStatSchemaGrowing,
    skill: ZaneStatSchemaGrowing,
    speed: ZaneStatSchemaGrowing,
    luck: ZaneStatSchemaGrowing,
    defense: ZaneStatSchemaGrowing,
    resistance: ZaneStatSchemaGrowing,
    mind: ZaneStatSchemaGrowing,
    vitality: ZaneStatSchemaGrowing,

    movement: ZaneStatSchemaBase,
} as const satisfies Record<ZaneStatType, z.ZodType<any>>;

export const costToIncreaseStatByType = {
    strength: 1,
    magic: 1,
    skill: 1,
    speed: 1,
    luck: 1,
    defense: 1,
    resistance: 1,
    mind: (currentValue: number) => Math.ceil((currentValue + 1) / 5),
    vitality: (currentValue: number) => Math.ceil((currentValue + 1) / 5),
    movement: 1,
} as const satisfies Record<ZaneStatType, number | ((currentValue: number) => number)>;

function ZaneStatSchema<TStatType extends ZaneStatType>(statType: TStatType) {
    const gotType = statObjectsByType[statType];
    return gotType.transform<z.infer<typeof statObjectsByType[TStatType]> & {type: TStatType}>((rest) => ({
        type: statType,
        ...rest,
    }));
}
export type ZaneStat<TStatType extends ZaneStatType = ZaneStatType> = z.infer<typeof statObjectsByType[TStatType]> & {type: TStatType};

export type ZaneStatTypeGrowth = keyof {[K in ZaneStatType as typeof statObjectsByType[K] extends typeof ZaneStatSchemaGrowing ? K : never]: true};
export const ZaneStatTypeGrowthValues = Object.keys(statObjectsByType).filter((key) => statObjectsByType[key as ZaneStatType] === ZaneStatSchemaGrowing) as ZaneStatTypeGrowth[];

const ZaneStatSheetBasicClassSchema = z.object({
    level: z.int().min(0).max(20).default(0),
    growthStats: z.array(z.string()).transform(v => new Set(v)).pipe(z.set(z.enum(ZaneStatTypeGrowthValues)).min(0).max(4)).default(new Set()),
}).describe(`Basic Class data`);
export type ZaneStatSheetBasicClass = z.infer<typeof ZaneStatSheetBasicClassSchema>;

const ZaneStatSheetAdvancedClassSchema = z.object({
    level: z.int().min(0).max(20).default(0),
    growthStats: z.array(z.string()).transform(v => new Set(v)).pipe(z.set(z.enum(ZaneStatTypeGrowthValues)).min(0).max(1)).default(new Set()),
}).describe(`Basic Class data`);
export type ZaneStatSheetAdvancedClass = z.infer<typeof ZaneStatSheetAdvancedClassSchema>;

const ZaneStatSheetPromotedClassSchema = z.object({
    level: z.int().min(0).max(20).default(0),
    doubleGrowthStats: z.array(z.string()).transform(v => new Set(v)).pipe(z.set(z.enum(ZaneStatTypeGrowthValues)).min(0).max(2)).default(new Set()),
}).describe(`Basic Class data`);
export type ZaneStatSheetPromotedClass = z.infer<typeof ZaneStatSheetPromotedClassSchema>;

export const ZaneStatSheetSchema = z.object({
    name: z.string().nullable().default(null),

    hitPoints: z.int().min(0).default(0),
    manaPoints: z.int().min(0).default(0),

    classData: z.object({
        basic: ZaneStatSheetBasicClassSchema,
        advanced: ZaneStatSheetAdvancedClassSchema.nullable().default(null),
        promoted: ZaneStatSheetPromotedClassSchema.nullable().default(null),
    }),

    stats: z.object(Object.fromEntries(Object.values(ZaneStatType).map((statType=> [statType, ZaneStatSchema(statType)]))) as {[K in ZaneStatType]: ReturnType<typeof ZaneStatSchema<K>>}),
});

export type ZaneStatSheet = z.infer<typeof ZaneStatSheetSchema>;


export function getCapsForStat(stat: ZaneStat, classTier: ZaneClassTier): {
    /** You cannot manually assign points to increase your score beyond the soft cap. */
    soft: number,
    /** You can neither grow past nor assign points to pass the hard cap. */
    hard: number,
} {
    switch (classTier) {

        case ZaneClassTier.BASIC:
            switch (stat.type) {
                case ZaneStatType.LUCK:
                    return {soft: 30, hard: 30};
                default:
                    return {soft: 20, hard: 25};
            }

        case ZaneClassTier.ADVANCED:
            switch (stat.type) {
                case ZaneStatType.LUCK:
                    return {soft: 50, hard: 50};
                default:
                    return {soft: 40, hard: 50};
            }

        case ZaneClassTier.PROMOTED:
            switch (stat.type) {
                case ZaneStatType.LUCK:
                    return {soft: 60, hard: 80};
                default:
                    return {soft: 80, hard: 80};
            }

    }
}
