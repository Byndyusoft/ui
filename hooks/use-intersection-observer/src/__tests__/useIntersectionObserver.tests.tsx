import { render } from '@testing-library/react';
import { vi } from 'vitest';
import React, { useEffect, useState } from 'react';
import { IUseIntersectionObserverOptions } from '../useIntersectionObserver.types';
import {
    intersectionMockInstance,
    mockAllIsIntersecting,
    mockIsIntersecting,
    resetIntersectionMocking,
    setupIntersectionMocking
} from './useIntersectionObserver.mocks';
import useIntersectionObserver from '../useIntersectionObserver';

interface IComponentProps {
    options?: IUseIntersectionObserverOptions;
    unmount?: boolean;
}

const HookComponent = ({ options, unmount }: IComponentProps) => {
    const [ref, setRef] = useState<Element | null>(null);
    const [isIntersecting] = useIntersectionObserver({ current: ref }, options);
    return (
        <div data-testid="wrapper" ref={!unmount ? setRef : undefined}>
            {isIntersecting.toString()}
        </div>
    );
};

const LazyHookComponent = ({ options, unmount }: IComponentProps) => {
    const [ref, setRef] = useState<Element | null>(null);

    const [isLoading, setIsLoading] = React.useState(true);

    const [isIntersecting] = useIntersectionObserver({ current: ref }, options);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) return <div>Loading</div>;

    return (
        <div data-testid="wrapper" ref={!unmount ? setRef : undefined}>
            {isIntersecting.toString()}
        </div>
    );
};

const HookComponentWithEntry = ({ options, unmount }: IComponentProps) => {
    const [ref, setRef] = useState<Element | null>(null);

    const { entry } = useIntersectionObserver({ current: ref }, options);
    return (
        <div data-testid="wrapper" ref={!unmount ? setRef : undefined}>
            {entry && Object.entries(entry).map(([key, value]) => `${key}: ${value}`)}
        </div>
    );
};

const setupHookComponent = (props: IComponentProps = {}) => render(<HookComponent {...props} />);
const setupLazyHookComponent = (props: IComponentProps = {}) => render(<LazyHookComponent {...props} />);
const setupHookComponentWithEntry = (props: IComponentProps = {}) => render(<HookComponentWithEntry {...props} />);

describe('hooks/useIntersectionObserver', () => {
    beforeEach(() => {
        setupIntersectionMocking(vi.fn());
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

    test('should create a hook isIntersecting', () => {
        const { getByText } = setupHookComponent();
        mockAllIsIntersecting(true);

        expect(getByText('true')).toBeInTheDocument();
    });

    test('should mock thresholds', () => {
        const { getByText } = setupHookComponent({
            options: { threshold: [0.5, 1] }
        });
        mockAllIsIntersecting(0);
        expect(getByText('false')).toBeInTheDocument();

        mockAllIsIntersecting(0.5);
        expect(getByText('true')).toBeInTheDocument();

        mockAllIsIntersecting(1);
        expect(getByText('true')).toBeInTheDocument();
    });

    test('should create a hook with isIntersectingInitial', () => {
        const { getByText } = setupHookComponent({
            options: { isIntersectingInitial: true }
        });
        expect(getByText('true')).toBeInTheDocument();

        mockAllIsIntersecting(false);
        expect(getByText('false')).toBeInTheDocument();
    });

    test('should trigger a hook leaving view', () => {
        const { getByText } = setupHookComponent();
        mockAllIsIntersecting(true);
        mockAllIsIntersecting(false);

        expect(getByText('false')).toBeInTheDocument();
    });

    test('should respect trigger once', () => {
        const { getByText } = setupHookComponent({
            options: { triggerOnce: true }
        });
        mockAllIsIntersecting(true);
        mockAllIsIntersecting(false);

        expect(getByText('true')).toBeInTheDocument();
    });

    test('should trigger onChange', () => {
        const onChange = vi.fn();
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
        expect(getByText('false')).toBeInTheDocument();

        rerender(<HookComponent options={{ skip: false }} />);
        mockAllIsIntersecting(true);
        expect(getByText('true')).toBeInTheDocument();
    });

    test('should not reset current state if changing skip', () => {
        const { getByText, rerender } = setupHookComponent({ options: { skip: false } });
        mockAllIsIntersecting(true);
        rerender(<HookComponent options={{ skip: true }} />);

        expect(getByText('true')).toBeInTheDocument();
    });

    test('should unmount the hook', () => {
        const { unmount, getByTestId } = setupHookComponent();
        const wrapper = getByTestId('wrapper');
        const instance = intersectionMockInstance(wrapper);
        unmount();

        expect(instance.unobserve).toHaveBeenCalledWith(wrapper);
    });

    test('isIntersecting should be false when component is unmounted', () => {
        const { rerender, getByText } = setupHookComponent({ unmount: false });
        mockAllIsIntersecting(true);
        expect(getByText('true')).toBeInTheDocument();

        rerender(<HookComponent unmount />);
        expect(getByText('false')).toBeInTheDocument();
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

        expect(getByText(/intersectionRatio: 0.5/)).toBeInTheDocument();
    });
});
