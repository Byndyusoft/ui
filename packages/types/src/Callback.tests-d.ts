import { describe, it, expectTypeOf } from 'vitest';
import { Callback } from './index';

describe('types/Callback', () => {
    it('should support default case with no args and void return', () => {
        type TTestCb = Callback;

        type TResultCb = () => void;

        expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
    });

    describe('return type', () => {
        it('should support return value when return type is defined', () => {
            type TTestCb = Callback<never, number>;

            type TResultCb = () => number;

            expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
        });

        it('should support void return explicitly', () => {
            type TTestCb = Callback<never, void>;

            type TResultCb = () => void;

            expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
        });

        it('should support undefined as return type', () => {
            type TTestCb = Callback<never, undefined>;

            type TResultCb = () => undefined;

            expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
        });

        it('should support null return type', () => {
            type TTestCb = Callback<[string], null>;

            type TResultCb = (str: string) => null;

            expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
        });
    });

    describe('primitive argument', () => {
        it('should support one primitive argument', () => {
            type TTestCb = Callback<string>;

            type TResultCb = (str: string) => void;

            expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
        });

        it('should support one argument with return type', () => {
            type TTestCb = Callback<number, string>;

            type TResultCb = (num: number) => string;

            expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
        });
    });

    describe('tuple argument', () => {
        it('should support empty tuple as args (like [])', () => {
            type TTestCb = Callback<[], string>;

            type TResultCb = () => string;

            expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
        });

        it('should support single-element tuple arguments', () => {
            type TTestCb = Callback<[number], string>;

            type TResultCb = (num: number) => string;

            expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
        });

        it('should support multiple optional args', () => {
            type TTestCb = Callback<[number, string?, boolean?], string>;

            type TResultCb = (a: number, b?: string, c?: boolean) => string;

            expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
        });

        it('should support infinite unknown args', () => {
            type TTestCb = Callback<unknown[]>;

            const resultCb1: TTestCb = () => {};
            const resultCb2: TTestCb = (a: unknown, b: unknown, c: unknown) => {};

            expectTypeOf<TTestCb>().toEqualTypeOf(resultCb1);
            expectTypeOf<TTestCb>().toEqualTypeOf(resultCb2);
        });

        it('should support complex tuple arguments', () => {
            type TTestCb = Callback<[number[], { value: number }], string[]>;

            type TResultCb = (nums: number[], obj: { value: number }) => string[];

            expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
        });

        it('should support two array args and return string', () => {
            type TTestCb = Callback<[number[], string[]], string>;

            type TResultCb = (nums: number[], strs: string[]) => string;

            expectTypeOf<TTestCb>().toEqualTypeOf<TResultCb>();
        });
    });

    describe('allowed arguments', () => {
        it('should allow 0 arguments', () => {
            expectTypeOf<Callback>().toEqualTypeOf<() => void>();
        });

        it('should allow 1 arguments', () => {
            expectTypeOf<Callback<number>>().toEqualTypeOf<(a: number) => void>();

            expectTypeOf<Callback<[number, number, number]>>().toEqualTypeOf<
                (a: number, b: number, c: number) => void
            >();
        });

        it('should allow 2 arguments', () => {
            expectTypeOf<Callback<never, string>>().toEqualTypeOf<() => string>();

            expectTypeOf<Callback<number, string>>().toEqualTypeOf<(a: number) => string>();

            expectTypeOf<Callback<[number, number, number], string>>().toEqualTypeOf<
                (a: number, b: number, c: number) => string
            >();
        });

        it('should not allow more than two arguments', () => {
            // @ts-expect-error: Too many type arguments
            type Invalid = Callback<number, number, number>;
        });
    });
});
