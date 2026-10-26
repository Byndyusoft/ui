import { AnyExtension, Editor, Extension, InputRule, KeyboardShortcutCommand, markInputRule } from '@tiptap/core';
import { splitBlockAs } from '@tiptap/pm/commands';
import { liftListItem } from '@tiptap/pm/schema-list';
import { EditorState, Plugin, TextSelection } from '@tiptap/pm/state';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import Placeholder from '@tiptap/extension-placeholder';
import { TTextEditorTool } from '../TextEditor.types';
import { ALL_TOOLS, isSafeUrl } from './markdown';
import { preserveZeroListStart } from './markdownExtensions';

export interface IEditorPermissions {
    tools: ReadonlyArray<TTextEditorTool>;
    editable: boolean;
    placeholder: string;
}

function hasDisabledList(state: Pick<EditorState, 'selection'>, tools: ReadonlyArray<TTextEditorTool>): boolean {
    const { $from } = state.selection;
    for (let depth = $from.depth; depth > 0; depth -= 1) {
        const type = $from.node(depth).type.name;
        if ((type === 'orderedList' || type === 'bulletList') && !tools.includes(type)) {
            return true;
        }
    }
    return false;
}

export function createExtensions(permissions: { current: IEditorPermissions }): AnyExtension[] {
    const kit = StarterKit.extend({
        addExtensions(this: { parent?: () => AnyExtension[] }): AnyExtension[] {
            return (this.parent?.() ?? []).map(original => {
                const extension = preserveZeroListStart(original);
                const tool = extension.name as TTextEditorTool;
                const isListBehavior = extension.name === 'listItem' || extension.name === 'listKeymap';
                if (!ALL_TOOLS.includes(tool) && !isListBehavior) {
                    return extension;
                }
                return extension.extend({
                    addInputRules(this: { editor: Editor; parent?: () => InputRule[] }): InputRule[] {
                        const rules = this.parent?.() ?? [];
                        if (tool === 'underline') {
                            rules.push(
                                markInputRule({
                                    find: /(?:^|\s)(\+\+([^+]+)\+\+)$/,
                                    type: this.editor.schema.marks.underline
                                })
                            );
                        }
                        return rules.map(rule => {
                            const { handler } = rule;
                            rule.handler = options =>
                                permissions.current.editable && permissions.current.tools.includes(tool)
                                    ? handler(options)
                                    : null;
                            return rule;
                        });
                    },
                    addKeyboardShortcuts(this: {
                        editor: Editor;
                        parent?: () => Record<string, KeyboardShortcutCommand>;
                    }): Record<string, KeyboardShortcutCommand> {
                        return Object.fromEntries(
                            Object.entries(this.parent?.() ?? {}).map(([key, handler]) => [
                                key,
                                (context: Parameters<KeyboardShortcutCommand>[0]) => {
                                    const { editable, tools } = permissions.current;
                                    if (isListBehavior) {
                                        return editable &&
                                            (!['Tab', 'Shift-Tab'].includes(key) ||
                                                !hasDisabledList(this.editor.state, tools))
                                            ? handler(context)
                                            : false;
                                    }
                                    // Consume forbidden formatting shortcuts, including native browser defaults.
                                    return !editable || !tools.includes(tool) || handler(context);
                                }
                            ])
                        );
                    },
                    ...(tool === 'underline'
                        ? {
                              markdownTokenizer: {
                                  name: 'underline',
                                  level: 'inline' as const,
                                  start: (source: string) => source.indexOf('++'),
                                  tokenize(
                                      source: string,
                                      _tokens: unknown,
                                      lexer: { inlineTokens: (text: string) => unknown[] }
                                  ) {
                                      const match = /^\+\+((?:\\.|[^+]|\+(?!\+))+?)\+\+/.exec(source);
                                      return match
                                          ? {
                                                type: 'underline',
                                                raw: match[0],
                                                tokens: lexer.inlineTokens(match[1])
                                            }
                                          : undefined;
                                  }
                              }
                          }
                        : {})
                });
            });
        }
    }).configure({
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        trailingNode: false,
        dropcursor: false,
        gapcursor: false,
        link: {
            openOnClick: false,
            linkOnPaste: false,
            markdownLinks: true,
            isAllowedUri: isSafeUrl,
            shouldAutoLink: url =>
                permissions.current.editable && permissions.current.tools.includes('link') && isSafeUrl(url)
        }
    });
    return [
        kit,
        Markdown.configure({ indentation: { style: 'space', size: 4 } }),
        Placeholder.configure({ placeholder: () => permissions.current.placeholder }),
        Extension.create({
            name: 'textEditorPermissions',
            priority: 1000,
            addProseMirrorPlugins() {
                return [
                    new Plugin({
                        filterTransaction: transaction => !transaction.docChanged || permissions.current.editable
                    })
                ];
            },
            addKeyboardShortcuts() {
                return {
                    Enter: () => {
                        const { editable, tools } = permissions.current;
                        const { state } = this.editor;
                        const marks = state.storedMarks ?? state.selection.$from.marks();
                        const allowedMarks = marks.filter(mark => tools.includes(mark.type.name as TTextEditorTool));
                        const disabledList = hasDisabledList(state, tools);
                        const disabledHeading = this.editor.isActive('heading') && !tools.includes('heading');
                        if (!editable || (!disabledList && !disabledHeading && marks.length === allowedMarks.length)) {
                            return false;
                        }
                        return this.editor
                            .chain()
                            .first(({ commands }) =>
                                disabledHeading
                                    ? [
                                          ({ state: currentState, dispatch }) =>
                                              splitBlockAs(() => ({ type: currentState.schema.nodes.paragraph }))(
                                                  currentState,
                                                  dispatch
                                              )
                                      ]
                                    : [
                                          () => commands.splitListItem('listItem'),
                                          () => commands.createParagraphNear(),
                                          () => commands.liftEmptyBlock(),
                                          () => commands.splitBlock()
                                      ]
                            )
                            .command(({ tr }) => {
                                while (hasDisabledList(tr, tools)) {
                                    // List lifting maps its own steps, so it needs a fresh transaction,
                                    // rather than the preceding split/lift mappings in a Tiptap chain.
                                    const currentState = EditorState.create({ doc: tr.doc, selection: tr.selection });
                                    if (
                                        !liftListItem(state.schema.nodes.listItem)(currentState, lifted => {
                                            lifted.steps.forEach(step => tr.step(step));
                                            tr.setSelection(TextSelection.create(tr.doc, lifted.selection.from));
                                        })
                                    ) {
                                        return false;
                                    }
                                }
                                tr.setStoredMarks(allowedMarks);
                                return true;
                            })
                            .run();
                    }
                };
            }
        })
    ];
}
