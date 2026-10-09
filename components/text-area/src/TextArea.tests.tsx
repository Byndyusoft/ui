/* eslint-disable react/forbid-component-props -- Проверяем inline-стили, входящие в API TextArea. */
import React, { createRef, useLayoutEffect, useRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import TextArea from './TextArea';
import { ITextAreaEnvironment, setupTextAreaEnvironment } from './hooks/__tests__/textAreaEnvironment';

describe('components/TextArea', () => {
    let environment: ITextAreaEnvironment;

    beforeEach(() => {
        environment = setupTextAreaEnvironment();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    test('сохраняет нативные атрибуты и стили при выключенной по умолчанию авто-высоте', () => {
        render(
            <TextArea
                aria-label="Description"
                className="custom"
                rows={4}
                isDisabled
                style={{ height: 80, overflowY: 'scroll', resize: 'vertical' }}
            />
        );
        const element = screen.getByRole('textbox');

        expect(element).toHaveAttribute('rows', '4');
        expect(element).toHaveClass('custom');
        expect(element).toBeDisabled();
        expect(element).toHaveStyle({ height: '80px', overflowY: 'scroll', resize: 'vertical' });
        expect(environment.observers).toHaveLength(0);
    });

    test('поддерживает объектный ref и сохраняет фокус, выделение и элемент при вводе', () => {
        const ref = createRef<HTMLTextAreaElement>();
        const { unmount } = render(
            <TextArea ref={ref} aria-label="Description" defaultValue="Initial text" withAutoHeight />
        );
        const element = screen.getByRole('textbox');
        ref.current?.focus();
        ref.current?.setSelectionRange(1, 4);
        environment.layout.contentHeight = 100;
        fireEvent.input(element);
        act(environment.flushFrames);

        expect(ref.current).toBe(element);
        expect(element).toHaveFocus();
        expect(ref.current?.selectionStart).toBe(1);
        expect(ref.current?.selectionEnd).toBe(4);
        expect(element).toHaveStyle({ height: '100px' });
        expect(element).toHaveValue('Initial text');
        unmount();
        expect(ref.current).toBeNull();
    });

    test('передаёт элемент в callback-ref и очищает ref при размонтировании', () => {
        const first = vi.fn();
        const second = vi.fn();
        const { rerender, unmount } = render(<TextArea ref={first} withAutoHeight />);
        const element = screen.getByRole('textbox');

        expect(first).toHaveBeenCalledExactlyOnceWith(element);
        rerender(<TextArea ref={first} rows={3} withAutoHeight />);
        expect(first).toHaveBeenCalledExactlyOnceWith(element);
        rerender(<TextArea ref={second} withAutoHeight />);
        expect(first).toHaveBeenLastCalledWith(null);
        expect(second).toHaveBeenLastCalledWith(element);
        expect(screen.getByRole('textbox')).toBe(element);
        unmount();
        expect(second).toHaveBeenLastCalledWith(null);
    });

    test('предоставляет DOM-элемент родительскому layout-эффекту при первом монтировании', () => {
        const onMount = vi.fn();
        const Parent = (): JSX.Element => {
            const ref = useRef<HTMLTextAreaElement>(null);

            useLayoutEffect(() => {
                onMount(ref.current);
                ref.current?.focus();
            }, []);

            return <TextArea ref={ref} withAutoHeight />;
        };
        const { unmount } = render(<Parent />);
        const element = screen.getByRole('textbox');

        expect(onMount).toHaveBeenCalledExactlyOnceWith(element);
        expect(element).toHaveFocus();
        unmount();
    });

    test('синхронно пересчитывает высоту при изменении value без вызова onChange', () => {
        const onChange = vi.fn();
        const { rerender } = render(<TextArea value="Initial" onChange={onChange} withAutoHeight />);
        environment.layout.contentHeight = 120;
        rerender(<TextArea value="Updated" onChange={onChange} withAutoHeight />);

        expect(screen.getByRole('textbox')).toHaveValue('Updated');
        expect(screen.getByRole('textbox')).toHaveStyle({ height: '120px' });
        expect(onChange).not.toHaveBeenCalled();
        environment.layout.contentHeight = 20;
        rerender(<TextArea value="" onChange={onChange} withAutoHeight />);
        expect(screen.getByRole('textbox')).toHaveStyle({ height: '40px' });
    });

    test('сохраняет нативные onChange и onInput при неуправляемом вводе', () => {
        const onChange = vi.fn();
        const onInput = vi.fn();
        render(<TextArea defaultValue="Initial" onChange={onChange} onInput={onInput} withAutoHeight />);
        environment.layout.contentHeight = 100;
        fireEvent.input(screen.getByRole('textbox'), { target: { value: 'Updated' } });
        act(environment.flushFrames);

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onInput).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('textbox')).toHaveValue('Updated');
        expect(screen.getByRole('textbox')).toHaveStyle({ height: '100px' });
    });

    test('пересчитывает rows и стили, не передавая withAutoHeight в DOM', () => {
        const { rerender } = render(<TextArea rows={3} withAutoHeight />);

        expect(screen.getByRole('textbox')).toHaveStyle({ height: '60px' });
        expect(screen.getByRole('textbox')).not.toHaveAttribute('withAutoHeight');
        rerender(<TextArea rows={4} style={{ minHeight: 100 }} withAutoHeight />);
        expect(screen.getByRole('textbox')).toHaveStyle({ height: '100px' });
        expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
    });

    test('восстанавливает актуальные пользовательские стили при выключении авто-высоты', () => {
        const { rerender } = render(<TextArea style={{ height: 80, resize: 'vertical' }} withAutoHeight />);
        rerender(<TextArea style={{ height: 120, overflowY: 'scroll', resize: 'both' }} />);

        expect(screen.getByRole('textbox')).toHaveStyle({ height: '120px', overflowY: 'scroll', resize: 'both' });
        expect(environment.observers[0].unobserve).toHaveBeenCalledTimes(1);
    });

    test('восстанавливает сокращённый overflow и явно заданную горизонтальную прокрутку', () => {
        const { rerender } = render(<TextArea style={{ overflow: 'hidden', overflowX: 'scroll' }} withAutoHeight />);
        rerender(<TextArea style={{ overflow: 'hidden', overflowX: 'scroll' }} />);

        expect(screen.getByRole('textbox')).toHaveStyle({ overflow: 'hidden', overflowX: 'scroll' });
    });
});
