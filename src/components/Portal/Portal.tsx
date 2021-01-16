import React, { FC, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface IPortalProps {}

const Portal: FC<IPortalProps> = ({ children }) => {
    const container = React.useRef<HTMLDivElement>(document.createElement('div'));

    useEffect(() => {
        document.body.appendChild(container.current);

        return () => {
            document.body.removeChild(container.current);
        };
    }, []);

    return createPortal(children, container.current);
};

export default Portal;
