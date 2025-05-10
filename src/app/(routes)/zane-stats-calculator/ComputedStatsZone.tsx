import { Card, Fieldset, NumberFormatter, Stack, Text, Title } from "@mantine/core";
import { memo } from "react";

export const ComputedStatZone = memo(function ComputedStatZone({hitPoints, manaPoints}: {readonly hitPoints: number, readonly manaPoints: number}) {
    console.log('ComputedStatZone rerendered');
    return <Fieldset legend="Computed Stats">
        <Stack gap="lg">
            <Card>
                <Title order={3}>Hit Points</Title>
                <Text><NumberFormatter value={hitPoints} /></Text>
            </Card>
            <Card>
                <Title order={3}>Mana Points</Title>
                <Text><NumberFormatter value={manaPoints} /></Text>
            </Card>
        </Stack>
    </Fieldset>;
});
