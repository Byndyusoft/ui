import { flexModifiersCss } from '../constants';
import { buildCss } from '../utilities';

describe('components/Flex/buildCss', () => {
    const config = { unit: '8px', values: { md: 1, lg: 1.5 } } as const;

    test('генерирует gap-классы для каждого токена values', () => {
        const css = buildCss(config);
        const mdValue = 'calc(var(--bsui-unit, 8px) * 1)';
        const lgValue = 'calc(var(--bsui-unit, 8px) * 1.5)';

        expect(css).toContain(`.bsui-flex--g-md{gap:${mdValue}}`);
        expect(css).toContain(`.bsui-flex--rg-lg{row-gap:${lgValue}}`);
        expect(css).toContain(`.bsui-flex--cg-lg{column-gap:${lgValue}}`);
    });

    test('покрывает три gap-варианта на каждый токен', () => {
        const rulesCount = buildCss(config).split('}').length - 1;

        expect(rulesCount).toBe(3 * Object.keys(config.values).length);
    });

    test('модификаторы раскладки заданы плоским CSS', () => {
        expect(flexModifiersCss).toContain('.bsui-flex{display:flex}');
        expect(flexModifiersCss).toContain('.bsui-flex--fd-column-reverse{flex-direction:column-reverse}');
        expect(flexModifiersCss).toContain('.bsui-flex--ai-baseline{align-items:baseline}');
        expect(flexModifiersCss).not.toContain('var(--bsui-unit');
    });
});
