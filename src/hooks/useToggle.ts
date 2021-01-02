import { useCallback, useState } from 'react';

type TInitialState = boolean | (() => boolean);

function useToggle(initialState: TInitialState = false) {
    const [value, setValue] = useState(initialState);

    const on = useCallback(() => setValue(true), []);

    const off = useCallback(() => setValue(false), []);

    const toggle = useCallback(() => setValue(previousValue => !previousValue), []);

    return [value, { on, off, toggle }] as const;
}

export default useToggle;
