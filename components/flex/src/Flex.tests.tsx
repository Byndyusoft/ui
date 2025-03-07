import React from 'react';
import { render, screen } from '@testing-library/react';
import Flex from './Flex';

describe('components/Flex', () => {
    test('renders correctly', () => {
        render(<Flex>Test</Flex>);

        expect(screen.getByText('Test')).toBeInTheDocument();
    });
});
