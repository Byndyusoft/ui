import React, { MutableRefObject, useLayoutEffect, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import useResizeObserver from './useResizeObserver';
import { TResizeObserverCallback, TResizeObserverRefs } from './useResizeObserver.types';

interface IObserverMock {
    observe: ReturnType<typeof vi.fn>;
    unobserve: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    notify: (entries: Array<ResizeObserverEntry>) => void;
}

function createRefs(...elements: Array<Element | null>): Array<MutableRefObject<Element | null>> {
    return elements.map(element => ({ current: element }));
}

const createEntry = (target: Element): ResizeObserverEntry => ({
    target,
    contentRect: new DOMRectReadOnly(0, 0, 200, 100),
    borderBoxSize: [],
    contentBoxSize: [],
    devicePixelContentBoxSize: []
});

describe('hooks/useResizeObserver', () => {
    let instances: Array<IObserverMock>;
    let createObserver: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        instances = [];
        createObserver = vi.fn((callback: ResizeObserverCallback) => {
            const observe = vi.fn();
            const unobserve = vi.fn();
            const disconnect = vi.fn();
            const observer: ResizeObserver = { observe, unobserve, disconnect };

            instances.push({
                observe,
                unobserve,
                disconnect,
                notify: entries => callback(entries, observer)
            });

            return observer;
        });
        vi.stubGlobal('ResizeObserver', createObserver);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test('наблюдает за одним элементом и передаёт его нативную запись', () => {
        const element = document.createElement('div');
        const callback = vi.fn<TResizeObserverCallback>();
        const entry = createEntry(element);

        renderHook(() => useResizeObserver(createRefs(element), callback));
        act(() => instances[0].notify([entry]));

        expect(createObserver).toHaveBeenCalledTimes(1);
        expect(instances[0].observe).toHaveBeenCalledExactlyOnceWith(element);
        expect(callback).toHaveBeenCalledExactlyOnceWith([entry]);
        expect(callback.mock.calls[0][0][0]).toBe(entry);
    });

    test('наблюдает за DOM-элементом обычного useRef после первого монтирования', () => {
        const Component = (): JSX.Element => {
            const ref = useRef<HTMLDivElement>(null);
            useResizeObserver([ref], vi.fn());

            return (
                <div ref={ref} data-testid="observed">
                    Наблюдаемый элемент
                </div>
            );
        };
        render(<Component />);

        expect(instances[0].observe).toHaveBeenCalledExactlyOnceWith(screen.getByTestId('observed'));
    });

    test('отслеживает замену и удаление DOM-элемента при прежнем ref', () => {
        const callback = vi.fn();
        const Component = ({ variant }: { variant: 'first' | 'second' | null }): JSX.Element | null => {
            const ref = useRef<HTMLDivElement>(null);
            const refs = useRef([ref]).current;
            useResizeObserver(refs, callback);

            if (variant !== null) {
                return (
                    <div key={variant} ref={ref} data-testid="observed">
                        Наблюдаемый элемент
                    </div>
                );
            }

            return null;
        };
        const { rerender } = render(<Component variant="first" />);
        const first = screen.getByTestId('observed');
        rerender(<Component variant="second" />);
        const second = screen.getByTestId('observed');

        expect(instances[0].unobserve).toHaveBeenCalledExactlyOnceWith(first);
        expect(instances[0].observe).toHaveBeenLastCalledWith(second);
        act(() => instances[0].notify([createEntry(first), createEntry(second)]));
        expect(callback).toHaveBeenCalledExactlyOnceWith([createEntry(second)]);
        rerender(<Component variant={null} />);
        expect(instances[0].unobserve).toHaveBeenLastCalledWith(second);
        expect(createObserver).toHaveBeenCalledTimes(1);
    });

    test('сравнивает current при обновлении с прежним массивом refs', () => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        const refs = createRefs(null);
        const { rerender } = renderHook(() => useResizeObserver(refs, vi.fn()));
        expect(createObserver).not.toHaveBeenCalled();

        refs[0].current = first;
        rerender();
        expect(instances[0].observe).toHaveBeenCalledExactlyOnceWith(first);
        refs[0].current = second;
        rerender();
        expect(instances[0].unobserve).toHaveBeenCalledExactlyOnceWith(first);
        expect(instances[0].observe).toHaveBeenLastCalledWith(second);
        refs[0].current = null;
        rerender();
        expect(instances[0].unobserve).toHaveBeenLastCalledWith(second);
        expect(createObserver).toHaveBeenCalledTimes(1);
    });

    test('подписывается до layout-эффекта потребителя', () => {
        const element = document.createElement('div');
        const onLayout = vi.fn();

        renderHook(() => {
            useResizeObserver(createRefs(element), vi.fn());
            useLayoutEffect(() => {
                onLayout(instances[0]?.observe.mock.calls[0]?.[0]);
            }, []);
        });

        expect(onLayout).toHaveBeenCalledExactlyOnceWith(element);
    });

    test('использует новый обработчик уже в layout-эффекте потребителя', () => {
        const element = document.createElement('div');
        const entry = createEntry(element);
        const initialCallback = vi.fn();
        const nextCallback = vi.fn();
        const { rerender } = renderHook(
            ({ callback }) => {
                useResizeObserver(createRefs(element), callback);
                useLayoutEffect(() => {
                    instances[0]?.notify([entry]);
                }, [callback]);
            },
            { initialProps: { callback: initialCallback } }
        );

        rerender({ callback: nextCallback });

        expect(initialCallback).toHaveBeenCalledExactlyOnceWith([entry]);
        expect(nextCallback).toHaveBeenCalledExactlyOnceWith([entry]);
        expect(createObserver).toHaveBeenCalledTimes(1);
        expect(instances[0].observe).toHaveBeenCalledTimes(1);
    });

    test('обновляет набор элементов до уведомления в layout-эффекте потребителя', () => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        const firstEntry = createEntry(first);
        const secondEntry = createEntry(second);
        const callback = vi.fn();
        const { rerender } = renderHook(
            ({ targets }) => {
                useResizeObserver(createRefs(targets), callback);
                useLayoutEffect(() => {
                    instances[0]?.notify([firstEntry, secondEntry]);
                }, [targets]);
            },
            { initialProps: { targets: first } }
        );

        rerender({ targets: second });

        expect(callback.mock.calls).toEqual([[[firstEntry]], [[secondEntry]]]);
        expect(instances[0].unobserve).toHaveBeenCalledExactlyOnceWith(first);
        expect(instances[0].observe).toHaveBeenLastCalledWith(second);
    });

    test('отключает observer до layout-очистки потребителя', () => {
        const element = document.createElement('div');
        const callback = vi.fn();
        const onCleanup = vi.fn();
        const { unmount } = renderHook(() => {
            useResizeObserver(createRefs(element), callback);
            useLayoutEffect(
                () => () => {
                    onCleanup(instances[0].disconnect.mock.calls.length);
                    instances[0].notify([createEntry(element)]);
                },
                []
            );
        });

        unmount();

        expect(onCleanup).toHaveBeenCalledExactlyOnceWith(1);
        expect(callback).not.toHaveBeenCalled();
    });

    test('наблюдает за несколькими элементами одним observer и передаёт пакет записей', () => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        const callback = vi.fn();
        const entries = [createEntry(second), createEntry(first)];

        renderHook(() => useResizeObserver(createRefs(first, second), callback));
        act(() => instances[0].notify(entries));

        expect(createObserver).toHaveBeenCalledTimes(1);
        expect(instances[0].observe).toHaveBeenCalledTimes(2);
        expect(instances[0].observe).toHaveBeenCalledWith(first);
        expect(instances[0].observe).toHaveBeenCalledWith(second);
        expect(callback).toHaveBeenCalledExactlyOnceWith(entries);
    });

    test('игнорирует пустые current и дубликаты refs и элементов в массиве только для чтения', () => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        const [firstRef, secondRef] = createRefs(first, second);
        const refs = [...createRefs(null), firstRef, firstRef, ...createRefs(first), secondRef] as const;

        renderHook(() => useResizeObserver(refs, vi.fn()));

        expect(instances[0].observe).toHaveBeenCalledTimes(2);
    });

    test('не повторяет подписки при равном составе массива или изменении порядка', () => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        const callback = vi.fn();
        const { rerender } = renderHook(({ elements }) => useResizeObserver(createRefs(...elements), callback), {
            initialProps: { elements: [first, second] }
        });

        rerender({ elements: [first, second] });
        rerender({ elements: [second, first] });

        expect(createObserver).toHaveBeenCalledTimes(1);
        expect(instances[0].observe).toHaveBeenCalledTimes(2);
        expect(instances[0].unobserve).not.toHaveBeenCalled();
        expect(instances[0].disconnect).not.toHaveBeenCalled();
    });

    test('обновляет только добавленные и удалённые элементы', () => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        const third = document.createElement('div');
        const { rerender } = renderHook(({ elements }) => useResizeObserver(createRefs(...elements), vi.fn()), {
            initialProps: { elements: [first, second] }
        });

        rerender({ elements: [second, third] });

        expect(createObserver).toHaveBeenCalledTimes(1);
        expect(instances[0].unobserve).toHaveBeenCalledExactlyOnceWith(first);
        expect(instances[0].observe).toHaveBeenCalledTimes(3);
        expect(instances[0].observe).toHaveBeenLastCalledWith(third);
        expect(instances[0].disconnect).not.toHaveBeenCalled();
    });

    test('использует новый обработчик без изменения подписок', () => {
        const element = document.createElement('div');
        const initialCallback = vi.fn();
        const nextCallback = vi.fn();
        const { rerender } = renderHook(({ callback }) => useResizeObserver(createRefs(element), callback), {
            initialProps: { callback: initialCallback }
        });

        rerender({ callback: nextCallback });
        act(() => instances[0].notify([createEntry(element)]));

        expect(initialCallback).not.toHaveBeenCalled();
        expect(nextCallback).toHaveBeenCalledTimes(1);
        expect(createObserver).toHaveBeenCalledTimes(1);
        expect(instances[0].observe).toHaveBeenCalledTimes(1);
    });

    test('отфильтровывает ожидающие записи удалённых элементов', () => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        const callback = vi.fn();
        const { rerender } = renderHook(({ elements }) => useResizeObserver(createRefs(...elements), callback), {
            initialProps: { elements: [first, second] }
        });

        rerender({ elements: [second] });
        const secondEntry = createEntry(second);
        act(() => instances[0].notify([createEntry(first), secondEntry]));
        act(() => instances[0].notify([createEntry(first)]));

        expect(callback).toHaveBeenCalledExactlyOnceWith([secondEntry]);
    });

    test.each([{ refs: [] }, { refs: createRefs(null) }])('не создаёт observer для пустого набора: %s', ({ refs }) => {
        renderHook(() => useResizeObserver(refs, vi.fn()));

        expect(createObserver).not.toHaveBeenCalled();
    });

    test.each([{ refs: [] }, { refs: createRefs(null) }])('удаляет все подписки для пустого набора: %s', ({ refs }) => {
        const first = document.createElement('div');
        const second = document.createElement('div');
        const callback = vi.fn();
        const { rerender } = renderHook(({ targets }) => useResizeObserver(targets, callback), {
            initialProps: { targets: createRefs(first, second) as TResizeObserverRefs }
        });

        rerender({ targets: refs });
        act(() => instances[0].notify([createEntry(first), createEntry(second)]));

        expect(instances[0].unobserve).toHaveBeenCalledTimes(2);
        expect(callback).not.toHaveBeenCalled();

        rerender({ targets: createRefs(first) });
        act(() => instances[0].notify([createEntry(first)]));

        expect(createObserver).toHaveBeenCalledTimes(1);
        expect(instances[0].observe).toHaveBeenCalledTimes(3);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('начинает наблюдение после появления элемента', () => {
        const element = document.createElement('div');
        const { rerender } = renderHook(({ targets }) => useResizeObserver(targets, vi.fn()), {
            initialProps: { targets: createRefs(null) as TResizeObserverRefs }
        });

        expect(createObserver).not.toHaveBeenCalled();

        rerender({ targets: createRefs(element) });

        expect(instances[0].observe).toHaveBeenCalledExactlyOnceWith(element);
    });

    test('отключается и игнорирует ожидающие уведомления после размонтирования', () => {
        const element = document.createElement('div');
        const callback = vi.fn();
        const { unmount } = renderHook(() => useResizeObserver(createRefs(element), callback));

        unmount();
        act(() => instances[0].notify([createEntry(element)]));

        expect(instances[0].disconnect).toHaveBeenCalledTimes(1);
        expect(callback).not.toHaveBeenCalled();
    });

    test('работает при отсутствии ResizeObserver', () => {
        const element = document.createElement('div');
        const callback = vi.fn();
        vi.stubGlobal('ResizeObserver', undefined);

        const { unmount } = renderHook(() => useResizeObserver(createRefs(element), callback));
        unmount();

        expect(createObserver).not.toHaveBeenCalled();
        expect(callback).not.toHaveBeenCalled();
    });
});
