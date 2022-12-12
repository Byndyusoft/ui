import { useState, useEffect } from 'react';

export type TUseDebouncedStateResult<T> = [
    debouncedState: T,
    setDebouncedState: (arg: T) => void
]

export default function useDebouncedState<T>(initValue: T, wait: number): TUseDebouncedStateResult<T> {
    const [triggerState, setTriggerState] = useState<T>(initValue);
    const [state, setState] = useState<T>(initValue);

    useEffect(() => {
        const timer = setTimeout(() => setState(triggerState), wait);
        return () => {
            clearTimeout(timer);
        }
    }, [triggerState]);

    return [state, setTriggerState];
}
