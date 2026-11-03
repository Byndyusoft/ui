import * as view from '..';

describe('components/View/exports', () => {
    test('сохраняет существующие экспорты и открывает утилиты раскладки', () => {
        expect(Object.keys(view)).toEqual(
            expect.arrayContaining([
                'createView',
                'ViewStylesInjector',
                'registerStyles',
                'getSpacingValue',
                'buildCss',
                'getSpacingClassName',
                'spacingPropPrefixes',
                'spacingUnitVariable',
                'validateValuesKeys'
            ])
        );
        expect(view.spacingUnitVariable).toBe('--bsui-unit');
        expect(view.spacingPropPrefixes.m).toBe('m');
        expect(view.spacingPropPrefixes.p).toBe('p');
        expect(view.getSpacingClassName(view.spacingPropPrefixes.padding, 'md')).toBe('bsui-p-md');
        expect(view.getSpacingValue('8px', 1)).toBe('calc(var(--bsui-unit, 8px) * 1)');
        expect(view.getSpacingValue({ value: 8, unit: 'px' }, 1.5)).toBe('12px');
        expect(view.buildCss({ step: { value: 8, unit: 'px' }, values: { md: 1 } })).toContain(
            '.bsui-p-md{padding:8px}'
        );
        expect(() => view.validateValuesKeys({ 'invalid token': 1 })).toThrow('недопустимый токен');
    });
});
