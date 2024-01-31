import { useCallback, useState } from 'react';

export interface IUseArray<T> {
    list: T[];
    append: (item: T) => void;
    prepend: (item: T) => void;
    filter: (cb: (item: T) => boolean) => void;
    clear: () => void;
    reset: () => void;
    sort: (cb: (a: T, b: T) => number) => void;
}

export default function useArray<T>(initialValue: T[]): IUseArray<T> {
    const [list, setList] = useState(initialValue);

    const append = useCallback(
        (item: T) => {
            setList(list => [...list, item]);
        },
        [setList]
    );

    const prepend = useCallback(
        (item: T) => {
            setList(list => [item, ...list]);
        },
        [setList]
    );

    const filter = useCallback(
        (cb: (item: T) => boolean) => {
            setList(list => list.filter(cb));
        },
        [setList]
    );

    const sort = useCallback(
        (cb: (a: T, b: T) => number) => {
            setList(list => [...list].sort(cb));
        },
        [setList]
    );

    const clear = useCallback(() => {
        setList([]);
    }, [setList]);

    const reset = useCallback(() => {
        setList(initialValue);
    }, [setList, initialValue]);

    return {
        list,
        append,
        prepend,
        filter,
        sort,
        clear,
        reset
    };
}
