import { useCallback, useState } from 'react';
import { IUseRadioGroupStateProps, IUseRadioGroup } from './RadioGroup.types';

const useRadioGroupState = ({ name, initialValue, onChange }: IUseRadioGroupStateProps): IUseRadioGroup => {
    const [value, setValue] = useState(initialValue);

    const setValueHandler = useCallback(
        (targetValue: string) => {
            setValue(targetValue);
            onChange?.(targetValue);
        },
        [onChange]
    );

    return {
        name,
        value,
        setValue: setValueHandler
    };
};

export default useRadioGroupState;
