import { useCallback, useState } from 'react';

export type TUseArray<T> = [list: Array<T>, commands: IUseArrayCommands<T>];

export type TPredicate<T> = (value: T) => boolean;

export type TComparator<L, R> = (left: L, right: R) => number;

interface IUseArrayCommands<T> {
    append: (item: T) => void;
    prepend: (item: T) => void;
    update: (index: number, item: T) => void;
    remove: (index: number) => void;
    filter: (predicate: TPredicate<T>) => void;
    clear: () => void;
    reset: () => void;
    sort: (comparator: TComparator<T, T>) => void;
}

export default function useArray<T>(initialValue: Array<T>): TUseArray<T> {
    const [list, setList] = useState<Array<T>>(initialValue);

    const append = useCallback((item: T) => setList(previousList => [...previousList, item]), [setList]);

    const prepend = useCallback((item: T) => setList(previousList => [item, ...previousList]), [setList]);

    const update = useCallback(
        (index: number, item: T) =>
            setList(previousList => [
                ...previousList.slice(0, index),
                item,
                ...previousList.slice(index + 1, previousList.length)
            ]),
        [setList]
    );

    const remove = useCallback(
        (index: number) =>
            setList(previousList => [
                ...previousList.slice(0, index),
                ...previousList.slice(index + 1, previousList.length)
            ]),
        [setList]
    );

    const filter = useCallback(
        (predicate: TPredicate<T>) => setList(previousList => previousList.filter(predicate)),
        [setList]
    );

    const sort = useCallback(
        (comparator: TComparator<T, T>) => setList(previousList => [...previousList].sort(comparator)),
        [setList]
    );

    const clear = useCallback(() => setList([]), [setList]);

    const reset = useCallback(() => setList(initialValue), [setList, initialValue]);

    const commands = { append, prepend, update, remove, filter, sort, clear, reset };

    return [list, commands];
}
