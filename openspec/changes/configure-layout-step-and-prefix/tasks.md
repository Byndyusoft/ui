# Tasks

## 1. View: конфигурация шага и генерация CSS

-   [x] 1.1 Обновить типы конфигурации View на `step: { value, unit }` (`unit` только `'px' | 'rem'`), необязательный `prefix` и проверку положительного целого шага и CSS-безопасного префикса; добавить runtime- и type-тесты допустимых и недопустимых конфигураций.
-   [x] 1.2 Реализовать вычисление готовых CSS-длин с нормализацией дробных результатов и применить `prefix` к spacing-селекторам View; обновить тесты генератора для px/rem, дробных множителей, отсутствия `calc()` и прежнего namespace по умолчанию.
-   [x] 1.3 Применить настроенный prefix к классам View при рендере, сохранив прежние default-вызовы экспортированных утилит; добавить тесты пользовательского prefix и проверить `npx --no-install turbo run test --filter=@byndyusoft-ui/view --only`.
-   [x] 1.4 Обновить README и Storybook View: новая форма конфигурации, фиксированный шаг, дробные токены и необязательный prefix; перевести in-repo конфигурацию View в истории ModalsProvider на новый формат; проверить Storybook и Prettier.

## 2. Flex: общий шаг и namespace

-   [x] 2.1 Перевести генератор gap и CSS flex-модификаторов на step и prefix из конфигурации View, сохранив default-поведение экспортированных утилит; обновить runtime- и type-тесты генерации gap, модификаторов и пользовательского prefix.
-   [x] 2.2 Обновить README и Storybook Flex под новую конфигурацию View и наследуемый prefix; проверить `npx --no-install turbo run test --filter=@byndyusoft-ui/flex --only` и `npm run prettier:check --workspace=@byndyusoft-ui/flex`.

## 3. Интеграция и выпуск

-   [x] 3.1 Проверить совместную регистрацию CSS View и Flex, SSR-вывод и уникальность style entries для разных step/prefix; проверить `npx --no-install turbo run test --filter=@byndyusoft-ui/view --filter=@byndyusoft-ui/flex`.
-   [x] 3.2 Добавить breaking changeset для `@byndyusoft-ui/view` и `@byndyusoft-ui/flex`; проверить `npx changeset status`.
-   [ ] 3.3 Проверить lint, сборку обоих пакетов с зависимостями и Storybook командами `npm run lint:check --workspace=@byndyusoft-ui/view`, `npm run lint:check --workspace=@byndyusoft-ui/flex`, `npx --no-install turbo run build --filter='@byndyusoft-ui/flex...'` и `npm run build-storybook`.
