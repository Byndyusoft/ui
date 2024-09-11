import { useCallback, useState } from 'react';
import { IUseRadioGroupStateProps, IUseRadioGroup } from './RadioGroup.types';

const useRadioGroupState = ({ name, value, onChange }: IUseRadioGroupStateProps): IUseRadioGroup => {
    const [_name] = useState(name);
    const [_value, setValue] = useState(value);

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
        name: _name,
        value: _value,
        setValue: setValueHandler
    };
};

export default useRadioGroupState;
