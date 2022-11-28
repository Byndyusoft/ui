import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useHover from './useHover';

const TestElement = () => {
    const { isHovered, bind } = useHover();

    return (
        <div data-testid="trigger" {...bind}>
            {isHovered ? <div>Entered</div> : <div>Leaved</div>}
        </div>
    );
};

const setupHook = () => renderHook(() => useHover());

const setupTest = () => {
    const {
        result: {
            current: { isHovered }
        }
    } = setupHook();

    const { container } = render(<TestElement />);
    return { container, isHovered };
};

describe('hooks/useHover', () => {
    test('initial false values', () => {
        const { isHovered } = setupTest();

        expect(isHovered).toBeFalsy();
        expect(screen.queryByText(/leaved/gi)).toBeInTheDocument();
    });

    test('mouseHover works', () => {
        const { container, isHovered } = setupTest();

        act(() => {
            fireEvent.mouseEnter(container);
        });

        waitFor(() => {
            expect(isHovered).toBeTruthy();
            expect(screen.queryByText(/entered/gi)).toBeInTheDocument();
        });
    });

    test('mouseLeave works', () => {
        const { container, isHovered } = setupTest();

        act(() => {
            fireEvent.mouseLeave(container);
        });

        waitFor(() => {
            expect(isHovered).toBeFalsy();
            expect(screen.queryByText(/leaved/gi)).toBeInTheDocument();
        });
    });
});
