import React, { FC } from 'react';
import cn from 'classnames';
import { Variant, Size, Type } from './constants';
import './Button.css';

interface IButtonProps {
    className?: string;
    variant?: Variant;
    size?: Size;
    type?: Type;
    isDisabled?: boolean;
    isPending?: boolean;
}

const Button: FC<IButtonProps> = ({
    children,
    className,
    variant = Variant.Primary,
    size = Size.Medium,
    type = Type.Button,
    isDisabled = false,
    isPending = false
}) => (
    <button
        // eslint-disable-next-line react/button-has-type
        type={type}
        className={cn(
            'Button',
            `Button--${variant}`,
            `Button--${size}`,
            !isDisabled && !isPending && `Button--actionable`,
            isDisabled && `disabled`,
            className
        )}
    >
        {isPending && `Загружаем...`}
        {!isPending && children}
    </button>
);

export default Button;
