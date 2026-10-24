import { Dispatch, SetStateAction } from 'react';
import { IDebouncedCallback } from '@byndyusoft-ui/use-debounced-callback';
import { describe, expectTypeOf, test } from 'vitest';
import useDebouncedValue, { TUseDebouncedValueReturn, useDebouncedValue as namedUseDebouncedValue } from './index';

describe('types/useDebouncedValue', () => {
    test('возвращает кортеж с типизированным значением и отложенным setter', () => {
        type TValue = { readonly text: string; flags: Array<boolean> } | null;
        type TResult = ReturnType<typeof useDebouncedValue<TValue>>;

        expectTypeOf<TResult>().toEqualTypeOf<TUseDebouncedValueReturn<TValue>>();
        expectTypeOf<TResult[0]>().toEqualTypeOf<TValue>();
        expectTypeOf<TResult[1]>().toEqualTypeOf<IDebouncedCallback<[SetStateAction<TValue>]>>();
        expectTypeOf<TResult[1]>().toMatchTypeOf<Dispatch<SetStateAction<TValue>>>();
        expectTypeOf<TResult[1]>().parameters.toEqualTypeOf<[SetStateAction<TValue>]>();
        expectTypeOf<TResult[1]['cancel']>().toEqualTypeOf<() => void>();
        expectTypeOf<TResult[1]['flush']>().toEqualTypeOf<() => void>();
        expectTypeOf<typeof namedUseDebouncedValue>().toEqualTypeOf<typeof useDebouncedValue>();
        expectTypeOf<typeof useDebouncedValue<TValue>>().parameters.toEqualTypeOf<[TValue | (() => TValue), number]>();
    });

    test('выводит тип из обычного значения', () => {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Проверяем выведенный тип состояния.
        const useExample = (value: ReadonlyArray<string>) => useDebouncedValue(value, 100);

        expectTypeOf<ReturnType<typeof useExample>>().toEqualTypeOf<TUseDebouncedValueReturn<ReadonlyArray<string>>>();
    });

    test('выводит тип из ленивого инициализатора', () => {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Проверяем выведенный тип состояния.
        const useExample = () => useDebouncedValue(() => ({ count: 0 }), 100);

        expectTypeOf<ReturnType<typeof useExample>>().toEqualTypeOf<TUseDebouncedValueReturn<{ count: number }>>();
    });

    test('сохраняет функцию в типе состояния', () => {
        type TValue = (text: string) => number;

        expectTypeOf<ReturnType<typeof useDebouncedValue<TValue>>>().toEqualTypeOf<TUseDebouncedValueReturn<TValue>>();
    });
});
