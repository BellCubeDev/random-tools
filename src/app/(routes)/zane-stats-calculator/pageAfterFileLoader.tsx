/* eslint-disable complexity */
'use client';

import { Badge, Button, ButtonGroup, Fieldset, FileButton, Flex, Loader, NumberInput, Space, Stack, Switch, Text, TextInput } from "@mantine/core";
import { startTransition, useCallback, useState, type Dispatch, type SetStateAction } from "react";
import * as yaml from 'yaml';
import type z from "zod";
import { useChangeEffect } from "../../hooks/useOnChange";
import { useUpdatedRef } from "../../hooks/useUpdatedRef";
import { statEligibleForCatchup } from "./checks";
import { ComputedStatZone } from "./ComputedStatsZone";
import { addZaneStatSheetPoints, gainZaneStatSheetLevel, growZaneStatSheetStats, increaseHitAndManaPoints } from "./gainLevel";
import { ZaneGrowthStatInput } from "./GrowthStatInput";
import { GrowthStatSelectionZone } from "./GrowthStatSelectionZone";
import { ZaneStatInput } from "./StatInput";
import { maxNewAssignPointsForStatInALevelPerClassTier, ZaneClassTier, ZaneStatType, ZaneStatTypeGrowthValues, type ZaneStat, type ZaneStatSheet, type ZaneStatTypeGrowth } from "./StatsTypes";
import { useStatState } from "./useStatState";

const emptyStatSheet: ZaneStatSheet = {
    name: null,
    hitPoints: 0,
    manaPoints: 0,
    classData: {
        basic: { level: 0, growthStats: new Set() },
        advanced: null,
        promoted: null,
    },
    stats: {
        defense: { type: ZaneStatType.DEFENSE, points: 0, bypassStatCaps: false, growthPercentagePoints: 50, totalGrownPoints: 0, pointsToAutoAssign: 0, countGrownPointsTowardAutoAssign: false },
        strength: { type: ZaneStatType.STRENGTH, points: 0, bypassStatCaps: false, growthPercentagePoints: 50, totalGrownPoints: 0, pointsToAutoAssign: 0, countGrownPointsTowardAutoAssign: false },
        luck: { type: ZaneStatType.LUCK, points: 0, bypassStatCaps: false, growthPercentagePoints: 50, totalGrownPoints: 0, pointsToAutoAssign: 0, countGrownPointsTowardAutoAssign: false },
        speed: { type: ZaneStatType.SPEED, points: 0, bypassStatCaps: false, growthPercentagePoints: 50, totalGrownPoints: 0, pointsToAutoAssign: 0, countGrownPointsTowardAutoAssign: false },
        magic: { type: ZaneStatType.MAGIC, points: 0, bypassStatCaps: false, growthPercentagePoints: 50, totalGrownPoints: 0, pointsToAutoAssign: 0, countGrownPointsTowardAutoAssign: false },
        mind: { type: ZaneStatType.MIND, points: 0, bypassStatCaps: false, growthPercentagePoints: 50, totalGrownPoints: 0, pointsToAutoAssign: 0, countGrownPointsTowardAutoAssign: false },
        resistance: { type: ZaneStatType.RESISTANCE, points: 0, bypassStatCaps: false, growthPercentagePoints: 50, totalGrownPoints: 0, pointsToAutoAssign: 0, countGrownPointsTowardAutoAssign: false },
        skill: { type: ZaneStatType.SKILL, points: 0, bypassStatCaps: false, growthPercentagePoints: 50, totalGrownPoints: 0, pointsToAutoAssign: 0, countGrownPointsTowardAutoAssign: false },
        vitality: { type: ZaneStatType.VITALITY, points: 0, bypassStatCaps: false, growthPercentagePoints: 50, totalGrownPoints: 0, pointsToAutoAssign: 0, countGrownPointsTowardAutoAssign: false },
        movement: { type: ZaneStatType.MOVEMENT, points: 0, bypassStatCaps: false },
    },
};

function prepareStatSheetForSaving(statSheet: ZaneStatSheet): z.input<z.ZodType<ZaneStatSheet>> {
    return {
        ...statSheet,
        classData: {
            basic: statSheet.classData.basic,
            advanced: statSheet.classData.advanced?.level === 0 ? null : statSheet.classData.advanced,
            promoted: statSheet.classData.promoted?.level === 0 ? null : statSheet.classData.promoted,
        },
        stats: {
            ...Object.fromEntries(
                Object.entries(statSheet.stats).map(([key, stat]) =>  [key, { ...stat, type: undefined }])
            ),
        },
    };
}

