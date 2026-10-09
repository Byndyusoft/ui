import React, { ChangeEvent, ChangeEventHandler, useLayoutEffect, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import TextArea from './TextArea';
import { ITextAreaEnvironment, setupTextAreaEnvironment } from './hooks/__tests__/textAreaEnvironment';

function advanceTime(milliseconds: number): void {
    act(() => {
        vi.advanceTimersByTime(milliseconds);
    });
}

describe('components/TextArea: отложенные коллбеки', () => {
    let environment: ITextAreaEnvironment;

    beforeEach(() => {
        vi.useFakeTimers();
        environment = setupTextAreaEnvironment();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    test('передаёт исходное React-событие и исключает служебные пропсы из DOM', () => {
        let lastEvent: ChangeEvent<HTMLTextAreaElement> | undefined;
        const onChange = vi.fn((event: ChangeEvent<HTMLTextAreaElement>) => {
            lastEvent = event;
        });
        const onDebouncedChange = vi.fn<ChangeEventHandler<HTMLTextAreaElement>>();
        const onThrottledChange = vi.fn<ChangeEventHandler<HTMLTextAreaElement>>();
        render(
            <TextArea
                onChange={onChange}
                onDebouncedChange={onDebouncedChange}
                debounceDelay={200}
                onThrottledChange={onThrottledChange}
                throttleDelay={100}
            />
        );
        const element = screen.getByRole('textbox');
        fireEvent.input(element, { target: { value: 'Текст' } });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onDebouncedChange).not.toHaveBeenCalled();
        expect(onThrottledChange).not.toHaveBeenCalled();
        advanceTime(100);
        expect(onThrottledChange).toHaveBeenCalledExactlyOnceWith(lastEvent);
        advanceTime(100);
        expect(onDebouncedChange).toHaveBeenCalledExactlyOnceWith(lastEvent);
        expect(lastEvent?.currentTarget).toBeNull();

        ['onDebouncedChange', 'debounceDelay', 'onThrottledChange', 'throttleDelay'].forEach(prop => {
            expect(element).not.toHaveAttribute(prop);
        });
    });

    test('изменение value через пропсы пересчитывает высоту и не запускает коллбеки', () => {
        const onChange = vi.fn();
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const callbacks = { onChange, onDebouncedChange, onThrottledChange };
        const { rerender } = render(<TextArea {...callbacks} value="Начальное" withAutoHeight />);
        environment.layout.contentHeight = 100;
        rerender(<TextArea {...callbacks} value="Программное изменение" withAutoHeight />);
        act(() => {
            vi.runAllTimers();
        });

        expect(screen.getByRole('textbox')).toHaveStyle({ height: '100px' });
        expect(onChange).not.toHaveBeenCalled();
        expect(onDebouncedChange).not.toHaveBeenCalled();
        expect(onThrottledChange).not.toHaveBeenCalled();
    });

    test('авто-высота, debounce и throttle совместно работают в uncontrolled-режиме', () => {
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        render(
            <TextArea
                defaultValue="Начальное"
                withAutoHeight
                onDebouncedChange={onDebouncedChange}
                debounceDelay={200}
                onThrottledChange={onThrottledChange}
                throttleDelay={100}
            />
        );
        const element = screen.getByRole('textbox');
        environment.layout.contentHeight = 120;
        fireEvent.input(element, { target: { value: 'Новый текст' } });
        act(environment.flushFrames);
        expect(element).toHaveStyle({ height: '120px' });
        expect(element).toHaveValue('Новый текст');
        advanceTime(200);
        expect(onThrottledChange).toHaveBeenCalledTimes(1);
        expect(onDebouncedChange).toHaveBeenCalledTimes(1);
    });

    test('авто-высота и коллбеки совместно работают в controlled-режиме', () => {
        const onChange = vi.fn();
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const Controlled = (): JSX.Element => {
            const [value, setValue] = useState('');

            return (
                <TextArea
                    value={value}
                    onChange={event => {
                        setValue(event.target.value);
                        onChange(event);
                    }}
                    onDebouncedChange={onDebouncedChange}
                    onThrottledChange={onThrottledChange}
                    withAutoHeight
                />
            );
        };
        render(<Controlled />);
        const element = screen.getByRole('textbox');
        environment.layout.contentHeight = 100;
        fireEvent.input(element, { target: { value: 'Текст' } });
        expect(element).toHaveValue('Текст');
        expect(element).toHaveStyle({ height: '100px' });
        advanceTime(2000);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onThrottledChange).toHaveBeenCalledTimes(1);
        expect(onDebouncedChange).toHaveBeenCalledTimes(1);
    });

    test('ожидающее событие содержит актуальное значение DOM при выполнении', () => {
        const values: Array<string> = [];
        const onDebouncedChange = vi.fn((event: ChangeEvent<HTMLTextAreaElement>) => {
            values.push(event.target.value);
        });
        const { rerender } = render(
            <TextArea value="Начальное" onChange={() => undefined} onDebouncedChange={onDebouncedChange} />
        );
        fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Ввод пользователя' } });
        rerender(<TextArea value="Программное" onChange={() => undefined} onDebouncedChange={onDebouncedChange} />);
        advanceTime(2000);

        expect(values).toEqual(['Программное']);
        expect(onDebouncedChange).toHaveBeenCalledTimes(1);
    });

    test('синхронное размонтирование внутри onChange завершает debounce и отменяет throttle', () => {
        let unmountComponent: () => void = () => undefined;
        const onDebouncedChange = vi.fn();
        const onThrottledChange = vi.fn();
        const { unmount } = render(
            <TextArea
                onChange={() => unmountComponent()}
                onDebouncedChange={onDebouncedChange}
                onThrottledChange={onThrottledChange}
            />
        );
        unmountComponent = unmount;
        fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Текст' } });
        act(() => {
            vi.runAllTimers();
        });

        expect(onDebouncedChange).toHaveBeenCalledTimes(1);
        expect(onThrottledChange).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });

    test('layout-размонтирование родителем использует обработчик из последнего рендера', () => {
        const first = vi.fn();
        const latest = vi.fn();
        const Parent = ({ updated }: { updated: boolean }): JSX.Element | null => {
            const [visible, setVisible] = useState(true);

            useLayoutEffect(() => {
                if (updated) {
                    setVisible(false);
                }
            }, [updated]);

            return visible ? <TextArea onDebouncedChange={updated ? latest : first} /> : null;
        };
        const { rerender } = render(<Parent updated={false} />);
        fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Текст' } });
        rerender(<Parent updated />);

        expect(first).not.toHaveBeenCalled();
        expect(latest).toHaveBeenCalledTimes(1);
        expect(vi.getTimerCount()).toBe(0);
    });

    test('повторное включение throttle не получает ввод до отключения обработчика', () => {
        const initial = vi.fn();
        const latest = vi.fn<ChangeEventHandler<HTMLTextAreaElement>>();
        const { rerender } = render(<TextArea onThrottledChange={initial} throttleDelay={100} />);
        const element = screen.getByRole('textbox');

        fireEvent.input(element, { target: { value: 'Устаревшее' } });
        advanceTime(50);
        rerender(<TextArea throttleDelay={100} />);

        expect(vi.getTimerCount()).toBe(0);

        rerender(<TextArea onThrottledChange={latest} throttleDelay={100} />);
        advanceTime(50);

        expect(initial).not.toHaveBeenCalled();
        expect(latest).not.toHaveBeenCalled();

        fireEvent.input(element, { target: { value: 'Новое' } });
        advanceTime(100);

        expect(latest).toHaveBeenCalledTimes(1);
        expect(latest.mock.calls[0][0].target.value).toBe('Новое');
    });
});
