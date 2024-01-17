import React, { ComponentType, PropsWithChildren } from 'react';
import { IClassNames } from './withClassNames.types';

export default function withClassNames<P, CN>(Component: ComponentType<P & IClassNames<CN>>, classNames: CN) {
    // eslint-disable-next-line react/display-name,@typescript-eslint/explicit-module-boundary-types
    return (props: PropsWithChildren<P>) => <Component {...props} classNames={classNames} />;
}
