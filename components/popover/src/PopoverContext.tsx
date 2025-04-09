import React, { createContext, useContext, PropsWithChildren } from 'react';
import usePopover from './hooks/usePopover';
import { IPopoverOptions, IPopoverContextValue } from './Popover.types';

const PopoverContext = createContext<IPopoverContextValue>({} as IPopoverContextValue);

export const usePopoverContext = (): IPopoverContextValue => {
    const context = useContext(PopoverContext);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (context === undefined) {
        throw new Error('Popover components must be wrapped in PopoverContext');
    }

    return context;
};

interface IPopoverProviderProps extends PropsWithChildren<IPopoverOptions> {}

const PopoverProvider = ({ children, ...restOptions }: IPopoverProviderProps): JSX.Element => {
    const value = usePopover({ ...restOptions });

    return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
};

export default PopoverProvider;
