import useIntersectionObserver from './useIntersectionObserver';

export type { IUseIntersectionObserverOptions, IUseIntersectionObserverReturn } from './useIntersectionObserver.types';
export {
    intersectionMockInstance,
    mockIsIntersecting,
    setupIntersectionMocking,
    mockAllIsIntersecting,
    resetIntersectionMocking
} from './__tests__/useIntersectionObserver.mocks';
export { useIntersectionObserver };
export default useIntersectionObserver;
