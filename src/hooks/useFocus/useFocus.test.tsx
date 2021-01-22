import React, { FC } from 'react';
import { render, screen } from '@testing-library/react';
import useFocus from '.';

const Component: FC = () => {
    const refToFocus = useFocus();

    return (
        <div>
            <input ref={refToFocus} type="text" name="testInput" data-testid="test" />
        </div>
    );
};

describe('hook/useFocus', () => {
    test('focus is working', () => {
        render(<Component />);

        const input = screen.getByTestId('test') as HTMLInputElement;

        expect(input).toHaveFocus();
    });
});
