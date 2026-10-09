import { SetStateAction, useMemo, useState } from 'react';
import useThrottledCallback, { IThrottledCallbackOptions } from '@byndyusoft-ui/use-throttled-callback';
import { TUseThrottledValueReturn } from './useThrottledValue.types';

const useThrottledValue = <T>(
    initialValue: T | (() => T),
    delay: number,
    options?: IThrottledCallbackOptions
): TUseThrottledValueReturn<T> => {
    const [throttledValue, setValue] = useState<T>(initialValue);

    const setThrottledValue = useThrottledCallback<[SetStateAction<T>]>(setValue, delay, options);

    return useMemo(() => [throttledValue, setThrottledValue], [throttledValue, setThrottledValue]);
};

export default useThrottledValue;
