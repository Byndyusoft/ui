# useBodyScrollLock

A React hook for locking body element scroll.

This hook manages the scrollability of the page's body element. When `isLocked` is set to `true`, scrolling is prevented by setting `overflow: hidden`. When set to `false` or when the component unmounts, scrolling is restored.

## Installation

```
npm install @byndyusoft-ui/use-body-scroll-lock
```

## Usage

```typescript
import useBodyScrollLock from '@byndyusoft-ui/use-body-scroll-lock';

function Modal({ isOpen }) {
    useBodyScrollLock(isOpen);

    return isOpen && <div className="modal">{/* modal content */}</div>;
}
```

## API

```typescript
 useBodyScrollLock(isLocked: boolean): void
```

#### Parameters

-   `isLocked` (boolean) - When `true`, body scroll will be locked. When `false`, scroll will be unlocked.
