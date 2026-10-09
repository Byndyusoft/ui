import { describe, expectTypeOf, test } from 'vitest';
import useDebouncedCallback, { IDebouncedCallback } from './index';

describe('types/useDebouncedCallback', () => {
    test('сохраняет типы обязательных, необязательных и остальных аргументов', () => {
        type TArgs = [value: string, count?: number, ...flags: Array<boolean>];
        type TResult = ReturnType<typeof useDebouncedCallback<TArgs>>;

        expectTypeOf<TResult>().toEqualTypeOf<IDebouncedCallback<TArgs>>();
        expectTypeOf<TResult>().parameters.toEqualTypeOf<TArgs>();
        expectTypeOf<TResult>().returns.toBeVoid();
        expectTypeOf<TResult['cancel']>().toEqualTypeOf<() => void>();
        expectTypeOf<TResult['flush']>().toEqualTypeOf<() => void>();
    });

    test('выводит типы аргументов из обработчика', () => {
        const callback = (value: string, count?: number): string => `${value}:${count ?? 0}`;
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Проверяем выведенный тип возвращаемого значения.
        const useExample = () => useDebouncedCallback(callback, 100);

        expectTypeOf<ReturnType<typeof useExample>>().parameters.toEqualTypeOf<[string, number?]>();
    });
});
