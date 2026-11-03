# `@byndyusoft-ui/flex`

---

> Flex-раскладка поверх `@byndyusoft-ui/view`: фабрика `createFlex` создаёт компонент
> под набор значений отступов вашего проекта.

## Установка

```sh
npm i @byndyusoft-ui/flex
```

## Фабрика createFlex (свои значения отступов)

`createFlex` принимает компонент, созданный `createView` из `@byndyusoft-ui/view`, —
значения `values` и их типы выводятся из него, отдельно передавать их не нужно.
Изменили `values` в одном месте — типы и стили обоих компонентов обновились сами.

```tsx
// src/shared/ui/layout.ts
import { createView } from '@byndyusoft-ui/view';
import { createFlex } from '@byndyusoft-ui/flex';

export const View = createView({
    step: { value: 8, unit: 'px' },
    values: { xs: 0.25, sm: 0.5, md: 1, lg: 1.5, xl: 2, xxl: 3 }
} as const);

export const Flex = createFlex(View);
```

```tsx
import { Flex, View } from '@/shared/ui/layout';

<Flex direction="column" gap="lg" p="xl">
    <View mb="md">...</View>
    <Flex gap="sm" alignItems="center">
        ...
    </Flex>
</Flex>;
```

gap-пропсы принимают те же токены, что и spacing-пропсы View. Стили (классы отступов,
gap и flex-модификаторы) генерируются автоматически и доставляются так же, как у
`createView`: автоинъекция в браузере и компонент `ViewStylesInjector` для SSR — подробности
в README `@byndyusoft-ui/view`. Шаг `step` фиксируется при создании фабрики, а gap и отступы
выводятся готовыми CSS-длинами; дробные множители токенов поддерживаются. Flex наследует
`prefix` созданного View (по умолчанию `bsui`), поэтому его классы используют тот же namespace.
Flex поддерживает короткие aliases spacing-пропсов View
(`m`, `mt`, `mh`, `p`, `pt`, `ph` и остальные); правила приоритета, aliases и сокращения
классов описаны в README View.

Чтобы использовать отдельный namespace, задайте `prefix` в `createView`; он автоматически
применится и к классам Flex:

```tsx
const View = createView({
    step: { value: 1, unit: 'rem' },
    prefix: 'app',
    values: { sm: 0.5, md: 1 }
} as const);
const Flex = createFlex(View); // классы app-flex, app-flex--g-md и т.п.
```

## Props

| Проп                         | Тип                                                                                 | Описание                  |
| ---------------------------- | ----------------------------------------------------------------------------------- | ------------------------- |
| `direction`                  | `row \| row-reverse \| column \| column-reverse`                                    | `flex-direction`          |
| `wrap`                       | `nowrap \| wrap \| wrap-reverse`                                                    | `flex-wrap`               |
| `justifyContent`             | `flex-start \| flex-end \| center \| space-between \| space-around \| space-evenly` | `justify-content`         |
| `alignContent`               | варианты выше + `stretch`                                                           | `align-content`           |
| `alignItems`                 | `flex-start \| flex-end \| center \| baseline \| stretch`                           | `align-items`             |
| `gap`, `rowGap`, `columnGap` | токен `values`                                                                      | Отступы между элементами  |
| spacing-пропсы View          | токен `values`                                                                      | Полные и короткие отступы |

Остальные пропсы (`as`, `className`, нативные атрибуты) проксируются в созданный View.

## Утилиты и типы

Из точки входа пакета также доступны:

-   `buildCss(config)` — генерация CSS для `gap`, `rowGap` и `columnGap`.
-   `flexModifiersCss` — CSS базового класса и модификаторов раскладки.
-   `blockClassName` — базовый класс `bsui-flex`.
-   `getDirectionModifier`, `getWrapModifier`, `getAlignContentModifier`,
    `getAlignItemsModifier`, `getJustifyContentModifier` — имена классов модификаторов;
    без аргумента возвращают пустую строку.
-   `directions`, `flexWraps`, `alignContentVariants`, `alignItemsVariants`,
    `justifyContentVariants` — наборы допустимых значений, например для элементов управления.

Публичные типы: `ICreatedFlex`, `ICreatedFlexProps`, `TFlexDirection`, `TFlexWrap`,
`TAlignContent`, `TAlignItems` и `TJustifyContent`. Созданный компонент имеет
`displayName = 'Flex'` и хранит конфигурацию View в `Flex.config`. Передача DOM-ref не поддерживается.
