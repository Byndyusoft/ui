# `@byndyusoft-ui/use-intersection-observer`
---
> A React hook that provides a simple and flexible way to use the Intersection Observer API, allowing you to track the visibility of DOM elements and react to their intersection with a specified root element or the viewport.

### Installation

```
npm i @byndyusoft-ui/use-intersection-observer
```

### Usage `useIntersectionObserver` hook
```js
// Use object destructuring, so you don't need to remember the exact order
const { isIntersecting, entry } = useIntersectionObserver(ref, options);

// Or array destructuring, making it easy to customize the field names
const [isIntersecting, entry] = useIntersectionObserver(ref, options);
```

#### Default

```jsx
import React, { useRef } from "react";
import {useIntersectionObserver} from "@byndyusoft-ui/use-intersection-observer";

const Component = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { isIntersecting, entry } = useIntersectionObserver(ref);

  return (
    <div class="scroll-container">
      <div ref={ref}>
        {`isIntersecting: ${isIntersecting}`}
      </div>
    </div>
  );
};
```

### Usage of `useIntersectionObserver` for Unmounted or Lazy-Loaded Components

import React, { useState } from "react";
```jsx
import React, { useState } from "react";
import { useIntersectionObserver } from "@byndyusoft-ui/use-intersection-observer";

const Component = () => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  const { isIntersecting, entry } = useIntersectionObserver({ current: ref });

  return (
    <div class="scroll-container">
      <button onClick={() => setIsVisible(p => !p)}>Toggle visible</button>
      {isVisible && (
          <div ref={setRef}>
            {`isIntersecting: ${isIntersecting}`}
          </div>
      )}
    </div>
  );
};
```

### Usage `useIntersectionObserver` with options

```jsx
import React from "react";
import { useIntersectionObserver } from "@byndyusoft-ui/use-intersection-observer";

const Component = () => {
  const tergetRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { isIntersecting, entry } = useIntersectionObserver(tergetRef, {
    root: scrollContainerRef.current,
    rootMargin: "10px",
    threshold: 0.5,
    triggerOnce: false,
    skip: false,
    isIntersectingInitial: false,
    isIntersectingFallback: false,
    trackVisibility: false, // experimental
    delay: 1500, // experimental
    onChange: (isIntersecting, entry) => console.log(isIntersecting, entry),
  });

  return (
    <div ref={containerRef} class="scroll-container">
      <div ref={tergetRef}>
        {`isIntersecting: ${isIntersecting}`}
      </div>
    </div>
  );
};
```
### Options

Provide these as the options argument in the `useIntersectionObserver ` hook.

| Name                               | Type                              | Default     | Description                                                                                                                                                                                                                                                                                             |
|------------------------------------|-----------------------------------| ----------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **root**                           | `Element`                         | `document`  | The Intersection Observer interface's read-only root property identifies the Element or Document whose bounds are treated as the bounding box of the viewport for the element which is the observer's target. If the root is `null`, then the bounds of the actual document viewport are used.          |
| **rootMargin**                     | `string`                          | `'0px'`     | Margin around the root. Can have values similar to the CSS margin property, e.g. `"10px 20px 30px 40px"` (top, right, bottom, left). Also supports percentages, to check if an element intersects with the center of the viewport for example `"-50% 0% -50% 0%"`.                                      |
| **threshold**                      | `number` or `number[]`            | `0`         | Number between `0` and `1` indicating the percentage that should be visible before triggering. Can also be an array of numbers, to create multiple trigger points.                                                                                                                                      |
| **onChange**                       | `(isIntersecting, entry) => void` | `undefined` | Call this function whenever the `isIntersecting` state changes. It will receive the `isIntersecting` boolean, alongside the current `IntersectionObserverEntry`.                                                                                                                                |
| **trackVisibility** (experimental) | `boolean`                         | `false`     | A boolean indicating whether this Intersection Observer will track visibility changes on the target.                                                                                                                                                                                                    |
| **delay** (experimental)           | `number`                          | `undefined` | A number indicating the minimum delay in milliseconds between notifications from this observer for a given target. This must be set to at least `100` if `trackVisibility` is `true`.                                                                                                                   |
| **skip**                           | `boolean`                         | `false`     | Skip creating the IntersectionObserver. You can use this to enable and disable the observer as needed. If `skip` is set while `isIntersecting`, the current state will still be kept.                                                                                                                   |
| **triggerOnce**                    | `boolean`                         | `false`     | Only trigger the observer once.                                                                                                                                                                                                                                                                         |
| **isIntersectingInitial**          | `boolean`                         | `false`     | Set the initial value of the `isIntersecting` boolean. This can be used if you expect the element to be in the viewport to start with, and you want to trigger something when it leaves.                                                                                                                |
| **isIntersectingFallback**         | `boolean`                         | `undefined` | If the `IntersectionObserver` API isn't available in the client, the default behavior is to throw an Error. You can set a specific fallback behavior, and the `isIntersecting` value will be set to this instead of failing. To set a global default, you can set it with the `defaultFallbackInView()` |
