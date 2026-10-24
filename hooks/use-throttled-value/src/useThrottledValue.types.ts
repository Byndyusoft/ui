import { SetStateAction } from 'react';
import { IThrottledCallback } from '@byndyusoft-ui/use-throttled-callback';

export type TUseThrottledValueReturn<T> = [T, IThrottledCallback<[SetStateAction<T>]>];
