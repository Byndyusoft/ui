import React, { Fragment, ReactNode } from 'react';
import { IHighlighterProps } from './Highlighter.types';
import { splitTextIntoSegments } from './Highlighter.utilities';

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
    highlighter = renderMarkedHighlight
}: IHighlighterProps): JSX.Element => {
    // If no highlight patterns are provided, return the original text
    if (searchValues.length === 0) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{text}</>;
    }

    // Create regular expression patterns for searching
    const highlightPattern = searchValues.map(searchValue =>
        ignoreSpaces ? searchValue.replace(/\s+/g, '').split('').join('\\s*') : searchValue
    );

    const regex = new RegExp(highlightPattern.join('|'), ignoreCase ? 'gi' : 'g');

    // Find all matches in the text
    const matches = [...text.matchAll(regex)];

    // If no matches found, return the original text
    if (matches.length === 0) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{text}</>;
    }

    // Split text into segments
    const segments = splitTextIntoSegments(text, matches);

    // Highlight matches
    const result: Array<string | ReactNode> = segments.map(part =>
        part.isMatch ? highlighter(part.segment) : part.segment
    );

    return (
        <>
            {result.map((val, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Fragment key={`${String(val)}_${i}`}>{val}</Fragment>
            ))}
        </>
    );
};

export default Highlighter;
