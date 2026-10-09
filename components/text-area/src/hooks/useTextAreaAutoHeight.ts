import { CSSProperties, useCallback, useRef } from 'react';
import useIsomorphicLayoutEffect from '@byndyusoft-ui/use-isomorphic-layout-effect';
import useResizeObserver from '@byndyusoft-ui/use-resize-observer';

function restoreStyles(element: HTMLTextAreaElement, style?: CSSProperties): void {
    element.style.height = typeof style?.height === 'number' ? `${style.height}px` : style?.height ?? '';
    element.style.overflow = '';
    element.style.overflowX = '';
    element.style.overflowY = '';

    if (style?.overflow !== undefined) {
        element.style.overflow = style.overflow;
    }

    if (style?.overflowX !== undefined) {
        element.style.overflowX = style.overflowX;
    }

    if (style?.overflowY !== undefined) {
        element.style.overflowY = style.overflowY;
    }

    element.style.resize = style?.resize ?? '';
}

function toPixels(value: string): number {
    return Number.parseFloat(value) || 0;
}

function measureHeight(element: HTMLTextAreaElement): void {
    const view = element.ownerDocument.defaultView;

    if (!view || element.getClientRects().length === 0) {
        return;
    }

    element.style.height = 'auto';
    element.style.overflowY = 'hidden';
    element.style.resize = 'none';

    const computedStyle = view.getComputedStyle(element);
    const padding = toPixels(computedStyle.paddingTop) + toPixels(computedStyle.paddingBottom);
    const border = toPixels(computedStyle.borderTopWidth) + toPixels(computedStyle.borderBottomWidth);
    // Нативная высота auto учитывает rows, обычный line-height и минимальную высоту CSS.
    const minimumHeight = toPixels(computedStyle.height);
    const contentHeight =
        computedStyle.boxSizing === 'border-box' ? element.scrollHeight + border : element.scrollHeight - padding;

    element.style.height = `${Math.max(minimumHeight, contentHeight)}px`;

    // Браузер вычисляет ограничения CSS, включая проценты и calc().
    const resolvedHeight = view.getComputedStyle(element).height;

    if (resolvedHeight.endsWith('px')) {
        element.style.height = resolvedHeight;
    }

    element.style.overflowY = element.scrollHeight > element.clientHeight ? 'auto' : 'hidden';
}

function useTextAreaAutoHeight(
    element: HTMLTextAreaElement | null,
    withAutoHeight: boolean,
    style?: CSSProperties
): void {
    const observerElementRef = useRef(element);
    const frameRef = useRef<number>();
    const activeElementRef = useRef<HTMLTextAreaElement | null>(null);
    const widthRef = useRef<number>();
    const userStyleRef = useRef(style);
    const wasEnabledRef = useRef(false);

    const cancelMeasurement = useCallback((): void => {
        if (frameRef.current !== undefined) {
            element?.ownerDocument.defaultView?.cancelAnimationFrame(frameRef.current);
            frameRef.current = undefined;
        }
    }, [element]);

    const scheduleMeasurement = useCallback((): void => {
        const view = element?.ownerDocument.defaultView;

        if (!element || !view || activeElementRef.current !== element || frameRef.current !== undefined) {
            return;
        }

        frameRef.current = view.requestAnimationFrame(() => {
            frameRef.current = undefined;

            if (activeElementRef.current === element) {
                measureHeight(element);
            }
        });
    }, [element]);

    useIsomorphicLayoutEffect(() => {
        observerElementRef.current = element;
    }, [element]);

    useResizeObserver(withAutoHeight ? [observerElementRef] : [], entries => {
        const entry = entries.find(item => item.target === element);

        if (entry && entry.contentRect.width !== widthRef.current) {
            widthRef.current = entry.contentRect.width;
            scheduleMeasurement();
        }
    });

    useIsomorphicLayoutEffect(() => {
        if (!element || !withAutoHeight) {
            return;
        }

        const view = element.ownerDocument.defaultView;
        const needsResizeFallback = typeof ResizeObserver === 'undefined';

        activeElementRef.current = element;
        widthRef.current = undefined;
        element.style.resize = 'none';
        element.addEventListener('input', scheduleMeasurement);

        if (needsResizeFallback) {
            view?.addEventListener('resize', scheduleMeasurement);
        }

        return () => {
            activeElementRef.current = null;
            cancelMeasurement();
            element.removeEventListener('input', scheduleMeasurement);
            view?.removeEventListener('resize', scheduleMeasurement);
            restoreStyles(element, userStyleRef.current);
        };
    }, [element, withAutoHeight, scheduleMeasurement, cancelMeasurement]);

    // Определяем связанную форму после обновления DOM, включая изменение атрибута form.
    useIsomorphicLayoutEffect(() => {
        const form = withAutoHeight ? element?.form : null;

        form?.addEventListener('reset', scheduleMeasurement);

        return () => form?.removeEventListener('reset', scheduleMeasurement);
    });

    // Пересчитываем высоту до отрисовки при изменении value, rows, className и style.
    useIsomorphicLayoutEffect(() => {
        userStyleRef.current = style;

        if (element && withAutoHeight) {
            cancelMeasurement();
            measureHeight(element);
        } else if (element && wasEnabledRef.current) {
            restoreStyles(element, style);
        }

        wasEnabledRef.current = withAutoHeight;
    });
}

export default useTextAreaAutoHeight;
