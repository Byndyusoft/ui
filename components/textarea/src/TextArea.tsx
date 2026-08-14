import React, {
    ChangeEvent,
    FocusEvent,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState
} from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';
import { TimeoutId } from '@byndyusoft-ui/types';
import { ITextAreaProps } from './TextArea.types';

const MIN_TEXTAREA_HEIGHT = 16;
const DEFAULT_CHANGING_DELAY = 2000;

const TextArea = forwardRef<HTMLTextAreaElement, ITextAreaProps>(
    (
        {
            className,
            isDisabled = false,
            minHeight = MIN_TEXTAREA_HEIGHT,
            rows,
            style,
            value,
            withAutoHeight = false,
            onChange,
            onFocus,
            onStopChanging,
            changingDelay = DEFAULT_CHANGING_DELAY,
            ...rest
        },
        ref
    ) => {
        const textAreaRef = useRef<HTMLTextAreaElement>(null);
        const [tempValue, setTempValue] = useState(typeof value === 'string' ? value : '');

        const timeoutId = useRef<TimeoutId>();
        const lastChangeEvent = useRef<ChangeEvent<HTMLTextAreaElement>>();
        const onStopChangingRef = useLatestRef(onStopChanging);

        const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
            clearTimeout(timeoutId.current);
            lastChangeEvent.current = event;
            setTempValue(event.target.value);
            onChange?.(event);
            timeoutId.current = setTimeout(() => {
                timeoutId.current = undefined;
                onStopChangingRef.current?.(event);
            }, changingDelay);
        };

        useEffect(
            () => () => {
                if (timeoutId.current === undefined) {
                    return;
                }

                clearTimeout(timeoutId.current);

                const event = lastChangeEvent.current;

                if (event) {
                    onStopChangingRef.current?.(event);
                }
            },
            [onStopChangingRef]
        );

        const handleFocus = (event: FocusEvent<HTMLTextAreaElement>): void => {
            const textArea = textAreaRef.current;

            if (textArea) {
                const { length } = textArea.value;
                textArea.setSelectionRange(length, length);
            }

            onFocus?.(event);
        };

        useImperativeHandle(ref, () => textAreaRef.current as HTMLTextAreaElement);

        useLayoutEffect(() => {
            const textArea = textAreaRef.current;

            if (withAutoHeight && textArea) {
                textArea.style.height = 'inherit';
                textArea.style.height = `${Math.max(textArea.scrollHeight, minHeight)}px`;
            }
        }, [tempValue, minHeight, withAutoHeight]);

        useEffect(() => {
            if (typeof value === 'string') {
                setTempValue(value);
            }
        }, [value]);

        return (
            <textarea
                {...rest}
                className={className}
                disabled={isDisabled}
                ref={textAreaRef}
                rows={withAutoHeight ? 1 : rows}
                style={
                    withAutoHeight
                        ? {
                              ...style,
                              overflow: 'hidden',
                              resize: 'none'
                          }
                        : style
                }
                value={tempValue}
                onChange={handleChange}
                onFocus={handleFocus}
            />
        );
    }
);

TextArea.displayName = 'TextArea';

export default TextArea;
