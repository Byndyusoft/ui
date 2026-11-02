import React from 'react';
import { describe, expectTypeOf, test } from 'vitest';
import { createView } from './createView';
import { ICreatedViewProps } from './index';

const View = createView({ unit: '8px', grid: { sm: 0.5, md: 1, lg: 1.5 } } as const);

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
        expectTypeOf(View.config.grid).toEqualTypeOf<{ readonly sm: 0.5; readonly md: 1; readonly lg: 1.5 }>();
        expectTypeOf(View.config.unit).toEqualTypeOf<string>();
    });
});
