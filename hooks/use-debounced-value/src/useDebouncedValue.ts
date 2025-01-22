import { useMemo, useState } from 'react';
import { InitialState } from '@byndyusoft-ui/types';
import useDebouncedCallback from '@byndyusoft-ui/use-debounced-callback';

type THookReturn<T> = [T, (arg: T) => void];

export default function useDebouncedValue<T>(value: InitialState<T>, delay = 300): THookReturn<T> {
    const [debouncedValue, setValue] = useState(value);

    const setDebouncedValue = useDebouncedCallback(setValue, delay);

    return useMemo(() => [debouncedValue, setDebouncedValue], [debouncedValue, setDebouncedValue]);
}
