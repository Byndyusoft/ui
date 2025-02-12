import { CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

type THTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

type TInputSize = 's' | 'm' | 'l' | 'xl';

type TInputVariant = 'outline' | 'line' | 'unstyled';

export interface IInputProps extends THTMLInputProps {
    size?: TInputSize;
    variant?: TInputVariant;
    className?: string;
    rightComponent?: ReactNode;
    leftComponent?: ReactNode;
    isInvalid?: boolean;
    inputClassName?: string;
    inputStyle?: CSSProperties;
}
