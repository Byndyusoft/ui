import React, { FC, HTMLAttributes, useEffect } from 'react';
import './Overlay.css';

export interface IOverlayProps extends HTMLAttributes<HTMLDivElement> {
    isOpen?: boolean;
}

const Overlay: FC<IOverlayProps> = ({ children, isOpen = false, ...props }) => {
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

    return isOpen ? <div className="Overlay" {...props}>{children}</div> : null;
};

export default Overlay;
