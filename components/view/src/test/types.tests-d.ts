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

    test('типизирует короткие spacing aliases теми же токенами', () => {
        expectTypeOf<ICreatedViewProps<typeof grid>['m']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['mt']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['mr']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['mb']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['ml']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['mh']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['mv']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['p']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['pt']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['pr']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['pb']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['pl']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['ph']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['pv']>().toEqualTypeOf<'xs' | 'md' | '150' | undefined>();

        const invalidProps: ICreatedViewProps<typeof grid> = {
            // @ts-expect-error: короткий alias принимает только токены values
            m: 'invalid'
        };

        expectTypeOf(invalidProps).not.toBeNever();
    });

    test('сохраняет нативные атрибуты и пропс as', () => {
        expectTypeOf<ICreatedViewProps<typeof grid>['id']>().toEqualTypeOf<string | undefined>();
        expectTypeOf<ICreatedViewProps<typeof grid>['as']>().not.toBeUndefined();
    });

    test('конфигурация требует юнит и сетку множителей', () => {
        expectTypeOf<IViewConfig<typeof grid>>().toMatchTypeOf<{ unit: string; values: typeof grid }>();
    });
});
