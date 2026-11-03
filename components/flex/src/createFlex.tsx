import React, { forwardRef } from 'react';
import cn from 'classnames';
import { registerStyles, type ICreatedView, type TSpacingValues } from '@byndyusoft-ui/view';
import { buildFlexModifiersCss, getFlexBlockClassName } from './constants';
import type { ICreatedFlex, ICreatedFlexProps } from './types';
import {
    buildCss,
    getAlignContentModifier,
    getAlignItemsModifier,
    getDirectionModifier,
    getGapClassNames,
    getJustifyContentModifier,
    getWrapModifier
} from './utilities';

export function createFlex<TValues extends TSpacingValues>(view: ICreatedView<TValues>): ICreatedFlex<TValues> {
    const classPrefix = view.config.prefix;

    registerStyles(view.config, buildFlexModifiersCss(classPrefix) + buildCss(view.config));

    const CreatedFlex = forwardRef<HTMLElement, ICreatedFlexProps<TValues>>(
        (
            {
                className,
                children,
                direction,
                wrap,
                alignContent,
                alignItems,
                justifyContent,
                gap,
                rowGap,
                columnGap,
                ...props
            },
            ref
        ) => {
            const flexClassName = cn(
                getFlexBlockClassName(classPrefix),
                className,
                getDirectionModifier(direction, classPrefix),
                getWrapModifier(wrap, classPrefix),
                getAlignContentModifier(alignContent, classPrefix),
                getAlignItemsModifier(alignItems, classPrefix),
                getJustifyContentModifier(justifyContent, classPrefix),
                ...getGapClassNames(gap, rowGap, columnGap, classPrefix)
            );

            return React.createElement(view, { className: flexClassName, ...props, ref }, children);
        }
    );

    CreatedFlex.displayName = 'Flex';

    return Object.assign(CreatedFlex, { config: view.config });
}
