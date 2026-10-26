import { Editor } from '@tiptap/core';
import { createExtensions } from '../utilities/extensions';

export function createTestEditor(content = ''): Editor {
    return new Editor({
        extensions: createExtensions({ current: { tools: [], editable: true, placeholder: '' } }),
        content,
        contentType: 'markdown'
    });
}
