import React, { FC, InputHTMLAttributes } from 'react';
import cn from 'classnames';
import Size from './sizes';

interface IInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
    type?: 'text' | 'password';
    name: string;
    className?: string;
    defaultValue?: string;
    value?: string;
    autoComplete?: 'on' | 'off';
    size?: Size;
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
    inputRef,
    onChange,
    isDisabled,
    isInvalid,
    leftComponent,
    rightComponent
}) => {
    const inputClassName = cn('Input', className, isInvalid && 'Invalid', `Input${size}`);

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
                        className={cn(`InputSideComponentContainer${placement}`, `InputSideComponentContainer${size}`)}
                    >
                        {sideComponent}
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className="InputContainer">
            {renderSideComponent({ sideComponent: leftComponent, placement: 'Left' })}
            <input
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
