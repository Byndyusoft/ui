import React, { FC } from 'react';
import cn from 'classnames';
import './Checkbox.css';

import CheckedSvg from './assets/checked.svg';

interface ICheckboxProps {
    className?: string;
    name: string;
    isChecked?: boolean;
    isDisabled?: boolean;
    value?: string | number;
    defaultChecked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => void;
    isInvalid?: boolean;
}

const Checkbox: FC<ICheckboxProps> = ({
    className,
    name,
    isChecked,
    isDisabled,
    value,
    defaultChecked,
    onChange,
    isInvalid,
    children
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (onChange) {
            onChange(event, event.target.checked);
        }
    };

    const fieldClassName = cn(
        'Checkbox--field',
        isChecked && 'Checkbox--isChecked',
        isDisabled && 'Checkbox--isDisabled',
        isChecked === undefined && 'Checkbox--Indeterminate',
        isInvalid && !isChecked && 'Checkbox--isInvalid'
    );

    return (
        <label className={cn(className, 'Checkbox--container', isDisabled && 'Checkbox--isDisabled')}>
            <input
                className="Checkbox--input"
                type="checkbox"
                name={name}
                checked={isChecked ?? false}
                disabled={isDisabled}
                value={value}
                defaultChecked={defaultChecked}
                onChange={handleChange}
            />
            <div className={cn(fieldClassName)}>
                {isChecked && <CheckedSvg />}
                {/* {isChecked === undefined && <IconIndeterminate />} */}
            </div>
            <div className={cn('Checkbox--label', isDisabled && 'Checkbox--isDisabled')}>{children}</div>
        </label>
    );
};

export default Checkbox;
