export { default as useInterval } from './useInterval';
export { default as useTimeout } from './useTimeout';
export { default as useLatestRef } from './useLatestRef';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('boop');
  }
  return a + b;
};