export enum LevelUpStep {
    NOT_STARTED = -1,
    CHOOSE_GROWTH,
    POINT_ALLOCATION,
}

export function ZaneStatsCalculatorAfterLoader({loadedSheet, startNewCharacter, setLoadedFile, isLoadingFile}: {
    readonly loadedSheet: null | ZaneStatSheet,
    readonly startNewCharacter: any,
    readonly setLoadedFile: any,
    readonly isLoadingFile: any,
}) {
    const { currentStatSheet, nextStatSheet, confirm: confirmChanges, cancel: cancelChanges } = useStatState(loadedSheet ?? emptyStatSheet);

    const hasAdvanced = nextStatSheet.classData.advanced.level > 0;
    const hasPromoted = nextStatSheet.classData.promoted.level > 0;
    const classTier = hasPromoted ? ZaneClassTier.PROMOTED : hasAdvanced ? ZaneClassTier.ADVANCED : ZaneClassTier.BASIC;

    const [levelUpStep, setLevelUpStep] = useState<LevelUpStep>(nextStatSheet.classData.basic.level === 0 ? LevelUpStep.CHOOSE_GROWTH : LevelUpStep.NOT_STARTED);
    const levelUpStepRef = useUpdatedRef(levelUpStep);
    const [isClassingUpThisLevel, setIsClassingUpThisLevel] = useState(nextStatSheet.classData.basic.level === 0);

    const cancel = useCallback(() => {
        startTransition(() => {
            cancelChanges();
            setIsClassingUpThisLevel(false);
            setLevelUpStep(LevelUpStep.NOT_STARTED);
        });
    }, [cancelChanges]);

    const nextStatSheetRef = useUpdatedRef(nextStatSheet);
    const currentStatSheetRef = useUpdatedRef(currentStatSheet);
    const classTierRef = useUpdatedRef(classTier);

    const startLevelUp = useCallback(() => {
        gainZaneStatSheetLevel(nextStatSheetRef.current, classTierRef.current);
        queueMicrotask(() => {
            startTransition(() => {
                growZaneStatSheetStats(nextStatSheetRef.current, classTierRef.current);
                addZaneStatSheetPoints(nextStatSheetRef.current, classTierRef.current);
            });
        });
        setLevelUpStep(LevelUpStep.POINT_ALLOCATION);
    }, [classTierRef, nextStatSheetRef]);

    const canConfirmLevelUp = levelUpStep === LevelUpStep.POINT_ALLOCATION && nextStatSheet.unallocatedPoints >= 0 && nextStatSheet.availableCatchups >= 0;
    const canConfirmLevelUpRef = useUpdatedRef(canConfirmLevelUp);
    const isClassingUpThisLevelRef = useUpdatedRef(isClassingUpThisLevel);
    const confirmLevelUp = useCallback(() => {
        if (!canConfirmLevelUpRef.current) return;
        increaseHitAndManaPoints(nextStatSheetRef.current, classTierRef.current, isClassingUpThisLevelRef.current);
        startTransition(() => {
            confirmChanges();
            setIsClassingUpThisLevel(false);
        });
        setLevelUpStep(LevelUpStep.NOT_STARTED);
    }, [canConfirmLevelUpRef, classTierRef, confirmChanges, isClassingUpThisLevelRef, nextStatSheetRef]);

    const startClassUp = useCallback(() => {
        if (classTierRef.current === ZaneClassTier.PROMOTED) return;
        const nextClassTier = currentStatSheetRef.current.classData.basic.level === 0 ? ZaneClassTier.BASIC : classTierRef.current === ZaneClassTier.BASIC ? ZaneClassTier.ADVANCED : ZaneClassTier.PROMOTED;
        startTransition(() => {
            setIsClassingUpThisLevel(true);
            gainZaneStatSheetLevel(nextStatSheetRef.current, nextClassTier);
            setLevelUpStep(LevelUpStep.CHOOSE_GROWTH);
        });
    }, [classTierRef, nextStatSheetRef, currentStatSheetRef]);

    if (classTier === ZaneClassTier.BASIC && nextStatSheet.classData.basic.level === 0) startClassUp();

    const canConfirmClassUp = isClassingUpThisLevel && nextStatSheet.classData.basic.growthStats.size === 4 && (hasAdvanced ? nextStatSheet.classData.advanced.growthStats.size === 1 : true) && (hasPromoted ? nextStatSheet.classData.promoted.doubleGrowthStats.size === 2 : true);
    const canConfirmClassUpRef = useUpdatedRef(canConfirmClassUp);
    const confirmClassUp = useCallback(() => {
        if (!canConfirmClassUpRef.current) return;
        addZaneStatSheetPoints(nextStatSheetRef.current, classTierRef.current);
        startTransition(() => {
            setLevelUpStep(LevelUpStep.POINT_ALLOCATION);
        });
    }, [canConfirmClassUpRef, classTierRef, nextStatSheetRef]);

    const saveStatSheet = useCallback(() => {
        if (levelUpStepRef.current !== LevelUpStep.NOT_STARTED) throw new Error('Cannot save while in the middle of a level up!');
        const statSheet = currentStatSheetRef.current;
        const fileName = statSheet.name ? `STATS_${statSheet.name}.yaml` : 'Stats__UNNAMED__.yaml';
        const data = new Blob(['# Generated with https://random.bellcube.dev/zane-stats-calculator/\n\n', yaml.stringify(prepareStatSheetForSaving(statSheet), {lineWidth: 0})], { type: 'text/yaml' });
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }, [currentStatSheetRef, levelUpStepRef]);



    const setName = nextStatSheet.setName;
    const onChangeName = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value === '' ? null : e.currentTarget.value);
    }, [setName]);

    const setBasicGrowthStatsNext = nextStatSheet.classData.basic.setGrowthStatsNext;
    const onChangeBasicGrowthStats = useCallback((v: string[]) => setBasicGrowthStatsNext(new Set(v as unknown as ZaneStatTypeGrowth[])), [setBasicGrowthStatsNext]);
    const setAdvancedGrowthStatsNext = nextStatSheet.classData.advanced.setGrowthStatsNext;
    const onChangeAdvancedGrowthStats = useCallback((v: string[]) => setAdvancedGrowthStatsNext(new Set(v as unknown as ZaneStatTypeGrowth[])), [setAdvancedGrowthStatsNext]);
    const setPromotedDoubleGrowthStatsNext = nextStatSheet.classData.promoted.setDoubleGrowthStatsNext;
    const onChangePromotedDoubleGrowthStats = useCallback((v: string[]) => setPromotedDoubleGrowthStatsNext(new Set(v as unknown as ZaneStatTypeGrowth[])), [setPromotedDoubleGrowthStatsNext]);

    const classLevel = classTier === ZaneClassTier.BASIC ? nextStatSheet.classData.basic.level : classTier === ZaneClassTier.ADVANCED ? nextStatSheet.classData.advanced!.level : nextStatSheet.classData.promoted!.level;

    const pointAllocationZoneDisabled = levelUpStep !== LevelUpStep.POINT_ALLOCATION;

    return <>
        <Flex gap="md" align="baseline" mt='-1em'>
            <div>
                <br />
                <Flex gap="md" align="center">
                    <Button color="violet" type='button' onClick={startNewCharacter}>New Character</Button>

                    <FileButton onChange={setLoadedFile}>{
                        (props) => <Button {...props} color="grape">Load Existing Character</Button>
                    }</FileButton>

                    {isLoadingFile ? <Loader type='bars' size='sm' /> : <Space w='md' />}

                    <Button onClick={saveStatSheet} variant="outline" color="grape" disabled={isLoadingFile || levelUpStep !== LevelUpStep.NOT_STARTED}>
                        Save
                    </Button>
                </Flex>
            </div>

            <TextInput value={currentStatSheet.name ?? ''} onChange={onChangeName} label="Character Name" style={{flexGrow: 1}} />
        </Flex>

        <Space h='xl' />

        <Flex gap="md" align='center' wrap='wrap'>
            <ButtonGroup>
                <Button onClick={startClassUp} disabled={levelUpStep !== LevelUpStep.NOT_STARTED || hasPromoted} loading={levelUpStep === LevelUpStep.CHOOSE_GROWTH} color='teal'>
                    Class Up
                </Button>
                <Button onClick={startLevelUp} disabled={levelUpStep !== LevelUpStep.NOT_STARTED} loading={levelUpStep === LevelUpStep.POINT_ALLOCATION} color='blue'>
                    Level Up
                </Button>
            </ButtonGroup>

            <ButtonGroup>
                {levelUpStep === LevelUpStep.CHOOSE_GROWTH ? <Button onClick={confirmClassUp} color='teal' variant='light' disabled={!canConfirmClassUp}>
                    Confirm Class Up
                </Button> : null }
                {levelUpStep === LevelUpStep.POINT_ALLOCATION ? <Button onClick={confirmLevelUp} color='blue' variant='light' disabled={!canConfirmLevelUp}>
                    Confirm Level Up
                </Button> : null }
                <Button onClick={cancel} disabled={levelUpStep === LevelUpStep.NOT_STARTED} variant='light' color='red'>
                    Revert Changes
                </Button>
            </ButtonGroup>

            <Flex gap="md" align='center' wrap='wrap'>
                <Flex gap="md" align='center' wrap='wrap'>
                    <Badge color='teal' size='lg' variant="outline" style={{ textTransform: 'unset' }}>
                        Basic Level: {nextStatSheet.classData.basic.level}
                    </Badge>
                </Flex>

                {hasAdvanced ? <Flex gap="md" align='center' wrap='wrap'>
                    <Badge color='teal' size='lg' variant="outline" style={{ textTransform: 'unset' }}>
                        Advanced Level: {nextStatSheet.classData.advanced?.level ?? 0}
                    </Badge>
                </Flex> : null}

                { hasPromoted ? <Flex gap="md" align='center' wrap='wrap'>
                    <Badge color='teal' size='lg' variant="outline" style={{ textTransform: 'unset' }}>
                        Promoted Level: {nextStatSheet.classData.promoted?.level ?? 0}
                    </Badge>
                </Flex> : null}
            </Flex>
        </Flex>

        <Space h='lg' />

        <Flex gap="lg" wrap='wrap'>
            <Stack gap='lg' style={{flexGrow: 0.9}}>
                <GrowthStatSelectionZone
                    classTier={classTier}
                    levelUpStep={levelUpStep}
                    hasAdvanced={hasAdvanced}
                    hasPromoted={hasPromoted}
                    onChangeBasicGrowthStats={onChangeBasicGrowthStats}
                    onChangeAdvancedGrowthStats={onChangeAdvancedGrowthStats}
                    onChangePromotedDoubleGrowthStats={onChangePromotedDoubleGrowthStats}
                    basicGrowthStats={nextStatSheet.classData.basic.growthStats}
                    advancedGrowthStats={nextStatSheet.classData.advanced.growthStats}
                    promotedDoubleGrowthStats={nextStatSheet.classData.promoted.doubleGrowthStats}
                />

                <Fieldset legend="Point Allocation" style={{flexGrow: 1, marginTop: '-3px'}}>
                    <Flex justify='center' gap='xl'>
                        <Badge color={nextStatSheet.unallocatedPoints < 0 ? 'red' : nextStatSheet.unallocatedPoints === 0 ? 'gray' : 'blue'} size='lg' variant="outline" style={{ textTransform: 'unset' }}>
                            Unallocated Points: {nextStatSheet.unallocatedPoints}
                        </Badge>
                        {isClassingUpThisLevel ? null : <Badge color={nextStatSheet.availableCatchups < 0 ? 'red' : nextStatSheet.availableCatchups === 0 ? 'gray' : 'lime'} size='lg' variant="outline" style={{ textTransform: 'unset' }}>
                            Available Catchups: {nextStatSheet.availableCatchups}
                        </Badge>}
                    </Flex>
                    <Space h='xs' />
                    <Flex gap="xl" align='flex-start' wrap='wrap' justify='space-evenly'>
                        <Stack gap='sm'>
                            {ZaneStatTypeGrowthValues.map((statType) => <ZaneGrowthStatInput
                                key={statType}
                                statNow={currentStatSheet.stats[statType]}
                                statNext={nextStatSheet.stats[statType]}
                                classTier={classTier}
                                classLevel={classLevel}
                                setUnallocatedPoints={nextStatSheet.setUnallocatedPoints}
                                setAvailableCatchups={nextStatSheet.setAvailableCatchups}
                                isLevelingUp={levelUpStep === LevelUpStep.POINT_ALLOCATION}
                                disabled={pointAllocationZoneDisabled}
                            />)}
                        </Stack>
                        <Stack gap='sm'>
                            <ZaneStatInput
                                statNow={currentStatSheet.stats.movement}
                                statNext={nextStatSheet.stats.movement}
                                classTier={classTier}
                                classLevel={classLevel}
                                setUnallocatedPoints={nextStatSheet.setUnallocatedPoints}
                                setAvailableCatchups={nextStatSheet.setAvailableCatchups}
                                disabled={pointAllocationZoneDisabled || !isClassingUpThisLevel}
                                customMax={6 + Math.floor(nextStatSheet.stats.speed.points / 10)}
                                isLevelingUp={levelUpStep === LevelUpStep.POINT_ALLOCATION}
                            />
                        </Stack>
                    </Flex>

                </Fieldset>
            </Stack>
            <Stack gap='lg' style={{flexGrow: 0.1}}>
                <ComputedStatZone hitPoints={nextStatSheet.hitPoints} manaPoints={nextStatSheet.manaPoints} />
                {/*<Fieldset legend="Point Auto-Assignment" disabled={levelUpStep === LevelUpStep.POINT_ALLOCATION}>
                    <Stack gap="sm" align='center' justify='center'>
                        <Text size='sm'
                            ta="center" style={{maxWidth: '25em'}}
                            mt='xs' mb='xs'
                        >
                            When leveling up, automatically assign the following number of points to the corresponding stat:
                        </Text>
                        {ZaneStatTypeGrowthValues.map((statType) => <ZaneStatAutoAssignInput
                            key={statType}
                            statNow={currentStatSheet.stats[statType]}
                            classTier={classTier}
                            classLevel={classLevel}
                            setPointsToAutoAssign={nextStatSheet.stats[statType].setPointsToAutoAssign}
                            setCountGrownPointsTowardAutoAssign={nextStatSheet.stats[statType].setCountGrownPointsTowardAutoAssign}
                        />)}
                    </Stack>
                    <Space h='lg' />
                </Fieldset>*/}
            </Stack>
        </Flex>

    </>;
}

