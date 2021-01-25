import React, { FC } from 'react';
import { render, screen } from '@testing-library/react';
import useAutofocus from '.';

const Component: FC = () => {
    const refToAutofocus = useAutofocus();

    return (
        <div>
            <input ref={refToAutofocus} type="text" name="testInput" aria-labelledby="textbox" />
        </div>
    );
};

describe('hook/useAutofocus', () => {
    test('Component is focused on referred node', () => {
        render(<Component />);

        const input = screen.getByRole('textbox') as HTMLInputElement;

        expect(input).toHaveFocus();
    });
});
