import React, { ChangeEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';
import useIsomorphicLayoutEffect from '@byndyusoft-ui/use-isomorphic-layout-effect';
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
            defaultValue,
            withAutoHeight = false,
            onChange,
            onStopChanging,
            changingDelay = DEFAULT_CHANGING_DELAY,
            ...rest
        },
        ref
    ) => {
        const textAreaRef = useRef<HTMLTextAreaElement>(null);
        const isControlled = value !== undefined;
        const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
        const autoHeightValue = isControlled ? value : uncontrolledValue;

        const timeoutId = useRef<TimeoutId>();
        const lastChangeEvent = useRef<ChangeEvent<HTMLTextAreaElement>>();
        const animationFrameId = useRef<number>();
        const onStopChangingRef = useLatestRef(onStopChanging);

        const updateAutoHeight = useCallback((): void => {
            const textArea = textAreaRef.current;

            if (!withAutoHeight || !textArea) {
                return;
            }

            textArea.style.height = 'auto';
            textArea.style.height = `${Math.max(textArea.scrollHeight, minHeight)}px`;
            textArea.style.overflowY = textArea.scrollHeight > textArea.clientHeight ? 'auto' : 'hidden';
        }, [minHeight, withAutoHeight]);

        const scheduleAutoHeight = useCallback((): void => {
            if (animationFrameId.current !== undefined) {
                return;
            }

            animationFrameId.current = requestAnimationFrame(() => {
                animationFrameId.current = undefined;
                updateAutoHeight();
            });
        }, [updateAutoHeight]);

        const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
            clearTimeout(timeoutId.current);
            lastChangeEvent.current = event;

            if (!isControlled) {
                setUncontrolledValue(event.target.value);
            }

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

        useImperativeHandle(ref, () => textAreaRef.current as HTMLTextAreaElement);

        useIsomorphicLayoutEffect(updateAutoHeight, [autoHeightValue, updateAutoHeight]);

        useIsomorphicLayoutEffect(() => {
            const textArea = textAreaRef.current;

            if (
                !withAutoHeight ||
                !textArea ||
                typeof ResizeObserver === 'undefined' ||
                typeof requestAnimationFrame === 'undefined'
            ) {
                return;
            }

            const resizeObserver = new ResizeObserver(scheduleAutoHeight);

            resizeObserver.observe(textArea);

            return () => {
                resizeObserver.disconnect();

                if (animationFrameId.current !== undefined) {
                    cancelAnimationFrame(animationFrameId.current);
                    animationFrameId.current = undefined;
                }
            };
        }, [scheduleAutoHeight, withAutoHeight]);

        return (
            <textarea
                {...rest}
                {...(isControlled ? { value } : { defaultValue })}
                className={className}
                disabled={isDisabled}
                ref={textAreaRef}
                rows={withAutoHeight ? 1 : rows}
                style={
                    withAutoHeight
                        ? {
                              ...style,
                              overflowX: 'hidden',
                              resize: 'none'
                          }
                        : style
                }
                onChange={handleChange}
            />
        );
    }
);

TextArea.displayName = 'TextArea';

export default TextArea;
