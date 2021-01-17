import React, { FC, useEffect } from 'react';

export interface IOverlayProps {
    isOpen?: boolean;
}

const Overlay: FC<IOverlayProps> = ({ children, isOpen = false }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('OverflowHidden');
        } else {
            document.body.classList.remove('OverflowHidden');
        }
    }, [isOpen])

    useEffect(() => {
        return () => {
            document.body.classList.remove('OverflowHidden');
        };
    }, []);

    return isOpen ? <div className="Overlay">{children}</div> : null;
};

export default Overlay;
