import React from 'react';
import { render, screen, act } from '@testing-library/react';
import TextInput from '.';

describe('components/TextInput', () => {
    test('TextInput isDisabled prop works', () => {
        render(<TextInput isDisabled aria-label="test-input" name="test" />);

        act(() => {
            const input = screen.getByLabelText('test-input') as HTMLInputElement;

            expect(input.disabled).toBeTruthy();
        });
    });

    test.todo('TextInput isInvalid prop works');
});
