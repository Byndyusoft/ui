import { createTestEditor } from '../__tests__/createEditor';
import { ALL_TOOLS } from './markdown';
import { pasteClipboard } from './clipboard';

function clipboard(html: string, text = ''): Pick<DataTransfer, 'getData'> {
    return { getData: type => (type === 'text/html' ? html : text) };
}

describe('clipboard normalization', () => {
    const html =
        '<h2>Заголовок</h2><p><b>жирный</b> <i>курсив</i> <u>подчёркнутый</u> <s>зачёркнутый</s> <a href="/test">ссылка</a></p><ol start="3"><li><p>три</p><ul><li>вложенный</li></ul></li><li>четыре</li></ol>';
    it.each(ALL_TOOLS)('strips only disabled %s from a mixed HTML fragment', tool => {
        const editor = createTestEditor();
        pasteClipboard(
            editor,
            clipboard(html),
            ALL_TOOLS.filter(item => item !== tool)
        );
        const json = JSON.stringify(editor.getJSON());
        expect(json).not.toContain(`"type":"${tool}"`);
        // eslint-disable-next-line jest-dom/prefer-to-have-text-content -- This is a ProseMirror node, not a DOM element.
        expect(editor.state.doc.textContent).toBe(
            'Заголовокжирный курсив подчёркнутый зачёркнутый ссылкатривложенныйчетыре'
        );
        for (const allowed of ALL_TOOLS.filter(item => item !== tool)) {
            expect(json).toContain(`"type":"${allowed}"`);
        }
        editor.destroy();
    });
    it('flattens forbidden outer lists and preserves allowed nested lists', () => {
        const editor = createTestEditor();
        pasteClipboard(editor, clipboard(html), ['bulletList']);
        expect(editor.getHTML()).not.toMatch(/<h2|<ol|<strong|<em|<u>|<s>|<a /);
        expect(editor.getHTML()).toContain('<ul>');
        editor.destroy();
    });
    it('does not inherit forbidden marks at the insertion point', () => {
        const editor = createTestEditor('**abc**');
        editor.commands.setTextSelection(2);
        pasteClipboard(editor, clipboard('', 'X'), []);
        expect(editor.getHTML()).toBe('<p><strong>a</strong>X<strong>bc</strong></p>');
        editor.commands.undo();
        expect(editor.getHTML()).toBe('<p><strong>abc</strong></p>');
        editor.destroy();
    });
    it('removes active elements and unsafe links and ignores an empty clipboard', () => {
        const editor = createTestEditor();
        expect(pasteClipboard(editor, clipboard(''), [])).toBe(false);
        pasteClipboard(
            editor,
            clipboard(
                '<p onclick="alert(1)">текст<a href="javascript:alert(1)">ссылка</a><img src=x onerror="alert(1)"><script>alert(1)</script></p>'
            ),
            ALL_TOOLS
        );
        expect(editor.getHTML()).toBe('<p>текстссылка</p>');
        editor.destroy();
    });
});
