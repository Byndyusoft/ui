import React from 'react';
import Link from './Link';
import { render, screen } from '@testing-library/react';

describe('Link', () => {
    test('has href attribute', () => {
        render(<Link href="http://google.com">Click me</Link>);

        const link = screen.getByText('Click me');

        expect(link).toHaveAttribute('href');
    });

    test('has not attribute when disabled', () => {
        render(
            <Link href="http://google.com" isDisabled>
                Click me
            </Link>
        );

        const link = screen.getByText('Click me');

        expect(link).toHaveClass('Link--disabled');
    });
});
