import {
    AnyExtension,
    JSONContent,
    MarkdownTokenizer,
    MarkdownToken,
    MarkdownLexerConfiguration,
    MarkdownParseHelpers,
    MarkdownParseResult,
    MarkdownRendererHelpers,
    RenderContext,
    NodeConfig,
    getExtensionField,
    renderNestedMarkdownContent
} from '@tiptap/core';

/** Upstream list handlers use `start || 1`; Markdown permits a zero start. */
export function preserveZeroListStart(extension: AnyExtension): AnyExtension {
    const context: { name: string; options: unknown; storage: unknown } = {
        name: extension.name,
        options: extension.options,
        storage: extension.storage
    };
    if (extension.name === 'orderedList') {
        const tokenizer = getExtensionField<MarkdownTokenizer>(extension, 'markdownTokenizer');
        const parse = getExtensionField<NonNullable<NodeConfig['parseMarkdown']>>(extension, 'parseMarkdown', context);
        return extension.extend({
            markdownTokenizer: {
                ...tokenizer,
                tokenize(
                    source: string,
                    tokens: MarkdownToken[],
                    lexer: MarkdownLexerConfiguration
                ): ReturnType<MarkdownTokenizer['tokenize']> {
                    const token = tokenizer.tokenize(source, tokens, lexer);
                    return token && /^0+[.)]\s/.test(source) ? { ...token, start: 0 } : token;
                }
            },
            parseMarkdown(token: MarkdownToken, helpers: MarkdownParseHelpers): MarkdownParseResult {
                const result = parse(token, helpers);
                if (
                    token.start === 0 &&
                    result &&
                    !Array.isArray(result) &&
                    'type' in result &&
                    result.type === 'orderedList'
                ) {
                    return { ...result, attrs: { ...(result as JSONContent).attrs, start: 0 } };
                }
                return result;
            }
        });
    }
    if (extension.name === 'listItem') {
        const render = getExtensionField<NonNullable<NodeConfig['renderMarkdown']>>(
            extension,
            'renderMarkdown',
            context
        );
        return extension.extend({
            renderMarkdown(node: JSONContent, helpers: MarkdownRendererHelpers, renderContext: RenderContext): string {
                const attributes = renderContext.meta?.parentAttrs as { start?: number } | undefined;
                return renderContext.parentType === 'orderedList' && attributes?.start === 0
                    ? renderNestedMarkdownContent(node, helpers, `${renderContext.index}. `, renderContext, {
                          alignNestedToPrefix: true
                      })
                    : render(node, helpers, renderContext);
            }
        });
    }
    return extension;
}
