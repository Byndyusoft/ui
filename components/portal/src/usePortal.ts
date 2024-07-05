import { useEffect, useState } from 'react';
import { IPortalProps } from './Portal.types';

export interface IUsePortal {
    container: HTMLDivElement;
}

export default function usePortal({ id }: IPortalProps): IUsePortal {
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
    }, [container]);

    return { container };
}
