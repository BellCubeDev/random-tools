import { useMemo, useState } from "react";
import z from "zod";
import { useChangeEffect } from "./useOnChange";

export function useValidate<T>(schema: z.ZodType<T>, value: unknown) {
    const {data, error, success} = useMemo(() => schema.safeParse(value), [schema, value]);
    const [lastGoodData, setLastGoodData] = useState<T | null>(null);
    if (success && data !== lastGoodData) setLastGoodData(data);


    useChangeEffect(() => {
        if (!error) return;

        console.error({
            error,
            errorAsTree: z.treeifyError(error),
            errorAsString: z.prettifyError(error),
            value,
            lastGoodData,
        });
    }, [error]);

    return {
        data,
        error,
        success,
        lastGoodData,
    };
}
