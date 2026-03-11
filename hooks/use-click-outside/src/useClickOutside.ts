import { useEffect, RefObject, useRef, MutableRefObject } from 'react';
import useLatestRef from '@byndyusoft-ui/use-latest-ref';

type RefLike = RefObject<HTMLElement | null> | null;

// Глобальный реестр всех активных хуков useClickOutside
const globalRegistry = new Map<
    symbol,
    {
        handlerRef: MutableRefObject<(event: PointerEvent) => void>;
        refsRef: MutableRefObject<RefLike[]>;
        disabled: boolean;
    }
>();

// Глобальный обработчик события
let globalEventHandler: ((event: PointerEvent) => void) | null = null;

// Функция для регистрации глобального обработчика
const ensureGlobalEventHandler = (): void => {
    if (!globalEventHandler) {
        globalEventHandler = (event: PointerEvent) => {
            const target = event.target;
            if (target == null || !(target instanceof Node)) {
                return;
            }

            for (const [, { handlerRef, refsRef, disabled }] of globalRegistry) {
                if (disabled) {
                    continue;
                }

                const refs = refsRef.current;
                if (!refs?.length) {
                    continue;
                }

                const isClickOutside = !refs.some(
                    ref => ref !== null && ref.current !== null && ref.current.contains(target)
                );

                if (isClickOutside) {
                    handlerRef.current(event);
                }
            }
        };

        document.addEventListener('pointerdown', globalEventHandler);
    }
};

// Функция для очистки глобального обработчика
const cleanupGlobalEventHandler = (): void => {
    if (globalEventHandler !== null && globalRegistry.size === 0) {
        document.removeEventListener('pointerdown', globalEventHandler);
        globalEventHandler = null;
    }
};

export interface IUseClickOutsideOptions {
    disabled?: boolean;
}

/**
 * Подписывается на клики вне переданных refs. Handler вызывается только если клик
 * произошёл вне всех переданных элементов (pointerdown на document).
 *
 * @param handler — вызывается с PointerEvent при клике вне всех refs
 * @param refs — массив ref'ов элементов; клик считается «внутри», если target внутри любого из них
 * @param options.disabled — при true handler не вызывается
 */

const useClickOutside = (
    handler: (event: PointerEvent) => void,
    refs: RefLike[],
    options?: IUseClickOutsideOptions
): void => {
    const hookId = useRef(Symbol());
    const isDisabled = options?.disabled ?? false;
    const handlerRef = useLatestRef(handler);
    const refsRef = useLatestRef(refs);

    useEffect(() => {
        const id = hookId.current;

        globalRegistry.set(id, {
            handlerRef,
            refsRef,
            disabled: isDisabled
        });

        ensureGlobalEventHandler();

        return () => {
            globalRegistry.delete(id);
            cleanupGlobalEventHandler();
        };
    }, [isDisabled]);
};

export default useClickOutside;
