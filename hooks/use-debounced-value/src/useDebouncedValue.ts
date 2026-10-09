import { SetStateAction, useMemo, useState } from 'react';
import useDebouncedCallback from '@byndyusoft-ui/use-debounced-callback';
import { TUseDebouncedValueReturn } from './useDebouncedValue.types';

function useDebouncedValue<T>(initialValue: T | (() => T), delay: number): TUseDebouncedValueReturn<T> {
    const [debouncedValue, setValue] = useState<T>(initialValue);

    const setDebouncedValue = useDebouncedCallback<[SetStateAction<T>]>(setValue, delay);

    return useMemo(() => [debouncedValue, setDebouncedValue], [debouncedValue, setDebouncedValue]);
}

export default useDebouncedValue;
