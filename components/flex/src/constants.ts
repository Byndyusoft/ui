export const blockClassName = 'bsui-flex';

export function getFlexBlockClassName(classPrefix = 'bsui'): string {
    return `${classPrefix}-flex`;
}

export const directions = ['row', 'column', 'row-reverse', 'column-reverse'] as const;

export const flexWraps = ['nowrap', 'wrap', 'wrap-reverse'] as const;

export const justifyContentVariants = [
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly'
] as const;

export const alignContentVariants = [
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
    'stretch'
] as const;

export const alignItemsVariants = ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'] as const;

export function buildFlexModifiersCss(classPrefix = 'bsui'): string {
    const flexClassName = getFlexBlockClassName(classPrefix);

    return [
        `.${flexClassName}{display:flex}`,
        `.${flexClassName}--fd-row{flex-direction:row}`,
        `.${flexClassName}--fd-row-reverse{flex-direction:row-reverse}`,
        `.${flexClassName}--fd-column{flex-direction:column}`,
        `.${flexClassName}--fd-column-reverse{flex-direction:column-reverse}`,
        `.${flexClassName}--fw-nowrap{flex-wrap:nowrap}`,
        `.${flexClassName}--fw-wrap{flex-wrap:wrap}`,
        `.${flexClassName}--fw-wrap-reverse{flex-wrap:wrap-reverse}`,
        `.${flexClassName}--jc-flex-start{justify-content:flex-start}`,
        `.${flexClassName}--jc-flex-end{justify-content:flex-end}`,
        `.${flexClassName}--jc-center{justify-content:center}`,
        `.${flexClassName}--jc-space-between{justify-content:space-between}`,
        `.${flexClassName}--jc-space-around{justify-content:space-around}`,
        `.${flexClassName}--jc-space-evenly{justify-content:space-evenly}`,
        `.${flexClassName}--ac-flex-start{align-content:flex-start}`,
        `.${flexClassName}--ac-flex-end{align-content:flex-end}`,
        `.${flexClassName}--ac-center{align-content:center}`,
        `.${flexClassName}--ac-space-between{align-content:space-between}`,
        `.${flexClassName}--ac-space-around{align-content:space-around}`,
        `.${flexClassName}--ac-space-evenly{align-content:space-evenly}`,
        `.${flexClassName}--ac-stretch{align-content:stretch}`,
        `.${flexClassName}--ai-flex-start{align-items:flex-start}`,
        `.${flexClassName}--ai-flex-end{align-items:flex-end}`,
        `.${flexClassName}--ai-center{align-items:center}`,
        `.${flexClassName}--ai-baseline{align-items:baseline}`,
        `.${flexClassName}--ai-stretch{align-items:stretch}`
    ].join('');
}

export const flexModifiersCss = buildFlexModifiersCss();
