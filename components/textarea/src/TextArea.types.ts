import { ChangeEventHandler, TextareaHTMLAttributes } from 'react';

export interface ITextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'disabled' | 'onChange'> {
    className?: string;
    isDisabled?: boolean;
    minHeight?: number;
    withAutoHeight?: boolean;
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    onStopChanging?: ChangeEventHandler<HTMLTextAreaElement>;
    changingDelay?: number;
}
