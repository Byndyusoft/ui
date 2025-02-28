/**
 * Interface for a text segment with match information.
 */
interface ITextSegment {
    segment: string;
    isMatch: boolean;
}

/**
 * Utility to split text into segments based on regex matches.
 * @param text - The full text to split
 * @param matches - Array of regex matches
 * @returns Array of text segments with match information
 */
export function splitTextIntoSegments(text: string, matches: Array<RegExpMatchArray>): Array<ITextSegment> {
    const result: Array<ITextSegment> = [];
    let lastIndex = 0;

    matches.forEach(match => {
        const start = match.index;

        if (start === undefined) {
            return;
        }

        const end = start + match[0].length;

        // Add the text before the match to the result
        if (start > lastIndex) {
            result.push({ segment: text.substring(lastIndex, start), isMatch: false });
        }

        // Add the matched segment to the result
        result.push({ segment: text.substring(start, end), isMatch: true });

        lastIndex = end;
    });

    // Add the remaining text after the last match to the result
    if (lastIndex < text.length) {
        result.push({ segment: text.substring(lastIndex), isMatch: false });
    }

    return result;
}
