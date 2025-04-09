import { useMemo, useState } from 'react';
import {
    autoUpdate,
    flip,
    offset as offsetMiddleware,
    shift,
    size,
    useClick,
    useDismiss,
    useFloating,
    useInteractions,
    useRole
} from '@floating-ui/react';
import { IPopoverContextValue, IPopoverOptions } from '../Popover.types';

const usePopover = ({
    initialOpen = false,
    shouldCloseOnClickOutside = false,
    offset,
    fitContentWidthByContainer,
    placement = 'bottom',
    open: controlledOpen,
    onOpenChange: setControlledOpen
}: IPopoverOptions): IPopoverContextValue => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = setControlledOpen ?? setUncontrolledOpen;

    const data = useFloating({
        placement,
        open,
        onOpenChange: setOpen,
        whileElementsMounted: autoUpdate,
        middleware: [
            offsetMiddleware(offset),
            flip({
                crossAxis: placement.includes('-'),
                padding: 5
            }),
            shift({ padding: 5 }),

            fitContentWidthByContainer &&
                size({
                    apply({ rects, elements }) {
                        Object.assign(elements.floating.style, {
                            width: `${rects.reference.width}px`
                        });
                    }
                })
        ]
    });

    const { context } = data;

    const click = useClick(context, { enabled: controlledOpen === undefined });
    const dismiss = useDismiss(context, { enabled: shouldCloseOnClickOutside });
    const role = useRole(context);

    const interactions = useInteractions([click, dismiss, role]);

    return useMemo(
        () => ({
            open,
            setOpen,
            ...interactions,
            ...data
        }),
        [open, setOpen, interactions, data]
    );
};

export default usePopover;
