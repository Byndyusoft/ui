import { ChangeEventHandler, ComponentPropsWithRef, HTMLInputTypeAttribute, Ref } from 'react';
import { describe, expectTypeOf, test } from 'vitest';
import TextInput, { ITextInputProps, TextInput as NamedTextInput } from './index';

describe('типы/TextInput', () => {
    test('предоставляет одинаковые именованный экспорт и экспорт по умолчанию', () => {
        expectTypeOf<typeof TextInput>().toEqualTypeOf<typeof NamedTextInput>();
    });

    test('принимает нативные типы поля и ref на HTMLInputElement', () => {
        type TProps = ComponentPropsWithRef<typeof TextInput>;
        expectTypeOf<TProps['type']>().toEqualTypeOf<HTMLInputTypeAttribute | undefined>();
        expectTypeOf<TProps['ref']>().toEqualTypeOf<Ref<HTMLInputElement> | undefined>();
        expectTypeOf<ITextInputProps['isDisabled']>().toEqualTypeOf<boolean | undefined>();
        expectTypeOf<'disabled'>().not.toMatchTypeOf<keyof ITextInputProps>();
        expectTypeOf<'withAutoHeight'>().not.toMatchTypeOf<keyof ITextInputProps>();
    });

    test('все обработчики изменения получают событие HTMLInputElement', () => {
        expectTypeOf<ITextInputProps['onChange']>().toEqualTypeOf<ChangeEventHandler<HTMLInputElement> | undefined>();
        expectTypeOf<ITextInputProps['onDebouncedChange']>().toEqualTypeOf<
            ChangeEventHandler<HTMLInputElement> | undefined
        >();
        expectTypeOf<ITextInputProps['onThrottledChange']>().toEqualTypeOf<
            ChangeEventHandler<HTMLInputElement> | undefined
        >();
    });
});
