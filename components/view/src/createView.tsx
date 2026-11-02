import { createElement, FC } from 'react';
import { buildSpacingCss, getSpacingClassName, registerStyles, validateValuesKeys } from './utilities';
import { ICreatedView, ICreatedViewProps, IViewConfig, TSpacingValues } from './types';
import { spacingPropsNames, spacingPropPrefixes } from './constants';

export function createView<TGrid extends TSpacingValues>(config: IViewConfig<TGrid>): ICreatedView<TGrid> {
    validateValuesKeys(config.values);

    registerStyles(config, buildSpacingCss(config));

    const CreatedView: FC<ICreatedViewProps<TGrid>> = ({ as = 'div', className, children, ...props }) => {
        const classNames: Array<string> = [];
        const domProps = { ...props };

        spacingPropsNames.forEach(name => {
            const token = props[name];

            if (token) {
                classNames.push(getSpacingClassName(spacingPropPrefixes[name], token));

                delete domProps[name];
            }
        });

        if (className) {
            classNames.push(className);
        }

        return createElement(as, { className: classNames.join(' ') || undefined, ...domProps }, children);
    };

    CreatedView.displayName = 'View';

    return Object.assign(CreatedView, { config });
}
