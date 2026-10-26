/* eslint-disable testing-library/no-node-access -- The contenteditable schema and DOM ref are part of the contract. */
/* eslint-disable no-script-url -- Unsafe URL fixture verifies rejection. */
import React, { createRef, useState, useLayoutEffect, FocusEvent } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Editor } from '@tiptap/core';
import TextEditor from './index';
import { ALL_TOOLS } from './utilities/markdown';

function instance(): Editor {
    return Reflect.get(screen.getByRole('textbox'), 'editor') as Editor;
}
function insert(text: string): void {
    act(() => {
        instance().commands.insertContent(text);
    });
}
function paste(html: string, text = ''): void {
    fireEvent.paste(screen.getByRole('textbox'), {
        clipboardData: { getData: (type: string) => (type === 'text/html' ? html : text) }
    });
}

describe('TextEditor', () => {
    it('mounts with React 17, exposes the actual div and cleans the ref', () => {
        const ref = createRef<HTMLDivElement>();
        const onChange = vi.fn();
        const onFocus = vi.fn<(event: FocusEvent<HTMLDivElement>) => void>();
        const onBlur = vi.fn();
        const { unmount } = render(
            <TextEditor
                ref={ref}
                defaultValue="**начало**"
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                id="editor"
                className="custom"
                style={{ minHeight: 120 }}
                aria-label="Текст"
                data-field="description"
            />
        );
        const region = screen.getByRole('textbox', { name: 'Текст' });
        expect(ref.current).toBe(region);
        expect(region).toHaveAttribute('contenteditable', 'true');
        expect(region).toHaveAttribute('data-field', 'description');
        expect(region).toHaveClass('custom');
        expect(region).toHaveStyle({ minHeight: '120px' });
        expect(region.querySelector('strong')).toHaveTextContent('начало');
        fireEvent.focus(region);
        fireEvent.blur(region);
        expect(onFocus.mock.calls[0][0].target).toBe(region);
        expect(onBlur).toHaveBeenCalledOnce();
        expect(onChange).not.toHaveBeenCalled();
        unmount();
        expect(ref.current).toBeNull();
    });
    it('sets and clears callback refs across remounts', () => {
        const ref = vi.fn();
        const view = render(<TextEditor ref={ref} />);
        expect(ref).toHaveBeenLastCalledWith(screen.getByRole('textbox'));
        view.unmount();
        expect(ref).toHaveBeenLastCalledWith(null);
        const { unmount } = render(<TextEditor ref={ref} />);
        expect(ref).toHaveBeenLastCalledWith(screen.getByRole('textbox'));
        unmount();
    });
    it('keeps selection and history on a controlled echo', () => {
        function Controlled(): React.ReactElement {
            const [value, setValue] = useState('начало');
            return <TextEditor value={value} onChange={setValue} />;
        }
        render(<Controlled />);
        act(() => {
            instance().commands.setTextSelection(4);
        });
        insert('X');
        expect(screen.getByRole('textbox')).toHaveTextContent('начXало');
        expect(instance().state.selection.from).toBe(5);
        act(() => {
            instance().commands.undo();
        });
        expect(screen.getByRole('textbox')).toHaveTextContent('начало');
    });
    it('replaces external value without notifications and starts new history', () => {
        const onChange = vi.fn();
        const { rerender } = render(<TextEditor value="начало" onChange={onChange} />);
        insert('x');
        onChange.mockClear();
        rerender(<TextEditor value="новое" onChange={onChange} />);
        expect(screen.getByRole('textbox')).toHaveTextContent('новое');
        act(() => {
            instance().commands.undo();
        });
        expect(screen.getByRole('textbox')).toHaveTextContent('новое');
        expect(onChange).not.toHaveBeenCalled();
    });
    it('ignores subsequent defaultValue and exposes placeholder', () => {
        const { rerender } = render(<TextEditor defaultValue="первое" />);
        rerender(<TextEditor defaultValue="второе" />);
        expect(screen.getByRole('textbox')).toHaveTextContent('первое');
        rerender(<TextEditor value="" placeholder="Начните ввод" />);
        expect(screen.getByRole('textbox').querySelector('p')).toHaveAttribute('data-placeholder', 'Начните ввод');
    });
    it.each([false, true])('prevents changes in disabled/read-only, disabled=%s', disabled => {
        const onChange = vi.fn();
        const { rerender } = render(<TextEditor value="текст" isReadOnly isDisabled={disabled} onChange={onChange} />);
        const region = screen.getByRole('textbox');
        expect(region).toHaveAttribute('contenteditable', 'false');
        expect(region.tabIndex).toBe(disabled ? -1 : 0);
        insert('попытка');
        paste('<b>вставка</b>');
        expect(region).toHaveTextContent('текст');
        rerender(<TextEditor value="замена" isReadOnly isDisabled={disabled} onChange={onChange} />);
        expect(region).toHaveTextContent('замена');
        expect(onChange).not.toHaveBeenCalled();
    });
    it('normalizes tools, preserving existing formatting and DOM identity', () => {
        const { rerender } = render(<TextEditor defaultValue={'# заголовок\n\n**жирный**'} />);
        expect(screen.getAllByRole('button').map(button => button.getAttribute('aria-label'))).toEqual([
            'Жирный',
            'Курсив',
            'Подчёркнутый',
            'Зачёркнутый'
        ]);
        const region = screen.getByRole('textbox');
        rerender(<TextEditor tools={['link', 'bold', 'link']} />);
        expect(screen.getAllByRole('button').map(button => button.getAttribute('aria-label'))).toEqual([
            'Ссылка',
            'Жирный'
        ]);
        rerender(<TextEditor tools={[]} />);
        expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBe(region);
        expect(region.querySelector('h1')).toHaveTextContent('заголовок');
        expect(region.querySelector('strong')).toHaveTextContent('жирный');
    });
    it('applies toolbar formatting and reports a Markdown snapshot', () => {
        const onChange = vi.fn();
        render(<TextEditor defaultValue="текст" onChange={onChange} />);
        act(() => {
            instance().commands.selectAll();
        });
        fireEvent.click(screen.getByRole('button', { name: 'Жирный' }));
        expect(onChange).toHaveBeenLastCalledWith('**текст**');
        expect(screen.getByRole('button', { name: 'Жирный' })).toHaveAttribute('aria-pressed', 'true');
    });
    it('opens, validates, applies and removes a link without submitting the form', () => {
        const submit = vi.fn();
        render(
            <form onSubmit={submit}>
                <TextEditor tools={ALL_TOOLS} defaultValue="текст" />
            </form>
        );
        act(() => {
            instance().commands.selectAll();
        });
        fireEvent.click(screen.getByRole('button', { name: 'Ссылка' }));
        const url = screen.getByRole('textbox', { name: 'Адрес ссылки' });
        fireEvent.change(url, { target: { value: 'javascript:alert(1)' } });
        fireEvent.click(screen.getByRole('button', { name: 'Применить ссылку' }));
        expect(screen.getByRole('alert')).toBeInTheDocument();
        fireEvent.change(url, { target: { value: '/article' } });
        fireEvent.keyDown(url, { key: 'Enter' });
        expect(screen.getByRole('link')).toHaveAttribute('href', '/article');
        fireEvent.click(screen.getByRole('button', { name: 'Ссылка' }));
        fireEvent.click(screen.getByRole('button', { name: 'Удалить ссылку' }));
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(submit).not.toHaveBeenCalled();
    });
    it('closes link UI after tools change and supports cancel and toolbar arrows', () => {
        const { rerender } = render(<TextEditor tools={ALL_TOOLS} />);
        fireEvent.click(screen.getByRole('button', { name: 'Ссылка' }));
        fireEvent.keyDown(screen.getByRole('textbox', { name: 'Адрес ссылки' }), { key: 'Escape' });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        fireEvent.keyDown(screen.getByRole('button', { name: 'Жирный' }), { key: 'ArrowRight' });
        expect(screen.getByRole('button', { name: 'Курсив' })).toHaveFocus();
        fireEvent.click(screen.getByRole('button', { name: 'Ссылка' }));
        rerender(<TextEditor tools={[]} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    it('filters HTML paste and internal clipboard with one undo, preserving surrounding text', () => {
        render(<TextEditor defaultValue="**слева справа**" tools={['italic']} />);
        act(() => {
            instance().commands.setTextSelection(7);
        });
        paste('<p><strong>жирный</strong> <em>курсив</em> <u>подчёркнутый</u></p>');
        const region = screen.getByRole('textbox');
        expect(region.querySelector('em')).toHaveTextContent('курсив');
        expect(region.querySelectorAll('strong')).toHaveLength(2);
        expect(region.querySelector('u')).toBeNull();
        act(() => {
            instance().commands.undo();
        });
        expect(region).toHaveTextContent('слева справа');
        expect(region.querySelector('strong')).toHaveTextContent('слева справа');
    });
    it('uses the current tools for plain Markdown paste and flattens nested forbidden lists', () => {
        const { rerender } = render(<TextEditor tools={ALL_TOOLS} />);
        rerender(<TextEditor tools={['italic']} />);
        paste('', '# заголовок\n\n1. **первый**\n2. *второй*\n    - вложенный');
        const region = screen.getByRole('textbox');
        expect(region.querySelector('h1,ol,ul,strong')).toBeNull();
        expect(region).toHaveTextContent('заголовокпервыйвторойвложенный');
        expect(region.querySelector('em')).toHaveTextContent('второй');
    });
    it('blocks disabled shortcuts and creates a paragraph after a disabled heading', () => {
        render(<TextEditor defaultValue="# заголовок" tools={[]} />);
        act(() => {
            instance().commands.setTextSelection(10);
        });
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', code: 'Enter' });
        expect(screen.getByRole('textbox').querySelectorAll('h1')).toHaveLength(1);
        expect(screen.getByRole('textbox').querySelector('p')).not.toBeNull();
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'b', ctrlKey: true });
        insert('обычный');
        expect(screen.queryByRole('textbox')?.querySelector('strong')).toBeNull();
    });
    it('keeps formatting through undo/redo with empty tools', () => {
        render(<TextEditor defaultValue="++текст++" tools={[]} />);
        act(() => {
            instance().commands.setTextSelection(3);
        });
        insert('X');
        act(() => {
            instance().commands.undo();
        });
        expect(screen.getByRole('textbox').querySelector('u')).toHaveTextContent('текст');
        act(() => {
            instance().commands.redo();
        });
        expect(screen.getByRole('textbox').querySelector('u')).toHaveTextContent('теXкст');
    });
    it('submits current Markdown immediately and resets the uncontrolled field without callbacks', () => {
        const change = vi.fn();
        render(
            <form aria-label="Форма">
                <TextEditor name="body" defaultValue="начало" onChange={change} />
            </form>
        );
        insert('X');
        const form = screen.getByRole<HTMLFormElement>('form');
        expect(new FormData(form).get('body')).toBe('Xначало');
        change.mockClear();
        act(() => {
            form.reset();
        });
        expect(screen.getByRole('textbox')).toHaveTextContent('начало');
        expect(new FormData(form).get('body')).toBe('начало');
        expect(change).not.toHaveBeenCalled();
    });
    it('rebinds external forms and preserves controlled reset, disabled submission rules', () => {
        const { rerender } = render(
            <>
                <form id="first" />
                <form id="second" />
                <TextEditor name="body" form="first" value="значение" isReadOnly />
            </>
        );
        const first = document.getElementById('first') as HTMLFormElement;
        const second = document.getElementById('second') as HTMLFormElement;
        expect(new FormData(first).get('body')).toBe('значение');
        rerender(
            <>
                <form id="first" />
                <form id="second" />
                <TextEditor name="body" form="second" value="замена" isReadOnly />
            </>
        );
        act(() => {
            first.reset();
            second.reset();
        });
        expect(new FormData(first).get('body')).toBeNull();
        expect(new FormData(second).get('body')).toBe('замена');
        rerender(
            <>
                <form id="first" />
                <form id="second" />
                <TextEditor name="body" form="second" value="замена" isDisabled />
            </>
        );
        expect(new FormData(second).get('body')).toBeNull();
    });
});

describe('TextEditor notification lifecycle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });
    it('cancels stale queues on external replacement and reset', () => {
        const debounced = vi.fn();
        const throttled = vi.fn();
        const { rerender } = render(
            <form aria-label="reset">
                <TextEditor value="initial" name="body" onDebouncedChange={debounced} onThrottledChange={throttled} />
            </form>
        );
        insert('X');
        rerender(
            <form aria-label="reset">
                <TextEditor
                    value="replacement"
                    name="body"
                    onDebouncedChange={debounced}
                    onThrottledChange={throttled}
                />
            </form>
        );
        act(() => {
            vi.advanceTimersByTime(3000);
        });
        expect(debounced).not.toHaveBeenCalled();
        expect(throttled).not.toHaveBeenCalled();
        insert('Y');
        act(() => {
            screen.getByRole<HTMLFormElement>('form').reset();
            vi.advanceTimersByTime(3000);
        });
        expect(debounced).not.toHaveBeenCalled();
        expect(throttled).not.toHaveBeenCalled();
    });
    it('preserves pending notifications during echo and ignores focus, selection and tools', () => {
        const debounced = vi.fn();
        function Controlled(): React.ReactElement {
            const [value, setValue] = useState('');
            const [isFull, setFull] = useState(false);
            return (
                <>
                    <button type="button" onClick={() => setFull(!isFull)}>
                        tools
                    </button>
                    <TextEditor
                        value={value}
                        onChange={setValue}
                        tools={isFull ? ALL_TOOLS : []}
                        onDebouncedChange={debounced}
                        debounceDelay={100}
                    />
                </>
            );
        }
        render(<Controlled />);
        insert('X');
        act(() => {
            vi.advanceTimersByTime(50);
            instance().commands.setTextSelection(1);
        });
        fireEvent.focus(screen.getByRole('textbox'));
        fireEvent.click(screen.getByRole('button', { name: 'tools' }));
        act(() => {
            vi.advanceTimersByTime(50);
        });
        expect(debounced).toHaveBeenCalledExactlyOnceWith('X');
    });
    it('flushes the snapshot once when onChange synchronously unmounts the component', () => {
        const debounced = vi.fn();
        const throttled = vi.fn();
        function Form(): React.ReactElement {
            const [isOpen, setOpen] = useState(true);
            return isOpen ? (
                <TextEditor
                    onChange={() => setOpen(false)}
                    onDebouncedChange={debounced}
                    onThrottledChange={throttled}
                />
            ) : (
                <p>closed</p>
            );
        }
        render(<Form />);
        insert('snapshot');
        expect(debounced).toHaveBeenCalledExactlyOnceWith('snapshot');
        act(() => {
            vi.runAllTimers();
        });
        expect(debounced).toHaveBeenCalledOnce();
        expect(throttled).not.toHaveBeenCalled();
        expect(vi.getTimerCount()).toBe(0);
    });
    it('adds a hard break with Shift+Enter', () => {
        render(<TextEditor defaultValue="текст" />);
        act(() => {
            instance().commands.setTextSelection(3);
        });
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter', shiftKey: true });
        expect(screen.getByRole('textbox').querySelector('br')).not.toBeNull();
    });
});

