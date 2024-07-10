import React, { Fragment, memo, ReactNode } from 'react';
import { IHighlighterProps } from './Highlighter.types';

/**
 * Default function to render highlighted text in bold style
 * @param str
 */
function renderBolderHighlight(str: string): JSX.Element {
    return <strong>{str}</strong>;
}

/**
 * The `Highlighter` component is used to display and highlight text that matches the specified pattern
 */
const Highlighter = memo(function Highlighter({
    highlight,
    value,
    ignoreCase,
    ignoreSpaces,
    customHighlight = renderBolderHighlight
}: IHighlighterProps): JSX.Element {
    // If no highlight pattern is provided, return the original value
    if (!highlight) {
        return <>{value}</>;
    }

    // Create a regular expression pattern for searching
    const highlightPattern = ignoreSpaces ? highlight.replace(/\s+/g, '').split('').join('\\s*') : highlight;

    const regex = new RegExp(highlightPattern, ignoreCase ? 'gi' : 'g');

    // Find all matches in the value
    const matches = [...value.matchAll(regex)];

    // If no matches found, return the original value
    if (matches.length === 0) {
        return <>{value}</>;
    }

    const result: Array<ReactNode> = [];
    let lastIndex = 0;

    // Process each match to highlight the matched text
    matches.forEach(match => {
        const start = match.index;

        if (start === undefined) {
            return;
        }

        const end = start + match[0].length;

        // Add the text before the match to the result
        if (start > lastIndex) {
            result.push(value.substring(lastIndex, start));
        }

        // Add the highlighted match to the result
        result.push(customHighlight(value.substring(start, end)));

        lastIndex = end;
    });

    // Add the remaining text after the last match to the result
    if (lastIndex < value.length) {
        result.push(value.substring(lastIndex));
    }

    return (
        <>
            {result.map((val, i) => (
                <Fragment key={`${String(val)}_${i}`}>{val}</Fragment>
            ))}
        </>
    );
});

export default Highlighter;
