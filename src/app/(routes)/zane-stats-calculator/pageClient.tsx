'use client';
import { useCallback, useEffect, useReducer, useState } from "react";
import { ZaneStatsCalculatorAfterLoader } from "./pageAfterFileLoader";
import { ZaneStatSheetSchema } from "./StatsTypes";
import { useValidate } from "../../hooks/useValidate";
import z from "zod";
import yaml from 'yaml';
import { joinJSX } from "../../../joinJSX";
import { hideNotification, showNotification } from "@mantine/notifications";
import notificationStyles from '../../components/Notifications.module.scss';

const nullableStatSheetSchema = z.union([ZaneStatSheetSchema, z.null()]);

export default function ZaneStatsCalculator() {
    const [loadedFile, setLoadedFile] = useState<File | null>(null);

    const [loadedSheetRaw, setLoadedSheetRaw] = useState<unknown>(null);
    const [sheetLoadingError, setSheetLoadingError] = useState<Error | null>(null);

    const [stateBoolean, resetState] = useReducer((state: boolean) => !state, false);

    const startNewCharacter = useCallback(() => {
        setLoadedFile(null);
        setLoadedSheetRaw(null);
        setSheetLoadingError(null);
        resetState();
    }, []);

    const [isLoadingFile, setIsLoadingFile] = useState(false);
    useEffect(() => {
        if (loadedFile === null) return setIsLoadingFile(false);
        let isCanceled = false;

        setIsLoadingFile(true);
        loadedFile.text().then((text) => {
            if (isCanceled) return;
            try {
                const parsed = yaml.parse(text);
                setLoadedSheetRaw(parsed);
                setSheetLoadingError(null);
                resetState();
            } catch (error) {
                console.error(error);
                setSheetLoadingError(error instanceof Error ? error : new Error('Unknown error while parsing YAML! See console for details.'));
            }
        }).catch((error) => {
            if (isCanceled) return;
            console.error(error);
            setSheetLoadingError(error instanceof Error ? error : new Error('Unknown error while reading file! See console for details.'));
        }).finally(() => {
            if (isCanceled) return;
            setIsLoadingFile(false);
        });

        return () => {
            isCanceled = true;
        };
    }, [loadedFile]);

    const {lastGoodData: loadedSheet, error: sheetValidationError} = useValidate(nullableStatSheetSchema, loadedSheetRaw);

    const errorString = sheetLoadingError?.message ?? (sheetValidationError === undefined ? undefined : z.prettifyError(sheetValidationError));

    useEffect(() => {
        if (!errorString) return;

        showNotification({
            id: 'sheet-loading-error',
            title: 'Error Loading Character!',
            message: joinJSX(<br />, errorString.split('\n')),
            color: 'red',
            loading: false,
            autoClose: false,
            withCloseButton: false,
            classNames: notificationStyles,
        });

        return () => {
            hideNotification('sheet-loading-error');
        };
    }, [errorString]);

    return <ZaneStatsCalculatorAfterLoader
        key={String(stateBoolean)}
        loadedSheet={loadedSheet}
        startNewCharacter={startNewCharacter}
        setLoadedFile={setLoadedFile}
        isLoadingFile={isLoadingFile}
    />;
}
