import { createElement, forwardRef } from 'react';
import { buildCss, buildSpacingClassNames, registerStyles, resolveSpacingProps, validateValuesKeys } from './utilities';
import { validateViewConfig } from './utilities/validateViewConfig';
import { ICreatedView, ICreatedViewProps, IViewConfig, TSpacingValues } from './types';
import { spacingPropsNames } from './constants';

export function createView<TGrid extends TSpacingValues>(config: IViewConfig<TGrid>): ICreatedView<TGrid> {
    validateViewConfig(config);
    validateValuesKeys(config.values);

    registerStyles(config, buildCss(config));

    const CreatedView = forwardRef<HTMLElement, ICreatedViewProps<TGrid>>(
        ({ as = 'div', className, children, ...props }, ref) => {
            const domProps = { ...props };
            const resolvedSpacingProps = resolveSpacingProps(props);

            spacingPropsNames.forEach(name => {
                delete domProps[name];
            });

            const classNames = buildSpacingClassNames(resolvedSpacingProps, config.prefix);

            if (className) {
                classNames.push(className);
            }

            return createElement(as, { className: classNames.join(' ') || undefined, ...domProps, ref }, children);
        }
    );

    CreatedView.displayName = 'View';

    return Object.assign(CreatedView, { config });
}
