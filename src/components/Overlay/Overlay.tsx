import React, { FC, HTMLAttributes, useEffect } from 'react';
import './Overlay.css';

export interface IOverlayProps extends HTMLAttributes<HTMLDivElement> {
    isOpen?: boolean;
}

const Overlay: FC<IOverlayProps> = ({ children, isOpen = false, ...props }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    useEffect(
        () => () => {
            document.body.style.overflow = '';
        },
        []
    );

    return isOpen ? (
        <div className="Overlay" {...props}>
            {children}
        </div>
    ) : null;
};

export default Overlay;
