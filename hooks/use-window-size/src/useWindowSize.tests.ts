import { act, renderHook } from '@testing-library/react-hooks';
import useWindowSize from './useWindowSize';

describe('use-window-size', () => {
    const triggerResize = (dimension: 'width' | 'height', value: number): void => {
        if (dimension === 'width') {
            (window.innerWidth as number) = value;
        } else {
            (window.innerHeight as number) = value;
        }

        window.dispatchEvent(new Event('resize'));
    };

    test('initializes', () => {
        const { result } = renderHook(() => useWindowSize());

        expect(typeof result.current).toBe('object');
        expect(typeof result.current.height).toBe('number');
        expect(typeof result.current.width).toBe('number');
    });
    test('resize', () => {
        const { result } = renderHook(() => useWindowSize());

        act(() => {
            triggerResize('height', 360);
        });

        expect(result.current.height).toBe(360);

        act(() => {
            triggerResize('width', 700);
        });

        expect(result.current.width).toBe(700);
        expect(result.current.height).toBe(360);
        act(() => {
            triggerResize('height', 700);
        });
        expect(result.current.width).toBe(700);
        expect(result.current.height).toBe(700);
    });
});
