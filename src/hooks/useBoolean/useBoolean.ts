import useToggle from '../useToggle';

type TInitialValue = boolean | (() => boolean);

interface IUseBooleanMethods {
    toTrue: () => void;
    toFalse: () => void;
    toggle: () => void;
}

export type TUseBoolean = [boolean, IUseBooleanMethods];

function useBoolean(initialValue: TInitialValue = false): TUseBoolean {
    const [value, { toLeftValue: toTrue, toRightValue: toFalse, toggle }] = useToggle(true, false, initialValue);

    return [value, { toTrue, toFalse, toggle }];
}

export default useBoolean;
