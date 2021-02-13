import { useCallback, useState } from 'react';

type TInitialValue<V> = V | (() => V);

interface IUseToggleMethods {
    toLeftValue: () => void;
    toRightValue: () => void;
    toggle: () => void;
}

export type TUseToggle<V> = [V, IUseToggleMethods];

function useToggle<L, R>(leftValue: L, rightValue: R, initialValue: TInitialValue<L | R>): TUseToggle<L | R> {
    const [value, setValue] = useState<L | R>(initialValue);

    const toLeftValue = useCallback(() => setValue(leftValue), [leftValue]);

    const toRightValue = useCallback(() => setValue(rightValue), [rightValue]);

    const toggle = useCallback(() => setValue(previousValue => previousValue === leftValue ? rightValue : leftValue), [leftValue, rightValue]);

    return [value, { toLeftValue, toRightValue, toggle }];
}

export default useToggle;
