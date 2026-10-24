# http-response-body-contract Specification

## Purpose

Определяет публичный TypeScript-контракт данных HTTP-ответа: тип выбирается потребителем без дополнительной необязательности, а существующее поведение выполнения сохраняется.

## Requirements

### Requirement: Required response data type

`IHttpResponse<T>` MUST содержать обязательное свойство `data: T`. Публичные результаты запросов MUST использовать выбранный тип данных без автоматически добавленного `undefined`.

#### Scenario: Typed JSON response

-   **WHEN** потребитель выполняет запрос с `.asJson<IUser>()`
-   **THEN** тип `response.data` равен `IUser`

#### Scenario: Existing format selectors

-   **WHEN** потребитель выбирает текстовый, бинарный или потоковый формат существующим методом builder
-   **THEN** тип `response.data` соответствует выбранному формату без автоматически добавленного `undefined`

#### Scenario: Response object without data

-   **WHEN** потребитель создаёт объект типа `IHttpResponse<IUser>` без свойства `data`
-   **THEN** TypeScript сообщает о пропущенном обязательном свойстве

### Requirement: Preserve explicit data types

Контракт MUST сохранять переданный `T`, включая `undefined`, `null`, `void` и `unknown`, без дополнительного сужения.

#### Scenario: Explicit undefined union

-   **WHEN** потребитель выбирает `.asJson<IUser | undefined>()`
-   **THEN** тип данных остаётся `IUser | undefined`

#### Scenario: Explicit empty result

-   **WHEN** потребитель выбирает `.asJson<void>()`
-   **THEN** ответ содержит свойство `data` типа `void` и прежние поля метаданных

#### Scenario: Unknown or nullable data

-   **WHEN** потребитель использует `IHttpResponse<unknown>` или `IHttpResponse<IUser | null>`
-   **THEN** тип данных остаётся соответственно `unknown` или `IUser | null`

### Requirement: Preserve runtime response behavior

Изменение MUST ограничиваться типовым контрактом и MUST сохранять существующую обработку тела, ошибок и hooks. Заданный generic MUST NOT включать runtime-валидацию ответа.

#### Scenario: Empty successful response

-   **WHEN** встроенный адаптер получает успешный ответ, для которого сейчас возвращает `data: undefined`, включая `204`, нулевую объявленную длину или пустой JSON
-   **THEN** он продолжает возвращать `data: undefined` без новой ошибки или подстановки другого значения

#### Scenario: Existing error and hook behavior

-   **WHEN** запрос проходит обработку HTTP-ошибки, ошибки разбора или hooks
-   **THEN** обработка сохраняет прежнее поведение без новых проверок наличия данных
