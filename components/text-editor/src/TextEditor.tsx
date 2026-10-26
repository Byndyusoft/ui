import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { EditorState } from '@tiptap/pm/state';
import { Editor, JSONContent } from '@tiptap/core';
import { useEditor } from '@tiptap/react';
import useIsomorphicLayoutEffect from '@byndyusoft-ui/use-isomorphic-layout-effect';
import { ITextEditorProps } from './TextEditor.types';
import { createExtensions, IEditorPermissions } from './utilities/extensions';
import { normalizeTools, parseMarkdown, serializeMarkdown } from './utilities/markdown';
import { pasteClipboard } from './utilities/clipboard';
import useTextEditorChangeCallbacks from './hooks/useTextEditorChangeCallbacks';
import useTextEditorAutoHeight from './hooks/useTextEditorAutoHeight';
import TextEditorToolbar from './TextEditorToolbar';
import './TextEditor.css';

const TextEditor = forwardRef<HTMLDivElement, ITextEditorProps>(
    (
        {
            value,
            defaultValue = '',
            onChange,
            onDebouncedChange,
            debounceDelay,
            onThrottledChange,
            throttleDelay,
            tools: requestedTools,
            withAutoHeight = false,
            isDisabled = false,
            isReadOnly = false,
            placeholder = '',
            name,
            form,
            className,
            style,
            onFocus,
            onBlur,
            ...attributes
        },
        forwardedRef
    ) => {
        const tools = useMemo(() => normalizeTools(requestedTools), [requestedTools]);
        const regionRef = useRef<HTMLDivElement>(null);
        const inputRef = useRef<HTMLInputElement>(null);
        const initialValueRef = useRef(value ?? defaultValue);
        const defaultValueRef = useRef(defaultValue);
        const [markdown, setMarkdown] = useState(initialValueRef.current);
        const markdownRef = useRef(markdown);
        const [revision, setRevision] = useState(0);
        const permissionsRef = useRef<IEditorPermissions>({ tools, editable: !isDisabled && !isReadOnly, placeholder });
        permissionsRef.current = { tools, editable: !isDisabled && !isReadOnly, placeholder };
        const extensions = useMemo(() => createExtensions(permissionsRef), [permissionsRef]);
        const callbacks = useTextEditorChangeCallbacks({
            onChange,
            onDebouncedChange,
            debounceDelay,
            onThrottledChange,
            throttleDelay
        });
        const callbacksRef = useRef(callbacks);
        callbacksRef.current = callbacks;
        const publish = useCallback((instance: Editor, notify: boolean): void => {
            const nextMarkdown = serializeMarkdown(instance);
            markdownRef.current = nextMarkdown;
            if (inputRef.current) {
                inputRef.current.value = nextMarkdown;
            }
            setMarkdown(nextMarkdown);
            setRevision(previous => previous + 1);
            if (notify) {
                callbacksRef.current.notify(nextMarkdown);
            }
        }, []);
        const editorRef = useRef<Editor | null>(null);
        const editor = useEditor(
            {
                element: null,
                immediatelyRender: false,
                shouldRerenderOnTransaction: false,
                extensions,
                enablePasteRules: false,
                editable: !isDisabled && !isReadOnly,
                onUpdate: ({ editor: instance }) => publish(instance, true),
                onTransaction: ({ transaction }) => {
                    if (!transaction.docChanged) {
                        setRevision(previous => previous + 1);
                    }
                },
                editorProps: {
                    handlePaste(_view, event) {
                        const instance = editorRef.current;
                        if (!permissionsRef.current.editable) {
                            return true;
                        }
                        return (
                            !!instance &&
                            !!event.clipboardData &&
                            pasteClipboard(instance, event.clipboardData, permissionsRef.current.tools)
                        );
                    },
                    handleDrop: () => true,
                    handleDOMEvents: {
                        beforeinput: () => !permissionsRef.current.editable,
                        click(_view, event) {
                            if ((event.target as HTMLElement).closest('a')) {
                                event.preventDefault();
                                return true;
                            }
                            return false;
                        }
                    }
                }
            },
            []
        );
        editorRef.current = editor;
        const replaceDocument = useCallback(
            (instance: Editor, nextValue: string): void => {
                callbacksRef.current.cancel();
                const content: JSONContent = parseMarkdown(instance, nextValue);
                instance.view.updateState(
                    EditorState.create({
                        schema: instance.schema,
                        doc: instance.schema.nodeFromJSON(content),
                        plugins: instance.state.plugins
                    })
                );
                publish(instance, false);
            },
            [publish]
        );
        useIsomorphicLayoutEffect(() => {
            if (!editor || !regionRef.current) {
                return;
            }
            editor.mount({ mount: regionRef.current });
            replaceDocument(editor, initialValueRef.current);
            return () => editor.unmount();
        }, [editor, replaceDocument]);
        useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
            forwardedRef,
            () => (editor ? regionRef.current : null),
            [editor]
        );
        useIsomorphicLayoutEffect(() => {
            if (!editor) {
                return;
            }
            editor.setEditable(!isDisabled && !isReadOnly, false);
            // Refresh placeholder decorations without changing the document.
            editor.view.dispatch(editor.state.tr);
        }, [editor, isDisabled, isReadOnly, placeholder]);
        useIsomorphicLayoutEffect(() => {
            if (editor && value !== undefined && value !== markdownRef.current) {
                replaceDocument(editor, value);
            }
        }, [editor, value, replaceDocument]);
        useIsomorphicLayoutEffect(() => {
            const node = regionRef.current;
            const associatedForm = form ? document.getElementById(form) : node?.closest('form');
            if (!(associatedForm instanceof HTMLFormElement) || !editor) {
                return;
            }
            const reset = (): void => {
                replaceDocument(editor, value ?? defaultValueRef.current);
                // Native reset runs after the event; its input default must be the new snapshot too.
                if (inputRef.current) {
                    inputRef.current.defaultValue = markdownRef.current;
                }
            };
            associatedForm.addEventListener('reset', reset);
            return () => associatedForm.removeEventListener('reset', reset);
        }, [editor, form, value, replaceDocument]);
        useTextEditorAutoHeight(regionRef, withAutoHeight, style, revision, className);
        return (
            <div className="byndyusoft-text-editor">
                {editor && tools.length > 0 && (
                    <TextEditorToolbar editor={editor} tools={tools} isDisabled={isDisabled || isReadOnly} />
                )}
                <div
                    {...attributes}
                    ref={regionRef}
                    className={['tiptap ProseMirror byndyusoft-text-editor__input', className]
                        .filter(Boolean)
                        .join(' ')}
                    style={style}
                    role="textbox"
                    aria-multiline="true"
                    aria-disabled={isDisabled}
                    aria-readonly={isReadOnly}
                    tabIndex={isDisabled ? -1 : 0}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                {name && (
                    <input
                        ref={inputRef}
                        type="hidden"
                        name={name}
                        form={form}
                        value={markdown}
                        disabled={isDisabled}
                    />
                )}
            </div>
        );
    }
);

TextEditor.displayName = 'TextEditor';
export default TextEditor;
