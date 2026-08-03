# Внутренние комментарии и вложения

> Этап: прототип комментариев с файлами в карточке обращения.  
> Источник кода: `scripts/data/message-constants.js`, `scripts/services/appeals-service.js`, `scripts/appeal-detail.js`.

## Модель сообщений

Единая лента объединяет клиентские сообщения, внутренние комментарии и системные события.

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | Уникальный идентификатор |
| `appealId` | string | ID обращения |
| `type` | enum | `CLIENT_MESSAGE` · `INTERNAL_COMMENT` · `SYSTEM_EVENT` |
| `authorId` | string \| null | ID автора |
| `authorName` | string | Отображаемое имя |
| `authorRole` | string \| null | Роль автора |
| `text` | string | Текст сообщения / описание события |
| `createdAt` | ISO datetime | Время создания |
| `visibility` | enum | `CLIENT` · `INTERNAL` |
| `attachments` | string[] | ID вложений, привязанных к сообщению |
| `deliveryStatus` | optional | Зарезервировано для исходящих клиентских сообщений |

### Системные события

Дополнительные поля для `SYSTEM_EVENT`:

- `eventType` — код из `HISTORY_EVENT_TYPES`
- `oldValue`, `newValue`, `reason` — контекст изменения

## Модель вложений

| Поле | Тип | Описание |
|---|---|---|
| `id` | string | Уникальный идентификатор |
| `appealId` | string | ID обращения |
| `messageId` | string \| null | ID сообщения (null для исходных документов) |
| `name` | string | Имя файла |
| `mimeType` | string | MIME-тип |
| `size` | number | Размер в байтах |
| `createdAt` | ISO datetime | Дата загрузки |
| `uploadedBy` | string | ID загрузившего |
| `uploadedByName` | string | Имя загрузившего |
| `visibility` | enum | `CLIENT` · `INTERNAL` |
| `mockUrl` | string | Mock-URL для прототипа |
| `localId` | optional | Локальный ID выбранного файла в UI |
| `status` | enum | `READY` · `UPLOADING` · `ERROR` |
| `source` | string | `initial` · `client` · `comment` · `system` |

## Миграция истории

Существующие записи `history[]` автоматически объединяются в `messages[]` через `AppealsRepository.ensureMessages()`:

- события `COMMENT_ADDED` → `INTERNAL_COMMENT`
- остальные события → `SYSTEM_EVENT`
- дубликаты отфильтровываются по ключу `type + createdAt + text + eventType`

Legacy-вложения `{ name, type, size, author }` нормализуются в `ensureAttachments()`.

## API service layer

| Метод | Описание |
|---|---|
| `AppealsService.addInternalComment(id, text, files, actor)` | Добавить комментарий с опциональными файлами |
| `AppealsService.addComment(id, text, actor)` | Alias без файлов |
| `enrich().messageFeed` | Хронологическая лента (oldest first) |
| `enrich().allAttachments` | Агрегированный список всех файлов обращения |

Операции статуса / назначения пишут и в `history`, и в `messages` как `SYSTEM_EVENT`.

## Валидация комментария

- Текст обязателен, если нет вложений
- Trim пробелов
- Максимум 5000 символов
- Блокировка повторной отправки (`commentSubmitting`)
- Форма очищается только при успехе; при ошибке сохраняется

## Лимиты файлов

| Параметр | Значение |
|---|---|
| Макс. файлов за комментарий | 10 |
| Макс. размер файла | 20 МБ |
| Макс. суммарный размер | 50 МБ |
| Форматы | PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, TXT |

Проверяются расширение и MIME-тип (`AttachmentValidator`).

## Права

| Permission | Назначение |
|---|---|
| `appeal.addInternalComment` | Добавление комментария |
| `appeal.addAttachment` | Прикрепление файлов |
| `appeal.viewInternalComments` | Просмотр внутренней ленты и internal-вложений |

Проверка в UI (`appeal-detail.js`) и service (`appeals-service.js`).

Mock-пользователь `CURRENT_USER` имеет все три права.

## UI-компоненты

| Блок | CSS |
|---|---|
| Форма комментария | `styles/components/input.css`, `styles/pages/appeal-detail.css` |
| File uploader | `styles/components/file-uploader.css` |
| Выбранные файлы | `styles/components/file-item.css` |
| Лента сообщений | `styles/components/timeline.css` |
| Агрегированные вложения | `styles/pages/appeal-detail.css` |

### Визуальное различие в ленте

- **Клиент** — синяя полоса слева (`--color-status-info`)
- **Внутренний** — оранжевая полоса (`--color-brand-primary`), метка «· внутренний»
- **Система** — приглушённый фон (`--color-background-surface-muted`)

## Ограничения прототипа

- In-memory persistence (сессия браузера)
- Mock upload с задержкой 300 ms, без реальной загрузки на сервер
- Кнопка «Просмотр» файла — disabled
- Нет отправки ответа клиенту из формы комментария

## Связанные документы

- [Статус, назначение и SLA](./appeal-status-and-sla.md)
- [Сопоставление карточки с Figma](./appeal-card-figma-mapping.md)
- [Design tokens](./design-tokens.md)
