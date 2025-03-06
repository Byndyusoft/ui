import { createElement, FC } from 'react';
import { IViewProps, IViewSpacings } from './View.types';
import './View.modules.css';

const magicUnitPrefix = 'mu';

function sanitize(className: string): string {
    return className.replace(magicUnitPrefix, '');
}

const getSpacingClasses = (spacingProps: IViewSpacings): string => {
    const spacingPropsNames: Array<keyof IViewSpacings> = [
        'margin',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
        'marginHorizontal',
        'marginVertical',
        'padding',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
        'paddingHorizontal',
        'paddingVertical'
    ];

    const classes: string[] = [];

    spacingPropsNames.forEach((name: keyof IViewSpacings) => {
        const value = spacingProps?.[name];

        if(!value) {
            return;
        }

        const prefix = name
            .replace(/margin/, 'm')
            .replace(/padding/, 'p')
            .replace(/Top/, 't')
            .replace(/Bottom/, 'b')
            .replace(/Left/, 'l')
            .replace(/Right/, 'r')
            .replace(/Horizontal/, 'h')
            .replace(/Vertical/, 'v');

        classes.push(`${prefix}-${sanitize(value)}`);
    });

    return classes.join(' ');
};

const View: FC<IViewProps> = ({ as = 'div', children, ...props }): JSX.Element => {
    const classNames = getSpacingClasses(props as IViewSpacings)

    return createElement(as, { className: classNames, ...props }, children);
};

export default View;
