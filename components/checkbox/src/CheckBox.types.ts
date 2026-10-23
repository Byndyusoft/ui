import { InputHTMLAttributes } from 'react';

export interface ICheckBoxClassNames {
    container?: ICheckBoxContainerClassNames;
    indicator?: ICheckBoxIndicatorClassNames;
    label?: ICheckBoxLabelClassNames;
}

export interface ICheckBoxContainerClassNames {
    main?: string;
    disabled?: string;
    input?: string;
}

export interface ICheckBoxIndicatorClassNames {
    main?: string;
    checked?: string;
    disabled?: string;
    indeterminate?: string;
}

export interface ICheckBoxLabelClassNames {
    main?: string;
    disabled?: string;
}

export interface ICheckBoxInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'disabled' | 'id' | 'type'> {
    id?: string;
    isChecked: boolean;
    isDisabled?: boolean;
    isIndeterminate?: boolean;
}

export interface ICheckBoxProps extends ICheckBoxInputProps {
    className?: string;
    classNames?: ICheckBoxClassNames;
    labelPosition?: 'left' | 'right';
    renderIndicator?: (classNames?: ICheckBoxIndicatorClassNames) => JSX.Element;
}
