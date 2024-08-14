import { ReactNode } from 'react';

/**
 * Function to split the text into segments based on matches
 * @param text - The full text to be split
 * @param matches - Array of regex matches
 * @param highlighter - Function to highlight the matched parts
 * @returns Array of ReactNodes with highlighted matches
 */
export function splitTextByMatches(
    text: string,
    matches: RegExpMatchArray[],
    highlighter: (str: string) => JSX.Element
): Array<ReactNode> {
    const result: Array<ReactNode> = [];
    let lastIndex = 0;

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
        result.push(highlighter(text.substring(start, end)));

        lastIndex = end;
    });

    // Add the remaining text after the last match to the result
    if (lastIndex < text.length) {
        result.push(text.substring(lastIndex));
    }

    return result;
}
