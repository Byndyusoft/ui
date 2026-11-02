import { describe, expectTypeOf, test } from 'vitest';
import { ICreatedViewProps, IViewConfig, TValuesToken } from '../types';

const grid = { xs: 0.25, md: 1, '150': 1.5 } as const;

describe('components/View/types', () => {
    test('выводит токены сетки из ключей конфигурации', () => {
        expectTypeOf<TValuesToken<typeof grid>>().toEqualTypeOf<'xs' | 'md' | '150'>();
    });

    test('типизирует spacing-пропсы токенами сетки', () => {
        expectTypeOf<ICreatedViewProps<typeof grid>['padding']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['marginHorizontal']>().toEqualTypeOf<
            'xs' | 'md' | '150' | undefined
        >();
    });

    test('сохраняет нативные атрибуты и пропс as', () => {
        expectTypeOf<ICreatedViewProps<typeof grid>['id']>().toEqualTypeOf<string | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['as']>().not.toBeUndefined();
    });

    test('конфигурация требует юнит и сетку множителей', () => {
        expectTypeOf<IViewConfig<typeof grid>>().toMatchTypeOf<{ unit: string; values: typeof grid }>();
    });
});
