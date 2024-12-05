import { useMemo, useState } from 'react';
import useThrottledCallback, { type IThrottledCallbackOptions } from '@byndyusoft-ui/use-throttled-callback';

export type THookReturn<T> = [T, (arg: T) => void];

const useThrottledValue = <T>(value: T, delay: number, option?: IThrottledCallbackOptions): THookReturn<T> => {
    const [throttledValue, setValue] = useState<T>(value);

    const setThrottledValue = useThrottledCallback<T>(setValue, delay, option);

    return useMemo(() => [throttledValue, setThrottledValue], [throttledValue, setThrottledValue]);
};

export default useThrottledValue;
