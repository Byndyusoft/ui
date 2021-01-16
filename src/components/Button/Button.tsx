import React, { FC } from 'react';
import cn from 'classnames';
import { Variant } from './constants';
import './Button.css';

interface IButtonProps {
    className?: string;
    variant?: Variant;
}

const Button: FC<IButtonProps> = ({ children, className, variant = Variant.Default }) => (
    <button type="button" className={cn('Button', `Button--${variant}`, className)}>
        {children}
    </button>
);

export default Button;
