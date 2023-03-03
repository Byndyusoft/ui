import React, { useCallback, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useEventListener from './useEventListener';

interface ISetupProps {
    onClick: () => void;
}

const Setup = ({ onClick }: ISetupProps): JSX.Element => {
    const ref = useRef(null);

    const handle = useCallback(() => onClick(), [onClick]);

    useEventListener('click', handle);

    return (
        <button type="button" ref={ref}>
            Click on me!
        </button>
    );
};

describe('hooks/useEventListener', () => {
    test('adds event listener', async () => {
        const onClick = jest.fn();

        render(<Setup onClick={onClick} />);

        await userEvent.click(screen.getByRole('button', { name: 'Click on me!' }));

        expect(onClick).toBeCalledTimes(1);
    });
});
