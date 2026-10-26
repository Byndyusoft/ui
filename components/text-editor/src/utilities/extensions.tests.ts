import { Editor } from '@tiptap/core';
import { createExtensions, IEditorPermissions } from './extensions';
import { ALL_TOOLS } from './markdown';
import { TTextEditorTool } from '../TextEditor.types';

function typeText(editor: Editor, text: string): void {
    for (const character of text) {
        const { view } = editor;
        const { from, to } = view.state.selection;
        const handled = view.someProp('handleTextInput', handler =>
            handler(view, from, to, character, () => view.state.tr.insertText(character, from, to))
        );
        if (!handled) {
            view.dispatch(view.state.tr.insertText(character, from, to));
        }
    }
}

describe('tool permissions', () => {
    let editor: Editor;
    const cases: Array<[TTextEditorTool, string, string]> = [
        ['bold', '**текст**', '<strong>'],
        ['italic', '*текст*', '<em>'],
        ['underline', '++текст++', '<u>'],
        ['strike', '~~текст~~', '<s>'],
        ['heading', '# ', '<h1>'],
        ['orderedList', '1. ', '<ol>'],
        ['bulletList', '- ', '<ul>']
    ];
    afterEach(() => editor?.destroy());
    it.each(cases)('guards input rules dynamically: %s', (tool, source, tag) => {
        const permissions: { current: IEditorPermissions } = {
            current: { tools: [], editable: true, placeholder: '' }
        };
        editor = new Editor({ extensions: createExtensions(permissions) });
        typeText(editor, source);
        expect(editor.getHTML()).not.toContain(tag);
        expect(editor.state.doc.textContent).toBe(source);
        editor.commands.clearContent();
        permissions.current.tools = [tool];
        typeText(editor, source);
        expect(editor.getHTML()).toContain(tag);
    });
    it('guards autolink and explicit Markdown links', () => {
        const permissions: { current: IEditorPermissions } = {
            current: { tools: [], editable: true, placeholder: '' }
        };
        editor = new Editor({ extensions: createExtensions(permissions) });
        typeText(editor, 'https://example.com [ссылка](/test) ');
        expect(editor.getHTML()).not.toContain('<a ');
        editor.commands.clearContent();
        permissions.current.tools = ['link'];
        typeText(editor, 'https://example.com ');
        expect(editor.getHTML()).toContain('<a ');
    });
    it.each(['orderedList', 'bulletList'] as const)(
        'creates a paragraph after disabled %s without damaging existing items',
        list => {
            editor = new Editor({
                extensions: createExtensions({ current: { tools: [], editable: true, placeholder: '' } }),
                content: list === 'orderedList' ? '1. one\n2. two' : '- one\n- two',
                contentType: 'markdown'
            });
            editor.commands.setTextSelection(6);
            editor.view.dom.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
            );
            expect(editor.getHTML()).toContain('<p>one</p>');
            expect(editor.getHTML()).toContain('<p>two</p>');
            expect(editor.state.selection.$from.parent.type.name).toBe('paragraph');
            expect(editor.state.selection.$from.depth).toBe(1);
        }
    );
    it('does not inherit a disabled mark into a new paragraph', () => {
        editor = new Editor({
            extensions: createExtensions({ current: { tools: [], editable: true, placeholder: '' } }),
            content: '**text**',
            contentType: 'markdown'
        });
        editor.commands.setTextSelection(5);
        editor.view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        typeText(editor, 'plain');
        expect(editor.getHTML()).toBe('<p><strong>text</strong></p><p>plain</p>');
    });
    it('retains all enabled extensions', () => {
        editor = new Editor({
            extensions: createExtensions({ current: { tools: ALL_TOOLS, editable: true, placeholder: '' } })
        });
        expect(editor.schema.nodes.heading).toBeDefined();
        expect(editor.schema.marks.underline).toBeDefined();
    });
    it.each(['orderedList', 'bulletList'] as const)('uses native Enter and undo in an enabled %s', list => {
        editor = new Editor({
            extensions: createExtensions({ current: { tools: [list, 'bold'], editable: true, placeholder: '' } }),
            content: list === 'orderedList' ? '1. **one**\n2. two' : '- **one**\n- two',
            contentType: 'markdown'
        });
        const before = editor.getJSON();
        editor.commands.setTextSelection(6);
        editor.view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        typeText(editor, 'new');
        expect(editor.getHTML()).toContain('<strong>new</strong>');
        expect(editor.view.dom.querySelectorAll('li')).toHaveLength(3);
        editor.commands.undo();
        expect(editor.getJSON()).toEqual(before);
    });
    it('exits nested disabled lists in one undoable change', () => {
        editor = new Editor({
            extensions: createExtensions({ current: { tools: [], editable: true, placeholder: '' } }),
            content: '- outer\n    3. inner\n    4. next\n- end',
            contentType: 'markdown'
        });
        const before = editor.getJSON();
        editor.state.doc.descendants((node, position) => {
            if (node.isText && node.text === 'inner') {
                editor.commands.setTextSelection(position + node.nodeSize);
            }
        });
        editor.view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        expect(editor.state.selection.$from.depth, editor.getHTML()).toBe(1);
        expect(editor.state.selection.$from.parent.type.name).toBe('paragraph');
        expect(editor.state.doc.textContent).toBe('outerinnernextend');
        editor.commands.undo();
        expect(editor.getJSON()).toEqual(before);
    });
    it('guards inherited shortcuts, including uppercase variants, after tools change', () => {
        const permissions: { current: IEditorPermissions } = {
            current: { tools: ['bold'], editable: true, placeholder: '' }
        };
        editor = new Editor({ extensions: createExtensions(permissions), content: '<p>text</p>' });
        editor.commands.selectAll();
        editor.view.dom.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, bubbles: true, cancelable: true })
        );
        expect(editor.getHTML()).toContain('<strong>text</strong>');
        permissions.current.tools = [];
        const event = new KeyboardEvent('keydown', { key: 'B', ctrlKey: true, bubbles: true, cancelable: true });
        editor.view.dom.dispatchEvent(event);
        expect(editor.getHTML()).toContain('<strong>text</strong>');
        expect(event.defaultPrevented).toBe(true);
    });
});

