import { AriaAttributes, CSSProperties, FocusEventHandler } from 'react';

export type TTextEditorTool =
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strike'
    | 'heading'
    | 'orderedList'
    | 'bulletList'
    | 'link';

export interface ITextEditorProps extends AriaAttributes {
    value?: string;
    defaultValue?: string;
    onChange?: (markdown: string) => void;
    onDebouncedChange?: (markdown: string) => void;
    debounceDelay?: number;
    onThrottledChange?: (markdown: string) => void;
    throttleDelay?: number;
    tools?: ReadonlyArray<TTextEditorTool>;
    withAutoHeight?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    placeholder?: string;
    name?: string;
    form?: string;
    id?: string;
    className?: string;
    style?: CSSProperties;
    onFocus?: FocusEventHandler<HTMLDivElement>;
    onBlur?: FocusEventHandler<HTMLDivElement>;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean | 'true' | 'false' | 'grammar' | 'spelling';
    'aria-required'?: boolean | 'true' | 'false';
    [attribute: `data-${string}`]: unknown;
}
