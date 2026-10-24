import { useRef } from 'react';
import useIsomorphicLayoutEffect from '@byndyusoft-ui/use-isomorphic-layout-effect';
import { TResizeObserverCallback, TResizeObserverRefs } from './useResizeObserver.types';

function useResizeObserver(refs: TResizeObserverRefs, onResize: TResizeObserverCallback): void {
    const callbackRef = useRef(onResize);
    const observerRef = useRef<ResizeObserver>();
    const observedElementsRef = useRef(new Set<Element>());

    // Обновляем обработчик в layout-фазе до синхронизации подписок.
    useIsomorphicLayoutEffect(() => {
        callbackRef.current = onResize;
    }, [onResize]);

    // Читаем current после обновления DOM при каждом рендере: объекты refs могут оставаться прежними.
    useIsomorphicLayoutEffect(() => {
        const elements = new Set<Element>();

        refs.forEach(({ current }) => {
            if (current !== null) {
                elements.add(current);
            }
        });

        if (!observerRef.current && elements.size > 0 && typeof ResizeObserver !== 'undefined') {
            observerRef.current = new ResizeObserver((entries, observer) => {
                if (observer !== observerRef.current) {
                    return;
                }

                const activeEntries = entries.filter(entry => observedElementsRef.current.has(entry.target));

                if (activeEntries.length > 0) {
                    callbackRef.current(activeEntries);
                }
            });
        }

        const observer = observerRef.current;

        if (!observer) {
            return;
        }

        const observedElements = observedElementsRef.current;

        observedElements.forEach(element => {
            if (!elements.has(element)) {
                observedElements.delete(element);
                observer.unobserve(element);
            }
        });

        elements.forEach(element => {
            if (!observedElements.has(element)) {
                observedElements.add(element);
                observer.observe(element);
            }
        });
    });

    useIsomorphicLayoutEffect(
        () => () => {
            observedElementsRef.current.clear();
            observerRef.current?.disconnect();
            observerRef.current = undefined;
        },
        []
    );
}

export default useResizeObserver;
