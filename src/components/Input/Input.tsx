import React, { FC, InputHTMLAttributes } from 'react';
import cn from 'classnames';
import Size from './constants/sizes';
import Variant from './constants/variants';

interface IInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    type?: 'text' | 'password';
    name: string;
    className?: string;
    defaultValue?: string;
    value?: string;
    autoComplete?: 'on' | 'off';
    size?: Size;
    variant?: Variant;
    inputRef?: (ref: HTMLInputElement) => void;
    isDisabled?: boolean;
    isInvalid?: boolean;
    leftComponent?: JSX.Element;
    rightComponent?: JSX.Element;
}

const Input: FC<IInputProps> = ({
    name,
    className,
    defaultValue,
    value,
    autoComplete = 'off',
    type = 'text',
    size = Size.Medium,
    variant = Variant.Regular,
    placeholder,
    inputRef,
    onChange,
    isDisabled,
    isInvalid,
    leftComponent,
    rightComponent
}) => {
    const inputContainerClassName = cn(
        'InputContainer',
        `InputContainer--${variant}`,
        isInvalid && 'Input--Invalid',
        isDisabled && 'Input--Disabled'
    );
    const inputClassName = cn('Input', className, `Input--${size}`);

    const renderSideComponent = ({
        sideComponent,
        placement
    }: {
        sideComponent?: JSX.Element;
        placement: 'Left' | 'Right';
    }) => {
        if (sideComponent) {
            if (React.isValidElement(sideComponent) === false) {
                return null;
            } else {
                return (
                    <div
                        className={cn(
                            `InputSideComponentContainer${placement}`,
                            `InputSideComponentContainer--${size}`
                        )}
                    >
                        {sideComponent}
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className={inputContainerClassName}>
            {renderSideComponent({ sideComponent: leftComponent, placement: 'Left' })}
            <input
                placeholder={placeholder}
                type={type}
                name={name}
                className={inputClassName}
                defaultValue={defaultValue}
                value={value}
                autoComplete={autoComplete}
                ref={refInstance => {
                    if (inputRef && refInstance) {
                        inputRef(refInstance);
                    }
                }}
                onChange={onChange}
                disabled={isDisabled}
            />
            {renderSideComponent({ sideComponent: rightComponent, placement: 'Right' })}
        </div>
    );
};

export default Input;
