import { useCallback, useState } from 'react';

export interface IUseArray {}

export default function useArray<T>(initialValue: T[]): {
    list: T[];
    append: (item: T) => void;
    prepend: (item: T) => void;
    filter: (cb: (item: T) => boolean) => void;
    clear: () => void;
    reset: () => void;
    sort: (cb: (a: T, b: T) => number) => void;
} {
    const [list, setList] = useState(initialValue);

    const append = useCallback(
        (item: T) => {
            setList([...list, item]);
        },
        [list]
    );

    const prepend = useCallback(
        (item: T) => {
            setList([item, ...list]);
        },
        [list]
    );

    const filter = useCallback(
        (cb: (item: T) => boolean) => {
            setList(list.filter(cb));
        },
        [list]
    );

    const sort = useCallback(
        (cb: (a: T, b: T) => number) => {
            setList([...list].sort(cb));
        },
        [list]
    );

    const clear = useCallback(() => {
        setList([]);
    }, [list]);

    const reset = useCallback(() => {
        setList(initialValue);
    }, [list, initialValue]);

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
