declare module '*.scss' {
    const content: { readonly [key: string]: string };

    export default content;
}

declare module '*.css' {
    const content: { readonly [key: string]: string };

    export default content;
}

declare module '*.png' {
    const content: string;

    export default content;
}

declare module '*.jpg' {
    const content: string;

    export default content;
}

declare module '*.gif' {
    const content: string;

    export default content;
}

declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

    const content: string;

    export default content;
}
