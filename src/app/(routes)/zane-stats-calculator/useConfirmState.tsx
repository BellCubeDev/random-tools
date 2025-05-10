import { useCallback, useState } from "react";
import { useUpdatedRef } from "../../hooks/useUpdatedRef";

export function useConfirmState<T>(initialValue: T) {
    const [valueNow, setValueNow] = useState<T>(initialValue);
    const valueNowRef = useUpdatedRef(valueNow);
    // eslint-disable-next-line react/hook-use-state
    const [valueNext, setValueNextInternal] = useState<T>(initialValue);
    const valueNextRef = useUpdatedRef(valueNext);

    const confirm = useCallback(() => {
        if (valueNextRef.current !== valueNowRef.current) setValueNow(valueNextRef.current);
    }, [valueNextRef, valueNowRef]);

    const cancel = useCallback(() => {
        if (valueNextRef.current !== valueNowRef.current) setValueNextInternal(valueNowRef.current);
    }, [valueNextRef, valueNowRef]);

    return { valueNow, valueNext, setValueNext: setValueNextInternal, confirm, cancel };
}
