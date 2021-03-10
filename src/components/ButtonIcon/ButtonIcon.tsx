import React, { FC } from 'react';
import cn from 'classnames';
import Button, { Size, IButtonProps } from '../Button';
import './ButtonIcon.css';

interface IButtonIconProps extends IButtonProps {
    leftIcon?: JSX.Element;
    rightIcon?: JSX.Element;
}

const ButtonIcon: FC<IButtonIconProps> = ({ children, leftIcon, rightIcon, size = Size.Medium, ...rest }) => (
    <Button
        className={cn(leftIcon && `ButtonIcon--leftIcon-${size}`, rightIcon && `ButtonIcon--rightIcon-${size}`)}
        size={size}
        {...rest}
    >
        {leftIcon}
        {children}
        {rightIcon}
    </Button>
);

export default ButtonIcon;
