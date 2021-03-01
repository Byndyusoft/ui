import React, { FC } from 'react';
import cn from 'classnames';
import { Variant } from './constants';
import './Button.css';

interface IButtonProps {
    className?: string;
    variant?: Variant;
    isDisabled?: boolean;
}

const Button: FC<IButtonProps> = ({ children, className, variant = Variant.Primary, isDisabled = false }) => (
    <button
        type="button"
        className={cn('Button', isDisabled ? `Button--${variant}-disabled` : `Button--${variant}`, className)}
    >
        {children}
    </button>
);

export default Button;
