import { useState, useEffect } from 'react';
import useThrottledCallback, { IThrottledCallbackOptions } from './useThrottledCallback';

const useThrottledValue = <T>(value: T, delay: number, options?: IThrottledCallbackOptions): T => {
    const [throttledValue, setThrottledValue] = useState<T>(value);

    const throttledCallback = useThrottledCallback<T>(
        (newValue: T) => {
            setThrottledValue(newValue);
        },
        delay,
        options
    );

    useEffect(() => {
        throttledCallback(value);
    }, [value, throttledCallback]);

    return throttledValue;
};

export default useThrottledValue;
