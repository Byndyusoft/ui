import React from 'react';
import { describe, expectTypeOf, test } from 'vitest';
import { createView } from '@byndyusoft-ui/view';
import { createFlex } from '../createFlex';
import {
    alignContentVariants,
    alignItemsVariants,
    blockClassName,
    directions,
    flexModifiersCss,
    flexWraps,
    justifyContentVariants
} from '../constants';
import {
    buildCss,
    getAlignContentModifier,
    getAlignItemsModifier,
    getDirectionModifier,
    getJustifyContentModifier,
    getWrapModifier
} from '../utilities';
import type {
    ICreatedFlex,
    ICreatedFlexProps,
    TAlignContent,
    TAlignItems,
    TFlexDirection,
    TFlexWrap,
    TJustifyContent
} from '../types';

const values = { sm: 0.5, md: 1, lg: 1.5 } as const;

const View = createView({ unit: '8px', values });
const Flex = createFlex(View);

describe('components/Flex/createFlex/types', () => {
    test('принимает токены values View в gap-пропсах', () => {
        React.createElement(Flex, { gap: 'sm', rowGap: 'md', columnGap: 'lg' });
    });

    test('отклоняет gap-значения вне values', () => {
        const invalidProps: ICreatedFlexProps<{ sm: 0.5; md: 1; lg: 1.5 }> = {
            // @ts-expect-error: токен отсутствует в values конфигурации
            gap: 'huge'
        };

        expectTypeOf(invalidProps).not.toBeNever();
    });

    test('выводит конфигурацию из типа созданного View', () => {
        expectTypeOf(Flex.config.values).toEqualTypeOf<typeof values>();
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

    test('экспортирует генераторы CSS и модификаторов', () => {
        expectTypeOf(buildCss(View.config)).toEqualTypeOf<string>();
        expectTypeOf(flexModifiersCss).toEqualTypeOf<string>();
        expectTypeOf<typeof blockClassName>().toEqualTypeOf<'bsui-flex'>();
        expectTypeOf(getDirectionModifier('column')).toEqualTypeOf<string>();
        expectTypeOf(getWrapModifier('wrap')).toEqualTypeOf<string>();
        expectTypeOf(getAlignContentModifier('stretch')).toEqualTypeOf<string>();
        expectTypeOf(getAlignItemsModifier('center')).toEqualTypeOf<string>();
        expectTypeOf(getJustifyContentModifier('space-between')).toEqualTypeOf<string>();
        expectTypeOf(Flex).toEqualTypeOf<ICreatedFlex<typeof values>>();
    });

    test('экспортирует типы и соответствующие варианты раскладки', () => {
        expectTypeOf<(typeof directions)[number]>().toEqualTypeOf<TFlexDirection>();
        expectTypeOf<(typeof flexWraps)[number]>().toEqualTypeOf<TFlexWrap>();
        expectTypeOf<(typeof alignContentVariants)[number]>().toEqualTypeOf<TAlignContent>();
        expectTypeOf<(typeof alignItemsVariants)[number]>().toEqualTypeOf<TAlignItems>();
        expectTypeOf<(typeof justifyContentVariants)[number]>().toEqualTypeOf<TJustifyContent>();
    });
});
