import { render, screen } from '@testing-library/react';
import React, { lazy, useCallback } from 'react';
import { IUseIntersectionObserverOptions } from '../useIntersectionObserver.types';
import {
    intersectionMockInstance,
    mockAllIsIntersecting,
    mockIsIntersecting,
    resetIntersectionMocking,
    setupIntersectionMocking
} from '../utilities/useIntersectionObserver.tests.utilities';
import useIntersectionObserver from '../useIntersectionObserver';

interface IComponentProps {
    options?: IUseIntersectionObserverOptions;
    unmount?: boolean;
}

const HookComponent = ({ options, unmount }: IComponentProps) => {
    const { ref, isIntersecting } = useIntersectionObserver(options);
    return (
        <div data-testid="wrapper" ref={!unmount ? ref : undefined}>
            {isIntersecting.toString()}
        </div>
    );
};

const LazyHookComponent = ({ options, unmount }: IComponentProps) => {
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(false);
    }, []);

    const { ref, isIntersecting } = useIntersectionObserver(options);

    if (isLoading) return <div>Loading</div>;

    return (
        <div data-testid="wrapper" ref={!unmount ? ref : undefined}>
            {isIntersecting.toString()}
        </div>
    );
};

const HookComponentWithEntry = ({ options, unmount }: IComponentProps) => {
    const { ref, entry } = useIntersectionObserver(options);
    return (
        <div data-testid="wrapper" ref={!unmount ? ref : undefined}>
            {entry && Object.entries(entry).map(([key, value]) => `${key}: ${value}`)}
        </div>
    );
};

const setupHookComponent = (props: IComponentProps = {}) => render(<HookComponent {...props} />);
const setupLazyHookComponent = (props: IComponentProps = {}) => render(<LazyHookComponent {...props} />);
const setupHookComponentWithEntry = (props: IComponentProps = {}) => render(<HookComponentWithEntry {...props} />);

describe('hooks/useIntersectionObserver', () => {
    beforeEach(() => {
        setupIntersectionMocking(jest.fn);
    });
    afterEach(() => {
        resetIntersectionMocking();
    });

    test('should create a hook', () => {
        const { getByTestId } = setupHookComponent();
        const wrapper = getByTestId('wrapper');
        const instance = intersectionMockInstance(wrapper);

        expect(instance.observe).toHaveBeenCalledWith(wrapper);
    });

    test('should create a hook with array threshold', () => {
        const { getByTestId } = setupHookComponent({
            options: { threshold: [0.1, 1] }
        });
        const wrapper = getByTestId('wrapper');
        const instance = intersectionMockInstance(wrapper);

        expect(instance.observe).toHaveBeenCalledWith(wrapper);
    });

    test('should create a lazy hook', () => {
        const { getByTestId } = setupLazyHookComponent();
        const wrapper = getByTestId('wrapper');
        const instance = intersectionMockInstance(wrapper);

        expect(instance.observe).toHaveBeenCalledWith(wrapper);
    });

    test('should create a hook inView', () => {
        const { getByText } = setupHookComponent();

        mockAllIsIntersecting(true);

        getByText('true');
    });

    test('should mock thresholds', () => {
        const { getByText } = setupHookComponent({
            options: { threshold: [0.5, 1] }
        });
        mockAllIsIntersecting(0);
        getByText('false');
        mockAllIsIntersecting(0.5);
        getByText('true');
        mockAllIsIntersecting(1);
        getByText('true');
    });

    test('should create a hook with initialInView', () => {
        const { getByText } = setupHookComponent({
            options: { isIntersectingInitial: true }
        });

        getByText('true');
        mockAllIsIntersecting(false);
        getByText('false');
    });

    test('should trigger a hook leaving view', () => {
        const { getByText } = setupHookComponent();
        mockAllIsIntersecting(true);
        mockAllIsIntersecting(false);
        getByText('false');
    });

    test('should respect trigger once', () => {
        const { getByText } = setupHookComponent({
            options: { triggerOnce: true }
        });
        mockAllIsIntersecting(true);
        mockAllIsIntersecting(false);

        getByText('true');
    });

    test('should trigger onChange', () => {
        const onChange = jest.fn();
        setupHookComponent({ options: { onChange } });

        mockAllIsIntersecting(true);
        expect(onChange).toHaveBeenLastCalledWith(
            true,
            expect.objectContaining({ intersectionRatio: 1, isIntersecting: true })
        );

        mockAllIsIntersecting(false);
        expect(onChange).toHaveBeenLastCalledWith(
            false,
            expect.objectContaining({ intersectionRatio: 0, isIntersecting: false })
        );
    });

    test('should respect skip', () => {
        const { getByText, rerender } = setupHookComponent({ options: { skip: true } });
        mockAllIsIntersecting(false);
        getByText('false');

        rerender(<HookComponent options={{ skip: false }} />);
        mockAllIsIntersecting(true);
        getByText('true');
    });

    test('should not reset current state if changing skip', () => {
        const { getByText, rerender } = setupHookComponent({ options: { skip: false } });

        mockAllIsIntersecting(true);
        rerender(<HookComponent options={{ skip: true }} />);
        getByText('true');
    });

    test('should unmount the hook', () => {
        const { unmount, getByTestId } = setupHookComponent();
        const wrapper = getByTestId('wrapper');
        const instance = intersectionMockInstance(wrapper);
        unmount();
        expect(instance.unobserve).toHaveBeenCalledWith(wrapper);
    });

    test('inView should be false when component is unmounted', () => {
        const { rerender, getByText } = setupHookComponent({ unmount: false });
        mockAllIsIntersecting(true);

        getByText('true');
        rerender(<HookComponent unmount />);
        getByText('false');
    });

    test('should handle trackVisibility', () => {
        setupHookComponent({ options: { trackVisibility: true, delay: 100 } });
        mockAllIsIntersecting(true);
    });

    test('should set intersection ratio as the largest threshold smaller than trigger', () => {
        const { getByTestId, getByText } = setupHookComponentWithEntry({
            options: { threshold: [0, 0.25, 0.5, 0.75, 1] }
        });

        const wrapper = getByTestId('wrapper');
        mockIsIntersecting(wrapper, 0.5);
        getByText(/intersectionRatio: 0.5/);
    });
});
