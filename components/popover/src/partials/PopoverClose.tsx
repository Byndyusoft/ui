import React from 'react';
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { usePopoverContext } from '../PopoverContext';

const PopoverClose = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
    const { setOpen } = usePopoverContext();

    const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>): void => {
        props.onClick?.(event);
        setOpen(false);
    };

    return <button type="button" ref={ref} {...props} onClick={onClickHandler} />;
});

PopoverClose.displayName = 'PopoverClose';

export default PopoverClose;
