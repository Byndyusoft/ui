# `@byndyusoft-ui/flex`

---

> Flex-раскладка поверх `@byndyusoft-ui/view`: фабрика `createFlex` создаёт компонент
> под собственную сетку отступов вашего проекта.

## Установка

```sh
npm i @byndyusoft-ui/flex
```

## Фабрика createFlex (своя сетка)

`createFlex` принимает компонент, созданный `createView` из `@byndyusoft-ui/view`, —
конфигурация сетки и её типы выводятся из него, отдельно передавать её не нужно.
Изменили сетку в одном месте — типы и стили обоих компонентов обновились сами.

```tsx
// src/shared/ui/layout.ts
import { createView } from '@byndyusoft-ui/view';
import { createFlex } from '@byndyusoft-ui/flex';

export const View = createView({
    unit: '8px',
    grid: { xs: 0.25, sm: 0.5, md: 1, lg: 1.5, xl: 2, xxl: 3 }
} as const);

export const Flex = createFlex(View);
```

```tsx
import { Flex, View } from '@/shared/ui/layout';

<Flex direction="column" gap="lg" padding="xl">
    <View marginBottom="md">...</View>
    <Flex gap="sm" alignItems="center">
        ...
    </Flex>
</Flex>;
```

gap-пропсы принимают те же токены, что и spacing-пропсы View. Стили (классы отступов,
gap и flex-модификаторы) генерируются автоматически и доставляются так же, как у
`createView`: автоинъекция в браузере и компонент `LayoutStyles` для SSR — подробности
в README `@byndyusoft-ui/view`.

## Props

| Проп | Тип | Описание |
| --- | --- | --- |
| `direction` | `row \| row-reverse \| column \| column-reverse` | `flex-direction` |
| `wrap` | `nowrap \| wrap \| wrap-reverse` | `flex-wrap` |
| `justifyContent` | `flex-start \| flex-end \| center \| space-between \| space-around \| space-evenly` | `justify-content` |
| `alignContent` | варианты выше + `stretch` | `align-content` |
| `alignItems` | `flex-start \| flex-end \| center \| baseline \| stretch` | `align-items` |
| `gap`, `rowGap`, `columnGap` | токен сетки | Отступы между элементами |
| spacing-пропсы | токен сетки | Все отступы созданного View |

Остальные пропсы (`as`, `className`, нативные атрибуты) проксируются в созданный View.
