import { Editor, JSONContent } from '@tiptap/core';
import { DOMParser, Slice } from '@tiptap/pm/model';
import { closeHistory } from '@tiptap/pm/history';
import { TTextEditorTool } from '../TextEditor.types';
import { filterDocument, parseMarkdown } from './markdown';

export function pasteClipboard(
    editor: Editor,
    clipboard: Pick<DataTransfer, 'getData'>,
    tools: ReadonlyArray<TTextEditorTool>
): boolean {
    const html = clipboard.getData('text/html');
    const text = clipboard.getData('text/plain');
    if (!html && !text) {
        return false;
    }
    let document: JSONContent;
    if (html) {
        // An inert document prevents scripts, event handlers and embedded resources from executing.
        const inert = new window.DOMParser().parseFromString(html, 'text/html');
        inert.querySelectorAll('script,style,iframe,object,embed,img,svg,math').forEach(element => element.remove());
        document = DOMParser.fromSchema(editor.schema).parse(inert.body).toJSON() as JSONContent;
    } else {
        document = parseMarkdown(editor, text);
    }
    const filtered = filterDocument(document, tools)[0];
    const node = editor.schema.nodeFromJSON(filtered);
    const slice = Slice.maxOpen(node.content);
    const transaction = closeHistory(editor.state.tr)
        .replaceSelection(slice)
        .setStoredMarks(null)
        .setMeta('paste', true)
        .setMeta('uiEvent', 'paste');
    editor.view.dispatch(transaction.scrollIntoView());
    return true;
}
