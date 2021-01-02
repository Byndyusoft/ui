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

    const remove = useCallback((index: number) => {
        setValue(previousValue => [...previousValue.slice(0, index), ...previousValue.slice(index + 1)]);
    }, []);

    const insert = useCallback((index: number, item: T) => {
        setValue(previousValue => [...previousValue.slice(0, index), item, ...previousValue.slice(index)]);
    }, []);

    return [value, { append, prepend, clear, remove, insert }] as const;
}

export default useArray;
