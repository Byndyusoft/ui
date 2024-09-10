import { useCallback, useState } from 'react';
import { IUseRadioGroupState, IRadioGroupState } from './Radio.types';

const useRadioGroup = ({ name, value, onChange }: IUseRadioGroupState): IRadioGroupState => {
    const [_name] = useState(name);
    const [_value, setValue] = useState(value);

    const setValueHandler = useCallback((targetValue: string) => {
            setValue(targetValue);

            if(onChange){
                onChange(targetValue)
            }
    },[onChange])

    return {
        name: _name,
        value: _value,
        setValue: setValueHandler
    };
};

export default useRadioGroup;
