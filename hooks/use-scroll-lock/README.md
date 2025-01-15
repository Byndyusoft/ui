# useScrollLock

A React hook for locking element scroll.

This hook manages the scrollability of either the body element or a specified target element. When `isLocked` is set to `true`, scrolling is prevented by setting `overflow: hidden` on the target element. When set to `false` or when the component unmounts, the original overflow value is restored.

## Installation

```
npm install @byndyusoft-ui/use-body-scroll-lock
```

## Usage

```typescript
import useScrollLock from '@byndyusoft-ui/use-body-scroll-lock';

// Basic usage
function Modal({ isOpen }) {
    useScrollLock(isOpen);

    return isOpen && <div className="modal">{/* modal content */}</div>;
}

// Usage with custom target element
function CustomScrollLock({ isLocked }) {
    const containerRef = useRef<HTMLDivElement>(null);
    useScrollLock(isLocked, containerRef.current);

    return (
        <div ref={containerRef} className="scrollable-container">
            {/* content */}
        </div>
    );
}
```

## API

```typescript
useScrollLock(isLocked?: boolean, target?: HTMLElement | null): void
```

#### Parameters

-   `isLocked` (boolean) - When `true`, body scroll will be locked. When `false` or `undefined`, scroll will be unlocked.
-   `target` (HTMLElement | null) - Optional. The HTML element to lock scrolling on. If not provided or null, defaults to document.body.
