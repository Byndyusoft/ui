import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/core';
import { TTextEditorTool } from './TextEditor.types';
import { isSafeUrl } from './utilities/markdown';

const LABELS: Record<TTextEditorTool, string> = {
    bold: 'Жирный',
    italic: 'Курсив',
    underline: 'Подчёркнутый',
    strike: 'Зачёркнутый',
    heading: 'Заголовок',
    orderedList: 'Нумерованный список',
    bulletList: 'Маркированный список',
    link: 'Ссылка'
};

interface IToolbarProps {
    editor: Editor;
    tools: ReadonlyArray<TTextEditorTool>;
    isDisabled: boolean;
}

function TextEditorToolbar({ editor, tools, isDisabled }: IToolbarProps): React.ReactElement {
    const [isLinkOpen, setLinkOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [isInvalid, setInvalid] = useState(false);
    const selectionRef = useRef({ from: 0, to: 0 });
    const urlRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (!tools.includes('link') || isDisabled) {
            setLinkOpen(false);
        }
    }, [tools, isDisabled]);
    useEffect(() => {
        if (isLinkOpen) {
            urlRef.current?.focus();
        }
    }, [isLinkOpen]);
    const closeLink = (): void => {
        setLinkOpen(false);
        editor.commands.focus();
    };
    const applyLink = (remove = false): void => {
        if (!tools.includes('link') || isDisabled) {
            return;
        }
        if (!remove && !isSafeUrl(url)) {
            setInvalid(true);
            return;
        }
        const chain = editor.chain().focus().setTextSelection(selectionRef.current).extendMarkRange('link');
        if (remove) {
            chain.unsetLink().run();
        } else {
            chain.setLink({ href: url }).run();
        }
        closeLink();
    };
    const toggle = (tool: TTextEditorTool): void => {
        if (isDisabled || !tools.includes(tool)) {
            return;
        }
        const chain = editor.chain().focus();
        switch (tool) {
            case 'heading':
                break;
            case 'bold':
                chain.toggleBold().run();
                break;
            case 'italic':
                chain.toggleItalic().run();
                break;
            case 'underline':
                chain.toggleUnderline().run();
                break;
            case 'strike':
                chain.toggleStrike().run();
                break;
            case 'orderedList':
                chain.toggleOrderedList().run();
                break;
            case 'bulletList':
                chain.toggleBulletList().run();
                break;
            case 'link':
                selectionRef.current = { from: editor.state.selection.from, to: editor.state.selection.to };
                setUrl(String(editor.getAttributes('link').href ?? ''));
                setInvalid(false);
                setLinkOpen(true);
                break;
        }
    };
    return (
        <div className="byndyusoft-text-editor__toolbar">
            <div
                role="toolbar"
                aria-label="Форматирование текста"
                onKeyDown={event => {
                    const controls = Array.from(
                        event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),select:not(:disabled)')
                    );
                    const index = controls.indexOf(event.target as HTMLElement);
                    if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
                        event.preventDefault();
                        const next =
                            event.key === 'Home'
                                ? 0
                                : event.key === 'End'
                                ? controls.length - 1
                                : (index + (event.key === 'ArrowRight' ? 1 : -1) + controls.length) % controls.length;
                        controls[next]?.focus();
                    }
                }}
            >
                {tools.map(tool =>
                    tool === 'heading' ? (
                        <select
                            key={tool}
                            aria-label={LABELS[tool]}
                            disabled={isDisabled}
                            value={editor.isActive('heading') ? Number(editor.getAttributes('heading').level) : 0}
                            onChange={event => {
                                if (!tools.includes('heading') || isDisabled) {
                                    return;
                                }
                                const level = Number(event.target.value) as 1 | 2 | 3 | 4 | 5 | 6;
                                const chain = editor.chain().focus();
                                if (level) {
                                    chain.setHeading({ level }).run();
                                } else {
                                    chain.setParagraph().run();
                                }
                            }}
                        >
                            <option value={0}>Абзац</option>
                            {[1, 2, 3, 4, 5, 6].map(level => (
                                <option key={level} value={level}>
                                    H{level}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <button
                            type="button"
                            key={tool}
                            disabled={isDisabled}
                            aria-label={LABELS[tool]}
                            aria-pressed={editor.isActive(tool)}
                            onMouseDown={event => event.preventDefault()}
                            onClick={() => toggle(tool)}
                        >
                            {LABELS[tool]}
                        </button>
                    )
                )}
            </div>
            {isLinkOpen && tools.includes('link') && !isDisabled && (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- Capture Escape from every control in the link dialog.
                <div
                    role="dialog"
                    aria-label="Редактирование ссылки"
                    onKeyDown={event => {
                        if (event.key === 'Escape') {
                            event.preventDefault();
                            closeLink();
                        }
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            applyLink();
                        }
                    }}
                >
                    <input
                        ref={urlRef}
                        aria-label="Адрес ссылки"
                        value={url}
                        aria-invalid={isInvalid}
                        onChange={event => {
                            setUrl(event.target.value);
                            setInvalid(false);
                        }}
                    />
                    {isInvalid && <span role="alert">Укажите безопасный адрес ссылки</span>}
                    <button type="button" onClick={() => applyLink()}>
                        Применить ссылку
                    </button>
                    <button type="button" onClick={() => applyLink(true)}>
                        Удалить ссылку
                    </button>
                    <button type="button" onClick={closeLink}>
                        Отмена
                    </button>
                </div>
            )}
        </div>
    );
}

export default TextEditorToolbar;