function ZaneStatAutoAssignInput<TStatType extends ZaneStatTypeGrowth>({statNow, classTier, classLevel, setPointsToAutoAssign, setCountGrownPointsTowardAutoAssign}: {
    readonly statNow: ZaneStat<TStatType>,
    readonly classTier: ZaneClassTier,
    readonly classLevel: number,
    readonly setPointsToAutoAssign: Dispatch<SetStateAction<number>>,
    readonly setCountGrownPointsTowardAutoAssign: Dispatch<SetStateAction<boolean>>,
}) {
    const maxNewAssignPointsForStatInALevel = maxNewAssignPointsForStatInALevelPerClassTier[classTier];
    const eligibleForCatchup = statEligibleForCatchup(statNow, classTier, classLevel, 0);
    const max = maxNewAssignPointsForStatInALevel + (eligibleForCatchup ? 1 : 0);

    const [value, setValue] = useState<string | number>(statNow.pointsToAutoAssign);

    useChangeEffect(() => {
        if (statNow.pointsToAutoAssign === value) return;
        setValue(statNow.pointsToAutoAssign);
    }, [statNow.pointsToAutoAssign]);

    const statNowRef = useUpdatedRef(statNow);

    const setAutoAssignPoints = useCallback((newValue: number | string) => {
        const oldValue = statNowRef.current.points;
        const asNumber = !newValue ? 0 : typeof newValue === 'number' ? newValue : parseInt(newValue, 10);
        if (oldValue === asNumber) return;

        setValue(newValue); // If we don't change the props of NumberInput, it won't rerender and the value won't be reverted---so we change it temporarily to the bad value here so we can revert it later.
        queueMicrotask(() => {
            if (isNaN(asNumber)) return setValue(oldValue);
            setPointsToAutoAssign(asNumber);
        });
    }, [statNowRef, setPointsToAutoAssign]);

    useChangeEffect(() => {
        if (statNow.pointsToAutoAssign <= max) return;
        setAutoAssignPoints(max);
    }, [max, statNow.pointsToAutoAssign, setAutoAssignPoints]);

    return <Flex gap="sm" align='baseline'>
        <NumberInput
            label={statNow.type}
            value={value}
            onChange={setAutoAssignPoints}
            min={0}
            max={max}
            step={1}
        />
        <Stack align='center'>
            <div />
            <Switch />
        </Stack>
    </Flex>;
}
