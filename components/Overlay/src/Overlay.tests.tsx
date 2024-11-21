import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Overlay from './Overlay';

describe('components/Overlay', () => {
    test('renders visible correctly', () => {
        render(<Overlay isVisible>Test</Overlay>);

        expect(screen.getByRole('presentation')).toHaveClass('isVisible');
        expect(screen.getByText('Test')).toBeInTheDocument();
    });

    test('renders invisible', () => {
        render(<Overlay isVisible={false}>Test</Overlay>);

        expect(screen.getByRole('presentation')).not.toHaveClass('isVisible');
        expect(screen.queryByText('Test')).not.toBeInTheDocument();
    });

    test('handles click', async () => {
        const onClick = jest.fn();

        render(
            <Overlay isVisible={false} onClick={onClick}>
                Test
            </Overlay>
        );

        await userEvent.click(screen.getByRole('presentation'));

        expect(onClick).toBeCalledTimes(1);
    });

    test('renders with custom className', () => {
        render(
            <Overlay isVisible className="custom-class">
                Test
            </Overlay>
        );

        expect(screen.getByRole('presentation')).toHaveClass('custom-class');
    });

    test('renders with custom data-testid', () => {
        render(
            <Overlay isVisible data-testid="custom-overlay">
                Test
            </Overlay>
        );

        expect(screen.getByTestId('custom-overlay')).toBeInTheDocument();
    });
});
