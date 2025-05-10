import { Fieldset, Flex, MultiSelect } from "@mantine/core";
import { LevelUpStep } from "./pageAfterFileLoader";
import { ZaneClassTier, ZaneStatTypeGrowthValues, type ZaneStatTypeGrowth } from "./StatsTypes";
import { memo } from "react";

function GrowthStatSelectionZone_({classTier, levelUpStep, hasAdvanced, hasPromoted, onChangeBasicGrowthStats, onChangeAdvancedGrowthStats, onChangePromotedDoubleGrowthStats, basicGrowthStats, advancedGrowthStats, promotedDoubleGrowthStats, }: {
    readonly classTier: ZaneClassTier,
    readonly levelUpStep: LevelUpStep,
    readonly hasAdvanced: boolean,
    readonly hasPromoted: boolean,
    readonly onChangeBasicGrowthStats: (v: string[]) => void,
    readonly onChangeAdvancedGrowthStats: (v: string[]) => void,
    readonly onChangePromotedDoubleGrowthStats: (v: string[]) => void,
    readonly basicGrowthStats: Set<ZaneStatTypeGrowth>,
    readonly advancedGrowthStats: Set<ZaneStatTypeGrowth>,
    readonly promotedDoubleGrowthStats: Set<ZaneStatTypeGrowth>,
}) {
    return <Fieldset legend="Growth Stat Selections" disabled={levelUpStep !== LevelUpStep.CHOOSE_GROWTH}>
        <Flex gap="md" align='baseline' wrap='wrap'>
            <MultiSelect label="Basic Class Growth Stats (4)"
                withScrollArea={false}
                maxValues={4}
                data={ZaneStatTypeGrowthValues.filter((v) => advancedGrowthStats.has(v) === false)}
                value={Array.from(basicGrowthStats)}
                onChange={onChangeBasicGrowthStats}
                disabled={classTier !== ZaneClassTier.BASIC}
                searchable
                styles={{
                    inputField: { display: levelUpStep === LevelUpStep.CHOOSE_GROWTH && classTier === ZaneClassTier.BASIC ? undefined : 'none' },
                }}
            />
            {hasAdvanced ? <MultiSelect label="Advanced Class Growth Stats (1)"
                withScrollArea={false}
                maxValues={1}
                data={ZaneStatTypeGrowthValues.filter((v) => basicGrowthStats.has(v) === false)}
                value={Array.from(advancedGrowthStats)}
                onChange={onChangeAdvancedGrowthStats}
                disabled={classTier !== ZaneClassTier.ADVANCED}
                searchable
                styles={{
                    inputField: { display: levelUpStep === LevelUpStep.CHOOSE_GROWTH && classTier === ZaneClassTier.ADVANCED ? undefined : 'none' },
                }}
            /> : null}
            { hasPromoted ? <MultiSelect label="Promoted Class Double-Growth Stats (2)"
                withScrollArea={false}
                maxValues={2}
                data={ZaneStatTypeGrowthValues.filter((v) => basicGrowthStats.has(v) || advancedGrowthStats.has(v) )}
                value={Array.from(promotedDoubleGrowthStats)}
                onChange={onChangePromotedDoubleGrowthStats}
                disabled={classTier !== ZaneClassTier.PROMOTED}
                searchable
                styles={{
                    inputField: { display: levelUpStep === LevelUpStep.CHOOSE_GROWTH && classTier === ZaneClassTier.PROMOTED ? undefined : 'none' },
                }}
            /> : null}
        </Flex>
    </Fieldset>;
}

export const GrowthStatSelectionZone = memo(GrowthStatSelectionZone_) as typeof GrowthStatSelectionZone_;
