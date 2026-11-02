export const blockClassName = 'bsui-flex';

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

export const flexModifiersCss = [
    `.${blockClassName}{display:flex}`,
    `.${blockClassName}--fd-row{flex-direction:row}`,
    `.${blockClassName}--fd-row-reverse{flex-direction:row-reverse}`,
    `.${blockClassName}--fd-column{flex-direction:column}`,
    `.${blockClassName}--fd-column-reverse{flex-direction:column-reverse}`,
    `.${blockClassName}--fw-nowrap{flex-wrap:nowrap}`,
    `.${blockClassName}--fw-wrap{flex-wrap:wrap}`,
    `.${blockClassName}--fw-wrap-reverse{flex-wrap:wrap-reverse}`,
    `.${blockClassName}--jc-flex-start{justify-content:flex-start}`,
    `.${blockClassName}--jc-flex-end{justify-content:flex-end}`,
    `.${blockClassName}--jc-center{justify-content:center}`,
    `.${blockClassName}--jc-space-between{justify-content:space-between}`,
    `.${blockClassName}--jc-space-around{justify-content:space-around}`,
    `.${blockClassName}--jc-space-evenly{justify-content:space-evenly}`,
    `.${blockClassName}--ac-flex-start{align-content:flex-start}`,
    `.${blockClassName}--ac-flex-end{align-content:flex-end}`,
    `.${blockClassName}--ac-center{align-content:center}`,
    `.${blockClassName}--ac-space-between{align-content:space-between}`,
    `.${blockClassName}--ac-space-around{align-content:space-around}`,
    `.${blockClassName}--ac-space-evenly{align-content:space-evenly}`,
    `.${blockClassName}--ac-stretch{align-content:stretch}`,
    `.${blockClassName}--ai-flex-start{align-items:flex-start}`,
    `.${blockClassName}--ai-flex-end{align-items:flex-end}`,
    `.${blockClassName}--ai-center{align-items:center}`,
    `.${blockClassName}--ai-baseline{align-items:baseline}`,
    `.${blockClassName}--ai-stretch{align-items:stretch}`
].join('');
