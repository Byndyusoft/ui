import React, { FC } from 'react';
import cn from 'classnames';
import { Variant, Size } from './constants';
import './Button.css';

interface IButtonProps {
    className?: string;
    variant?: Variant;
    size?: Size;
    isDisabled?: boolean;
    isPending?: boolean;
}

const Button: FC<IButtonProps> = ({
    children,
    className,
    size = Size.Medium,
    variant = Variant.Primary,
    isDisabled = false,
    isPending = false
}) => (
    <button
        type="button"
        className={cn(
            'Button',
            `Button--${variant}`,
            `Button--${size}`,
            !isDisabled && !isPending && `actionable`,
            isDisabled && `disabled`,
            className
        )}
    >
        {isPending && `Загрузка`}
        {!isPending && children}
    </button>
);

export default Button;
