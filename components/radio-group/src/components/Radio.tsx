import React, { useCallback } from 'react';
import { IRadioProps } from '../RadioGroup.types';
import { useRadioGroupContext } from './RadioGroupContext';

const Radio = ({ value, children }: IRadioProps): JSX.Element => {
    const { name, value: groupValue, setValue } = useRadioGroupContext();

    const onChangeHandler = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setValue(event.target.value);
        },
        [setValue]
    );

    return (
        <div>
            <input
                type="radio"
                name={name}
                id={value}
                value={value}
                checked={groupValue === value}
                onChange={onChangeHandler}
            />
            <label htmlFor={value}>{children}</label>
        </div>
    );
};

export default Radio;
