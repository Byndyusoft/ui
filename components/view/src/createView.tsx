import { createElement, FC } from 'react';
import { buildSpacingCss, getSpacingClassName, spacingPropPrefixes } from './buildSpacingCss';
import { ICreatedView, ICreatedViewProps, ISpacingProps, IViewConfig, TSpacingGrid } from './LayoutConfig.types';
import { registerLayoutStyles } from './layoutStylesRegistry';
import { validateGridKeys } from './validateGridKeys';

const spacingPropsNames = Object.keys(spacingPropPrefixes) as Array<keyof ISpacingProps>;

export function createView<TGrid extends TSpacingGrid>(config: IViewConfig<TGrid>): ICreatedView<TGrid> {
    validateGridKeys(config.grid);

    registerLayoutStyles(config, buildSpacingCss(config));

    const CreatedView: FC<ICreatedViewProps<TGrid>> = ({ as = 'div', className, children, ...props }) => {
        const classNames: Array<string> = [];

        spacingPropsNames.forEach(name => {
            const token = props[name];

            if (token) {
                classNames.push(getSpacingClassName(spacingPropPrefixes[name], token));
                delete props[name];
            }
        });

        if (className) {
            classNames.push(className);
        }

        return createElement(as, { className: classNames.join(' ') || undefined, ...props }, children);
    };

    CreatedView.displayName = 'CreatedView';

    return Object.assign(CreatedView, { config });
}
