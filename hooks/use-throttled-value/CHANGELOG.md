# @byndyusoft-ui/use-throttled-value

## 0.3.1

### Patch Changes

-   Build the selected hooks, TextArea and TextInput as CommonJS so their published packages load in Node.js and test runners. Preserve default and named exports and TypeScript types for require and import consumers. Keep React and existing hook dependencies external.
-   Updated dependencies
    -   @byndyusoft-ui/use-throttled-callback@0.3.1

## 0.3.0

### Minor Changes

-   Исправлена частота вызовов throttle при сочетании leading и trailing: после отложенного вызова следующий leading также ограничен интервалом. Повторные вызовы из обработчика больше не теряются и не обходят ограничение; исключения не блокируют хук. Отключение trailing удаляет ожидающие аргументы.

    В use-throttled-callback добавлены методы cancel и flush, именованный экспорт и стабильная функция при замене обработчика. Документация и типы согласованы с use-debounced-callback.

    В use-throttled-value setter поддерживает функции обновления состояния и методы cancel и flush. Добавлены именованный экспорт, тип результата и русская документация.

### Patch Changes

-   Updated dependencies
    -   @byndyusoft-ui/use-throttled-callback@0.3.0
