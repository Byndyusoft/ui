import React, { type FC } from 'react';
import cn from 'classnames';
import { registerStyles, type ICreatedView, type TSpacingValues } from '@byndyusoft-ui/view';
import { blockClassName, flexModifiersCss } from './constants';
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
    registerStyles(view.config, flexModifiersCss + buildCss(view.config));

    const CreatedFlex: FC<ICreatedFlexProps<TValues>> = ({
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
    }) => {
        const flexClassName = cn(
            blockClassName,
            className,
            getDirectionModifier(direction),
            getWrapModifier(wrap),
            getAlignContentModifier(alignContent),
            getAlignItemsModifier(alignItems),
            getJustifyContentModifier(justifyContent),
            ...getGapClassNames(gap, rowGap, columnGap)
        );

        return React.createElement(view, { className: flexClassName, ...props }, children);
    };

    CreatedFlex.displayName = 'Flex';

    return Object.assign(CreatedFlex, { config: view.config });
}
