import { useState } from 'react';

type TInitialState<T> = Array<T> | (() => Array<T>);

function useArray<T>(initialState: TInitialState<T> = []) {
    const [value] = useState<Array<T>>(initialState);

    return [value] as const;
}

export default useArray;
