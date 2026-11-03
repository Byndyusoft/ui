# Tasks

## 1. View ref

-   [x] 1.1 Перевести `createView` и `ICreatedView` на React 17 forward-ref типы с `HTMLElement`, передавать ref на созданный `as`-элемент и сохранить `View.config`; добавить runtime/type tests для object ref, callback ref, очистки callback до `null`, пользовательского `as` и JSX-вызова с `React.Ref<HTMLElement>`. Проверить `npm test -- --exclude '**/.delta/**' components/view/src`.
-   [x] 1.2 Обновить README и Storybook View с примером DOM-ref и фактическим типом `HTMLElement`; проверить примеры и форматирование командой `npx --no-install prettier --check components/view/README.md components/view/src/createView.stories.tsx`.

## 2. Flex ref

-   [x] 2.1 Перевести `createFlex` и `ICreatedFlex` на forward-ref типы и пересылать ref через созданный View на конечный DOM-элемент; добавить runtime/type tests для object/callback refs, `as`, размонтирования и конфигурации. Проверить `npm test -- --exclude '**/.delta/**' components/flex/src` и `npx --no-install turbo run build --filter='@byndyusoft-ui/flex...'`.
-   [x] 2.2 Обновить README и Storybook Flex с примером ref и пояснением, что он указывает на host element View; проверить форматирование `npx --no-install prettier --check components/flex/README.md components/flex/src/createFlex.stories.tsx`.

## 3. Публичный контракт и выпуск

-   [x] 3.1 Запустить совместные runtime/type tests `npm test -- --exclude '**/.delta/**' components/view/src components/flex/src`, lint командами `npm run lint:check --workspace=@byndyusoft-ui/view` и `npm run lint:check --workspace=@byndyusoft-ui/flex`, а также `npx --no-install turbo run build --filter='@byndyusoft-ui/flex...'`; подтвердить, что фабричные компоненты по-прежнему доступны в JSX с прежними props.
-   [x] 3.2 Добавить minor changeset для `@byndyusoft-ui/view` и `@byndyusoft-ui/flex`, проверить `npx changeset status` и финальный diff типов/документации.
