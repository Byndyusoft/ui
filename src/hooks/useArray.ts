import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

type TInitialValue<T> = Array<T> | (() => Array<T>);

type TComparator<T> = (left: T, right: T) => number;

type TPredicate<T> = (item: T, index: number, array: Array<T>) => boolean;

interface IUseArrayMethods<T> {
    append: (item: T) => void;
    prepend: (item: T) => void;
    clear: () => void;
    remove: (index: number) => void;
    insert: (index: number, item: T) => void;
    sort: (comparator: TComparator<T>) => void;
    update: (index: number, item: T) => void;
    filter: (predicate: TPredicate<T>) => void;
    reset: () => void;
}

export type TUseArray<T> = [Array<T>, Dispatch<SetStateAction<Array<T>>>, IUseArrayMethods<T>];

function useArray<T>(initialValue: TInitialValue<T> = []): TUseArray<T> {
    const initialValueRef = useRef<TInitialValue<T>>(initialValue);

    const [value, setValue] = useState<Array<T>>(initialValue);

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

    const sort = useCallback((comparator: TComparator<T>) => {
        setValue(previousValue => previousValue.sort(comparator));
    }, []);

    const update = useCallback((index: number, item: T) => {
        setValue(previousValue => [...previousValue.slice(0, index), item, ...previousValue.slice(index + 1)]);
    }, []);

    const filter = useCallback((predicate: TPredicate<T>) => {
        setValue(previousValue => previousValue.filter(predicate));
    }, []);

    const reset = useCallback(() => {
        const currentValue = Array.isArray(initialValueRef.current)
            ? initialValueRef.current
            : initialValueRef.current();

        setValue(() => [...currentValue]);
    }, []);

    return [value, setValue, { append, prepend, clear, remove, insert, sort, update, filter, reset }];
}

export default useArray;