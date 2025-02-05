import { renderHook } from '@testing-library/react-hooks';
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
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('should not lock body scroll when isLocked=false', () => {
        renderHook(() => useScrollLock(false));
        expect(document.body.style.overflow).toBe('');
    });

    it('should handle isLocked value changes correctly', () => {
        const { rerender } = renderHook(({ isLocked }) => useScrollLock(isLocked), {
            initialProps: { isLocked: false }
        });

        expect(document.body.style.overflow).toBe('');

        rerender({ isLocked: true });
        expect(document.body.style.overflow).toBe('hidden');

        rerender({ isLocked: false });
        expect(document.body.style.overflow).toBe('');
    });

    it('should lock scroll on target element when provided', () => {
        renderHook(() => useScrollLock(true, targetElement));
        expect(targetElement.style.overflow).toBe('hidden');
        expect(document.body.style.overflow).not.toBe('hidden');
    });

    it('should restore original overflow style on target element', () => {
        const { unmount } = renderHook(() => useScrollLock(true, targetElement));
        expect(targetElement.style.overflow).toBe('hidden');

        unmount();
        expect(targetElement.style.overflow).toBe('auto');
    });
});
