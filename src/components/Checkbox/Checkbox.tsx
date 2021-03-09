import React, { FC } from 'react';
import cn from 'classnames';
import './Checkbox.css';

import CheckedSvg from './assets/checked.svg';
import IndeterminateSvg from './assets/indeterminate.svg';

interface ICheckboxProps {
    className?: string;
    name: string;
    isChecked?: boolean;
    isDisabled?: boolean;
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, isChecked: boolean) => void;
    isInvalid?: boolean;
    isIndeterminate?: boolean;
}

const Checkbox: FC<ICheckboxProps> = ({
    className,
    name,
    isChecked,
    isDisabled,
    value,
    onChange,
    isInvalid,
    isIndeterminate,
    children
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (onChange) {
            onChange(event, event.target.checked);
        }
    };

    const checkboxClassName = cn(
        'Checkbox',
        isChecked && 'Checkbox--isChecked',
        isDisabled && 'Checkbox--isDisabled',
        (isChecked === undefined || isIndeterminate) && 'Checkbox--isIndeterminate',
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
                onChange={handleChange}
            />
            <div className={cn(checkboxClassName)}>
                {isChecked && <CheckedSvg />}
                {isChecked === undefined && <IndeterminateSvg />}
            </div>
            <div className={cn('Checkbox--label', isDisabled && 'Checkbox--isDisabled')}>{children}</div>
        </label>
    );
};

export default Checkbox;
