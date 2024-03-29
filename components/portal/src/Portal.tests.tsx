import React from 'react';
import { render, screen } from '@testing-library/react';
import Portal from './Portal';

describe('components/Portal', () => {
    test('renders correctly with children', () => {
        const { baseElement } = render(
            <Portal id="portal">
                <div data-testid="content" />
            </Portal>
        );

        expect(screen.getByTestId('content')).toBeInTheDocument();

        // eslint-disable-next-line testing-library/no-node-access
        expect(baseElement.querySelector('[id="portal"]')).toBeInTheDocument();
    });
});
