import { useEffect, useState } from 'react';
import { IPortalProps } from './Portal.types';

export interface IUsePortalContainer {
    container: HTMLElement;
}

export default function usePortalContainer({ id, targetElement }: IPortalProps): IUsePortalContainer {
    const [container] = useState<HTMLElement>(() => {
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
