import { useCallback, useEffect, useState } from 'react';
import { IUseRadioGroupStateProps, IUseRadioGroup } from './RadioGroup.types';

const useRadioGroupState = ({ name, value, onChange }: IUseRadioGroupStateProps): IUseRadioGroup => {
    const [stateValue, setStateValue] = useState(value);

    useEffect(() => {
        if (value !== stateValue) {
            setStateValue(value);
            onChange?.(value);
        }
    }, [value, stateValue]);

    const setValueHandler = useCallback(
        (targetValue: string) => {
            setStateValue(targetValue);
            onChange?.(targetValue);
        },
        [onChange]
    );

    return {
        name,
        value: stateValue,
        setValue: setValueHandler
    };
};

export default useRadioGroupState;
