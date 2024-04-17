import { useState } from 'react';
import useDebouncedCallback from '@byndyusoft-ui/use-debounced-callback';

export default function useDebouncedValue(value: string, delay = 300): [string, (value: string) => void] {
    const [debouncedValue, setValue] = useState(value);

    const setDebounceValue = useDebouncedCallback(setValue, delay);

    return [debouncedValue, setDebounceValue];
}
