import { renderHook, act, RenderHookResult, Renderer } from '@testing-library/react-hooks';
import useIntersectionObserver from '../useIntersectionObserver';
import { observe } from '../useIntersectionObserver.utilities';
import { IUseIntersectionObserverOptions, IUseIntersectionObserverReturn } from '../useIntersectionObserver.types';

jest.mock('../useIntersectionObserver.utilities');

const setup = (
    options: IUseIntersectionObserverOptions
): RenderHookResult<IUseIntersectionObserverOptions, IUseIntersectionObserverReturn, Renderer<unknown>> =>
    renderHook(state => useIntersectionObserver(state), { initialProps: options });

describe('hooks/useIntersectionObserver', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should initialize with initialInView', () => {
        const { result } = setup({ isIntersectingInitial: true });

        expect(result.current.isIntersecting).toBe(true);
    });

    test('should call useIntersectionObserverUtilities with correct parameters', () => {
        const options = {
            threshold: 0.5,
            delay: 100,
            trackVisibility: true,
            rootMargin: '0px',
            root: null,
            triggerOnce: false,
            skip: false,
            initialInView: false,
            fallbackInView: false,
            onChange: jest.fn()
        };

        const { result } = setup(options);
        const ref = document.createElement('div');

        act(() => {
            result.current.ref(ref);
        });

        expect(observe).toHaveBeenCalledWith({
            element: ref,
            options: {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
                trackVisibility: true,
                delay: 100
            },
            callback: expect.any(Function),
            fallbackInView: false
        });
    });

    test('should update state when observe callback is called', () => {
        const onChange = jest.fn();
        const { result } = setup({ onChange });
        const ref = document.createElement('div');

        act(() => {
            result.current.ref(ref);
        });

        const callback = (observe as jest.Mock).mock.calls[0][0].callback;

        act(() => {
            callback(true, { isIntersecting: true, target: ref });
        });

        expect(result.current.isIntersecting).toBe(true);
        expect(result.current.entry).toEqual({ isIntersecting: true, target: ref });
        expect(onChange).toHaveBeenCalledWith(true, { isIntersecting: true, target: ref });
    });

    test('should not call observe if skip is true', () => {
        const { result } = setup({ skip: true });
        const ref = document.createElement('div');

        act(() => {
            result.current.ref(ref);
        });

        expect(observe).not.toHaveBeenCalled();
    });
});
