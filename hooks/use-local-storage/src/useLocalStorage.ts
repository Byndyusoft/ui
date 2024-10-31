import { LocalStorageService } from '@byndyusoft-ui/local-storage';

export interface IUseLocalStorageActions {}

export type TUseLocalStorage<TValue> = [TValue, IUseLocalStorageActions];

export default function useLocalStorage<TValue>(key: string, initialValue: TValue): TUseLocalStorage<TValue> {
    return [initialValue, {}];
}
