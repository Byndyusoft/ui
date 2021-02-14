import React, { FC, HTMLAttributes, useEffect } from 'react';
import './Overlay.css';

const Overlay: FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="Overlay" {...props}>
            {children}
        </div>
    );
};

export default Overlay;
