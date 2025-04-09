import { Placement, useFloating, useInteractions } from '@floating-ui/react';

export interface IPopoverOptions {
    initialOpen?: boolean;
    shouldCloseOnClickOutside?: boolean;
    offset?: number;
    fitContentWidthByContainer?: boolean;
    placement?: Placement;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export interface IPopoverContextValue extends ReturnType<typeof useInteractions>, ReturnType<typeof useFloating> {
    open: boolean;
    setOpen: (arg: boolean) => void;
}
