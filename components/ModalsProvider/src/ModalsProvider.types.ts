export type TModalState = 'opened' | 'closed' | 'registered';

export interface IModalState {
    isOpen: boolean;
}

export type TModalsProviderState = Record<string, TModalState>;

export type TModalsProviderAction = (modalId: string) => void;

export interface IModalsProviderActions {
    register: TModalsProviderAction;
    unregister: TModalsProviderAction;
    open: TModalsProviderAction;
    close: TModalsProviderAction;
}
