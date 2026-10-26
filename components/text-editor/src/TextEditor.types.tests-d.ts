import { createElement, createRef } from 'react';
import { expectTypeOf } from 'vitest';
import TextEditor, { TextEditor as NamedTextEditor, ITextEditorProps, TTextEditorTool } from './index';

expectTypeOf(TextEditor).toEqualTypeOf(NamedTextEditor);
expectTypeOf<ITextEditorProps['onChange']>().toEqualTypeOf<((markdown: string) => void) | undefined>();
expectTypeOf<ITextEditorProps['onDebouncedChange']>().toEqualTypeOf<ITextEditorProps['onChange']>();
expectTypeOf<ITextEditorProps['onThrottledChange']>().toEqualTypeOf<ITextEditorProps['onChange']>();
const tools: ReadonlyArray<TTextEditorTool> = ['bold', 'link'];
createElement(TextEditor, { tools, ref: createRef<HTMLDivElement>(), value: '**text**', 'data-field': 'body' });
// @ts-expect-error The ref is the editable div, not a textarea or editor instance.
createElement(TextEditor, { ref: createRef<HTMLTextAreaElement>() });
// @ts-expect-error DOM change events are deliberately replaced by Markdown snapshots.
createElement(TextEditor, { onChange: (event: React.ChangeEvent<HTMLDivElement>) => event.preventDefault() });
// @ts-expect-error Unsupported formats cannot be added to the schema through tools.
createElement(TextEditor, { tools: ['image'] });
// @ts-expect-error The component owns contenteditable and its document.
createElement(TextEditor, { contentEditable: true });
// @ts-expect-error Native constraint validation is outside this component's API.
createElement(TextEditor, { required: true });
// @ts-expect-error Raw HTML cannot replace the document.
createElement(TextEditor, { dangerouslySetInnerHTML: { __html: '' } });
