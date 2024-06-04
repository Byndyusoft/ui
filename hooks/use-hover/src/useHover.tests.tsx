import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import useHover from './useHover';

function Setup(): JSX.Element {
    const ref = useRef(null);
    const isHovered = useHover(ref);

    return (
        <div aria-label="trigger" ref={ref}>
            {isHovered ? <div>Hovered</div> : <div>Leaved</div>}
        </div>
    );
}

describe('hooks/useHover', () => {
    test('initial state', () => {
        render(<Setup />);

        const triggerElement = screen.getByLabelText('trigger');

        expect(triggerElement).toHaveTextContent('Leaved');
    });

    test('hover and leave behavior', async () => {
        render(<Setup />);

        const triggerElement = screen.getByLabelText('trigger');

        await userEvent.hover(triggerElement);

        expect(triggerElement).toHaveTextContent('Hovered');

        await userEvent.unhover(triggerElement);

        expect(triggerElement).toHaveTextContent('Leaved');
    });
});
