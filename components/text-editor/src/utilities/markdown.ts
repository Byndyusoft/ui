import { Editor, JSONContent } from '@tiptap/core';
import { TTextEditorTool } from '../TextEditor.types';

export const DEFAULT_TOOLS: ReadonlyArray<TTextEditorTool> = ['bold', 'italic', 'underline', 'strike'];
export const ALL_TOOLS: ReadonlyArray<TTextEditorTool> = [
    ...DEFAULT_TOOLS,
    'heading',
    'orderedList',
    'bulletList',
    'link'
];

export function normalizeTools(tools: ReadonlyArray<TTextEditorTool> = DEFAULT_TOOLS): TTextEditorTool[] {
    return [...new Set(tools)].filter(tool => ALL_TOOLS.includes(tool));
}

export function isSafeUrl(value: string): boolean {
    // eslint-disable-next-line no-control-regex -- Reject URL scheme obfuscation.
    if (!value.trim() || /[\u0000-\u0020\u007f-\u009f]/.test(value)) {
        return false;
    }
    let decoded = value;
    try {
        decoded = decodeURIComponent(value);
    } catch {
        return false;
    }
    // eslint-disable-next-line no-control-regex -- Check decoded controls as well.
    if (/[\u0000-\u001f\u007f-\u009f]/.test(decoded) || decoded.includes('\\')) {
        return false;
    }
    const protocol = /^([^/?#]*):/.exec(decoded)?.[1];
    return !protocol || /^(https?|mailto|tel)$/i.test(protocol);
}

/** Schema content is trusted structurally, but every link still crosses this boundary. */
export function filterDocument(node: JSONContent, tools: ReadonlyArray<TTextEditorTool> = ALL_TOOLS): JSONContent[] {
    const content = node.content?.flatMap(child => filterDocument(child, tools));
    const marks = node.marks?.filter(
        mark =>
            tools.includes(mark.type as TTextEditorTool) &&
            (mark.type !== 'link' || isSafeUrl(String(mark.attrs?.href ?? '')))
    );
    if ((node.type === 'orderedList' || node.type === 'bulletList') && !tools.includes(node.type)) {
        return content?.flatMap(item => item.content ?? []) ?? [];
    }
    return [
        {
            ...node,
            ...(content ? { content } : {}),
            ...(marks ? { marks } : {}),
            ...(node.type === 'heading' && !tools.includes('heading') ? { type: 'paragraph', attrs: undefined } : {})
        }
    ];
}

export function parseMarkdown(editor: Editor, markdown: string): JSONContent {
    const parsed = editor.markdown?.parse(markdown) ?? { type: 'doc' };
    const document = filterDocument(parsed)[0];
    return { ...document, content: document.content?.length ? document.content : [{ type: 'paragraph' }] };
}

/** Protect literal block markers and ++; the upstream serializer escapes the other inline delimiters. */
export function serializeMarkdown(editor: Editor): string {
    const document = editor.getJSON();
    let sentinel = '\uE000';
    const source = JSON.stringify(document);
    while (source.includes(sentinel)) {
        sentinel += '\uE000';
    }
    const protectedCharacters: string[] = [];
    const protect = (node: JSONContent): JSONContent => ({
        ...node,
        ...(node.text
            ? {
                  text: node.text.replace(
                      node.marks?.some(mark => mark.type === 'underline') ? /[+#.!|=\-\s]/g : /[+#.!|=-]/g,
                      character => {
                          protectedCharacters.push(
                              /\s/.test(character) ? `&#${character.charCodeAt(0)};` : `\\${character}`
                          );
                          return `${sentinel}${protectedCharacters.length - 1}${sentinel}`;
                      }
                  )
              }
            : {}),
        ...(node.content ? { content: node.content.map(protect) } : {})
    });
    const markdown = editor.markdown?.serialize(protect(document)) ?? '';
    return markdown.replace(
        new RegExp(`${sentinel}(\\d+)${sentinel}`, 'g'),
        (_match, index: string) => protectedCharacters[Number(index)]
    );
}
