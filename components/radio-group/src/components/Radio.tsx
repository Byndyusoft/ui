import React, { ReactElement } from 'react';
import { IRadioProps } from '../RadioGroup.types';
import { useRadioGroupContext } from './RadioGroupContext';

const Radio = ({ value, isDisabled, children }: IRadioProps): ReactElement => {
    const { name, value: groupValue, setValue } = useRadioGroupContext();

    const radioId = `${name}-${value}`;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setValue(event.target.value);
    };

    return (
        <div>
            <input
                type="radio"
                name={name}
                id={radioId}
                value={value}
                checked={groupValue === value}
                onChange={handleInputChange}
                disabled={isDisabled}
            />
            <label htmlFor={radioId}>{children}</label>
        </div>
    );
};

export default Radio;
