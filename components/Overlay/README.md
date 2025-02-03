# `@byndyusoft-ui/overlay`

The Overlay component creates a semi-transparent layer over content.

## Installation

```bash
npm install @byndyusoft-ui/overlay
```

## Usage

```tsx
import { Overlay } from '@byndyusoft-ui/overlay';

function Example() {
    return (
        <div>
            <div>Main content</div>
            <Overlay isVisible={true} color="#000000" blur={5} center>
                <div>Overlay content</div>
            </Overlay>
        </div>
    );
}
```

## Props

| Prop              | Type               | Default            | Description                                                               |
| ----------------- | ------------------ | ------------------ | ------------------------------------------------------------------------- |
| children          | ReactNode          | -                  | Content to be rendered inside the overlay                                 |
| className         | string             | -                  | Additional CSS class for the overlay container                            |
| classNames        | IOverlayClassNames | Overlay.module.css | Object with class names for overlay elements                              |
| refElement        | HTMLElement        | -                  | Reference to the element that will be used lock scroll                    |
| color             | string             | #000000            | Overlay background color (hex format)                                     |
| backgroundOpacity | number             | 0.6                | Background opacity (from 0 to 1)                                          |
| blur              | number             | 10                 | Blur effect value in pixels                                               |
| zIndex            | number             | 100                | Overlay z-index                                                           |
| isVisible         | boolean            | false              | Controls overlay visibility                                               |
| center            | boolean            | false              | Centers the content inside overlay                                        |
| fixed             | boolean            | false              | Determines whether overlay should have fixed position instead of absolute |

# Notes

-   Component uses `useBodyScrollLock` hook to prevent body scrolling when overlay is visible
-   The color prop expects a hex color value (e.g., "#000000")
-   The refElement prop is used to lock scroll of the element when overlay is visible
