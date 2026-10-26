import React, { createRef } from 'react';
import TextEditor, {
    TextEditor as NamedTextEditor,
    ITextEditorProps,
    TTextEditorTool
} from '@byndyusoft-ui/text-editor';

const tools: ReadonlyArray<TTextEditorTool> = ['bold', 'underline', 'heading'];
const props: ITextEditorProps = { tools, value: '++text++', onChange: markdown => markdown.toUpperCase() };
const editor = <TextEditor {...props} ref={createRef<HTMLDivElement>()} aria-label="Description" data-field="body" />;
const named = <NamedTextEditor defaultValue="text" />;
void [editor, named];
