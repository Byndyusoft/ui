# `@byndyusoft-ui/with-class-names`

---

> High Order Component for css styles injection ...

## Installation

```
npm i @byndyusoft-ui/with-class-names
```

## Method "mergeClassNames"
Use this method for merge component styles with custom styles 
```ts
    mergeClassNames(targetStyles, sourceStyles, options)
```

### Option "withReplace" ("true" by default)


## Usage example

*Checkbox.tsx (Byndyusoft-UI component from "@byndyusoft-ui/Checkbox")*
```tsx
    // ... Some imports
    import { IClassNames, TClassNamesRecord } from '@byndyusoft-ui/with-class-names';
    import styles from './Checkbox.module.css';

    // List of classNames for check TypeScript
    const styleClassNames = ['container', 'disabled', 'input', 'field', 'label', 'trigger'] as const;
    
    export type TCheckboxClassNames = TClassNamesRecord<(typeof styleClassNames)[number]>;
    export const checkboxClassNames = styles as TCheckboxClassNames;

export interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement>, IClassNames<TCheckboxClassNames> {
    // ... some props
}

const Checkbox = forwardRef<HTMLInputElement, ICheckboxProps>(
    (
        {
            classNames = checkboxClassNames,
            // ... other props
        },
        forwardedRef
    ) => {
        // ... component body
    }
);
```

*Checkbox.tsx (Project component with custom styles)* 
```tsx
    import withClassNames, { mergeClassNames } from '@byndyusoft-ui/with-class-names';
    import Checkbox, { TCheckboxClassNames, checkboxClassNames } from '@byndyusoft-ui/Checkbox';
    import styles from './CheckboxWithReplacedStyles.module.css';

    const Checkbox = withClassNames(
        Checkbox,
        mergeClassNames(checkboxClassNames, styles as TCheckboxClassNames)
    );

    export default Checkbox;
```
