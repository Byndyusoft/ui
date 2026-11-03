# Spec Delta

## ADDED Requirements

### Requirement: Ref на DOM-элемент фабричного компонента

Компоненты View и Flex, созданные фабриками, SHALL принимать object и callback refs типа `HTMLElement` и передавать их на фактически отрендеренный HTML-элемент. Для Flex ref MUST указывать на элемент, который рендерит созданный View; ref MUST NOT предоставлять внутренний API компонента или фабрики.

#### Scenario: Object ref с пользовательским тегом View

-   **WHEN** потребитель передаёт созданному View object ref и `as="section"`
-   **THEN** ref указывает на отрендеренный элемент `section` типа `HTMLElement`

#### Scenario: Ref компонента Flex

-   **WHEN** потребитель передаёт созданному Flex object ref и задаёт нативный тег через `as`
-   **THEN** ref указывает на этот HTML-элемент, созданный View, без дополнительной DOM-обёртки

#### Scenario: Callback ref при монтировании и размонтировании

-   **WHEN** потребитель передаёт созданному View или Flex callback ref
-   **THEN** callback получает фактический HTML-элемент при монтировании и `null` при размонтировании

#### Scenario: Типизация ref

-   **WHEN** TypeScript проверяет вызов созданного View или Flex с ref
-   **THEN** ref принимается как ссылка на `HTMLElement` независимо от выбранного `as`, без публичной типизации внутреннего компонента
