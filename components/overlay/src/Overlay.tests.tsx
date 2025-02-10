import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Overlay from './Overlay';

describe('components/Overlay', () => {
    test('renders visible correctly', () => {
        render(<Overlay isVisible>Test</Overlay>);

        expect(screen.getByRole('presentation')).toHaveClass('fadeIn');
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

    test('applies center prop correctly', () => {
        render(
            <Overlay isVisible center>
                Test
            </Overlay>
        );

        expect(screen.getByRole('presentation')).toHaveClass('center');
    });

    test('applies fixed position when fixed prop is true', () => {
        render(
            <Overlay isVisible fixed>
                Test
            </Overlay>
        );

        expect(screen.getByRole('presentation')).toHaveStyle({ position: 'fixed' });
    });

    test('applies custom styles correctly', () => {
        render(
            <Overlay isVisible color="#FF0000" backgroundOpacity={0.8} fixed zIndex={200}>
                Test
            </Overlay>
        );

        const overlay = screen.getByRole('presentation');
        expect(overlay.getAttribute('style')).toContain(
            'z-index: 200; background-color: rgba(255, 0, 0, 0.8); position: fixed;'
        );
    });

    test('applies custom classNames', () => {
        const customClassNames = {
            container: 'custom-container',
            fadeIn: 'custom-fade-in',
            fadeOut: 'custom-fade-out',
            center: 'custom-center'
        };

        render(
            <Overlay isVisible classNames={customClassNames}>
                Test
            </Overlay>
        );

        const overlay = screen.getByRole('presentation');
        expect(overlay).toHaveClass('custom-container', 'custom-fade-in');
    });
});
