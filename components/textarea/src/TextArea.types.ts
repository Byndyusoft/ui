import { ChangeEventHandler, TextareaHTMLAttributes } from 'react';

export interface ITextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'disabled'> {
    className?: string;
    isDisabled?: boolean;
    minHeight?: number;
    withAutoHeight?: boolean;
    onStopChanging?: ChangeEventHandler<HTMLTextAreaElement>;
    changingDelay?: number;
}
