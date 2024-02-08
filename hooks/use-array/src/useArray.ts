import { useCallback, useState } from 'react';

export type TUseArray<T> = [list: T[], commands: IUseArrayCommands<T>];

interface IUseArrayCommands<T> {
    append: (item: T) => void;
    prepend: (item: T) => void;
    update: (index: number, item: T) => void;
    remove: (index: number) => void;
    filter: (cb: (item: T) => boolean) => void;
    clear: () => void;
    reset: () => void;
    sort: (cb: (a: T, b: T) => number) => void;
}

export default function useArray<T>(initialValue: T[]): TUseArray<T> {
    const [list, setList] = useState(initialValue);

    const append = useCallback(
        (item: T) => {
            setList(previousList => [...previousList, item]);
        },
        [setList]
    );

    const prepend = useCallback(
        (item: T) => {
            setList(previousList => [item, ...previousList]);
        },
        [setList]
    );

    const update = useCallback(
        (index, item) => {
            setList(previousList => [
                ...previousList.slice(0, index),
                item,
                ...previousList.slice(index + 1, previousList.length)
            ]);
        },
        [setList]
    );

    const remove = useCallback(
        index => {
            setList(previousList => [
                ...previousList.slice(0, index),
                ...previousList.slice(index + 1, previousList.length)
            ]);
        },
        [setList]
    );

    const filter = useCallback(
        (cb: (item: T) => boolean) => {
            setList(previousList => previousList.filter(cb));
        },
        [setList]
    );

    const sort = useCallback(
        (cb: (a: T, b: T) => number) => {
            setList(previousList => [...previousList].sort(cb));
        },
        [setList]
    );

    const clear = useCallback(() => {
        setList([]);
    }, [setList]);

    const reset = useCallback(() => {
        setList(initialValue);
    }, [setList, initialValue]);

    const commands = { append, prepend, update, remove, filter, sort, clear, reset };

    return [list, commands];
}
