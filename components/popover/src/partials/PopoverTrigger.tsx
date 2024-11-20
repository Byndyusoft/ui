import React from 'react';
import { cloneElement, forwardRef, HTMLProps, isValidElement } from 'react';
import { useMergeRefs } from '@floating-ui/react';
import { usePopoverContext } from '../PopoverContext';

interface IPopoverTriggerProps extends HTMLProps<HTMLElement> {
    asChild?: boolean; // allows the user to pass any element as the anchor
}

const PopoverTrigger = forwardRef<HTMLElement, IPopoverTriggerProps>(
    ({ children, asChild = false, ...props }, propRef) => {
        const context = usePopoverContext();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        const childrenRef = (children as any).ref;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

        if (asChild && isValidElement(children)) {
            return cloneElement(
                children,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                context.getReferenceProps({
                    ref,
                    ...props,
                    ...children.props,
                    'data-state': context.open ? 'open' : 'closed'
                })
            );
        }

        return (
            <button
                ref={ref}
                type="button"
                // for styling the trigger based on the state
                data-state={context.open ? 'open' : 'closed'}
                {...context.getReferenceProps(props)}
            >
                {children}
            </button>
        );
    }
);

PopoverTrigger.displayName = 'PopoverTrigger';

export default PopoverTrigger;
