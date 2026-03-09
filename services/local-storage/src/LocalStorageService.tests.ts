import { LocalStorageService } from './LocalStorageService';
import { TDeserializeValue, TSerializeValue } from './LocalStorageService.types';

describe('services/local-storage', () => {
    const KEY = 'ls-test-key';

    beforeEach(() => {
        window.localStorage.clear();
    });

    test('get returns default value when key is missing', () => {
        const service = new LocalStorageService<string>(KEY, 'default');

        const value = service.getValue();

        expect(value).toBe('default');
    });

    test('set writes JSON value and get reads it back by default', () => {
        const service = new LocalStorageService<number>(KEY, 0);

        service.setValue(42);

        expect(window.localStorage.getItem(KEY)).toBe(JSON.stringify(42));
        expect(service.getValue()).toBe(42);
    });

    test('has reflects presence and removal of value', () => {
        const service = new LocalStorageService<string>(KEY, 'default');

        expect(service.hasValue()).toBe(false);

        service.setValue('value');
        expect(service.hasValue()).toBe(true);

        service.removeValue();
        expect(service.hasValue()).toBe(false);
    });

    test('remove deletes only the specific key', () => {
        const service = new LocalStorageService<string>(KEY, 'default');

        window.localStorage.setItem('other-key', 'other');
        service.setValue('value');

        service.removeValue();

        expect(window.localStorage.getItem(KEY)).toBeNull();
        expect(window.localStorage.getItem('other-key')).toBe('other');
    });

    test('clears all keys in localStorage', () => {
        const service = new LocalStorageService<string>(KEY, 'default');

        window.localStorage.setItem('other-key', 'other');
        service.setValue('value');

        service.clear();

        expect(window.localStorage.getItem(KEY)).toBeNull();
        expect(window.localStorage.getItem('other-key')).toBeNull();
        expect(window.localStorage.length).toBe(0);
    });

    test('uses custom serializer and deserializer when provided', () => {
        interface IValue {
            foo: string;
        }

        const serialize = vi.fn((value: IValue) => `(${value.foo})`) as TSerializeValue<IValue>;
        const deserialize = vi.fn((raw: string) => ({ foo: raw.slice(1, -1) })) as TDeserializeValue<IValue>;

        const service = new LocalStorageService<IValue>(KEY, { foo: 'default' }, { serialize, deserialize });

        service.setValue({ foo: 'bar' });

        expect(window.localStorage.getItem(KEY)).toBe('(bar)');

        // эмулируем новое значение, чтобы протестировать десериализацию
        window.localStorage.setItem(KEY, '(baz)');

        const value = service.getValue();

        expect(value).toEqual({ foo: 'baz' });

        expect(serialize).toHaveBeenCalledTimes(1);
        expect(deserialize).toHaveBeenCalledTimes(1);
    });
});
