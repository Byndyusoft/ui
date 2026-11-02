import React, { FC } from 'react';
import cn from 'classnames';
import { ICreatedView, registerLayoutStyles, TSpacingGrid } from '@byndyusoft-ui/view';
import { buildFlexCss, flexModifiersCss } from './buildFlexCss';
import { ICreatedFlex, ICreatedFlexProps } from './createFlex.types';
import {
    getAlignContentModifier,
    getAlignItemsModifier,
    getDirectionModifier,
    getJustifyContentModifier,
    getWrapModifier
} from './flexModifiers';

const blockClassName = 'bsui-flex';

function getGapClassNames(gap?: string, rowGap?: string, columnGap?: string): Array<string> {
    if (gap) {
        return [`${blockClassName}--g-${gap}`];
    }

    if (rowGap === columnGap && columnGap !== undefined) {
        return [`${blockClassName}--g-${columnGap}`];
    }

    const classNames: Array<string> = [];

    if (rowGap) {
        classNames.push(`${blockClassName}--rg-${rowGap}`);
    }

    if (columnGap) {
        classNames.push(`${blockClassName}--cg-${columnGap}`);
    }

    return classNames;
}

export function createFlex<TGrid extends TSpacingGrid>(view: ICreatedView<TGrid>): ICreatedFlex<TGrid> {
    registerLayoutStyles(view.config, flexModifiersCss + buildFlexCss(view.config));

    const CreatedFlex: FC<ICreatedFlexProps<TGrid>> = ({
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

    CreatedFlex.displayName = 'CreatedFlex';

    return Object.assign(CreatedFlex, { config: view.config });
}
