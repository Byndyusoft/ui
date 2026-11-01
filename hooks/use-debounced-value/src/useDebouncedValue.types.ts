import { SetStateAction } from 'react';
import { IDebouncedCallback } from '@byndyusoft-ui/use-debounced-callback';

export type TUseDebouncedValueReturn<T> = [T, IDebouncedCallback<[SetStateAction<T>]>];
