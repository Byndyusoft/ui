import React, { ChangeEvent, createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TextArea from './TextArea';

describe('components/TextArea', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
        vi.useRealTimers();
    });

    test('рендерит textarea с переданными атрибутами', () => {
        render(<TextArea aria-label="Description" className="custom-class" placeholder="Type here" rows={4} />);

        const textArea = screen.getByLabelText('Description');

        expect(textArea).toBeInTheDocument();
        expect(textArea).toHaveClass('custom-class');
        expect(textArea).toHaveAttribute('placeholder', 'Type here');
        expect(textArea).toHaveAttribute('rows', '4');
    });

    test('использует prop isDisabled как disabled-атрибут', () => {
        render(<TextArea aria-label="Description" isDisabled />);

        expect(screen.getByLabelText('Description')).toBeDisabled();
    });

    test('вызывает onChange и onStopChanging после задержки', () => {
        const onChange = vi.fn();
        const onStopChanging = vi.fn();

        render(
            <TextArea
                aria-label="Description"
                changingDelay={300}
                onChange={onChange}
                onStopChanging={onStopChanging}
            />
        );

        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Text' } });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onStopChanging).not.toHaveBeenCalled();

        vi.advanceTimersByTime(300);

        expect(onStopChanging).toHaveBeenCalledTimes(1);
    });

    test('использует задержку изменения по умолчанию', () => {
        const onStopChanging = vi.fn();

        render(<TextArea aria-label="Description" onStopChanging={onStopChanging} />);

        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Text' } });

        vi.advanceTimersByTime(1999);

        expect(onStopChanging).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);

        expect(onStopChanging).toHaveBeenCalledTimes(1);
    });

    test('сбрасывает таймер остановки изменения при каждом изменении', () => {
        const onStopChanging = vi.fn((event: ChangeEvent<HTMLTextAreaElement>) => event.target.value);

        render(<TextArea aria-label="Description" changingDelay={300} onStopChanging={onStopChanging} />);

        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'First' } });
        vi.advanceTimersByTime(299);
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Second' } });
        vi.advanceTimersByTime(299);

        expect(onStopChanging).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);

        expect(onStopChanging).toHaveBeenCalledTimes(1);
        expect(onStopChanging).toHaveReturnedWith('Second');
    });

    test('вызывает onStopChanging с последним событием при размонтировании', () => {
        const onStopChanging = vi.fn((event: ChangeEvent<HTMLTextAreaElement>) => event.target.value);

        const { unmount } = render(
            <TextArea aria-label="Description" changingDelay={300} onStopChanging={onStopChanging} />
        );

        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Text' } });

        unmount();

        expect(onStopChanging).toHaveBeenCalledTimes(1);
        expect(onStopChanging).toHaveReturnedWith('Text');
    });

    test('устанавливает фокус через проброшенный ref', () => {
        const ref = createRef<HTMLTextAreaElement>();

        render(<TextArea aria-label="Description" ref={ref} />);

        ref.current?.focus();

        expect(screen.getByLabelText('Description')).toHaveFocus();
    });

    test('не сбрасывает выделение текста при фокусе', () => {
        const ref = createRef<HTMLTextAreaElement>();

        render(<TextArea aria-label="Description" ref={ref} defaultValue="Initial text" />);

        ref.current?.setSelectionRange(0, 7);
        ref.current?.focus();

        expect(ref.current?.selectionStart).toBe(0);
        expect(ref.current?.selectionEnd).toBe(7);
    });

    test('обновляет значение textarea при изменении prop value', () => {
        const { rerender } = render(<TextArea aria-label="Description" value="Initial" />);

        expect(screen.getByLabelText('Description')).toHaveValue('Initial');

        rerender(<TextArea aria-label="Description" value="Updated" />);

        expect(screen.getByLabelText('Description')).toHaveValue('Updated');
    });

    test('не меняет отображаемое значение в controlled-режиме без обновления prop value', () => {
        const onChange = vi.fn();

        render(<TextArea aria-label="Description" value="Initial" onChange={onChange} />);

        const textArea = screen.getByLabelText('Description');

        fireEvent.change(textArea, { target: { value: 'Changed' } });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(textArea).toHaveValue('Initial');
    });

    test('использует defaultValue в uncontrolled-режиме', () => {
        render(<TextArea aria-label="Description" defaultValue="Initial" />);

        expect(screen.getByLabelText('Description')).toHaveValue('Initial');
    });

    test('меняет отображаемое значение в uncontrolled-режиме', () => {
        render(<TextArea aria-label="Description" defaultValue="Initial" />);

        const textArea = screen.getByLabelText('Description');

        fireEvent.change(textArea, { target: { value: 'Changed' } });

        expect(textArea).toHaveValue('Changed');
    });

    test('устанавливает rows равным одному при включенной авто-высоте', () => {
        render(<TextArea aria-label="Description" rows={4} withAutoHeight />);

        expect(screen.getByLabelText('Description')).toHaveAttribute('rows', '1');
    });

    test('добавляет стили авто-высоты при включенной авто-высоте', () => {
        render(<TextArea aria-label="Description" className="custom-class" withAutoHeight />);

        const textArea = screen.getByLabelText('Description');

        expect(textArea).toHaveClass('custom-class');
        expect(textArea).toHaveStyle({
            overflowX: 'hidden',
            resize: 'none'
        });
    });

    test('устанавливает авто-высоту по scrollHeight', () => {
        vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(40);

        render(<TextArea aria-label="Description" minHeight={20} value="Text" withAutoHeight />);

        expect(screen.getByLabelText('Description')).toHaveStyle({ height: '40px' });
    });

    test('устанавливает авто-высоту по minHeight, когда scrollHeight меньше', () => {
        vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(10);

        render(<TextArea aria-label="Description" minHeight={20} value="Text" withAutoHeight />);

        expect(screen.getByLabelText('Description')).toHaveStyle({ height: '20px' });
    });

    test('не наследует высоту родителя перед измерением авто-высоты', () => {
        vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockImplementation(function getScrollHeight(
            this: HTMLTextAreaElement
        ) {
            // eslint-disable-next-line no-invalid-this
            return this.style.height === 'inherit' ? 80 : 40;
        });

        render(<TextArea aria-label="Description" minHeight={20} value="Text" withAutoHeight />);

        expect(screen.getByLabelText('Description')).toHaveStyle({ height: '40px' });
    });

    test('скрывает вертикальный overflow, когда контент авто-высоты помещается', () => {
        vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(40);
        vi.spyOn(HTMLTextAreaElement.prototype, 'clientHeight', 'get').mockReturnValue(40);

        render(<TextArea aria-label="Description" value="Text" withAutoHeight />);

        expect(screen.getByLabelText('Description')).toHaveStyle({ overflowY: 'hidden' });
    });

    test('разрешает вертикальную прокрутку, когда контент авто-высоты ограничен', () => {
        vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(80);
        vi.spyOn(HTMLTextAreaElement.prototype, 'clientHeight', 'get').mockReturnValue(40);

        render(<TextArea aria-label="Description" value="Text" withAutoHeight />);

        expect(screen.getByLabelText('Description')).toHaveStyle({ overflowY: 'auto' });
    });

    test('обновляет авто-высоту при изменении размера textarea', () => {
        let scrollHeight = 40;
        const observe = vi.fn();
        const disconnect = vi.fn();
        const cancelAnimationFrame = vi.fn();
        let resizeObserverCallback: ResizeObserverCallback | undefined;
        let animationFrameCallback: FrameRequestCallback | undefined;

        vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockImplementation(() => scrollHeight);
        vi.spyOn(HTMLTextAreaElement.prototype, 'clientHeight', 'get').mockImplementation(() => scrollHeight);
        vi.stubGlobal(
            'requestAnimationFrame',
            vi.fn((callback: FrameRequestCallback) => {
                animationFrameCallback = callback;

                return 1;
            })
        );
        vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrame);
        vi.stubGlobal(
            'ResizeObserver',
            vi.fn((callback: ResizeObserverCallback) => {
                resizeObserverCallback = callback;

                return {
                    disconnect,
                    observe,
                    unobserve: vi.fn()
                };
            })
        );

        render(<TextArea aria-label="Description" value="Text" withAutoHeight />);

        const textArea = screen.getByLabelText('Description');

        expect(observe).toHaveBeenCalledWith(textArea);
        expect(textArea).toHaveStyle({ height: '40px' });

        scrollHeight = 80;
        resizeObserverCallback?.([], {} as ResizeObserver);
        resizeObserverCallback?.([], {} as ResizeObserver);

        expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
        expect(textArea).toHaveStyle({ height: '40px' });

        animationFrameCallback?.(0);

        expect(textArea).toHaveStyle({ height: '80px' });
        expect(disconnect).not.toHaveBeenCalled();
        expect(cancelAnimationFrame).not.toHaveBeenCalled();
    });
});
