import { useState } from 'react';
import useDebounceCallback from '@byndyusoft-ui/use-debounce-callback';

export default function useDebounce(value: string, delay = 300): [string, (value: string) => void] {
    const [debouncedValue, setValue] = useState(value);

    const setDebounceValue = useDebounceCallback(setValue, delay);

    return [debouncedValue, setDebounceValue];
}
