import React, { ReactNode, useCallback } from 'react';
import { useRadioGroupContext } from '../components/RadioGroupContext';

const CustomRadioComponent = ({ value, children }: { value: string; children: ReactNode }): JSX.Element => {
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

export default CustomRadioComponent;
