import React, { ChangeEvent, ChangeEventHandler, createRef, useLayoutEffect, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import TextInput, { TextInput as NamedTextInput } from './index';

function advanceTime(milliseconds: number): void {
    act(() => {
        vi.advanceTimersByTime(milliseconds);
    });
}

describe('components/TextInput', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    test('экспортирует один компонент и использует text по умолчанию', () => {
        expect(NamedTextInput).toBe(TextInput);
        const { rerender } = render(<TextInput aria-label="Название" />);
        expect(screen.getByLabelText('Название')).toHaveAttribute('type', 'text');
        rerender(<TextInput aria-label="Название" type="password" />);
        expect(screen.getByLabelText('Название')).toHaveAttribute('type', 'password');
        rerender(<TextInput aria-label="Название" type={undefined} />);
        expect(screen.getByLabelText('Название')).toHaveAttribute('type', 'text');
    });

    test('передаёт нативные атрибуты и управляет disabled через isDisabled', () => {
        const { rerender } = render(
            <TextInput id="name" name="name" placeholder="Название" required maxLength={20} isDisabled />
        );
        const element = screen.getByRole('textbox');
        expect(element).toBeDisabled();
        expect(element).toBeRequired();
        expect(element).toHaveAttribute('id', 'name');
        expect(element).toHaveAttribute('name', 'name');
        expect(element).toHaveAttribute('placeholder', 'Название');
        expect(element).toHaveAttribute('maxlength', '20');
        expect(element).not.toHaveAttribute('isDisabled');
        rerender(<TextInput />);
        expect(element).toBeEnabled();
    });

    test('передаёт DOM-элемент в ref, сохраняет его при рендере и очищает при размонтировании', () => {
        const first = createRef<HTMLInputElement>();
        const second = createRef<HTMLInputElement>();
        const { rerender, unmount } = render(<TextInput ref={first} defaultValue="Название" />);
        const element = screen.getByRole('textbox');
        expect(first.current).toBe(element);
        first.current?.focus();
        first.current?.setSelectionRange(1, 3);
        rerender(<TextInput ref={second} defaultValue="Название" />);
        expect(first.current).toBeNull();
        expect(second.current).toBe(element);
        expect(element).toHaveFocus();
        expect(second.current?.selectionStart).toBe(1);
        expect(second.current?.selectionEnd).toBe(3);
        unmount();
        expect(second.current).toBeNull();
    });

    test('callback-ref доступен в layout-эффекте родителя и очищается при размонтировании', () => {
        let input: HTMLInputElement | null = null;
        const ref = vi.fn((element: HTMLInputElement | null): void => {
            input = element;
        });
        const Parent = (): JSX.Element => {
            useLayoutEffect(() => {
                input?.focus();
            }, []);

            return <TextInput ref={ref} />;
        };
        const { unmount } = render(<Parent />);
        const element = screen.getByRole('textbox');
        expect(ref).toHaveBeenCalledExactlyOnceWith(element);
        expect(element).toHaveFocus();
        unmount();
        expect(ref).toHaveBeenLastCalledWith(null);
    });

    test('onChange и onInput получают нативное событие, отложенные коллбеки — то же событие позже', () => {
        const onChange = vi.fn();
        const onInput = vi.fn();
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        render(
            <TextInput
                onChange={onChange}
                onInput={onInput}
                onDebouncedChange={onDebouncedChange}
                debounceDelay={200}
                onThrottledChange={onThrottledChange}
                throttleDelay={100}
            />
        );
        const element = screen.getByRole('textbox');
        fireEvent.input(element, { target: { value: 'Текст' } });
        const event = onChange.mock.calls[0][0] as ChangeEvent<HTMLInputElement>;
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onInput).toHaveBeenCalledTimes(1);
        expect(event.target).toBe(element);
        expect(onDebouncedChange).not.toHaveBeenCalled();
        expect(onThrottledChange).not.toHaveBeenCalled();
        advanceTime(100);
        expect(onThrottledChange).toHaveBeenCalledExactlyOnceWith(event);
        advanceTime(100);
        expect(onDebouncedChange).toHaveBeenCalledExactlyOnceWith(event);
        expect(event.currentTarget).toBeNull();
        ['onDebouncedChange', 'debounceDelay', 'onThrottledChange', 'throttleDelay'].forEach(prop => {
            expect(element).not.toHaveAttribute(prop);
        });
    });

    test('работает в управляемом режиме и не вызывает коллбеки при программном изменении value', () => {
        const onChange = vi.fn();
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const Controlled = ({
            initialValue,
            overrideValue
        }: {
            initialValue: string;
            overrideValue?: string;
        }): JSX.Element => {
            const [value, setValue] = useState(initialValue);

            return (
                <TextInput
                    value={overrideValue ?? value}
                    onChange={event => {
                        setValue(event.target.value);
                        onChange(event);
                    }}
                    onDebouncedChange={onDebouncedChange}
                    onThrottledChange={onThrottledChange}
                />
            );
        };
        const { rerender } = render(<Controlled initialValue="Начальное" />);
        fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Текст' } });
        expect(screen.getByRole('textbox')).toHaveValue('Текст');
        advanceTime(2000);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onDebouncedChange).toHaveBeenCalledTimes(1);
        expect(onThrottledChange).toHaveBeenCalledTimes(1);
        vi.clearAllMocks();
        rerender(<Controlled initialValue="Начальное" overrideValue="Программное" />);
        advanceTime(2000);
        expect(screen.getByRole('textbox')).toHaveValue('Программное');
        expect(onChange).not.toHaveBeenCalled();
        expect(onDebouncedChange).not.toHaveBeenCalled();
        expect(onThrottledChange).not.toHaveBeenCalled();
    });

    test('работает с defaultValue и другими нативными типами поля', () => {
        const onDebouncedChange = vi.fn<ChangeEventHandler<HTMLInputElement>>();
        render(<TextInput type="number" defaultValue={10} onDebouncedChange={onDebouncedChange} />);
        const element = screen.getByRole('spinbutton');
        expect(element).toHaveValue(10);
        fireEvent.input(element, { target: { value: '20' } });
        advanceTime(2000);
        expect(element).toHaveValue(20);
        expect(onDebouncedChange).toHaveBeenCalledTimes(1);
        expect(onDebouncedChange.mock.calls[0][0].target.value).toBe('20');
    });

    test('ожидающее событие отражает актуальное значение DOM при выполнении', () => {
        const values: Array<string> = [];
        const onDebouncedChange = vi.fn((event: ChangeEvent<HTMLInputElement>) => {
            values.push(event.target.value);
        });
        const callbacks = { onChange: vi.fn(), onDebouncedChange };
        const { rerender } = render(<TextInput {...callbacks} value="Начальное" />);
        fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Ввод' } });
        rerender(<TextInput {...callbacks} value="Программное" />);
        advanceTime(2000);
        expect(values).toEqual(['Программное']);
    });

    test('размонтирование внутри onChange завершает debounce и отменяет throttle', () => {
        let unmountComponent: () => void = () => undefined;
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const { unmount } = render(
            <TextInput
                onChange={() => unmountComponent()}
                onDebouncedChange={onDebouncedChange}
                onThrottledChange={onThrottledChange}
            />
        );
        unmountComponent = unmount;
        fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Текст' } });
        expect(onDebouncedChange).toHaveBeenCalledTimes(1);
        expect(onThrottledChange).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    test('layout-размонтирование использует обработчик из последнего рендера', () => {
        const first = vi.fn();
        const latest = vi.fn();
        const Parent = ({ updated }: { updated: boolean }): JSX.Element | null => {
            const [visible, setVisible] = useState(true);

            useLayoutEffect(() => {
                if (updated) {
                    setVisible(false);
                }
            }, [updated]);

            return visible ? <TextInput onDebouncedChange={updated ? latest : first} /> : null;
        };
        const { rerender } = render(<Parent updated={false} />);
        fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Текст' } });
        rerender(<Parent updated />);
        expect(first).not.toHaveBeenCalled();
        expect(latest).toHaveBeenCalledTimes(1);
        expect(vi.getTimerCount()).toBe(0);
    });
});
