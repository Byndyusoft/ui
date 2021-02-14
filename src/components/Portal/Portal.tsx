import { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface IPortalProps {
    id?: string
}

const Portal: FC<IPortalProps> = ({ children, id }) => {
    const [container] = useState<HTMLDivElement>(() => {
        const element = document.createElement('div');

        if (id && id.length > 0) {
            element.setAttribute('id', id);
        }

        return element;
    });

    useEffect(() => {
        document.body.appendChild(container);

        return () => {
            document.body.removeChild(container);
        };
    }, []);

    return createPortal(children, container);
};

export default Portal;
