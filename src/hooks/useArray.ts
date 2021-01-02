import { useCallback, useState } from 'react';

type TInitialState<T> = Array<T> | (() => Array<T>);

function useArray<T>(initialState: TInitialState<T> = []) {
    const [value, setValue] = useState<Array<T>>(initialState);

    const append = useCallback((item: T) => {
        setValue(previousValue => [...previousValue, item]);
    }, []);

    const prepend = useCallback((item: T) => {
        setValue(previousValue => [item, ...previousValue]);
    }, []);

    const clear = useCallback(() => {
        setValue(() => []);
    }, []);

    return [value, { append, prepend, clear }] as const;
}

export default useArray;
