import React from 'react';
import { describe, expectTypeOf, test } from 'vitest';
import { createView } from '../createView';
import { buildCss, getSpacingClassName, getSpacingValue, validateValuesKeys } from '../utilities';
import type { ICreatedViewProps, ISpacingProps, IViewConfig } from '../types';
import { spacingPropPrefixes, spacingUnitVariable } from '../constants';

const View = createView({ unit: '8px', values: { sm: 0.5, md: 1, lg: 1.5 } } as const);

describe('components/View/createView/types', () => {
    test('принимает токены сетки в spacing-пропсах', () => {
        React.createElement(View, { padding: 'sm', marginHorizontal: 'md', marginBottom: 'lg' });
    });

    test('отклоняет значения вне сетки', () => {
        const invalidProps: ICreatedViewProps<{ sm: 0.5; md: 1; lg: 1.5 }> = {
            // @ts-expect-error: токен отсутствует в сетке конфигурации
            padding: 'huge'
        };

        expectTypeOf(invalidProps).not.toBeNever();
    });

    test('выводит тип конфигурации на компоненте для createFlex', () => {
        expectTypeOf(View.config.values).toEqualTypeOf<{ readonly sm: 0.5; readonly md: 1; readonly lg: 1.5 }>();
        expectTypeOf(View.config.unit).toEqualTypeOf<string>();
    });

    test('экспортирует утилиты генерации CSS и проверки конфигурации', () => {
        expectTypeOf(buildCss(View.config)).toEqualTypeOf<string>();
        expectTypeOf(getSpacingClassName('p', 'md')).toEqualTypeOf<string>();
        expectTypeOf(getSpacingValue('8px', 1)).toEqualTypeOf<string>();
        expectTypeOf(validateValuesKeys).returns.toBeVoid();
        expectTypeOf(spacingPropPrefixes).toEqualTypeOf<Record<keyof ISpacingProps, string>>();
        expectTypeOf<typeof spacingUnitVariable>().toEqualTypeOf<'--bsui-unit'>();
        expectTypeOf(View.config).toMatchTypeOf<IViewConfig>();
    });
});
