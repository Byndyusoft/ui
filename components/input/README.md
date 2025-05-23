# `@byndyusoft-ui/input`

The `input` component is a React component designed to provide a flexible and customizable input field for your applications.

## Installation

```sh
npm i @byndyusoft-ui/input
# or
yarn add @byndyusoft-ui/input
```

### Customization with CSS Variables

You can customize the appearance of the input component by overriding the following CSS variables:

```css
:root {
    --input-height-s: 1.5rem;
    --input-height-m: 2rem;
    --input-height-l: 2.5rem;
    --input-height-xl: 3rem;
    
    --input-font-size-s: 0.75rem;
    --input-font-size-m: 0.875rem;
    --input-font-size-l: 1rem;
    --input-font-size-xl: 1.25rem;

    --input-border-radius: 0.375rem;
    --input-padding-x: 0.5rem;
    --input-transition: box-shadow ease 200ms, border ease 200ms;
    --input-disabled-opacity: 0.5;
    --input-container-gap: 0.25rem;

    --input-main-color: #343434;
    --input-focus-color: #000000;
    --input-invalid-color: #ff0000;

    --input-line-border: 1px solid var(--input-main-color);
    --input-line-focus-border: 1px solid var(--input-focus-color);
    --input-line-focus-box-shadow: 0 -1px 0 0 var(--input-focus-color) inset;
    --input-invalid-line-border: 1px solid var(--input-invalid-color);
    --input-invalid-line-box-shadow: 0 -1px 0 0 var(--input-invalid-color) inset;

    --input-outline-border: 1px solid var(--input-main-color);
    --input-outline-focus-border: 1px solid var(--input-focus-color);
    --input-outline-focus-box-shadow: 0 0 0 1px var(--input-focus-color) inset;
    --input-invalid-outline-border: 1px solid var(--input-invalid-color);
    --input-invalid-outline-box-shadow: 0 0 0 1px var(--input-invalid-color) inset;
}
```


## License
This project is licensed under the ISC License.
