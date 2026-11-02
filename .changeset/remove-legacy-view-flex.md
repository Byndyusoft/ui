---
'@byndyusoft-ui/view': major
'@byndyusoft-ui/flex': major
---

Удалён устаревший API раскладки: default-экспорты `View` и `Flex`, типы `IViewProps`, `IFlexProps`, `TSpacingUnit`, фиксированная сетка `su*` и пакет `@byndyusoft-ui/css-utilities`. Пакеты ранее не публиковались, внешних потребителей нет. Миграция — фабрики `createView(config)` и `createFlex(view)`: задайте собственный юнит и сетку токенов, например `createView({ unit: '1rem', grid: { '025': 0.25, '100': 1, '300': 3 } } as const)`, и используйте созданные компоненты вместо готовых.
