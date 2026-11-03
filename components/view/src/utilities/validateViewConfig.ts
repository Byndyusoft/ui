const cssClassPrefixPattern = /^[A-Za-z_][A-Za-z0-9_-]*$/;

interface IRuntimeViewConfig {
    step?: {
        value?: unknown;
        unit?: unknown;
    };
    values?: unknown;
    prefix?: unknown;
}

export function validateViewConfig(config: IRuntimeViewConfig): void {
    const { step, prefix } = config;

    if (!step || typeof step.value !== 'number' || !Number.isInteger(step.value) || step.value <= 0) {
        throw new Error('@byndyusoft-ui/view: step.value должен быть положительным целым числом.');
    }

    if (step.unit !== 'px' && step.unit !== 'rem') {
        throw new Error('@byndyusoft-ui/view: step.unit должен быть "px" или "rem".');
    }

    if (prefix !== undefined && (typeof prefix !== 'string' || !cssClassPrefixPattern.test(prefix))) {
        throw new Error(
            '@byndyusoft-ui/view: недопустимый prefix CSS-классов. Используйте латинскую букву или подчёркивание в начале, затем латиницу, цифры, дефис или подчёркивание.'
        );
    }
}
