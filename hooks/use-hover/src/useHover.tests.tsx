import React, { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useHover from './useHover';

function Setup() {
    const ref = useRef(null);
    const isHovered = useHover(ref);

    return (
        <div aria-label="trigger" ref={ref}>
            {isHovered ? <div>Hovered</div> : <div>Unhovered</div>}
        </div>
    );
}

describe('hooks/useHover', () => {
    test('initial state', () => {
        render(<Setup />);

        const triggerElement = screen.getByLabelText('trigger');

        expect(triggerElement).toHaveTextContent('Unhovered');
    });

    test('hover and unhover behavior', () => {
        render(<Setup />);

        const triggerElement = screen.getByLabelText('trigger');

        userEvent.hover(triggerElement);
        expect(triggerElement).toHaveTextContent('Hovered');
        userEvent.unhover(triggerElement);
        expect(triggerElement).toHaveTextContent('Unhovered');
    });
});
