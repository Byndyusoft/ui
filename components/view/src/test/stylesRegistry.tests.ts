import { getStyleEntries, registerStyles, resetStyles } from '../utilities';

describe('components/View/stylesRegistry', () => {
    const config = { step: { value: 8, unit: 'px' }, values: { md: 1 } } as const;
    const css = '.bsui-p-md{padding:calc(var(--bsui-unit, 8px) * 1)}';

    afterEach(() => {
        resetStyles();
        document.head.querySelectorAll('style[id^="bsui-layout-"]').forEach(style => style.remove());
    });

    test('инъецирует style-элемент в head при регистрации', () => {
        const entry = registerStyles(config, css);
        const style = document.getElementById(entry.id);

        expect(style).not.toBeNull();
        expect(style?.textContent).toBe(css);
    });

    test('идемпотентен: повторная регистрация того же конфига не дублирует элемент', () => {
        registerStyles(config, css);
        registerStyles(config, css);

        expect(document.head.querySelectorAll('style[id^="bsui-layout-"]')).toHaveLength(1);
    });

    test('дополняет существующий элемент стилями для того же конфига', () => {
        const gapCss = '.bsui-flex--g-md{gap:calc(var(--bsui-unit, 8px) * 1)}';
        const entry = registerStyles(config, css);

        registerStyles(config, gapCss);

        expect(document.head.querySelectorAll('style[id^="bsui-layout-"]')).toHaveLength(1);
        expect(document.getElementById(entry.id)?.textContent).toBe(css + gapCss);
    });

    test('регистрирует отдельные записи для разных CSS-префиксов', () => {
        const defaultEntry = registerStyles(config, css);
        const customEntry = registerStyles({ ...config, prefix: 'app' }, '.app-p-md{padding:8px}');

        expect(customEntry.id).not.toBe(defaultEntry.id);
        expect(getStyleEntries()).toHaveLength(2);
    });

    test('не дублирует стили, отрендеренные на сервере', () => {
        const entry = registerStyles(config, css);
        const serverStyle = document.getElementById(entry.id);

        resetStyles();
        registerStyles(config, css);

        expect(document.head.querySelectorAll('style[id^="bsui-layout-"]')).toHaveLength(1);
        expect(document.getElementById(entry.id)).toBe(serverStyle);
    });

    test('возвращает зарегистрированные записи', () => {
        registerStyles(config, css);

        expect(getStyleEntries()).toHaveLength(1);
        expect(getStyleEntries()[0].css).toBe(css);
    });
});
