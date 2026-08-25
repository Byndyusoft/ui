# TODO — @byndyusoft-ui/http-client

Связанные архитектурные решения зафиксированы в [DECISIONS.md](./DECISIONS.md).

## P0

### P0-1 — Релизная гигиена: changeset + версия

README создан и описывает публичный API, адаптеры, приоритеты конфигурации, CORS, body, ошибки и hooks. Перед первым publish остаются changeset и повышение версии `0.0.1` → `0.1.0`.

## P2

### P2-1 — Модернизация package.json

Сборка только CJS: нет `exports`-map (dual ESM/CJS для Vite-потребителей), `sideEffects: false`, `engines` (Node 20). Без ESM-входа недоступен tree-shaking.

### P2-3 — Добавить `validateStatus`

Сейчас любой статус вне 2xx → `HttpResponseError`. Нужна опция `validateStatus?: (status) => boolean` (client/request), чтобы 404/304 и т.п. можно было считать успехом.

### P2-4 — Спроектировать opt-in retry

Согласно D-005, повторы будут реализованы в отдельном opt-in классе для оркестрации запросов, без встраивания retry-логики в `HttpClient`, адаптеры или hooks. Нужно спроектировать лимит попыток, exponential backoff, поддержку `Retry-After`, отмену через `AbortSignal`, перечень временных сетевых сбоев и статусов (`408`, `429`, часть `5xx`), а также безопасное поведение для мутаций.

### P2-5 — Зафиксировать edge-cases XHR stream

Поведение abort/timeout после resolve stream и 4xx при `responseType: 'stream'` должно быть явным контрактом (reject promise vs `stream.error`) с тестами. Смежное: расходящаяся семантика timeout для STREAM — fetch-таймер живёт до получения заголовков, `xhr.timeout` покрывает всю загрузку; задокументировать или унифицировать. Также задокументировать, что XHR-stream не настоящий стрим: ответ целиком накапливается в `responseText`, что ограничивает размер стриминговых ответов по памяти.

### P2-6 — Добавить браузерные интеграционные тесты

Проверить в настоящих браузерах credentialed CORS, preflight, cookies с `SameSite`/`Secure`, redirects и `keepalive`. Тесты jsdom и mock-адаптеров не воспроизводят эти особенности платформы. Актуально после появления реальных пользователей credentials-API.

## P3

### P3-1 — Развить hooks до композиционного pipeline

Сейчас на каждую фазу можно назначить лишь один хук, а следующий вызов заменяет предыдущий. При совместном использовании auth, tracing и логирования потребуется композиция хуков с предсказуемым порядком и правилами восстановления.

### P3-3 — Чистка конфигурации

`.npmignore` избыточен при `files: ["dist"]` — удалить. Поправить команду запуска тестов пакета в корневом AGENTS.md (`vitest run --root ../../ --project <name>` не работает; рабочий вариант — `npm test -w @byndyusoft-ui/http-client`).

## Рекомендуемый порядок

1. P0: changeset + версия
2. P2: package.json модернизация вместе с релизной подготовкой
3. P2: retry / validateStatus по продуктовым нуждам
4. P2–P3: DX и полировка фоном

## Не планируется

### P3-2 — Convenience-методы builder

Явно не берём в работу как необязательный синтаксический сахар. Для настройки заголовков достаточно `header()` и `headers()`, а решение можно пересмотреть только при появлении подтверждённых повторяющихся сценариев. Причины зафиксированы в D-010.

## Закрыто

1. Модель ошибок + guards (`HttpResponseError`, `ParseError`, `cause`/`config`)
2. `TimeoutError.timeout`, `ParseError.responseType` / `raw`
3. Body: FormData / URLSearchParams / Blob / ArrayBufferView (`prepareRequestBody`)
4. Default `params`, number/boolean params, null-skip
5. Options/config validation, `RequestPreparationError`
6. `stream` response type
7. `FetchAdapter`: `ParseError`, если streaming body отсутствует (`response.body === null`)
8. `HttpResponseError` передаёт `config` в базовый `HttpClientError`
9. Default `FetchAdapter`, `withCredentials` (client / builder / оба адаптера)
10. Adapter options (`FetchAdapterOptions`, `XhrAdapterOptions`)
11. Удалены устаревшие закомментированные методы из `HttpRequestBuilder`
12. Publish hygiene: `files: ["dist"]`, `.npmignore`
13. Default `headers` клонируются в конструкторе `HttpClient`.
14. Языковое соглашение: комментарии и JSDoc исходников — английский; пользовательские документы пакета — русский (D-002).
15. Валидация `FetchAdapter`: исключён `mode: 'navigate'`; `cache: 'only-if-cached'` требует `mode: 'same-origin'`.
16. Parity Fetch/XHR: `Content-Length: 0` и error body при `blob`.
17. Пустые `params` нормализуются в `undefined` вместо `{}`.
18. Утилиты покрыты изолированными тестами и английскими JSDoc; зафиксирована мутация headers в `prepareRequestBody`.
19. Согласно D-006, `body(undefined)` выбрасывает `RequestBuilderError` с кодом `INVALID_BODY`, а `body(null)` отправляет JSON `null`.
20. Согласно D-007, формат ответа выбирается через `asJson<T>()`, `asText()`, `asBlob()`, `asArrayBuffer()` или `asStream()`, а `execute()` не принимает generic.
21. Формат ответа `formData` удалён; отправка `FormData` через `body()` сохранена.
22. Согласно D-009, тело `HttpResponseError` типизируется композицией `isHttpResponseError(error) && isData(error.data)` без усложнения публичного guard; сценарии `400` и `422` покрыты type- и runtime-тестами.
23. Согласно D-011, `XhrAdapter` поддерживает adapter-wide callbacks `onDownloadProgress` и `onUploadProgress`; upload listener подключается только для запросов с телом.
24. Согласно D-012, `HttpClient.withAdapter()` создаёт независимый scoped-клиент со снимком текущих defaults и hooks.
