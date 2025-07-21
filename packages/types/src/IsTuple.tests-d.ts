import { describe, it, expectTypeOf } from 'vitest';
import { IsTuple } from './index';

describe('types/IsTuple', () => {
    it('should be false for non-array types', () => {
        expectTypeOf<IsTuple<string>>().toEqualTypeOf<false>();
        expectTypeOf<IsTuple<number>>().toEqualTypeOf<false>();
    });

    it('should be false for regular arrays', () => {
        expectTypeOf<IsTuple<Array<string>>>().toEqualTypeOf<false>();
        expectTypeOf<IsTuple<string[]>>().toEqualTypeOf<false>();
        expectTypeOf<IsTuple<unknown[]>>().toEqualTypeOf<false>();
    });

    it('should be true for tuples', () => {
        expectTypeOf<IsTuple<[]>>().toEqualTypeOf<true>();
        expectTypeOf<IsTuple<[string]>>().toEqualTypeOf<true>();
        expectTypeOf<IsTuple<[string, number]>>().toEqualTypeOf<true>();
        expectTypeOf<IsTuple<[string, number?]>>().toEqualTypeOf<true>();
    });
});
