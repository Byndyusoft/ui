import { optionsToId, observe } from '../utilities/useIntersectionObserver.utilities';
import {
    intersectionMockInstance,
    mockIsIntersecting,
    resetIntersectionMocking,
    setupIntersectionMocking
} from './useIntersectionObserver.mocks';

describe('hooks/useIntersectionObserver/utilities', () => {
    beforeEach(() => {
        setupIntersectionMocking(vi.fn);
    });
    afterEach(() => {
        resetIntersectionMocking();
    });

    test('should be able to use observe', () => {
        const element = document.createElement('div');
        const callback = vi.fn();
        const unmount = observe({
            element,
            callback,
            options: { threshold: 0.1 },
            isIntersectingFallback: false
        });

        mockIsIntersecting(element, true);
        expect(callback).toHaveBeenCalled();

        unmount();
        expect(() => intersectionMockInstance(element)).toThrow(
            'Failed to find IntersectionObserver for element. Is it being observed?'
        );
    });

    test('should convert options to id', () => {
        expect(
            optionsToId({
                root: document.createElement('div'),
                rootMargin: '10px 10px',
                threshold: [0, 1]
            })
        ).toBe('root_1,rootMargin_10px 10px,threshold_0,1');

        expect(
            optionsToId({
                root: null,
                rootMargin: '10px 10px',
                threshold: 1
            })
        ).toBe('root_0,rootMargin_10px 10px,threshold_1');

        expect(
            optionsToId({
                threshold: 0,
                // @ts-expect-error
                trackVisibility: true,
                delay: 500
            })
        ).toBe('delay_500,threshold_0,trackVisibility_true');

        expect(optionsToId({ threshold: 0 })).toBe('threshold_0');

        expect(optionsToId({ threshold: [0, 0.5, 1] })).toBe('threshold_0,0.5,1');
    });
});
