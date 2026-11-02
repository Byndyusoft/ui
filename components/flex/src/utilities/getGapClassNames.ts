import { blockClassName } from '../constants';

export function getGapClassNames(gap?: string, rowGap?: string, columnGap?: string): Array<string> {
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
