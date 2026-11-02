# `@byndyusoft-ui/view`

---

> Фабрика базового компонента раскладки с типизированными отступами. `createView`
> создаёт компонент под собственную сетку отступов вашего проекта.

## Установка

```sh
npm i @byndyusoft-ui/view
```

## Фабрика createView (своя сетка)

`createView` принимает конфигурацию — базовый юнит и набор именованных токенов с
множителями юнита — и возвращает компонент, типизированный токенами вашей сетки.
Объект конфигурации обязательно помечайте `as const`: типы токенов выводятся из него.

```tsx
// src/shared/ui/layout.ts
import { createView } from '@byndyusoft-ui/view';

export const View = createView({
    unit: '8px',
    values: { xs: 0.25, sm: 0.5, md: 1, lg: 1.5, xl: 2, xxl: 3 }
} as const);
```

```tsx
import { View } from '@/shared/ui/layout';

// padding: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' — автокомплит и проверка типов
<View padding="lg" marginBottom="md" />;
```

CSS генерируется автоматически при создании компонента: классы `bsui-p-lg`, `bsui-mv-md`
и т.п. со значениями `calc(var(--bsui-unit, 8px) * <множитель>)`. Inline-стили не
используются, атрибут `style` не выставляется.

### Рантайм-переопределение юнита

Значение юнита из конфигурации — только фолбэк. Переопределяйте переменную
`--bsui-unit` в CSS — глобально, по медиа-запросу или для поддерева:

```css
:root {
    --bsui-unit: 8px;
}
@media (max-width: 600px) {
    :root {
        --bsui-unit: 4px;
    }
}
```

### SSR

В браузере стили инъецируются автоматически при импорте. Для SSR добавьте компонент
`ViewStylesInjector` в корень приложения (или в `<head>` шаблона): серверный HTML будет
содержать стили, а при гидратации дубли не создаются.

```tsx
import { ViewStylesInjector } from '@byndyusoft-ui/view';

<html>
    <head>
        <ViewStylesInjector />
    </head>
    <body>...</body>
</html>;
```

### Ограничения токенов

Ключи сетки становятся частью имён CSS-классов, поэтому допустимы только латиница,
цифры, дефис и подчёркивание (`'025'`, `'s-1'`, `'token_name'`). Недопустимый ключ
вызывает ошибку при создании компонента.

## Props

| Проп                                                                                                            | Тип               | Описание                                           |
| --------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------- |
| `as`                                                                                                            | `keyof ReactHTML` | Тег или компонент для рендера (по умолчанию `div`) |
| `className`                                                                                                     | `string`          | Дополнительный класс, мержится со сгенерированными |
| `margin`, `marginTop`, `marginRight`, `marginBottom`, `marginLeft`, `marginHorizontal`, `marginVertical`        | токен сетки       | Внешние отступы                                    |
| `padding`, `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`, `paddingHorizontal`, `paddingVertical` | токен сетки       | Внутренние отступы                                 |

Остальные нативные атрибуты (`id`, `data-*`, `aria-*`, обработчики) передаются в DOM как есть.

## Утилиты и типы

Из точки входа пакета также доступны:

-   `buildSpacingCss(config)` — генерация CSS отступов без регистрации стилей.
-   `getSpacingClassName(prefix, token)` — имя класса, например `bsui-p-md`.
-   `getSpacingValue(unit, multiplier)` — CSS-значение отступа через `calc` и переменную юнита.
-   `spacingPropPrefixes` — соответствие spacing-пропсов префиксам классов.
-   `spacingUnitVariable` — имя CSS-переменной `--bsui-unit`.
-   `validateValuesKeys(grid)` — проверка допустимости имён токенов; при ошибке бросает исключение.
-   `registerStyles(config, css)` и `ViewStylesInjector` — регистрация и вывод стилей, в том числе для SSR.

Публичные типы: `IViewConfig`, `TSpacingValues`, `TValuesToken`, `ISpacingProps`,
`ICreatedViewProps` и `ICreatedView`. Созданный компонент имеет `displayName = 'View'`
и сохраняет исходную конфигурацию в `View.config`. Передача DOM-ref не поддерживается.
