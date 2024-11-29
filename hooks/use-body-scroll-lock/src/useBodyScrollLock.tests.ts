import { renderHook } from '@testing-library/react-hooks';
import useBodyScrollLock from './useBodyScrollLock';

describe('useBodyScrollLock', () => {
    beforeEach(() => {
        document.body.style.overflow = '';
    });

    it('should lock body scroll when isLocked=true', () => {
        renderHook(() => useBodyScrollLock(true));
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('should not lock body scroll when isLocked=false', () => {
        renderHook(() => useBodyScrollLock(false));
        expect(document.body.style.overflow).toBe('');
    });

    it('should handle isLocked value changes correctly', () => {
        const { rerender } = renderHook(({ isLocked }) => useBodyScrollLock(isLocked), {
            initialProps: { isLocked: false }
        });

        expect(document.body.style.overflow).toBe('');

        rerender({ isLocked: true });
        expect(document.body.style.overflow).toBe('hidden');

        rerender({ isLocked: false });
        expect(document.body.style.overflow).toBe('');
    });
});
