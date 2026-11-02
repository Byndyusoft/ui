import { buildCss } from '../utilities';

describe('components/View/buildCss', () => {
    const config = {
        unit: '8px',
        values: { sm: 0.5, md: 1, lg: 1.5 }
    } as const;

    test('генерирует классы отступов со значением от юнита и множителя', () => {
        const css = buildCss(config);

        expect(css).toContain('.bsui-p-md{padding:calc(var(--bsui-unit, 8px) * 1)}');
        expect(css).toContain('.bsui-m-sm{margin:calc(var(--bsui-unit, 8px) * 0.5)}');
    });

    test('генерирует парные стороны для горизонтали и вертикали', () => {
        const css = buildCss(config);
        const value = 'calc(var(--bsui-unit, 8px) * 1.5)';

        expect(css).toContain(`.bsui-ph-lg{padding-left:${value};padding-right:${value}}`);
        expect(css).toContain(`.bsui-mv-lg{margin-top:${value};margin-bottom:${value}}`);
    });

    test('покрывает всю матрицу: 14 вариантов сторон на каждый токен', () => {
        const css = buildCss(config);
        const rulesCount = css.split('}').length - 1;

        expect(rulesCount).toBe(14 * Object.keys(config.values).length);
    });
});
