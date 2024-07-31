import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import Highlighter from './Highlighter';
import { IHighlighterProps } from './Highlighter.types';

const setup = (props: IHighlighterProps): RenderResult => {
    return render(<Highlighter {...props} />);
};

describe('Highlighter', () => {
    const defaultProps: IHighlighterProps = {
        text: 'This is a test string',
        searchValues: ['test']
    };

    test('renders the text without highlighting if no highlight is provided', () => {
        const {getByText} = setup({...defaultProps, searchValues: ['']});
        expect(getByText(defaultProps.text)).toBeInTheDocument();
    });

    test('renders the text without highlighting if the highlight does not match', () => {
        const {getByText} = setup({...defaultProps, searchValues: ['invalid']});
        expect(getByText(defaultProps.text)).toBeInTheDocument();
    });

    test('renders the text with highlighted text when there is a match', () => {
        const {container} = setup({...defaultProps});
        const markedText = container.querySelector('mark');
        expect(markedText).toHaveTextContent('test');
    });

    test('renders the text with multiple highlighted matches', () => {
        const {container} = setup({...defaultProps, text: 'test test test'});
        const markedText = container.querySelectorAll('mark');
        expect(markedText.length).toBe(3);
    });

    test('renders the text with case-insensitive highlighted matches', () => {
        const {container} = setup({...defaultProps, text: 'Test TEST Test', ignoreCase: true});
        const markedText = container.querySelectorAll('mark');
        expect(markedText.length).toBe(3);
    });

    test('renders the text with custom highlight styles', () => {
        const customHighlight = (str: string) => <strong>{str}</strong>;
        const {container} = setup({...defaultProps, customHighlight});

        const markedText = container.querySelectorAll('mark');
        expect(markedText.length).toBe(0);

        const customHighlightedText = container.querySelector('strong');
        expect(customHighlightedText).toHaveTextContent('test');
    });

    test('renders the text with ignored spaces in the highlight pattern', () => {
        const {container} = setup({...defaultProps, searchValues: ['t e s t'], ignoreSpaces: true});
        const markedText = container.querySelector('mark');
        expect(markedText).toHaveTextContent('test');
    });

    test('renders the text with multiple search values', () => {
        const {container} = setup({...defaultProps, searchValues: ['test', 'This'], ignoreSpaces: true});
        const markedText = container.querySelectorAll('mark');
        expect(markedText.length).toBe(2);
        expect(markedText[0]).toHaveTextContent('This');
        expect(markedText[1]).toHaveTextContent('test');
    });

    test('renders the text with overlapping search values', () => {
        const {container} = setup({...defaultProps, searchValues: ['This', 'is']});
        const markedText = container.querySelectorAll('mark');
        expect(markedText.length).toBe(2);
        expect(markedText[0]).toHaveTextContent('This');
        expect(markedText[1]).toHaveTextContent('is');
    });

    test('renders the text with overlapping search values, prioritizes longer strings', () => {        const {container} = setup({
            ...defaultProps,
            text: 'iss is',
            searchValues: ['is', 'iss'],
        });
        const markedText = container.querySelectorAll('mark');
        expect(markedText.length).toBe(2);
        expect(markedText[0]).toHaveTextContent('iss');
        expect(markedText[1]).toHaveTextContent('is');
    });
});
