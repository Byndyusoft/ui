import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import View, { sanitizeMagicUnit, TSpacingUnit } from '@byndyusoft-ui/view';
import { IFlexProps, TAlignContent, TAlignItems, TFlexDirection, TFlexWrap, TJustifyContent } from './Flex.types';
import '@byndyusoft-ui/css-utilities';
import './Flex.scss';

const prefix = 'bsui';
const blockClassName = `${prefix}-flex`;

export function getDirectionModifier(direction?: TFlexDirection): string {
    if (direction) {
        return `${blockClassName}--fd-${direction}`;
    }

    return '';
}

export function getWrapModifier(wrap?: TFlexWrap): string {
    if (wrap) {
        return `${blockClassName}--fw-${wrap}`;
    }

    return '';
}

export function getAlignContentModifier(alignContent?: TAlignContent): string {
    if (alignContent) {
        return `${blockClassName}--ac-${alignContent}`;
    }

    return '';
}

export function getAlignItemsModifier(alignItems?: TAlignItems): string {
    if (alignItems) {
        return `${blockClassName}--ai-${alignItems}`;
    }

    return '';
}

export function getJustifyContentModifier(justifyContent?: TJustifyContent): string {
    if (justifyContent) {
        return `${blockClassName}--jc-${justifyContent}`;
    }

    return '';
}

export function getGapModifiers(gap?: TSpacingUnit, rowGap?: TSpacingUnit, columnGap?: TSpacingUnit): Array<string> {
    if (gap) {
        return [`${blockClassName}--g-${sanitizeMagicUnit(gap)}`];
    }

    if (rowGap === columnGap && columnGap !== undefined) {
        return [`${blockClassName}--g-${sanitizeMagicUnit(columnGap)}`];
    }

    const classNames: Array<string> = [];

    if (rowGap) {
        classNames.push(`${blockClassName}--rg-${sanitizeMagicUnit(rowGap)}`);
    }

    if (columnGap) {
        classNames.push(`${blockClassName}--cg-${sanitizeMagicUnit(columnGap)}`);
    }

    return classNames;
}

const Flex: FC<IFlexProps> = ({
    className,
    children,
    direction,
    wrap,
    alignContent,
    alignItems,
    justifyContent,
    gap,
    columnGap,
    rowGap,
    ...props
}): JSX.Element => {
    const flexClassName = useMemo(
        () =>
            cn(
                blockClassName,
                className,
                getDirectionModifier(direction),
                getWrapModifier(wrap),
                getAlignContentModifier(alignContent),
                getAlignItemsModifier(alignItems),
                getJustifyContentModifier(justifyContent),
                ...getGapModifiers(gap, rowGap, columnGap)
            ),
        [className, direction, wrap, alignContent, alignItems, justifyContent, gap, rowGap, columnGap]
    );

    return (
        <View className={flexClassName} {...props}>
            {children}
        </View>
    );
};

export default Flex;
