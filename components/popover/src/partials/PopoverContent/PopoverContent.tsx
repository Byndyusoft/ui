import React, { forwardRef, HTMLProps } from 'react';
import cn from 'classnames';
import { useMergeRefs, FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { usePopoverContext } from '../../PopoverContext';
import styles from './PopoverContent.module.css';

interface IPopoverContentProps extends HTMLProps<HTMLDivElement> {
    modal?: boolean;
    withPortal?: boolean;
    isFloatingFocusDisabled?: boolean;
}

const PopoverContent = forwardRef<HTMLDivElement, IPopoverContentProps>(
    ({ modal = false, withPortal = false, isFloatingFocusDisabled = false, style, className, ...props }, propRef) => {
        const { context: floatingContext, ...popoverContext } = usePopoverContext();
        const ref = useMergeRefs([popoverContext.refs.setFloating, propRef]);

        if (!floatingContext.open) return null;

        if (withPortal) {
            <FloatingPortal>
                <FloatingFocusManager context={floatingContext} modal={modal} disabled={isFloatingFocusDisabled}>
                    <div
                        ref={ref}
                        // eslint-disable-next-line react/forbid-dom-props
                        style={{ ...popoverContext.floatingStyles, ...style }}
                        className={cn(styles.popoverContent, className)}
                        {...popoverContext.getFloatingProps(props)}
                    >
                        {props.children}
                    </div>
                </FloatingFocusManager>
            </FloatingPortal>;
        }

        return (
            <FloatingFocusManager context={floatingContext} modal={modal} disabled={isFloatingFocusDisabled}>
                <div
                    ref={ref}
                    // eslint-disable-next-line react/forbid-dom-props
                    style={{ ...popoverContext.floatingStyles, ...style }}
                    className={cn(styles.popoverContent, className)}
                    {...popoverContext.getFloatingProps(props)}
                >
                    {props.children}
                </div>
            </FloatingFocusManager>
        );
    }
);

PopoverContent.displayName = 'PopoverContent';

export default PopoverContent;
