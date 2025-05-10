import { useEffect } from "react";

/**
 * Advanced version of useEffect that only runs when a subset of the normal dependencies array changes.
 *
 * This hook exists to circumvent React Compiler in the few cases where such a circumvention is necessary.
 */
export function useChangeEffect(...params: Parameters<typeof useEffect>) {
    "use no memo";
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useEffect(...params);
}
