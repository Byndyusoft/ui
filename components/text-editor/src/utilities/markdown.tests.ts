/* eslint-disable no-script-url -- Unsafe URL fixtures verify rejection. */
import { createTestEditor } from '../__tests__/createEditor';
import { filterDocument, isSafeUrl, parseMarkdown, serializeMarkdown, ALL_TOOLS } from './markdown';

const fixtures = [
    '**жирный** *курсив* ++подчёркнутый++ ~~зачёркнутый~~',
    '**жирный *курсив ++подчёркнутый++* текст**',
    'Абзац\n\nСледующий  \nстрока',
    '3. третий\n4. четвёртый\n    - вложенный\n        1. ещё глубже',
    '- первый\n- второй',
    '0. нулевой\n1. первый\n    0. вложенный нулевой\n    1. следующий',
    '[ссылка](https://example.com/path) [путь](/test) [якорь](#anchor)',
    ...Array.from({ length: 6 }, (_, index) => `${'#'.repeat(index + 1)} Заголовок`),
    '\\+\\+буквальные плюсы\\+\\+ и \\*звёзды\\*',
    '\\# текст\n\n1\\. текст\n\n\\- текст',
    'до ++ пробелы внутри ++ после',
    ''
];

describe('Markdown adapter', () => {
    it.each(fixtures)('preserves the document: %s', value => {
        const editor = createTestEditor();
        editor.commands.setContent(parseMarkdown(editor, value), { emitUpdate: false });
        const original = editor.getJSON();
        const serialized = serializeMarkdown(editor);
        editor.commands.setContent(parseMarkdown(editor, serialized), { emitUpdate: false });
        expect(editor.getJSON()).toEqual(original);
        editor.destroy();
    });
    it('serializes an empty document as an empty string', () => {
        const editor = createTestEditor();
        expect(serializeMarkdown(editor)).toBe('');
        editor.destroy();
    });
    it.each([
        'javascript:alert(1)',
        'data:text/html,test',
        'java\nscript:alert(1)',
        'javascript%3aalert(1)',
        '//test\\evil'
    ])('rejects %s', url => {
        expect(isSafeUrl(url)).toBe(false);
    });
    it.each([
        'https://test.ru',
        'https://test.ru/a%20b',
        'http://test.ru',
        'mailto:a@test.ru',
        'tel:+123',
        '/test',
        '../test',
        '#test'
    ])('allows %s', url => {
        expect(isSafeUrl(url)).toBe(true);
    });
    it('filters every missing format without losing text', () => {
        const editor = createTestEditor(fixtures[0]);
        const document = editor.getJSON();
        for (const tool of ALL_TOOLS) {
            const filtered = filterDocument(
                document,
                ALL_TOOLS.filter(item => item !== tool)
            )[0];
            expect(JSON.stringify(filtered)).not.toContain(`"type":"${tool}"`);
        }
        editor.destroy();
    });
    it('does not execute active HTML or retain unsupported nodes and dangerous links', () => {
        const editor = createTestEditor();
        editor.commands.setContent(
            parseMarkdown(editor, '<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[x](javascript:alert)')
        );
        expect(editor.getHTML()).not.toMatch(/<script|<img|href="javascript/);
        editor.destroy();
    });
});

it('preserves zero as the first ordered-list number', () => {
    const editor = createTestEditor();
    editor.commands.setContent(parseMarkdown(editor, '0. zero\n1. one'), { emitUpdate: false });
    expect(editor.getJSON().content?.[0].attrs?.start).toBe(0);
    expect(serializeMarkdown(editor)).toMatch(/^0\. zero\n1\. one$/);
    editor.destroy();
});