it('updates active tools for stored marks without reporting a document change', () => {
    const change = vi.fn();
    render(<TextEditor onChange={change} />);
    fireEvent.click(screen.getByRole('button', { name: 'Жирный' }));
    expect(screen.getByRole('button', { name: 'Жирный' })).toHaveAttribute('aria-pressed', 'true');
    expect(change).not.toHaveBeenCalled();
    insert('text');
    expect(change).toHaveBeenLastCalledWith('**text**');
});

it('flushes the current callback when the parent removes the field from a layout effect', () => {
    const first = vi.fn();
    const latest = vi.fn();
    function Parent({ updated, hide }: { updated: boolean; hide: boolean }): React.ReactElement {
        const [isVisible, setVisible] = useState(true);
        useLayoutEffect(() => {
            if (hide) {
                setVisible(false);
            }
        }, [hide]);
        return isVisible ? <TextEditor onDebouncedChange={updated ? latest : first} /> : <p>closed</p>;
    }
    const { rerender } = render(<Parent updated={false} hide={false} />);
    insert('snapshot');
    rerender(<Parent updated hide />);
    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledExactlyOnceWith('snapshot');
});

it('unsubscribes from the previous external form in uncontrolled mode', () => {
    const { rerender } = render(
        <>
            <form id="old" />
            <form id="new" />
            <TextEditor form="old" defaultValue="start" />
        </>
    );
    insert('X');
    rerender(
        <>
            <form id="old" />
            <form id="new" />
            <TextEditor form="new" defaultValue="start" />
        </>
    );
    act(() => {
        (document.getElementById('old') as HTMLFormElement).reset();
    });
    expect(screen.getByRole('textbox')).toHaveTextContent('Xstart');
    act(() => {
        (document.getElementById('new') as HTMLFormElement).reset();
    });
    expect(screen.getByRole('textbox')).toHaveTextContent('start');
});

it('preserves editable-region styling when className changes', () => {
    const { rerender } = render(<TextEditor className="first" defaultValue="a  b" />);
    const region = screen.getByRole('textbox');
    const whitespace = getComputedStyle(region).whiteSpace;
    rerender(<TextEditor className="second" defaultValue="a  b" />);
    expect(screen.getByRole('textbox')).toBe(region);
    expect(region).toHaveClass('second');
    expect(getComputedStyle(region).whiteSpace).toBe(whitespace);
});
