import { ActionIcon, Flex, NumberInput, Paper, Stack, Switch, ThemeIcon } from "@mantine/core";
import { memo, useCallback, useRef, useState, type ComponentProps, type Dispatch, type SetStateAction } from "react";
import { useChangeEffect } from "../../hooks/useOnChange";
import { useUpdatedRef } from "../../hooks/useUpdatedRef";
import { statEligibleForCatchup } from "./checks";
import { costToIncreaseStatByType, getCapsForStat, maxNewAssignPointsForStatInALevelPerClassTier, ZaneClassTier, type ZaneStat, type ZaneStatType } from "./StatsTypes";
import type { ZaneNextStatSheet } from "./useStatState";
import { IconArrowUpBar, IconDownload } from "@tabler/icons-react";

export function ZaneStatInput<TStatType extends ZaneStatType>(props: ComponentProps<typeof ZaneStatInputInternal<TStatType>>) {
    return <Paper>
        <ZaneStatInputInternal {...props} />
    </Paper>;
}

function ZaneStatInputInternal_<TStatType extends ZaneStatType>({statNow, statNext, classTier, setUnallocatedPoints, setAvailableCatchups, disabled, classLevel, customMax, isLevelingUp}: {
    readonly setUnallocatedPoints: Dispatch<SetStateAction<number>>,
    readonly setAvailableCatchups: Dispatch<SetStateAction<number>>,
    readonly statNow: ZaneStat<TStatType>,
    readonly statNext: ZaneNextStatSheet['stats'][TStatType],
    readonly classTier: ZaneClassTier,
    readonly classLevel: number,
    readonly disabled?: boolean,
    readonly customMax?: number,
    readonly isLevelingUp: boolean,
}) {
    const [value, setValue] = useState<string | number>(statNext.points);

    const maxNewAssignPointsForStatInALevel = maxNewAssignPointsForStatInALevelPerClassTier[classTier];

    const min = statNow.points + ('recentlyGrownPoints' in statNext ? statNext.recentlyGrownPoints : 0);

    let max = customMax !== undefined ? customMax : Math.max(min, Math.min(getCapsForStat(statNow, classTier).soft));
    const eligibleForCatchup = statEligibleForCatchup(statNow, classTier, classLevel, 'recentlyGrownPoints' in statNext ? statNext.recentlyGrownPoints : 0);
    if (customMax === undefined && classLevel !== 1 && max > min + maxNewAssignPointsForStatInALevel) max = min + maxNewAssignPointsForStatInALevel + (eligibleForCatchup ? 1 : 0);

    if (statNext.bypassStatCaps) max = Infinity;

    useChangeEffect(() => {
        if (statNext.points === value) return;
        setValue(statNext.points);
    }, [statNext.points]);

    const statNextRef = useUpdatedRef(statNext);

    const classTierRef = useUpdatedRef(classTier);
    const bypassMaxRef = useUpdatedRef(statNext.bypassStatCaps);
    const setPointsNextRaw = statNext.setPointsNext;
    const setPointsNext = useCallback((newValue: number | string) => {
        const oldValue = statNextRef.current.points;
        const asNumber = !newValue ? 0 : typeof newValue === 'number' ? newValue : parseInt(newValue, 10);
        if (oldValue === asNumber) return;

        setValue(newValue); // If we don't change the props of NumberInput, it won't rerender and the value won't be reverted---so we change it temporarily to the bad value here so we can revert it later.
        queueMicrotask(() => {
            if (isNaN(asNumber)) return setValue(oldValue);

            const cap = getCapsForStat(statNextRef.current, classTierRef.current);
            if (!bypassMaxRef.current) {
                if (oldValue > cap.soft) return setValue(oldValue); // Don't accidentally undo growth!
                if (asNumber > cap.soft) return setValue(oldValue); // do not allow the input modify the value if we're past the soft cap
            }
            if (asNumber < min) return setValue(oldValue); // do not allow the input to go below the point value from the last level

            setPointsNextRaw(asNumber);

            const costToIncreaseStat = costToIncreaseStatByType[statNextRef.current.type];

            const isBackwards = asNumber < oldValue;

            if (eligibleForCatchup) {
                if (asNumber === min + maxNewAssignPointsForStatInALevel + 1) setAvailableCatchups(catchups => catchups - 1);
                else if (oldValue === min + maxNewAssignPointsForStatInALevel + 1) setAvailableCatchups(catchups => catchups + 1);
            }

            if (typeof costToIncreaseStat === 'number')
                return setUnallocatedPoints(points => points + (costToIncreaseStat * (oldValue - asNumber)));

            let pointsToChange = 0;
            const startFrom = isBackwards ? asNumber : oldValue;
            const endAt = isBackwards ? oldValue : asNumber;
            for (let i = startFrom; i < endAt; i++) pointsToChange += costToIncreaseStat(i);
            setUnallocatedPoints(points => points + (isBackwards ? pointsToChange : -pointsToChange));
        });
    }, [statNextRef, classTierRef, bypassMaxRef, min, setPointsNextRaw, eligibleForCatchup, setUnallocatedPoints, maxNewAssignPointsForStatInALevel, setAvailableCatchups]);

    useChangeEffect(() => {
        if (!customMax) return;
        if (statNext.points <= customMax) return;
        setPointsNext(customMax);
    }, [customMax, statNext.points, setPointsNext]);

    useChangeEffect(() => {
        if (!isLevelingUp || !('pointsToAutoAssign' in statNext)) return;
        let pointsToAdd = statNext.pointsToAutoAssign;
        if (statNext.countGrownPointsTowardAutoAssign) pointsToAdd -= statNext.recentlyGrownPoints;
        if (pointsToAdd <= 0) return;
        setPointsNext(statNext.points + pointsToAdd);
    }, [isLevelingUp]);

    const setBypassStatCaps = statNext.setBypassStatCaps;
    const toggleBypassMax = useCallback(() => {
        setBypassStatCaps(bypass => !bypass);
    }, [setBypassStatCaps]);

    return <Flex gap='xs' align='center'>
        <NumberInput
            disabled={disabled ?? false}
            min={min}
            max={max}
            value={value}
            label={statNow.type}
            onChange={setPointsNext}
            clampBehavior='none'
            allowDecimal={false}
        />
        <Stack>
            <div style={{height:8}} />
            {!statNext.bypassStatCaps
                ? <ActionIcon size='md' color='teal' onClick={toggleBypassMax} disabled={false}>
                    <IconDownload style={{rotate: '180deg'}} />
                </ActionIcon>
                : <ActionIcon size='md' color='red' onClick={toggleBypassMax} disabled={false}>
                    <IconArrowUpBar />
                </ActionIcon>}
        </Stack>
    </Flex>;
}

export const ZaneStatInputInternal = memo(ZaneStatInputInternal_) as typeof ZaneStatInputInternal_;
