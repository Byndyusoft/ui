import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import Highlighter from './Highlighter';
import { IHighlighterProps } from './Highlighter.types';

const setup = (props: IHighlighterProps): RenderResult => render(<Highlighter {...props} />);

describe('Highlighter', () => {
    const defaultProps: IHighlighterProps = {
        text: 'This is a test string',
        searchValues: ['test']
    };

    test('renders the text without highlighting if no highlight is provided', () => {
        setup({ ...defaultProps, searchValues: [''] });

        expect(screen.getByText(defaultProps.text)).toBeInTheDocument();
    });

    test('renders the text without highlighting if the highlight does not match', () => {
        setup({ ...defaultProps, searchValues: ['invalid'] });

        expect(screen.getByText(defaultProps.text)).toBeInTheDocument();
    });

    test('renders the text with highlighted text when there is a match', () => {
        setup({ ...defaultProps });

        expect(screen.getByText('test', { selector: 'mark' })).toBeInTheDocument();
    });

    test('renders the text with multiple highlighted matches', () => {
        setup({ ...defaultProps, text: 'test test test' });

        const highlights = screen.getAllByText('test', { selector: 'mark' });
        expect(highlights).toHaveLength(3);
    });

    test('renders the text with case-insensitive highlighted matches', () => {
        setup({ ...defaultProps, text: 'Test TEST Test', ignoreCase: true });

        const highlights = screen.getAllByText(/test/i, { selector: 'mark' });
        expect(highlights).toHaveLength(3);
    });

    test('renders the text with custom highlight styles', () => {
        const customHighlight = (str: string): JSX.Element => <strong>{str}</strong>;
        setup({ ...defaultProps, highlighter: customHighlight });

        expect(screen.queryByText('test', { selector: 'mark' })).not.toBeInTheDocument();
        expect(screen.getByText('test', { selector: 'strong' })).toBeInTheDocument();
    });

    test('renders the text with ignored spaces in the highlight pattern', () => {
        setup({ ...defaultProps, searchValues: ['t e s t'], ignoreSpaces: true });

        expect(screen.getByText('test', { selector: 'mark' })).toBeInTheDocument();
    });

    test('renders the text with multiple search values', () => {
        setup({ ...defaultProps, searchValues: ['test', 'This'], ignoreSpaces: true });

        const highlights = screen.getAllByText(/test|This/, { selector: 'mark' });
        expect(highlights).toHaveLength(2);
        expect(highlights[0]).toHaveTextContent('This');
        expect(highlights[1]).toHaveTextContent('test');
    });

    test('renders the text with overlapping search values', () => {
        setup({ ...defaultProps, searchValues: ['This', 'is'] });

        const highlights = screen.getAllByText(/This|is/, { selector: 'mark' });
        expect(highlights).toHaveLength(2);
        expect(highlights[0]).toHaveTextContent('This');
        expect(highlights[1]).toHaveTextContent('is');
    });

    test('renders the text with overlapping search values, without sorting by string length', () => {
        setup({
            ...defaultProps,
            text: 'iss is',
            searchValues: ['is', 'iss']
        });

        const highlights = screen.getAllByText(/is/, { selector: 'mark' });
        expect(highlights).toHaveLength(2);
        expect(highlights[0]).toHaveTextContent('is');
        expect(highlights[1]).toHaveTextContent('is');
    });
});
