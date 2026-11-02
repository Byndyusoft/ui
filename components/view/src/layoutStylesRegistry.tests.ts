import { getLayoutStyleEntries, registerLayoutStyles, resetLayoutStyles } from './layoutStylesRegistry';

describe('components/View/layoutStylesRegistry', () => {
    const config = { unit: '8px', grid: { md: 1 } } as const;
    const css = '.bsui-p-md{padding:calc(var(--bsui-unit, 8px) * 1)}';

    afterEach(() => {
        resetLayoutStyles();
        document.head.querySelectorAll('style[id^="bsui-layout-"]').forEach(style => style.remove());
    });

    test('инъецирует style-элемент в head при регистрации', () => {
        const entry = registerLayoutStyles(config, css);
        const style = document.getElementById(entry.id);

        expect(style).not.toBeNull();
        expect(style?.textContent).toBe(css);
    });

    test('идемпотентен: повторная регистрация того же конфига не дублирует элемент', () => {
        registerLayoutStyles(config, css);
        registerLayoutStyles(config, css);

        expect(document.head.querySelectorAll('style[id^="bsui-layout-"]')).toHaveLength(1);
    });

    test('дополняет существующий элемент стилями для того же конфига', () => {
        const gapCss = '.bsui-flex--g-md{gap:calc(var(--bsui-unit, 8px) * 1)}';
        const entry = registerLayoutStyles(config, css);

        registerLayoutStyles(config, gapCss);

        expect(document.head.querySelectorAll('style[id^="bsui-layout-"]')).toHaveLength(1);
        expect(document.getElementById(entry.id)?.textContent).toBe(css + gapCss);
    });

    test('не дублирует стили, отрендеренные на сервере', () => {
        const entry = registerLayoutStyles(config, css);
        const serverStyle = document.getElementById(entry.id);

        resetLayoutStyles();
        registerLayoutStyles(config, css);

        expect(document.head.querySelectorAll('style[id^="bsui-layout-"]')).toHaveLength(1);
        expect(document.getElementById(entry.id)).toBe(serverStyle);
    });

    test('возвращает зарегистрированные записи', () => {
        registerLayoutStyles(config, css);

        expect(getLayoutStyleEntries()).toHaveLength(1);
        expect(getLayoutStyleEntries()[0].css).toBe(css);
    });
});
