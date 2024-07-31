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
        searchValue: 'test'
    };

    test('renders the value without highlighting if no highlight is provided', () => {
        const { getByText } = setup({ ...defaultProps, searchValue: '' });
        expect(getByText(defaultProps.text)).toBeInTheDocument();
    });

    test('renders the value without highlighting if the highlight does not match', () => {
        const { getByText } = setup({ ...defaultProps, searchValue: 'invalid' });
        expect(getByText(defaultProps.text)).toBeInTheDocument();
    });

    test('renders the value with highlighted text when there is a match', () => {
        const { container } = setup({ ...defaultProps });
        const markedText = container.querySelector('mark');
        expect(markedText).toHaveTextContent('test');
    });

    test('renders the value with multiple highlighted matches', () => {
        const { container } = setup({ ...defaultProps, text: 'test test test' });
        const markedText = container.querySelectorAll('mark');
        expect(markedText.length).toBe(3);
    });

    test('renders the value with case-insensitive highlighted matches', () => {
        const { container } = setup({ ...defaultProps, text: 'Test TEST Test', ignoreCase: true });
        const markedText = container.querySelectorAll('mark');
        expect(markedText.length).toBe(3);
    });

    test('renders the value with custom highlight styles', () => {
        const customHighlight = (str: string) => <strong>{str}</strong>;
        const { container } = setup({ ...defaultProps, customHighlight });

        const markedText = container.querySelectorAll('mark');
        expect(markedText.length).toBe(0);

        const customHighlightedText = container.querySelector('strong');
        expect(customHighlightedText).toHaveTextContent('test');
    });

    test('renders the value with ignored spaces in the highlight pattern', () => {
        const { container } = setup({ ...defaultProps, searchValue: 't e s t', ignoreSpaces: true });
        const markedText = container.querySelector('mark');
        expect(markedText).toHaveTextContent('test');
    });
});
