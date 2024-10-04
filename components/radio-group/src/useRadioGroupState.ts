import { useCallback, useState } from 'react';
import { IUseRadioGroupStateProps, IUseRadioGroup } from './RadioGroup.types';

const useRadioGroupState = ({ name, initialValue, onChange }: IUseRadioGroupStateProps): IUseRadioGroup => {
    const [_value, setValue] = useState(initialValue);

    const setValueHandler = useCallback(
        (targetValue: string) => {
            setValue(targetValue);

            if (onChange) {
                onChange(targetValue);
            }
        },
        [onChange]
    );

    return {
        name,
        value: _value,
        setValue: setValueHandler
    };
};

export default useRadioGroupState;
