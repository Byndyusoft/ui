import { useMemo, useState } from 'react';
import useThrottledCallback, { IThrottledCallbackOptions } from '@byndyusoft-ui/use-throttled-callback';
import { InitialState } from '@byndyusoft-ui/types';
import { TUseThrottledValueReturn } from './useThrottledValue.types';

const useThrottledValue = <T>(
    value: InitialState<T>,
    delay: number,
    option?: IThrottledCallbackOptions
): TUseThrottledValueReturn<T> => {
    const [throttledValue, setValue] = useState<T>(value);

    const setThrottledValue = useThrottledCallback<[T]>(setValue, delay, option);

    return useMemo(() => [throttledValue, setThrottledValue], [throttledValue, setThrottledValue]);
};

export default useThrottledValue;
