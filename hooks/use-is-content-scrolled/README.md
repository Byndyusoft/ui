# `@byndyusoft-ui/use-is-content-scrolled`

---

> A React hook that tracks whether an element or window content is scrolled by x or y axis.

### Installation

```
npm i @byndyusoft-ui/use-is-content-scrolled
```

### Usage

```tsx
import { useRef } from 'react';
import useIsContentScrolled from '@byndyusoft-ui/use-is-content-scrolled';

const Component = (): JSX.Element => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { isScrolledByY } = useIsContentScrolled(contentRef);

    return (
        <div>
            {isScrolledByY && <div>Content is scrolled</div>}
            <div ref={contentRef}>Scrollable content</div>
        </div>
    );
};
```

Call the hook without arguments to track window scroll position.

### Conditional rendering

When a `ref` is passed to the hook, the element with that `ref` should be rendered by the time the component that calls the hook is mounted.

The hook subscribes to the `scroll` event after mounting. If the component is mounted while `ref.current` is still `null`, and the scrollable element appears later without remounting the component, the handler may not subscribe to that element.

For conditionally rendered content, move the hook to a child component that renders the scrollable element itself.

```tsx
const ScrollableContent = (): JSX.Element => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { isScrolledByY } = useIsContentScrolled(contentRef);

    return (
        <div>
            {isScrolledByY && <div>Content is scrolled</div>}
            <div ref={contentRef}>Scrollable content</div>
        </div>
    );
};

const Component = ({ isOpen }: { isOpen: boolean }): JSX.Element | null => {
    return isOpen ? <ScrollableContent /> : null;
};
```
