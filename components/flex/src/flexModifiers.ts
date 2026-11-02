import { TAlignContent, TAlignItems, TFlexDirection, TFlexWrap, TJustifyContent } from './Flex.types';

export const blockClassName = 'bsui-flex';

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
