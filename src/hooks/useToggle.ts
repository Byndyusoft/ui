import { useCallback, useState } from 'react';

type TInitialValue = boolean | (() => boolean);

function useToggle(initialValue: TInitialValue = false) {
    const [value, setValue] = useState(initialValue);

    const on = useCallback(() => setValue(true), []);

    const off = useCallback(() => setValue(false), []);

    const toggle = useCallback(() => setValue(previousValue => !previousValue), []);

    return [value, { on, off, toggle }] as const;
}

export default useToggle;
