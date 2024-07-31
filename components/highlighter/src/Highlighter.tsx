import React, { Fragment, ReactNode } from 'react';
import { IHighlighterProps } from './Highlighter.types';

/**
 * Default function to render highlighted text in bold style
 * @param str
 */
function renderMarkedHighlight(str: string): JSX.Element {
    return <mark>{str}</mark>;
}

/**
 * The `Highlighter` component is used to display and highlight text that matches the specified patterns
 */
const Highlighter = ({
    searchValues,
    text,
    ignoreCase,
    ignoreSpaces,
    customHighlight = renderMarkedHighlight
}: IHighlighterProps): JSX.Element => {
    // If no highlight patterns are provided, return the original text
    if (!searchValues || searchValues.length === 0) {
        return <>{text}</>;
    }

    // Sort search values by length to prioritize longer strings in the search
    const sortedSearchValues = [...searchValues].sort((a, b) => b.length - a.length);

    // Create regular expression patterns for searching
    const highlightPattern = sortedSearchValues.map(searchValue =>
      ignoreSpaces ? searchValue.replace(/\s+/g, '').split('').join('\\s*') : searchValue
    );

    const regex = new RegExp(highlightPattern.join('|'), ignoreCase ? 'gi' : 'g');

    // Find all matches in the text
    const matches = [...text.matchAll(regex)];

    // If no matches found, return the original text
    if (matches.length === 0) {
        return <>{text}</>;
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
            result.push(text.substring(lastIndex, start));
        }

        // Add the highlighted match to the result
        result.push(customHighlight(text.substring(start, end)));

        lastIndex = end;
    });

    // Add the remaining text after the last match to the result
    if (lastIndex < text.length) {
        result.push(text.substring(lastIndex));
    }

    return (
        <>
            {result.map((val, i) => (
                <Fragment key={`${String(val)}_${i}`}>{val}</Fragment>
            ))}
        </>
    );
};

export default Highlighter;
