import React, { FC } from 'react';
import cn from 'classnames';
import { Variant } from './constants';
import './Button.css';

interface IButtonProps {
    className?: string;
    variant?: Variant;
    isDisabled?: boolean;
    isPending?: boolean;
}

const Button: FC<IButtonProps> = ({
    children,
    className,
    variant = Variant.Primary,
    isDisabled = false,
    isPending = false
}) => (
    <button
        type="button"
        className={cn(
            'Button',
            `Button--${variant}`,
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
