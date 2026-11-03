import { buildFlexModifiersCss, flexModifiersCss } from '../constants';
import { buildCss } from '../utilities';

describe('components/Flex/buildCss', () => {
    const config = { step: { value: 8, unit: 'px' }, values: { md: 1, lg: 1.5 } } as const;

    test('генерирует gap-классы для каждого токена values', () => {
        const css = buildCss(config);
        const mdValue = '8px';
        const lgValue = '12px';

        expect(css).toContain(`.bsui-flex--g-md{gap:${mdValue}}`);
        expect(css).toContain(`.bsui-flex--rg-lg{row-gap:${lgValue}}`);
        expect(css).toContain(`.bsui-flex--cg-lg{column-gap:${lgValue}}`);
    });

    test('покрывает три gap-варианта на каждый токен', () => {
        const rulesCount = buildCss(config).split('}').length - 1;

        expect(rulesCount).toBe(3 * Object.keys(config.values).length);
    });

    test('использует пользовательский prefix и готовые CSS-длины', () => {
        const css = buildCss({ ...config, prefix: 'app' });

        expect(css).toContain('.app-flex--g-md{gap:8px}');
        expect(css).toContain('.app-flex--rg-lg{row-gap:12px}');
        expect(css).not.toContain('calc(');
    });

    test('модификаторы раскладки заданы плоским CSS', () => {
        expect(flexModifiersCss).toContain('.bsui-flex{display:flex}');
        expect(flexModifiersCss).toContain('.bsui-flex--fd-column-reverse{flex-direction:column-reverse}');
        expect(flexModifiersCss).toContain('.bsui-flex--ai-baseline{align-items:baseline}');
        expect(flexModifiersCss).not.toContain('var(--bsui-unit');
    });

    test('генерирует модификаторы с пользовательским prefix', () => {
        const css = buildFlexModifiersCss('app');

        expect(css).toContain('.app-flex{display:flex}');
        expect(css).toContain('.app-flex--fd-column-reverse{flex-direction:column-reverse}');
        expect(css).not.toContain('.bsui-flex');
    });
});
