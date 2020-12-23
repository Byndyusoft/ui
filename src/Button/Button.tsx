import React, { FC } from 'react';
import cn from 'classnames';
import './Button.css';
import { Variant } from './constants';

interface IButtonProps {
    className?: string;
    variant?: Variant.Danger | Variant.Primary | Variant.Default;
}

const Button: FC<IButtonProps> = ({ children, className, variant = Variant.Default }) => {
    return <button className={cn('Button', `Button--${variant}`, className)}>{children}</button>;
};

export default Button;
