import { RefObject, useCallback, useRef } from 'react';
import useIsomorphicLayoutEffect from '@byndyusoft-ui/use-isomorphic-layout-effect';
import useResizeObserver from '@byndyusoft-ui/use-resize-observer';
import { ITextEditorProps } from '../TextEditor.types';

function useTextEditorAutoHeight(
    ref: RefObject<HTMLDivElement>,
    enabled: boolean,
    style: ITextEditorProps['style'],
    revision: number,
    className?: string
): void {
    const styleRef = useRef(style);
    styleRef.current = style;
    const frameRef = useRef<number>();
    const hasRenderedRef = useRef(false);
    const widthRef = useRef<number>();
    const measure = useCallback((): void => {
        const element = ref.current;
        if (!enabled || !element || element.getClientRects().length === 0) {
            return;
        }
        const computed = getComputedStyle(element);
        const padding = parseFloat(computed.paddingTop || '0') + parseFloat(computed.paddingBottom || '0');
        const border = parseFloat(computed.borderTopWidth || '0') + parseFloat(computed.borderBottomWidth || '0');
        element.style.resize = 'none';
        element.style.height = 'auto';
        const natural = element.scrollHeight + (computed.boxSizing === 'border-box' ? border : -padding);
        const minimum = parseFloat(computed.minHeight) || 0;
        const maximum = parseFloat(computed.maxHeight) || Infinity;
        const height = Math.max(minimum, Math.min(maximum, natural));
        element.style.height = `${height}px`;
        element.style.overflowY = natural > height ? 'auto' : 'hidden';
    }, [enabled, ref]);
    const schedule = useCallback((): void => {
        if (frameRef.current === undefined && enabled) {
            frameRef.current = requestAnimationFrame(() => {
                frameRef.current = undefined;
                measure();
            });
        }
    }, [enabled, measure]);
    useResizeObserver(enabled ? [ref] : [], entries => {
        const { width } = entries[0].contentRect;
        if (width !== widthRef.current) {
            widthRef.current = width;
            schedule();
        }
    });
    useIsomorphicLayoutEffect(() => {
        if (hasRenderedRef.current) {
            schedule();
        }
        hasRenderedRef.current = true;
    }, [schedule, revision, style, className]);
    useIsomorphicLayoutEffect(() => {
        measure();
    }, [measure]);
    useIsomorphicLayoutEffect(() => {
        if (!enabled) {
            return;
        }
        const element = ref.current;
        window.addEventListener('resize', schedule);
        return () => {
            window.removeEventListener('resize', schedule);
            if (frameRef.current !== undefined) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = undefined;
            }
            if (element) {
                const height = styleRef.current?.height;
                element.style.height = typeof height === 'number' ? `${height}px` : height ?? '';
                element.style.overflowY = styleRef.current?.overflowY ?? '';
                element.style.resize = styleRef.current?.resize ?? '';
            }
            widthRef.current = undefined;
        };
    }, [enabled, ref, schedule]);
}

export default useTextEditorAutoHeight;
