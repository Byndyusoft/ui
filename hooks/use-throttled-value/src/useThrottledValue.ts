import { useState, useEffect } from 'react';
import useThrottledCallback from '@byndyusoft-ui/use-throttled-callback';

const useThrottledValue = <T>(value: T, delay: number): T => {
    const [throttledValue, setThrottledValue] = useState<T>(value);

    const throttledCallback = useThrottledCallback<T>((newValue: T) => {
        setThrottledValue(newValue);
    }, delay);

    useEffect(() => {
        throttledCallback(value);
    }, [value, throttledCallback]);

    return throttledValue;
};

export default useThrottledValue;
