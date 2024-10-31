import { useEffect, useState } from 'react';
import { IPortalProps } from './Portal.types';

export interface IUsePortal {
    container: Element;
}

export default function usePortal({ id, targetElement }: IPortalProps): IUsePortal {
    const [container] = useState<Element>(() => {
        if (targetElement) {
            return targetElement;
        }

        const element = document.createElement('div');

        if (id && id.length > 0) {
            element.setAttribute('id', id);
        }

        return element;
    });

    useEffect(() => {
        if (!targetElement) {
            document.body.appendChild(container);

            return () => {
                document.body.removeChild(container);
            };
        }
    }, [container, targetElement]);

    return { container };
}
