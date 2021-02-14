import React from 'react';
import { render, screen } from '@testing-library/react';
import Overlay from './Overlay';

describe('components/Overlay', () => {
    test('renders correctly with children', () => {
        render(<Overlay isOpen><div data-testid="content" /></Overlay>);

        expect(screen.getByTestId('content')).toBeInTheDocument();
        expect(document.body).toHaveStyle('overflow: hidden');
    });
});
