import { Flex, Paper, Stack, Text } from "@mantine/core";
import { memo, type ComponentProps } from "react";
import { ZaneStatInputInternal } from "./StatInput";
import type { ZaneStatTypeGrowth } from "./StatsTypes";

export const ZaneGrowthStatInput = memo(function ZaneGrowthStatInput<TStatType extends ZaneStatTypeGrowth>({statNext, ...props}: ComponentProps<typeof ZaneStatInputInternal<TStatType>>) {
    return <Paper>
        <Flex gap='xs' align='center'>
            <ZaneStatInputInternal statNext={statNext} {...props} />
            <Stack>
                <div style={{height:8}} />
                <Text size="sm">Growth Chance: {statNext.growthPercentagePoints}% (+{statNext.recentlyGrownPoints} this level)</Text>
            </Stack>
        </Flex>

        <Text size="sm">This stat has grown by {statNext.totalGrownPoints} total points.</Text>
    </Paper>;
});
