# `@byndyusoft-ui/use-click-outside`

A React hook that invokes the given handler when a click (pointerdown) occurs outside the specified elements.

## Installation

```sh
npm i @byndyusoft-ui/use-click-outside
# or
yarn add @byndyusoft-ui/use-click-outside
```

## Dependencies

- `@byndyusoft-ui/use-latest-ref`

## Behavior

- Subscribes to `pointerdown` on `document`. The handler is only called when the click occurs **outside all** elements passed in `refs` (i.e. `event.target` is not contained in any of `ref.current`).
- A single global listener on the document is used for all hook instances.
- The `disabled: true` option disables invoking the handler for that instance.
- The refs array may include `null` entries; they are ignored during the check.

## Signature

```ts
useClickOutside(
  handler: (event: PointerEvent) => void,
  refs: (RefObject<HTMLElement | null> | null)[],
  options?: { disabled?: boolean }
): void
```
