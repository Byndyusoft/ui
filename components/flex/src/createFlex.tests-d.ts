import React from 'react';
import { describe, expectTypeOf, test } from 'vitest';
import { createView } from '@byndyusoft-ui/view';
import { createFlex, ICreatedFlexProps } from './index';

const grid = { sm: 0.5, md: 1, lg: 1.5 } as const;

const View = createView({ unit: '8px', grid });
const Flex = createFlex(View);

describe('components/Flex/createFlex/types', () => {
    test('принимает токены сетки View в gap-пропсах', () => {
        React.createElement(Flex, { gap: 'sm', rowGap: 'md', columnGap: 'lg' });
    });

    test('отклоняет gap-значения вне сетки', () => {
        const invalidProps: ICreatedFlexProps<{ sm: 0.5; md: 1; lg: 1.5 }> = {
            // @ts-expect-error: токен отсутствует в сетке конфигурации
            gap: 'huge'
        };

        expectTypeOf(invalidProps).not.toBeNever();
    });

    test('выводит конфигурацию из типа созданного View', () => {
        expectTypeOf(Flex.config.grid).toEqualTypeOf<typeof grid>();
    });

    test('сохраняет модификаторы раскладки и spacing-пропсы', () => {
        React.createElement(Flex, {
            direction: 'row',
            wrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'md'
        });
    });
});
