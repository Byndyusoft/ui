import React, { useCallback, useMemo } from 'react';
import { IRadioProps } from '../RadioGroup.types';
import { useRadioGroupContext } from './RadioGroupContext';

const Radio = ({ value, children }: IRadioProps): JSX.Element => {
    const { name, value: groupValue, setValue } = useRadioGroupContext();

    const radioId = useMemo(() => `${name}-${value}`, [name, value]);

    const onChangeHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }, []);

    return (
        <div>
            <input
                type="radio"
                name={name}
                id={radioId}
                value={value}
                checked={groupValue === value}
                onChange={onChangeHandler}
            />
            <label htmlFor={radioId}>{children}</label>
        </div>
    );
};

export default Radio;
