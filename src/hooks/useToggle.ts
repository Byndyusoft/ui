import { useCallback, useState } from 'react';

type TInitialValue = boolean | (() => boolean);

interface IUseToggleMethods {
    on: () => void;
    off: () => void;
    toggle: () => void;
}

export type TUseToggle = [boolean, IUseToggleMethods];

function useToggle(initialValue: TInitialValue = false): TUseToggle {
    const [value, setValue] = useState(initialValue);

    const on = useCallback(() => setValue(true), []);

    const off = useCallback(() => setValue(false), []);

    const toggle = useCallback(() => setValue(previousValue => !previousValue), []);

    return [value, { on, off, toggle }];
}

export default useToggle;
