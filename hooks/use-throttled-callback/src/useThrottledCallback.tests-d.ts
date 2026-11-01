import { describe, expectTypeOf, test } from 'vitest';
import useThrottledCallback, {
    IThrottledCallback,
    IThrottledCallbackOptions,
    useThrottledCallback as namedHook
} from './index';

describe('types/useThrottledCallback', () => {
    test('сохраняет обязательные, необязательные и остальные аргументы', () => {
        type TArgs = [value: string, count?: number, ...flags: Array<boolean>];
        type TResult = ReturnType<typeof useThrottledCallback<TArgs>>;

        expectTypeOf<TResult>().toEqualTypeOf<IThrottledCallback<TArgs>>();
        expectTypeOf<TResult>().parameters.toEqualTypeOf<TArgs>();
        expectTypeOf<TResult>().returns.toBeVoid();
        expectTypeOf<TResult['cancel']>().toEqualTypeOf<() => void>();
        expectTypeOf<TResult['flush']>().toEqualTypeOf<() => void>();
        expectTypeOf<typeof namedHook>().toEqualTypeOf<typeof useThrottledCallback>();
        expectTypeOf<typeof useThrottledCallback<TArgs>>().parameters.toEqualTypeOf<
            [(...args: TArgs) => void, number, IThrottledCallbackOptions?]
        >();
    });

    test('выводит аргументы из обработчика и не использует его результат', () => {
        const callback = (value: string, count?: number): string => `${value}:${count ?? 0}`;
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Проверяем выведенный тип обработчика.
        const useExample = () => useThrottledCallback(callback, 100);

        expectTypeOf<ReturnType<typeof useExample>>().parameters.toEqualTypeOf<[string, number?]>();
        expectTypeOf<ReturnType<typeof useExample>>().returns.toBeVoid();
    });
});
