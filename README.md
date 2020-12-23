# @byndyusoft/ui

## Develop

1. git clone `git@github.com:Byndyusoft/ui.git`
2. run `yarn install`
3. run `yarn storybook`

---

## Components

### Button

```JavaScript
import { Button, ButtonVariant } from '@pixelfixer/ui-test';
// Use default styles
import '@byndyusoft/ui/dist/Button/Button.css';
...
<Button variant={ButtonVariant.Primary}>Button!</Button>
```

Переопределение дефолтных стилей

```css
.Button {
    --background-primary: #15722b;
}
```

## Hooks

useInterval

useTimeout
