import { buildCss } from '../utilities';

describe('components/View/buildCss', () => {
    const config = {
        step: { value: 8, unit: 'px' },
        values: { sm: 0.5, md: 1, lg: 1.5 }
    } as const;

    test('генерирует классы отступов со значением от юнита и множителя', () => {
        const css = buildCss(config);

        expect(css).toContain('.bsui-p-md{padding:8px}');
        expect(css).toContain('.bsui-m-sm{margin:4px}');
    });

    test('генерирует парные стороны для горизонтали и вертикали', () => {
        const css = buildCss(config);
        const value = '12px';

        expect(css).toContain(`.bsui-ph-lg{padding-left:${value};padding-right:${value}}`);
        expect(css).toContain(`.bsui-mv-lg{margin-top:${value};margin-bottom:${value}}`);
    });

    test('покрывает всю матрицу: 14 вариантов сторон на каждый токен', () => {
        const css = buildCss(config);
        const rulesCount = css.split('}').length - 1;

        expect(rulesCount).toBe(14 * Object.keys(config.values).length);
    });

    test('генерирует готовые значения rem без артефактов двоичной арифметики', () => {
        const css = buildCss({ step: { value: 3, unit: 'rem' }, values: { small: 0.1 } } as const);

        expect(css).toContain('.bsui-m-small{margin:0.3rem}');
        expect(css).not.toContain('calc(');
    });

    test('использует пользовательский prefix селекторов', () => {
        const css = buildCss({ ...config, prefix: 'app' });

        expect(css).toContain('.app-p-md{padding:8px}');
        expect(css).not.toContain('.bsui-');
    });
});
