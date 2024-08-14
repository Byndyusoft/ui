export interface IHighlighterProps {
    /**
     * The text where we need to highlight the matched substring
     */
    text: string;
    /**
     * The search patterns to match in the text.
     */
    searchValues: Array<string>;
    /**
     * Flag to indicate if the search should be case-insensitive
     */
    ignoreCase?: boolean;
    /**
     * Function to render the matched highlighted text with custom styles
     * By default, renders matched text in mark style
     * @param str
     */
    highlighter?: (str: string) => JSX.Element;
    /**
     * Flag to indicate if spaces should be ignored in the search pattern
     */
    ignoreSpaces?: boolean;
}
