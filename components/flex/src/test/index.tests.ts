import * as flex from '..';

describe('components/Flex/exports', () => {
    test('сохраняет фабрику и открывает CSS, модификаторы и варианты раскладки', () => {
        expect(Object.keys(flex)).toEqual(
            expect.arrayContaining([
                'createFlex',
                'buildCss',
                'flexModifiersCss',
                'blockClassName',
                'getDirectionModifier',
                'getWrapModifier',
                'getAlignContentModifier',
                'getAlignItemsModifier',
                'getJustifyContentModifier',
                'directions',
                'flexWraps',
                'alignContentVariants',
                'alignItemsVariants',
                'justifyContentVariants'
            ])
        );
        expect(flex.blockClassName).toBe('bsui-flex');
        expect(flex.getDirectionModifier('column')).toBe('bsui-flex--fd-column');
        expect(flex.getWrapModifier('wrap')).toBe('bsui-flex--fw-wrap');
        expect(flex.getAlignContentModifier('stretch')).toBe('bsui-flex--ac-stretch');
        expect(flex.getAlignItemsModifier('center')).toBe('bsui-flex--ai-center');
        expect(flex.getJustifyContentModifier('space-between')).toBe('bsui-flex--jc-space-between');
        expect(flex.getDirectionModifier('column', 'app')).toBe('app-flex--fd-column');
        expect(flex.buildCss({ step: { value: 8, unit: 'px' }, values: { md: 1 } })).toContain(
            '.bsui-flex--g-md{gap:8px}'
        );
        expect(flex.flexModifiersCss).toContain('.bsui-flex{display:flex}');
        expect(flex.directions).toContain('column');
        expect(flex.flexWraps).toContain('wrap');
        expect(flex.alignContentVariants).toContain('stretch');
        expect(flex.alignItemsVariants).toContain('center');
        expect(flex.justifyContentVariants).toContain('space-between');
    });
});
