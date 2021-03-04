import React, { FC, InputHTMLAttributes } from 'react';
import cn from 'classnames';
import Size from './constants/sizes';
import Variant from './constants/variants';
export interface IInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
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

const Input: FC<IInputProps> = props => {
    const {
        name,
        className,
        defaultValue,
        value,
        autoComplete = 'off',
        spellCheck = 'false',
        type = 'text',
        size = Size.Medium,
        variant = Variant.Regular,
        placeholder,
        inputRef,
        onChange,
        isDisabled,
        isInvalid,
        leftComponent,
        rightComponent,
        ...rest
    } = props;

    const inputContainerClassName = cn(
        'InputContainer',
        `InputContainer--${variant}`,
        isInvalid && 'Input--Invalid',
        isDisabled && 'Input--Disabled'
    );
    const inputClassName = cn('Input', className, `Input--${size}`);

    const renderSideComponent = ({ sideComponent }: { sideComponent?: JSX.Element }): JSX.Element | null => {
        if (sideComponent) {
            if (!React.isValidElement(sideComponent)) {
                return null;
            }
            return <div className={`InputSideComponentContainer--${size}`}>{sideComponent}</div>;
        }
        return null;
    };

    return (
        <div className={inputContainerClassName}>
            {renderSideComponent({ sideComponent: leftComponent })}
            <input
                {...rest}
                spellCheck={spellCheck}
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
            {renderSideComponent({ sideComponent: rightComponent })}
        </div>
    );
};

export default Input;
