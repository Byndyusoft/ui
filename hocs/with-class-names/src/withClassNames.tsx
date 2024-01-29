import React, { ComponentType, FunctionComponent, PropsWithChildren } from 'react';

export interface IClassNames<CN> {
    classNames?: CN;
}

export type TClassNamesRecord<K extends string> = Partial<Record<K, string>>;

export default function withClassNames<P, CN>(
    Component: ComponentType<P & IClassNames<CN>>,
    classNames: CN
): FunctionComponent<PropsWithChildren<P>> {
    // eslint-disable-next-line react/display-name
    return (props: PropsWithChildren<P>) => <Component {...props} classNames={classNames} />;
}
