import { Dispatch, SetStateAction } from 'react';
import { IThrottledCallback, IThrottledCallbackOptions } from '@byndyusoft-ui/use-throttled-callback';
import { describe, expectTypeOf, test } from 'vitest';
import useThrottledValue, { TUseThrottledValueReturn, useThrottledValue as namedHook } from './index';

describe('types/useThrottledValue', () => {
    test('возвращает значение и setter с контрактом useState и управлением ожиданием', () => {
        type TValue = { count: number } | null;
        type TResult = ReturnType<typeof useThrottledValue<TValue>>;

        expectTypeOf<TResult>().toEqualTypeOf<TUseThrottledValueReturn<TValue>>();
        expectTypeOf<TResult[0]>().toEqualTypeOf<TValue>();
        expectTypeOf<TResult[1]>().toEqualTypeOf<IThrottledCallback<[SetStateAction<TValue>]>>();
        expectTypeOf<TResult[1]>().toMatchTypeOf<Dispatch<SetStateAction<TValue>>>();
        expectTypeOf<TResult[1]['cancel']>().toEqualTypeOf<() => void>();
        expectTypeOf<TResult[1]['flush']>().toEqualTypeOf<() => void>();
        expectTypeOf<typeof namedHook>().toEqualTypeOf<typeof useThrottledValue>();
        expectTypeOf<typeof useThrottledValue<TValue>>().parameters.toEqualTypeOf<
            [TValue | (() => TValue), number, IThrottledCallbackOptions?]
        >();
    });

    test('выводит тип состояния из ленивого инициализатора', () => {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Проверяем выведенный тип состояния.
        const useExample = () => useThrottledValue(() => ({ count: 0 }), 100);

        expectTypeOf<ReturnType<typeof useExample>>().toEqualTypeOf<TUseThrottledValueReturn<{ count: number }>>();
    });

    test('сохраняет тип массива и состояния-функции', () => {
        type TFunction = (value: string) => number;

        expectTypeOf<ReturnType<typeof useThrottledValue<ReadonlyArray<string>>>>().toEqualTypeOf<
            TUseThrottledValueReturn<ReadonlyArray<string>>
        >();
        expectTypeOf<ReturnType<typeof useThrottledValue<TFunction>>>().toEqualTypeOf<
            TUseThrottledValueReturn<TFunction>
        >();
    });
});
