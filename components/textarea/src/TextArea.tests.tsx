import React, { ChangeEvent, createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TextArea from './TextArea';

describe('components/TextArea', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    test('renders textarea with passed attributes', () => {
        render(<TextArea aria-label="Description" className="custom-class" placeholder="Type here" rows={4} />);

        const textArea = screen.getByLabelText('Description');

        expect(textArea).toBeInTheDocument();
        expect(textArea).toHaveClass('custom-class');
        expect(textArea).toHaveAttribute('placeholder', 'Type here');
        expect(textArea).toHaveAttribute('rows', '4');
    });

    test('uses isDisabled prop as disabled attribute', () => {
        render(<TextArea aria-label="Description" isDisabled />);

        expect(screen.getByLabelText('Description')).toBeDisabled();
    });

    test('calls onChange and onStopChanging after delay', () => {
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

    test('uses default changing delay', () => {
        const onStopChanging = vi.fn();

        render(<TextArea aria-label="Description" onStopChanging={onStopChanging} />);

        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Text' } });

        vi.advanceTimersByTime(1999);

        expect(onStopChanging).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);

        expect(onStopChanging).toHaveBeenCalledTimes(1);
    });

    test('resets stop changing timer on each change', () => {
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

    test('calls onStopChanging with latest event on unmount', () => {
        const onStopChanging = vi.fn((event: ChangeEvent<HTMLTextAreaElement>) => event.target.value);

        const { unmount } = render(
            <TextArea aria-label="Description" changingDelay={300} onStopChanging={onStopChanging} />
        );

        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Text' } });

        unmount();

        expect(onStopChanging).toHaveBeenCalledTimes(1);
        expect(onStopChanging).toHaveReturnedWith('Text');
    });

    test('sets focus through forwarded ref', () => {
        const ref = createRef<HTMLTextAreaElement>();

        render(<TextArea aria-label="Description" ref={ref} />);

        ref.current?.focus();

        expect(screen.getByLabelText('Description')).toHaveFocus();
    });

    test('updates textarea value when value prop changes', () => {
        const { rerender } = render(<TextArea aria-label="Description" value="Initial" />);

        expect(screen.getByLabelText('Description')).toHaveValue('Initial');

        rerender(<TextArea aria-label="Description" value="Updated" />);

        expect(screen.getByLabelText('Description')).toHaveValue('Updated');
    });

    test('sets rows to one when auto height is enabled', () => {
        render(<TextArea aria-label="Description" rows={4} withAutoHeight />);

        expect(screen.getByLabelText('Description')).toHaveAttribute('rows', '1');
    });

    test('adds auto height styles when auto height is enabled', () => {
        render(<TextArea aria-label="Description" className="custom-class" withAutoHeight />);

        const textArea = screen.getByLabelText('Description');

        expect(textArea).toHaveClass('custom-class');
        expect(textArea).toHaveStyle({
            overflow: 'hidden',
            resize: 'none'
        });
    });

    test('sets auto height from scroll height', () => {
        vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(40);

        render(<TextArea aria-label="Description" minHeight={20} value="Text" withAutoHeight />);

        expect(screen.getByLabelText('Description')).toHaveStyle({ height: '40px' });
    });

    test('sets auto height from min height when scroll height is lower', () => {
        vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(10);

        render(<TextArea aria-label="Description" minHeight={20} value="Text" withAutoHeight />);

        expect(screen.getByLabelText('Description')).toHaveStyle({ height: '20px' });
    });
});
