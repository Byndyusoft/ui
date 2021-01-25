import React, { FC } from 'react';
import { render, screen } from '@testing-library/react';
import useAutofocus from '.';

const Component: FC = () => {
    const refToAutofocus = useAutofocus();

    return (
        <div>
            <input ref={refToAutofocus} type="text" name="testInput" data-testid="test" />
        </div>
    );
};

describe('hook/useAutofocus', () => {
    test('Component is focused on referred node', () => {
        render(<Component />);

        const input = screen.getByTestId('test') as HTMLInputElement;

        expect(input).toHaveFocus();
    });
});
