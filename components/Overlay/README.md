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

| Prop              | Type               | Default            | Description                                    |
| ----------------- | ------------------ | ------------------ | ---------------------------------------------- |
| isVisible         | boolean            | false              | Controls overlay visibility                    |
| children          | ReactNode          | -                  | Content to be rendered inside the overlay      |
| className         | string             | -                  | Additional CSS class for the overlay container |
| classNames        | IOverlayClassNames | Overlay.module.css | Object with class names for overlay elements   |
| color             | string             | -                  | Overlay background color (hex format)          |
| blur              | number             | -                  | Blur effect value in pixels                    |
| backgroundOpacity | number             | 0.6                | Background opacity (from 0 to 1)               |
| zIndex            | number             | 100                | Overlay z-index                                |
| center            | boolean            | false              | Centers the content inside overlay             |

# Notes

-   Component uses `useBodyScrollLock` hook to prevent body scrolling when overlay is visible
-   The color prop expects a hex color value (e.g., "#000000")
-   Overlay takes 100% width and height of the screen
