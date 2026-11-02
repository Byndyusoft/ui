import { createElement, FC } from 'react';
import { buildCss, buildSpacingClassNames, registerStyles, resolveSpacingProps, validateValuesKeys } from './utilities';
import { ICreatedView, ICreatedViewProps, IViewConfig, TSpacingValues } from './types';
import { spacingPropsNames } from './constants';

export function createView<TGrid extends TSpacingValues>(config: IViewConfig<TGrid>): ICreatedView<TGrid> {
    validateValuesKeys(config.values);

    registerStyles(config, buildCss(config));

    const CreatedView: FC<ICreatedViewProps<TGrid>> = ({ as = 'div', className, children, ...props }) => {
        const domProps = { ...props };
        const resolvedSpacingProps = resolveSpacingProps(props);

        spacingPropsNames.forEach(name => {
            delete domProps[name];
        });

        const classNames = buildSpacingClassNames(resolvedSpacingProps);

        if (className) {
            classNames.push(className);
        }

        return createElement(as, { className: classNames.join(' ') || undefined, ...domProps }, children);
    };

    CreatedView.displayName = 'View';

    return Object.assign(CreatedView, { config });
}
