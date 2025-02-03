import { useCallback, useMemo, useState } from 'react';
import { IModalsProviderActions, TModalsProviderState, TModalState } from './ModalsProvider.types';

function createModalState(): TModalState {
    return 'registered';
}

export type TUseModalsProviderState = [TModalsProviderState, IModalsProviderActions];

export default function useModalsProviderState(): TUseModalsProviderState {
    const [state, setState] = useState<TModalsProviderState>({});

    const register = useCallback(
        (modalId: string) =>
            setState(prevState => {
                if (modalId in prevState) {
                    throw new Error(`Modal with id ${modalId} already exists!`);
                }

                return { ...prevState, [modalId]: createModalState() };
            }),
        []
    );

    const unregister = useCallback(
        (modalId: string) =>
            setState(prevState => {
                if (modalId in prevState) {
                    delete prevState[modalId];
                }

                return prevState;
            }),
        []
    );

    const open = useCallback(
        (modalId: string) =>
            setState(prevState => {
                if (modalId in prevState) {
                    return { ...prevState, [modalId]: 'opened' };
                }

                throw new Error(`Modal with id ${modalId} does not exist!`);
            }),
        []
    );

    const close = useCallback(
        (modalId: string) =>
            setState(prevState => {
                if (modalId in prevState) {
                    return { ...prevState, [modalId]: 'closed' };
                }

                throw new Error(`Modal with id ${modalId} does not exist!`);
            }),
        []
    );

    const actions = useMemo(() => ({ register, unregister, open, close }), [register, open, close, unregister]);

    return [state, actions];
}
