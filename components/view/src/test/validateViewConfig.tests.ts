import { validateViewConfig } from '../utilities/validateViewConfig';

describe('components/View/validateViewConfig', () => {
    test.each([
        { step: { value: 8, unit: 'px' }, values: {} },
        { step: { value: 1, unit: 'rem' }, values: {}, prefix: 'app' },
        { step: { value: 8, unit: 'px' }, values: {}, prefix: '_app-2' }
    ] as const)('принимает корректную конфигурацию %#', config => {
        expect(() => validateViewConfig(config)).not.toThrow();
    });

    test.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])('отклоняет недопустимое значение шага %s', value => {
        expect(() => validateViewConfig({ step: { value, unit: 'px' }, values: {} })).toThrow(
            'step.value должен быть положительным целым числом'
        );
    });

    test('отклоняет неподдерживаемую CSS-единицу', () => {
        expect(() => validateViewConfig({ step: { value: 8, unit: 'em' } })).toThrow(
            'step.unit должен быть "px" или "rem"'
        );
    });

    test.each(['', '2app', 'app.name', 'app name'])('отклоняет недопустимый prefix "%s"', prefix => {
        expect(() => validateViewConfig({ step: { value: 8, unit: 'px' }, values: {}, prefix })).toThrow(
            'недопустимый prefix CSS-классов'
        );
    });
});
