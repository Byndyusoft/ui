import { renderHook } from '@testing-library/react';
import useScrollLock from './useScrollLock';

describe('useScrollLock', () => {
    let targetElement: HTMLDivElement;

    beforeEach(() => {
        document.body.style.overflow = '';
        targetElement = document.createElement('div');
        targetElement.style.overflow = 'auto';
        document.body.appendChild(targetElement);
    });

    afterEach(() => {
        targetElement.remove();
    });

    it('should lock body scroll when isLocked=true', () => {
        renderHook(() => useScrollLock(true));
        expect(document.body).toHaveStyle({ overflow: 'hidden' });
    });

    it('should not lock body scroll when isLocked=false', () => {
        renderHook(() => useScrollLock(false));
        expect(document.body).toHaveStyle({ overflow: '' });
    });

    it('should handle isLocked value changes correctly', () => {
        const { rerender } = renderHook(({ isLocked }) => useScrollLock(isLocked), {
            initialProps: { isLocked: false }
        });

        expect(document.body).toHaveStyle({ overflow: '' });

        rerender({ isLocked: true });
        expect(document.body).toHaveStyle({ overflow: 'hidden' });

        rerender({ isLocked: false });
        expect(document.body).toHaveStyle({ overflow: '' });
    });

    it('should lock scroll on target element when provided', () => {
        renderHook(() => useScrollLock(true, targetElement));
        expect(targetElement).toHaveStyle({ overflow: 'hidden' });
        expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
    });

    it('should restore original overflow style on target element', () => {
        const { unmount } = renderHook(() => useScrollLock(true, targetElement));
        expect(targetElement).toHaveStyle({ overflow: 'hidden' });

        unmount();
        expect(targetElement).toHaveStyle({ overflow: 'auto' });
    });
});
