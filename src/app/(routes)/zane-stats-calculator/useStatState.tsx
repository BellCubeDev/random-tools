/* eslint-disable max-lines */
import { startTransition, useCallback, useMemo, useState } from "react";
import { ZaneStatType, type ZaneStatSheet, type ZaneStatSheetBasicClass, type ZaneStatTypeGrowth } from "./StatsTypes";
import { useConfirmState } from "./useConfirmState";

/**
 * Massive hook function to manage the state of a Zane Stat Sheet
 *
 * @param initial The initial state of the stat sheet (e.g. from a loaded file)
 * @returns
 */

export function useStatState(initial: ZaneStatSheet) {
    const [name, setName] = useState<string | null>(initial.name);
    const [unallocatedPoints, setUnallocatedPoints] = useState<number>(0);
    const [availableCatchups, setAvailableCatchups] = useState<number>(0);
    const {valueNow: hitPointsNow, valueNext: hitPointsNext, cancel: cancelHitPoints, setValueNext: setHitPointsNext, confirm: confirmHitPoints} = useConfirmState<number>(initial.hitPoints);
    const {valueNow: manaPointsNow, valueNext: manaPointsNext, cancel: cancelManaPoints, setValueNext: setManaPointsNext, confirm: confirmManaPoints} = useConfirmState<number>(initial.manaPoints);

    //const {valueNow: basicClassDataNow, valueNext: basicClassDataNext, cancel: cancelBasicClassData, setValueNext: setBasicClassDataNext, confirm: confirmBasicClassData} = useConfirmState<ZaneStatSheet["classData"][0]>({level: 0, growthStats: new Set()});
    const {valueNow: basicClassLevelNow, valueNext: basicClassLevelNext, cancel: cancelBasicClassLevel, setValueNext: setBasicClassLevelNext, confirm: confirmBasicClassLevel} = useConfirmState<number>(initial.classData.basic.level);
    const {valueNow: basicClassGrowthStatsNow, valueNext: basicClassGrowthStatsNext, cancel: cancelBasicClassGrowthStats, setValueNext: setBasicClassGrowthStatsNext, confirm: confirmBasicClassGrowthStats} = useConfirmState(initial.classData.basic.growthStats);
    const basicClassDataNow = useMemo<ZaneStatSheetBasicClass>(() => ({
        level: basicClassLevelNow,
        growthStats: basicClassGrowthStatsNow,
    }), [basicClassLevelNow, basicClassGrowthStatsNow]);
    const basicClassDataNext = useMemo(() => ({
        level: basicClassLevelNext,
        setLevelNext: setBasicClassLevelNext,
        growthStats: basicClassGrowthStatsNext,
        setGrowthStatsNext: setBasicClassGrowthStatsNext,
    }), [basicClassLevelNext, setBasicClassLevelNext, basicClassGrowthStatsNext, setBasicClassGrowthStatsNext]);
    const confirmBasicClassData = useCallback(() => {
        confirmBasicClassLevel();
        confirmBasicClassGrowthStats();
    }, [confirmBasicClassLevel, confirmBasicClassGrowthStats]);
    const cancelBasicClassData = useCallback(() => {
        cancelBasicClassLevel();
        cancelBasicClassGrowthStats();
    }, [cancelBasicClassLevel, cancelBasicClassGrowthStats]);



    const {valueNow: advancedClassLevelNow, valueNext: advancedClassLevelNext, cancel: cancelAdvancedClassLevel, setValueNext: setAdvancedClassLevelNext, confirm: confirmAdvancedClassLevel} = useConfirmState<number>(initial.classData.advanced?.level ?? 0);
    const {valueNow: advancedClassGrowthStatsNow, valueNext: advancedClassGrowthStatsNext, cancel: cancelAdvancedClassGrowthStats, setValueNext: setAdvancedClassGrowthStatsNext, confirm: confirmAdvancedClassGrowthStats} = useConfirmState(initial.classData.advanced?.growthStats ?? new Set<ZaneStatTypeGrowth>());
    const advancedClassDataNow = useMemo(() => ({
        level: advancedClassLevelNow,
        growthStats: advancedClassGrowthStatsNow,
    }), [advancedClassLevelNow, advancedClassGrowthStatsNow]);
    const advancedClassDataNext = useMemo(() => ({
        level: advancedClassLevelNext,
        setLevelNext: setAdvancedClassLevelNext,
        growthStats: advancedClassGrowthStatsNext,
        setGrowthStatsNext: setAdvancedClassGrowthStatsNext,
    }), [advancedClassLevelNext, setAdvancedClassLevelNext, advancedClassGrowthStatsNext, setAdvancedClassGrowthStatsNext]);
    const confirmAdvancedClassData = useCallback(() => {
        confirmAdvancedClassLevel();
        confirmAdvancedClassGrowthStats();
    }, [confirmAdvancedClassLevel, confirmAdvancedClassGrowthStats]);
    const cancelAdvancedClassData = useCallback(() => {
        cancelAdvancedClassLevel();
        cancelAdvancedClassGrowthStats();
    }, [cancelAdvancedClassLevel, cancelAdvancedClassGrowthStats]);



    const {valueNow: promotedClassLevelNow, valueNext: promotedClassLevelNext, cancel: cancelPromotedClassLevel, setValueNext: setPromotedClassLevelNext, confirm: confirmPromotedClassLevel} = useConfirmState<number>(initial.classData.promoted?.level ?? 0);
    const {valueNow: promotedClassDoubleGrowthStatsNow, valueNext: promotedClassDoubleGrowthStatsNext, cancel: cancelPromotedClassDoubleGrowthStats, setValueNext: setPromotedClassDoubleGrowthStatsNext, confirm: confirmPromotedClassDoubleGrowthStats} = useConfirmState(initial.classData.promoted?.doubleGrowthStats ?? new Set<ZaneStatTypeGrowth>());
    const promotedClassDataNow = useMemo(() => ({
        level: promotedClassLevelNow,
        doubleGrowthStats: promotedClassDoubleGrowthStatsNow,
    }), [promotedClassLevelNow, promotedClassDoubleGrowthStatsNow]);
    const promotedClassDataNext = useMemo(() => ({
        level: promotedClassLevelNext,
        setLevelNext: setPromotedClassLevelNext,
        doubleGrowthStats: promotedClassDoubleGrowthStatsNext,
        setDoubleGrowthStatsNext: setPromotedClassDoubleGrowthStatsNext,
    }), [promotedClassLevelNext, setPromotedClassLevelNext, promotedClassDoubleGrowthStatsNext, setPromotedClassDoubleGrowthStatsNext]);
    const confirmPromotedClassData = useCallback(() => {
        confirmPromotedClassLevel();
        confirmPromotedClassDoubleGrowthStats();
    }, [confirmPromotedClassLevel, confirmPromotedClassDoubleGrowthStats]);
    const cancelPromotedClassData = useCallback(() => {
        cancelPromotedClassLevel();
        cancelPromotedClassDoubleGrowthStats();
    }, [cancelPromotedClassLevel, cancelPromotedClassDoubleGrowthStats]);



    const classDataNow = useMemo(() => ({
        basic: basicClassDataNow,
        advanced: advancedClassDataNow,
        promoted: promotedClassDataNow,
    } satisfies ZaneStatSheet['classData']), [advancedClassDataNow, basicClassDataNow, promotedClassDataNow]);
    const classDataNext = useMemo(() => ({
        basic: basicClassDataNext,
        advanced: advancedClassDataNext,
        promoted: promotedClassDataNext,
    } satisfies ZaneStatSheet['classData'] & Record<string, unknown>), [basicClassDataNext, advancedClassDataNext, promotedClassDataNext]);
    const confirmClassData = useCallback(() => {
        confirmBasicClassData();
        confirmAdvancedClassData();
        confirmPromotedClassData();
    }, [confirmBasicClassData, confirmAdvancedClassData, confirmPromotedClassData]);
    const cancelClassData = useCallback(() => {
        cancelBasicClassData();
        cancelAdvancedClassData();
        cancelPromotedClassData();
    }, [cancelBasicClassData, cancelAdvancedClassData, cancelPromotedClassData]);

    const [statStrengthRecentlyGrownPoints, setStatStrengthRecentlyGrownPoints] = useState<number>(0);
    const [statStrengthPointsToAutoAssign, setStatStrengthPointsToAutoAssign] = useState<number>(initial.stats.strength.pointsToAutoAssign);
    const [statStrengthCountGrownPointsTowardAutoAssign, setStatStrengthCountGrownPointsTowardAutoAssign] = useState<boolean>(initial.stats.strength.countGrownPointsTowardAutoAssign);
    const [statStrengthBypassStatCaps, setStatStrengthBypassStatCaps] = useState(initial.stats.strength.bypassStatCaps ?? false);
    const {valueNow: statStrengthPointsNow, valueNext: statStrengthPointsNext, cancel: cancelStatStrengthPoints, setValueNext: setStatStrengthPointsNext, confirm: confirmStatStrengthPoints} = useConfirmState<number>(initial.stats.strength.points);
    const {valueNow: statStrengthGrowthPercentNow, valueNext: statStrengthGrowthPercentNext, cancel: cancelStatStrengthGrowthPercent, setValueNext: setStatStrengthGrowthPercentNext, confirm: confirmStatStrengthGrowthPercent} = useConfirmState<number>(initial.stats.strength.growthPercentagePoints);
    const {valueNow: statStrengthTotalGrownNow, valueNext: statStrengthTotalGrownNext, cancel: cancelStatStrengthTotalGrown, setValueNext: setStatStrengthTotalGrownNext, confirm: confirmStatStrengthTotalGrown} = useConfirmState<number>(initial.stats.strength.totalGrownPoints);
    const statStrengthNow = useMemo(() => ({
        type: ZaneStatType.STRENGTH as const,
        points: statStrengthPointsNow,
        growthPercentagePoints: statStrengthGrowthPercentNow,
        totalGrownPoints: statStrengthTotalGrownNow,
        pointsToAutoAssign: statStrengthPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statStrengthCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statStrengthBypassStatCaps,
    }), [statStrengthPointsNow, statStrengthGrowthPercentNow, statStrengthTotalGrownNow, statStrengthPointsToAutoAssign, statStrengthCountGrownPointsTowardAutoAssign, statStrengthBypassStatCaps]);
    const statStrengthNext = useMemo(() => ({
        type: ZaneStatType.STRENGTH as const,
        setPointsNext: setStatStrengthPointsNext,
        setGrowthPercentNext: setStatStrengthGrowthPercentNext,
        setTotalGrownNext: setStatStrengthTotalGrownNext,
        setRecentlyGrownPoints: setStatStrengthRecentlyGrownPoints,
        setPointsToAutoAssign: setStatStrengthPointsToAutoAssign,
        setCountGrownPointsTowardAutoAssign: setStatStrengthCountGrownPointsTowardAutoAssign,
        points: statStrengthPointsNext,
        growthPercentagePoints: statStrengthGrowthPercentNext,
        totalGrownPoints: statStrengthTotalGrownNext,
        recentlyGrownPoints: statStrengthRecentlyGrownPoints,
        pointsToAutoAssign: statStrengthPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statStrengthCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statStrengthBypassStatCaps,
        setBypassStatCaps: setStatStrengthBypassStatCaps,
    }), [setStatStrengthPointsNext, setStatStrengthGrowthPercentNext, setStatStrengthTotalGrownNext, statStrengthPointsNext, statStrengthGrowthPercentNext, statStrengthTotalGrownNext, statStrengthRecentlyGrownPoints, statStrengthPointsToAutoAssign, statStrengthCountGrownPointsTowardAutoAssign, statStrengthBypassStatCaps]);
    const confirmStatStrength = useCallback(() => {
        confirmStatStrengthPoints();
        confirmStatStrengthGrowthPercent();
        confirmStatStrengthTotalGrown();
        setStatStrengthRecentlyGrownPoints(0);
    }, [confirmStatStrengthPoints, confirmStatStrengthGrowthPercent, confirmStatStrengthTotalGrown]);
    const cancelStatStrength = useCallback(() => {
        cancelStatStrengthPoints();
        cancelStatStrengthGrowthPercent();
        cancelStatStrengthTotalGrown();
        setStatStrengthRecentlyGrownPoints(0);
    }, [cancelStatStrengthPoints, cancelStatStrengthGrowthPercent, cancelStatStrengthTotalGrown]);

    const [statMagicRecentlyGrownPoints, setStatMagicRecentlyGrownPoints] = useState<number>(0);
    const [statMagicPointsToAutoAssign, setStatMagicPointsToAutoAssign] = useState<number>(initial.stats.magic.pointsToAutoAssign);
    const [statMagicCountGrownPointsTowardAutoAssign, setStatMagicCountGrownPointsTowardAutoAssign] = useState<boolean>(initial.stats.magic.countGrownPointsTowardAutoAssign);
    const [statMagicBypassStatCaps, setStatMagicBypassStatCaps] = useState(initial.stats.magic.bypassStatCaps ?? false);
    const {valueNow: statMagicPointsNow, valueNext: statMagicPointsNext, cancel: cancelStatMagicPoints, setValueNext: setStatMagicPointsNext, confirm: confirmStatMagicPoints} = useConfirmState<number>(initial.stats.magic.points);
    const {valueNow: statMagicGrowthPercentNow, valueNext: statMagicGrowthPercentNext, cancel: cancelStatMagicGrowthPercent, setValueNext: setStatMagicGrowthPercentNext, confirm: confirmStatMagicGrowthPercent} = useConfirmState<number>(initial.stats.magic.growthPercentagePoints);
    const {valueNow: statMagicTotalGrownNow, valueNext: statMagicTotalGrownNext, cancel: cancelStatMagicTotalGrown, setValueNext: setStatMagicTotalGrownNext, confirm: confirmStatMagicTotalGrown} = useConfirmState<number>(initial.stats.magic.totalGrownPoints);
    const statMagicNow = useMemo(() => ({
        type: ZaneStatType.MAGIC as const,
        points: statMagicPointsNow,
        growthPercentagePoints: statMagicGrowthPercentNow,
        totalGrownPoints: statMagicTotalGrownNow,
        pointsToAutoAssign: statMagicPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statMagicCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statMagicBypassStatCaps,
    }), [statMagicPointsNow, statMagicGrowthPercentNow, statMagicTotalGrownNow, statMagicPointsToAutoAssign, statMagicCountGrownPointsTowardAutoAssign, statMagicBypassStatCaps]);
    const statMagicNext = useMemo(() => ({
        type: ZaneStatType.MAGIC as const,
        setPointsNext: setStatMagicPointsNext,
        setGrowthPercentNext: setStatMagicGrowthPercentNext,
        setTotalGrownNext: setStatMagicTotalGrownNext,
        setRecentlyGrownPoints: setStatMagicRecentlyGrownPoints,
        setPointsToAutoAssign: setStatMagicPointsToAutoAssign,
        setCountGrownPointsTowardAutoAssign: setStatMagicCountGrownPointsTowardAutoAssign,
        points: statMagicPointsNext,
        growthPercentagePoints: statMagicGrowthPercentNext,
        totalGrownPoints: statMagicTotalGrownNext,
        recentlyGrownPoints: statMagicRecentlyGrownPoints,
        pointsToAutoAssign: statMagicPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statMagicCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statMagicBypassStatCaps,
        setBypassStatCaps: setStatMagicBypassStatCaps,
    }), [setStatMagicPointsNext, setStatMagicGrowthPercentNext, setStatMagicTotalGrownNext, statMagicPointsNext, statMagicGrowthPercentNext, statMagicTotalGrownNext, statMagicRecentlyGrownPoints, statMagicPointsToAutoAssign, statMagicCountGrownPointsTowardAutoAssign, statMagicBypassStatCaps]);
    const confirmStatMagic = useCallback(() => {
        confirmStatMagicPoints();
        confirmStatMagicGrowthPercent();
        confirmStatMagicTotalGrown();
        setStatMagicRecentlyGrownPoints(0);
    }, [confirmStatMagicPoints, confirmStatMagicGrowthPercent, confirmStatMagicTotalGrown]);
    const cancelStatMagic = useCallback(() => {
        cancelStatMagicPoints();
        cancelStatMagicGrowthPercent();
        cancelStatMagicTotalGrown();
        setStatMagicRecentlyGrownPoints(0);
    }, [cancelStatMagicPoints, cancelStatMagicGrowthPercent, cancelStatMagicTotalGrown]);

    const [statSkillRecentlyGrownPoints, setStatSkillRecentlyGrownPoints] = useState<number>(0);
    const [statSkillPointsToAutoAssign, setStatSkillPointsToAutoAssign] = useState<number>(initial.stats.skill.pointsToAutoAssign);
    const [statSkillCountGrownPointsTowardAutoAssign, setStatSkillCountGrownPointsTowardAutoAssign] = useState<boolean>(initial.stats.skill.countGrownPointsTowardAutoAssign);
    const [statSkillBypassStatCaps, setStatSkillBypassStatCaps] = useState(initial.stats.skill.bypassStatCaps ?? false);
    const {valueNow: statSkillPointsNow, valueNext: statSkillPointsNext, cancel: cancelStatSkillPoints, setValueNext: setStatSkillPointsNext, confirm: confirmStatSkillPoints} = useConfirmState<number>(initial.stats.skill.points);
    const {valueNow: statSkillGrowthPercentNow, valueNext: statSkillGrowthPercentNext, cancel: cancelStatSkillGrowthPercent, setValueNext: setStatSkillGrowthPercentNext, confirm: confirmStatSkillGrowthPercent} = useConfirmState<number>(initial.stats.skill.growthPercentagePoints);
    const {valueNow: statSkillTotalGrownNow, valueNext: statSkillTotalGrownNext, cancel: cancelStatSkillTotalGrown, setValueNext: setStatSkillTotalGrownNext, confirm: confirmStatSkillTotalGrown} = useConfirmState<number>(initial.stats.skill.totalGrownPoints);
    const statSkillNow = useMemo(() => ({
        type: ZaneStatType.SKILL as const,
        points: statSkillPointsNow,
        growthPercentagePoints: statSkillGrowthPercentNow,
        totalGrownPoints: statSkillTotalGrownNow,
        pointsToAutoAssign: statSkillPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statSkillCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statSkillBypassStatCaps,
    }), [statSkillPointsNow, statSkillGrowthPercentNow, statSkillTotalGrownNow, statSkillPointsToAutoAssign, statSkillCountGrownPointsTowardAutoAssign, statSkillBypassStatCaps]);
    const statSkillNext = useMemo(() => ({
        type: ZaneStatType.SKILL as const,
        setPointsNext: setStatSkillPointsNext,
        setGrowthPercentNext: setStatSkillGrowthPercentNext,
        setTotalGrownNext: setStatSkillTotalGrownNext,
        setRecentlyGrownPoints: setStatSkillRecentlyGrownPoints,
        setPointsToAutoAssign: setStatSkillPointsToAutoAssign,
        setCountGrownPointsTowardAutoAssign: setStatSkillCountGrownPointsTowardAutoAssign,
        points: statSkillPointsNext,
        growthPercentagePoints: statSkillGrowthPercentNext,
        totalGrownPoints: statSkillTotalGrownNext,
        recentlyGrownPoints: statSkillRecentlyGrownPoints,
        pointsToAutoAssign: statSkillPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statSkillCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statSkillBypassStatCaps,
        setBypassStatCaps: setStatSkillBypassStatCaps,
    }), [setStatSkillPointsNext, setStatSkillGrowthPercentNext, setStatSkillTotalGrownNext, statSkillPointsNext, statSkillGrowthPercentNext, statSkillTotalGrownNext, statSkillRecentlyGrownPoints, statSkillPointsToAutoAssign, statSkillCountGrownPointsTowardAutoAssign, statSkillBypassStatCaps]);
    const confirmStatSkill = useCallback(() => {
        confirmStatSkillPoints();
        confirmStatSkillGrowthPercent();
        confirmStatSkillTotalGrown();
        setStatSkillRecentlyGrownPoints(0);
    }, [confirmStatSkillPoints, confirmStatSkillGrowthPercent, confirmStatSkillTotalGrown]);
    const cancelStatSkill = useCallback(() => {
        cancelStatSkillPoints();
        cancelStatSkillGrowthPercent();
        cancelStatSkillTotalGrown();
        setStatSkillRecentlyGrownPoints(0);
    }, [cancelStatSkillPoints, cancelStatSkillGrowthPercent, cancelStatSkillTotalGrown]);

    const [statSpeedRecentlyGrownPoints, setStatSpeedRecentlyGrownPoints] = useState<number>(0);
    const [statSpeedPointsToAutoAssign, setStatSpeedPointsToAutoAssign] = useState<number>(initial.stats.speed.pointsToAutoAssign);
    const [statSpeedCountGrownPointsTowardAutoAssign, setStatSpeedCountGrownPointsTowardAutoAssign] = useState<boolean>(initial.stats.speed.countGrownPointsTowardAutoAssign);
    const [statSpeedBypassStatCaps, setStatSpeedBypassStatCaps] = useState(initial.stats.speed.bypassStatCaps ?? false);
    const {valueNow: statSpeedPointsNow, valueNext: statSpeedPointsNext, cancel: cancelStatSpeedPoints, setValueNext: setStatSpeedPointsNext, confirm: confirmStatSpeedPoints} = useConfirmState<number>(initial.stats.speed.points);
    const {valueNow: statSpeedGrowthPercentNow, valueNext: statSpeedGrowthPercentNext, cancel: cancelStatSpeedGrowthPercent, setValueNext: setStatSpeedGrowthPercentNext, confirm: confirmStatSpeedGrowthPercent} = useConfirmState<number>(initial.stats.speed.growthPercentagePoints);
    const {valueNow: statSpeedTotalGrownNow, valueNext: statSpeedTotalGrownNext, cancel: cancelStatSpeedTotalGrown, setValueNext: setStatSpeedTotalGrownNext, confirm: confirmStatSpeedTotalGrown} = useConfirmState<number>(initial.stats.speed.totalGrownPoints);
    const statSpeedNow = useMemo(() => ({
        type: ZaneStatType.SPEED as const,
        points: statSpeedPointsNow,
        growthPercentagePoints: statSpeedGrowthPercentNow,
        totalGrownPoints: statSpeedTotalGrownNow,
        pointsToAutoAssign: statSpeedPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statSpeedCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statSpeedBypassStatCaps,
    }), [statSpeedPointsNow, statSpeedGrowthPercentNow, statSpeedTotalGrownNow, statSpeedPointsToAutoAssign, statSpeedCountGrownPointsTowardAutoAssign, statSpeedBypassStatCaps]);
    const statSpeedNext = useMemo(() => ({
        type: ZaneStatType.SPEED as const,
        setPointsNext: setStatSpeedPointsNext,
        setGrowthPercentNext: setStatSpeedGrowthPercentNext,
        setTotalGrownNext: setStatSpeedTotalGrownNext,
        setRecentlyGrownPoints: setStatSpeedRecentlyGrownPoints,
        setPointsToAutoAssign: setStatSpeedPointsToAutoAssign,
        setCountGrownPointsTowardAutoAssign: setStatSpeedCountGrownPointsTowardAutoAssign,
        points: statSpeedPointsNext,
        growthPercentagePoints: statSpeedGrowthPercentNext,
        totalGrownPoints: statSpeedTotalGrownNext,
        recentlyGrownPoints: statSpeedRecentlyGrownPoints,
        pointsToAutoAssign: statSpeedPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statSpeedCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statSpeedBypassStatCaps,
        setBypassStatCaps: setStatSpeedBypassStatCaps,
    }), [setStatSpeedPointsNext, setStatSpeedGrowthPercentNext, setStatSpeedTotalGrownNext, statSpeedPointsNext, statSpeedGrowthPercentNext, statSpeedTotalGrownNext, statSpeedRecentlyGrownPoints, statSpeedPointsToAutoAssign, statSpeedCountGrownPointsTowardAutoAssign, statSpeedBypassStatCaps]);
    const confirmStatSpeed = useCallback(() => {
        confirmStatSpeedPoints();
        confirmStatSpeedGrowthPercent();
        confirmStatSpeedTotalGrown();
        setStatSpeedRecentlyGrownPoints(0);
    }, [confirmStatSpeedPoints, confirmStatSpeedGrowthPercent, confirmStatSpeedTotalGrown]);
    const cancelStatSpeed = useCallback(() => {
        cancelStatSpeedPoints();
        cancelStatSpeedGrowthPercent();
        cancelStatSpeedTotalGrown();
        setStatSpeedRecentlyGrownPoints(0);
    }, [cancelStatSpeedPoints, cancelStatSpeedGrowthPercent, cancelStatSpeedTotalGrown]);

    const [statLuckRecentlyGrownPoints, setStatLuckRecentlyGrownPoints] = useState<number>(0);
    const [statLuckPointsToAutoAssign, setStatLuckPointsToAutoAssign] = useState<number>(initial.stats.luck.pointsToAutoAssign);
    const [statLuckCountGrownPointsTowardAutoAssign, setStatLuckCountGrownPointsTowardAutoAssign] = useState<boolean>(initial.stats.luck.countGrownPointsTowardAutoAssign);
    const [statLuckBypassStatCaps, setStatLuckBypassStatCaps] = useState(initial.stats.luck.bypassStatCaps ?? false);
    const {valueNow: statLuckPointsNow, valueNext: statLuckPointsNext, cancel: cancelStatLuckPoints, setValueNext: setStatLuckPointsNext, confirm: confirmStatLuckPoints} = useConfirmState<number>(initial.stats.luck.points);
    const {valueNow: statLuckGrowthPercentNow, valueNext: statLuckGrowthPercentNext, cancel: cancelStatLuckGrowthPercent, setValueNext: setStatLuckGrowthPercentNext, confirm: confirmStatLuckGrowthPercent} = useConfirmState<number>(initial.stats.luck.growthPercentagePoints);
    const {valueNow: statLuckTotalGrownNow, valueNext: statLuckTotalGrownNext, cancel: cancelStatLuckTotalGrown, setValueNext: setStatLuckTotalGrownNext, confirm: confirmStatLuckTotalGrown} = useConfirmState<number>(initial.stats.luck.totalGrownPoints);
    const statLuckNow = useMemo(() => ({
        type: ZaneStatType.LUCK as const,
        points: statLuckPointsNow,
        growthPercentagePoints: statLuckGrowthPercentNow,
        totalGrownPoints: statLuckTotalGrownNow,
        pointsToAutoAssign: statLuckPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statLuckCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statLuckBypassStatCaps,
    }), [statLuckPointsNow, statLuckGrowthPercentNow, statLuckTotalGrownNow, statLuckPointsToAutoAssign, statLuckCountGrownPointsTowardAutoAssign, statLuckBypassStatCaps]);
    const statLuckNext = useMemo(() => ({
        type: ZaneStatType.LUCK as const,
        setPointsNext: setStatLuckPointsNext,
        setGrowthPercentNext: setStatLuckGrowthPercentNext,
        setTotalGrownNext: setStatLuckTotalGrownNext,
        setRecentlyGrownPoints: setStatLuckRecentlyGrownPoints,
        setPointsToAutoAssign: setStatLuckPointsToAutoAssign,
        setCountGrownPointsTowardAutoAssign: setStatLuckCountGrownPointsTowardAutoAssign,
        points: statLuckPointsNext,
        growthPercentagePoints: statLuckGrowthPercentNext,
        totalGrownPoints: statLuckTotalGrownNext,
        recentlyGrownPoints: statLuckRecentlyGrownPoints,
        pointsToAutoAssign: statLuckPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statLuckCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statLuckBypassStatCaps,
        setBypassStatCaps: setStatLuckBypassStatCaps,
    }), [setStatLuckPointsNext, setStatLuckGrowthPercentNext, setStatLuckTotalGrownNext, statLuckPointsNext, statLuckGrowthPercentNext, statLuckTotalGrownNext, statLuckRecentlyGrownPoints, statLuckPointsToAutoAssign, statLuckCountGrownPointsTowardAutoAssign, statLuckBypassStatCaps]);
    const confirmStatLuck = useCallback(() => {
        confirmStatLuckPoints();
        confirmStatLuckGrowthPercent();
        confirmStatLuckTotalGrown();
        setStatLuckRecentlyGrownPoints(0);
    }, [confirmStatLuckPoints, confirmStatLuckGrowthPercent, confirmStatLuckTotalGrown]);
    const cancelStatLuck = useCallback(() => {
        cancelStatLuckPoints();
        cancelStatLuckGrowthPercent();
        cancelStatLuckTotalGrown();
        setStatLuckRecentlyGrownPoints(0);
    }, [cancelStatLuckPoints, cancelStatLuckGrowthPercent, cancelStatLuckTotalGrown]);

    const [statDefenseRecentlyGrownPoints, setStatDefenseRecentlyGrownPoints] = useState<number>(0);
    const [statDefensePointsToAutoAssign, setStatDefensePointsToAutoAssign] = useState<number>(initial.stats.defense.pointsToAutoAssign);
    const [statDefenseCountGrownPointsTowardAutoAssign, setStatDefenseCountGrownPointsTowardAutoAssign] = useState<boolean>(initial.stats.defense.countGrownPointsTowardAutoAssign);
    const [statDefenseBypassStatCaps, setStatDefenseBypassStatCaps] = useState(initial.stats.defense.bypassStatCaps ?? false);
    const {valueNow: statDefensePointsNow, valueNext: statDefensePointsNext, cancel: cancelStatDefensePoints, setValueNext: setStatDefensePointsNext, confirm: confirmStatDefensePoints} = useConfirmState<number>(initial.stats.defense.points);
    const {valueNow: statDefenseGrowthPercentNow, valueNext: statDefenseGrowthPercentNext, cancel: cancelStatDefenseGrowthPercent, setValueNext: setStatDefenseGrowthPercentNext, confirm: confirmStatDefenseGrowthPercent} = useConfirmState<number>(initial.stats.defense.growthPercentagePoints);
    const {valueNow: statDefenseTotalGrownNow, valueNext: statDefenseTotalGrownNext, cancel: cancelStatDefenseTotalGrown, setValueNext: setStatDefenseTotalGrownNext, confirm: confirmStatDefenseTotalGrown} = useConfirmState<number>(initial.stats.defense.totalGrownPoints);
    const statDefenseNow = useMemo(() => ({
        type: ZaneStatType.DEFENSE as const,
        points: statDefensePointsNow,
        growthPercentagePoints: statDefenseGrowthPercentNow,
        totalGrownPoints: statDefenseTotalGrownNow,
        pointsToAutoAssign: statDefensePointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statDefenseCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statDefenseBypassStatCaps,
    }), [statDefensePointsNow, statDefenseGrowthPercentNow, statDefenseTotalGrownNow, statDefensePointsToAutoAssign, statDefenseCountGrownPointsTowardAutoAssign, statDefenseBypassStatCaps]);
    const statDefenseNext = useMemo(() => ({
        type: ZaneStatType.DEFENSE as const,
        setPointsNext: setStatDefensePointsNext,
        setGrowthPercentNext: setStatDefenseGrowthPercentNext,
        setTotalGrownNext: setStatDefenseTotalGrownNext,
        setRecentlyGrownPoints: setStatDefenseRecentlyGrownPoints,
        setPointsToAutoAssign: setStatDefensePointsToAutoAssign,
        setCountGrownPointsTowardAutoAssign: setStatDefenseCountGrownPointsTowardAutoAssign,
        points: statDefensePointsNext,
        growthPercentagePoints: statDefenseGrowthPercentNext,
        totalGrownPoints: statDefenseTotalGrownNext,
        recentlyGrownPoints: statDefenseRecentlyGrownPoints,
        pointsToAutoAssign: statDefensePointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statDefenseCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statDefenseBypassStatCaps,
        setBypassStatCaps: setStatDefenseBypassStatCaps,
    }), [setStatDefensePointsNext, setStatDefenseGrowthPercentNext, setStatDefenseTotalGrownNext, statDefensePointsNext, statDefenseGrowthPercentNext, statDefenseTotalGrownNext, statDefenseRecentlyGrownPoints, statDefensePointsToAutoAssign, statDefenseCountGrownPointsTowardAutoAssign, statDefenseBypassStatCaps]);
    const confirmStatDefense = useCallback(() => {
        confirmStatDefensePoints();
        confirmStatDefenseGrowthPercent();
        confirmStatDefenseTotalGrown();
        setStatDefenseRecentlyGrownPoints(0);
    }, [confirmStatDefensePoints, confirmStatDefenseGrowthPercent, confirmStatDefenseTotalGrown]);
    const cancelStatDefense = useCallback(() => {
        cancelStatDefensePoints();
        cancelStatDefenseGrowthPercent();
        cancelStatDefenseTotalGrown();
        setStatDefenseRecentlyGrownPoints(0);
    }, [cancelStatDefensePoints, cancelStatDefenseGrowthPercent, cancelStatDefenseTotalGrown]);

    const [statResistanceRecentlyGrownPoints, setStatResistanceRecentlyGrownPoints] = useState<number>(0);
    const [statResistancePointsToAutoAssign, setStatResistancePointsToAutoAssign] = useState<number>(initial.stats.resistance.pointsToAutoAssign);
    const [statResistanceCountGrownPointsTowardAutoAssign, setStatResistanceCountGrownPointsTowardAutoAssign] = useState<boolean>(initial.stats.resistance.countGrownPointsTowardAutoAssign);
    const [statResistanceBypassStatCaps, setStatResistanceBypassStatCaps] = useState(initial.stats.resistance.bypassStatCaps ?? false);
    const {valueNow: statResistancePointsNow, valueNext: statResistancePointsNext, cancel: cancelStatResistancePoints, setValueNext: setStatResistancePointsNext, confirm: confirmStatResistancePoints} = useConfirmState<number>(initial.stats.resistance.points);
    const {valueNow: statResistanceGrowthPercentNow, valueNext: statResistanceGrowthPercentNext, cancel: cancelStatResistanceGrowthPercent, setValueNext: setStatResistanceGrowthPercentNext, confirm: confirmStatResistanceGrowthPercent} = useConfirmState<number>(initial.stats.resistance.growthPercentagePoints);
    const {valueNow: statResistanceTotalGrownNow, valueNext: statResistanceTotalGrownNext, cancel: cancelStatResistanceTotalGrown, setValueNext: setStatResistanceTotalGrownNext, confirm: confirmStatResistanceTotalGrown} = useConfirmState<number>(initial.stats.resistance.totalGrownPoints);
    const statResistanceNow = useMemo(() => ({
        type: ZaneStatType.RESISTANCE as const,
        points: statResistancePointsNow,
        growthPercentagePoints: statResistanceGrowthPercentNow,
        totalGrownPoints: statResistanceTotalGrownNow,
        pointsToAutoAssign: statResistancePointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statResistanceCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statResistanceBypassStatCaps,
    }), [statResistancePointsNow, statResistanceGrowthPercentNow, statResistanceTotalGrownNow, statResistancePointsToAutoAssign, statResistanceCountGrownPointsTowardAutoAssign, statResistanceBypassStatCaps]);
    const statResistanceNext = useMemo(() => ({
        type: ZaneStatType.RESISTANCE as const,
        setPointsNext: setStatResistancePointsNext,
        setGrowthPercentNext: setStatResistanceGrowthPercentNext,
        setTotalGrownNext: setStatResistanceTotalGrownNext,
        setRecentlyGrownPoints: setStatResistanceRecentlyGrownPoints,
        setPointsToAutoAssign: setStatResistancePointsToAutoAssign,
        setCountGrownPointsTowardAutoAssign: setStatResistanceCountGrownPointsTowardAutoAssign,
        points: statResistancePointsNext,
        growthPercentagePoints: statResistanceGrowthPercentNext,
        totalGrownPoints: statResistanceTotalGrownNext,
        recentlyGrownPoints: statResistanceRecentlyGrownPoints,
        pointsToAutoAssign: statResistancePointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statResistanceCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statResistanceBypassStatCaps,
        setBypassStatCaps: setStatResistanceBypassStatCaps,
    }), [setStatResistancePointsNext, setStatResistanceGrowthPercentNext, setStatResistanceTotalGrownNext, statResistancePointsNext, statResistanceGrowthPercentNext, statResistanceTotalGrownNext, statResistanceRecentlyGrownPoints, statResistancePointsToAutoAssign, statResistanceCountGrownPointsTowardAutoAssign, statResistanceBypassStatCaps]);
    const confirmStatResistance = useCallback(() => {
        confirmStatResistancePoints();
        confirmStatResistanceGrowthPercent();
        confirmStatResistanceTotalGrown();
        setStatResistanceRecentlyGrownPoints(0);
    }, [confirmStatResistancePoints, confirmStatResistanceGrowthPercent, confirmStatResistanceTotalGrown]);
    const cancelStatResistance = useCallback(() => {
        cancelStatResistancePoints();
        cancelStatResistanceGrowthPercent();
        cancelStatResistanceTotalGrown();
        setStatResistanceRecentlyGrownPoints(0);
    }, [cancelStatResistancePoints, cancelStatResistanceGrowthPercent, cancelStatResistanceTotalGrown]);

    const [statMindRecentlyGrownPoints, setStatMindRecentlyGrownPoints] = useState<number>(0);
    const [statMindPointsToAutoAssign, setStatMindPointsToAutoAssign] = useState<number>(initial.stats.mind.pointsToAutoAssign);
    const [statMindCountGrownPointsTowardAutoAssign, setStatMindCountGrownPointsTowardAutoAssign] = useState<boolean>(initial.stats.mind.countGrownPointsTowardAutoAssign);
    const [statMindBypassStatCaps, setStatMindBypassStatCaps] = useState(initial.stats.mind.bypassStatCaps ?? false);
    const {valueNow: statMindPointsNow, valueNext: statMindPointsNext, cancel: cancelStatMindPoints, setValueNext: setStatMindPointsNext, confirm: confirmStatMindPoints} = useConfirmState<number>(initial.stats.mind.points);
    const {valueNow: statMindGrowthPercentNow, valueNext: statMindGrowthPercentNext, cancel: cancelStatMindGrowthPercent, setValueNext: setStatMindGrowthPercentNext, confirm: confirmStatMindGrowthPercent} = useConfirmState<number>(initial.stats.mind.growthPercentagePoints);
    const {valueNow: statMindTotalGrownNow, valueNext: statMindTotalGrownNext, cancel: cancelStatMindTotalGrown, setValueNext: setStatMindTotalGrownNext, confirm: confirmStatMindTotalGrown} = useConfirmState<number>(initial.stats.mind.totalGrownPoints);
    const statMindNow = useMemo(() => ({
        type: ZaneStatType.MIND as const,
        points: statMindPointsNow,
        growthPercentagePoints: statMindGrowthPercentNow,
        totalGrownPoints: statMindTotalGrownNow,
        pointsToAutoAssign: statMindPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statMindCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statMindBypassStatCaps,
    }), [statMindPointsNow, statMindGrowthPercentNow, statMindTotalGrownNow, statMindPointsToAutoAssign, statMindCountGrownPointsTowardAutoAssign, statMindBypassStatCaps]);
    const statMindNext = useMemo(() => ({
        type: ZaneStatType.MIND as const,
        setPointsNext: setStatMindPointsNext,
        setGrowthPercentNext: setStatMindGrowthPercentNext,
        setTotalGrownNext: setStatMindTotalGrownNext,
        setRecentlyGrownPoints: setStatMindRecentlyGrownPoints,
        setPointsToAutoAssign: setStatMindPointsToAutoAssign,
        setCountGrownPointsTowardAutoAssign: setStatMindCountGrownPointsTowardAutoAssign,
        points: statMindPointsNext,
        growthPercentagePoints: statMindGrowthPercentNext,
        totalGrownPoints: statMindTotalGrownNext,
        recentlyGrownPoints: statMindRecentlyGrownPoints,
        pointsToAutoAssign: statMindPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statMindCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statMindBypassStatCaps,
        setBypassStatCaps: setStatMindBypassStatCaps,
    }), [setStatMindPointsNext, setStatMindGrowthPercentNext, setStatMindTotalGrownNext, statMindPointsNext, statMindGrowthPercentNext, statMindTotalGrownNext, statMindRecentlyGrownPoints, statMindPointsToAutoAssign, statMindCountGrownPointsTowardAutoAssign, statMindBypassStatCaps]);
    const confirmStatMind = useCallback(() => {
        confirmStatMindPoints();
        confirmStatMindGrowthPercent();
        confirmStatMindTotalGrown();
        setStatMindRecentlyGrownPoints(0);
    }, [confirmStatMindPoints, confirmStatMindGrowthPercent, confirmStatMindTotalGrown]);
    const cancelStatMind = useCallback(() => {
        cancelStatMindPoints();
        cancelStatMindGrowthPercent();
        cancelStatMindTotalGrown();
        setStatMindRecentlyGrownPoints(0);
    }, [cancelStatMindPoints, cancelStatMindGrowthPercent, cancelStatMindTotalGrown]);

    const [statVitalityRecentlyGrownPoints, setStatVitalityRecentlyGrownPoints] = useState<number>(0);
    const [statVitalityPointsToAutoAssign, setStatVitalityPointsToAutoAssign] = useState<number>(initial.stats.vitality.pointsToAutoAssign);
    const [statVitalityCountGrownPointsTowardAutoAssign, setStatVitalityCountGrownPointsTowardAutoAssign] = useState<boolean>(initial.stats.vitality.countGrownPointsTowardAutoAssign);
    const [statVitalityBypassStatCaps, setStatVitalityBypassStatCaps] = useState(initial.stats.vitality.bypassStatCaps ?? false);
    const {valueNow: statVitalityPointsNow, valueNext: statVitalityPointsNext, cancel: cancelStatVitalityPoints, setValueNext: setStatVitalityPointsNext, confirm: confirmStatVitalityPoints} = useConfirmState<number>(initial.stats.vitality.points);
    const {valueNow: statVitalityGrowthPercentNow, valueNext: statVitalityGrowthPercentNext, cancel: cancelStatVitalityGrowthPercent, setValueNext: setStatVitalityGrowthPercentNext, confirm: confirmStatVitalityGrowthPercent} = useConfirmState<number>(initial.stats.vitality.growthPercentagePoints);
    const {valueNow: statVitalityTotalGrownNow, valueNext: statVitalityTotalGrownNext, cancel: cancelStatVitalityTotalGrown, setValueNext: setStatVitalityTotalGrownNext, confirm: confirmStatVitalityTotalGrown} = useConfirmState<number>(initial.stats.vitality.totalGrownPoints);
    const statVitalityNow = useMemo(() => ({
        type: ZaneStatType.VITALITY as const,
        points: statVitalityPointsNow,
        growthPercentagePoints: statVitalityGrowthPercentNow,
        totalGrownPoints: statVitalityTotalGrownNow,
        pointsToAutoAssign: statVitalityPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statVitalityCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statVitalityBypassStatCaps,
    }), [statVitalityPointsNow, statVitalityGrowthPercentNow, statVitalityTotalGrownNow, statVitalityPointsToAutoAssign, statVitalityCountGrownPointsTowardAutoAssign, statVitalityBypassStatCaps]);
    const statVitalityNext = useMemo(() => ({
        type: ZaneStatType.VITALITY as const,
        setPointsNext: setStatVitalityPointsNext,
        setGrowthPercentNext: setStatVitalityGrowthPercentNext,
        setTotalGrownNext: setStatVitalityTotalGrownNext,
        setRecentlyGrownPoints: setStatVitalityRecentlyGrownPoints,
        setPointsToAutoAssign: setStatVitalityPointsToAutoAssign,
        setCountGrownPointsTowardAutoAssign: setStatVitalityCountGrownPointsTowardAutoAssign,
        points: statVitalityPointsNext,
        growthPercentagePoints: statVitalityGrowthPercentNext,
        totalGrownPoints: statVitalityTotalGrownNext,
        recentlyGrownPoints: statVitalityRecentlyGrownPoints,
        pointsToAutoAssign: statVitalityPointsToAutoAssign,
        countGrownPointsTowardAutoAssign: statVitalityCountGrownPointsTowardAutoAssign,
        bypassStatCaps: statVitalityBypassStatCaps,
        setBypassStatCaps: setStatVitalityBypassStatCaps,
    }), [setStatVitalityPointsNext, setStatVitalityGrowthPercentNext, setStatVitalityTotalGrownNext, statVitalityPointsNext, statVitalityGrowthPercentNext, statVitalityTotalGrownNext, statVitalityRecentlyGrownPoints, statVitalityPointsToAutoAssign, statVitalityCountGrownPointsTowardAutoAssign, statVitalityBypassStatCaps]);
    const confirmStatVitality = useCallback(() => {
        confirmStatVitalityPoints();
        confirmStatVitalityGrowthPercent();
        confirmStatVitalityTotalGrown();
        setStatVitalityRecentlyGrownPoints(0);
    }, [confirmStatVitalityPoints, confirmStatVitalityGrowthPercent, confirmStatVitalityTotalGrown]);
    const cancelStatVitality = useCallback(() => {
        cancelStatVitalityPoints();
        cancelStatVitalityGrowthPercent();
        cancelStatVitalityTotalGrown();
        setStatVitalityRecentlyGrownPoints(0);
    }, [cancelStatVitalityPoints, cancelStatVitalityGrowthPercent, cancelStatVitalityTotalGrown]);

    const [statMovementBypassStatCaps, setStatMovementBypassStatCaps] = useState(initial.stats.movement.bypassStatCaps ?? false);
    const {valueNow: statMovementPointsNow, valueNext: statMovementPointsNext, cancel: cancelStatMovementPoints, setValueNext: setStatMovementPointsNext, confirm: confirmStatMovementPoints} = useConfirmState<number>(initial.stats.movement.points);
    const statMovementNow = useMemo(() => ({
        type: ZaneStatType.MOVEMENT as const,
        points: statMovementPointsNow,
        bypassStatCaps: statMovementBypassStatCaps,
    }), [statMovementPointsNow, statMovementBypassStatCaps]);
    const statMovementNext = useMemo(() => ({
        type: ZaneStatType.MOVEMENT as const,
        setPointsNext: setStatMovementPointsNext,
        points: statMovementPointsNext,
        bypassStatCaps: statMovementBypassStatCaps,
        setBypassStatCaps: setStatMovementBypassStatCaps,
    }), [setStatMovementPointsNext, statMovementPointsNext, statMovementBypassStatCaps]);
    const confirmStatMovement = confirmStatMovementPoints;
    const cancelStatMovement = cancelStatMovementPoints;

    const statsNow = useMemo(() => ({
        strength: statStrengthNow,
        magic: statMagicNow,
        skill: statSkillNow,
        speed: statSpeedNow,
        luck: statLuckNow,
        defense: statDefenseNow,
        resistance: statResistanceNow,
        mind: statMindNow,
        vitality: statVitalityNow,
        movement: statMovementNow,
    }), [statStrengthNow, statMagicNow, statSkillNow, statSpeedNow, statLuckNow, statDefenseNow, statResistanceNow, statMindNow, statVitalityNow, statMovementNow]);

    const statsNext = useMemo(() => ({
        strength: statStrengthNext,
        magic: statMagicNext,
        skill: statSkillNext,
        speed: statSpeedNext,
        luck: statLuckNext,
        defense: statDefenseNext,
        resistance: statResistanceNext,
        mind: statMindNext,
        vitality: statVitalityNext,
        movement: statMovementNext,
    }), [statStrengthNext, statMagicNext, statSkillNext, statSpeedNext, statLuckNext, statDefenseNext, statResistanceNext, statMindNext, statVitalityNext, statMovementNext]);

    const confirmStats = useCallback(() => {
        confirmStatStrength();
        confirmStatMagic();
        confirmStatSkill();
        confirmStatSpeed();
        confirmStatLuck();
        confirmStatDefense();
        confirmStatResistance();
        confirmStatMind();
        confirmStatVitality();
        confirmStatMovement();
    }, [confirmStatStrength, confirmStatMagic, confirmStatSkill, confirmStatSpeed, confirmStatLuck, confirmStatDefense, confirmStatResistance, confirmStatMind, confirmStatVitality, confirmStatMovement]);

    const cancelStats = useCallback(() => {
        cancelStatStrength();
        cancelStatMagic();
        cancelStatSkill();
        cancelStatSpeed();
        cancelStatLuck();
        cancelStatDefense();
        cancelStatResistance();
        cancelStatMind();
        cancelStatVitality();
        cancelStatMovement();
    }, [cancelStatStrength, cancelStatMagic, cancelStatSkill, cancelStatSpeed, cancelStatLuck, cancelStatDefense, cancelStatResistance, cancelStatMind, cancelStatVitality, cancelStatMovement]);

    const currentStatSheet = useMemo(()=>({
        name,
        hitPoints: hitPointsNow,
        manaPoints: manaPointsNow,
        classData: classDataNow,
        stats: statsNow,
    } satisfies ZaneStatSheet), [classDataNow, hitPointsNow, manaPointsNow, name, statsNow]);

    const nextStatSheet = useMemo(() => ({
        name,
        setName,
        hitPoints: hitPointsNext,
        setHitPointsNext,
        manaPoints: manaPointsNext,
        setManaPointsNext,
        unallocatedPoints,
        setUnallocatedPoints,
        classData: classDataNext,
        stats: statsNext,
        availableCatchups,
        setAvailableCatchups,
    } satisfies ZaneStatSheet & Record<string, unknown>), [availableCatchups, classDataNext, hitPointsNext, manaPointsNext, name, setHitPointsNext, setManaPointsNext, statsNext, unallocatedPoints]);

    const confirm = useCallback(() => {
        startTransition(() => {
            confirmClassData();
            confirmStats();
            confirmHitPoints();
            confirmManaPoints();
            setUnallocatedPoints(0);
            setAvailableCatchups(0);
        });
    }, [confirmClassData, confirmHitPoints, confirmManaPoints, confirmStats]);

    const cancel = useCallback(() => {
        startTransition(() => {
            cancelClassData();
            cancelStats();
            cancelHitPoints();
            cancelManaPoints();
            setUnallocatedPoints(0);
            setAvailableCatchups(0);
        });
    }, [cancelClassData, cancelHitPoints, cancelManaPoints, cancelStats]);

    return useMemo(() => ({
        currentStatSheet,
        nextStatSheet,
        confirm,
        cancel,
    }), [cancel, confirm, currentStatSheet, nextStatSheet]);
}

export type ZaneNextStatSheet = ReturnType<typeof useStatState>['nextStatSheet'];