it.each([false, true])('does not indent a disabled list or trap Tab in read-only, editable=%s', editable => {
    const editor = new Editor({
        extensions: createExtensions({ current: { tools: [], editable, placeholder: '' } }),
        content: '- one\n- two',
        contentType: 'markdown'
    });
    editor.commands.setTextSelection(11);
    const before = editor.getHTML();
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    editor.view.dom.dispatchEvent(event);
    expect(editor.getHTML()).toBe(before);
    expect(event.defaultPrevented).toBe(false);
    editor.destroy();
});

it('uses native Tab/Shift+Tab for enabled lists and keeps them unchanged after disabling', () => {
    const permissions: { current: IEditorPermissions } = {
        current: { tools: ['bulletList'], editable: true, placeholder: '' }
    };
    const editor = new Editor({
        extensions: createExtensions(permissions),
        content: '- one\n- two',
        contentType: 'markdown'
    });
    try {
        editor.commands.setTextSelection(11);
        const initial = editor.getJSON();
        editor.view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
        expect(editor.state.selection.$from.depth).toBe(5);
        permissions.current.tools = [];
        const nested = editor.getJSON();
        const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        editor.view.dom.dispatchEvent(event);
        expect(editor.getJSON()).toEqual(nested);
        expect(event.defaultPrevented).toBe(false);
        permissions.current.tools = ['bulletList'];
        editor.view.dom.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })
        );
        expect(editor.getJSON()).toEqual(initial);
    } finally {
        editor.destroy();
    }
});
