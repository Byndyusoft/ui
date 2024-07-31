export interface IHighlighterProps {
    /**
     * The text where we need to highlight the matched substring
     */
    text: string;
    /**
     * The search pattern to match in the value
     */
    highlight: string;
    /**
     * Flag to indicate if the search should be case-insensitive
     */
    ignoreCase?: boolean;
    /**
     * Function to render the matched highlighted text with custom styles
     * By default, renders matched text in bold style
     * @param str
     */
    customHighlight?: (str: string) => JSX.Element;
    /**
     * Flag to indicate if spaces should be ignored in the search pattern
     */
    ignoreSpaces?: boolean;
}
