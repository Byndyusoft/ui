import { useState } from 'react';
import useDebouncedCallback from '@byndyusoft-ui/use-debounced-callback';

type THookReturn<T> = [T, (arg: T) => void];

const useDebouncedValue = <T>(value: T, delay = 300): THookReturn<T> => {
    const [debouncedValue, setValue] = useState(value);

    const setDebouncedValue = useDebouncedCallback(setValue, delay);

    return [debouncedValue, setDebouncedValue];
};

export default useDebouncedValue;
