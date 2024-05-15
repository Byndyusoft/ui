export type TModalState = 'opened' | 'closed' | 'registered';

export type TModalsProviderState = Record<string, TModalState>;

export type TModalsProviderAction = (modalId: string) => void;

export interface IModalsProviderActions {
    register: TModalsProviderAction;
    unregister: TModalsProviderAction;
    open: TModalsProviderAction;
    close: TModalsProviderAction;
}
