# Карточка клиента

## Маршрут

`#/clients/:id` — hash-маршрут, view `client-detail`.

## Модель клиента

Расширенные поля в `scripts/data/clients-mock.js`: id, name, clientType, status, phone, email, preferredContactChannel, objectOrContract, relatedObjects[], relatedContracts[], totalAppeals, openAppeals, lastActivityAt, createdAt, importantNote, tags[], importantNoteUpdatedAt.

## Связь клиента с обращениями

Обращения содержат `clientId`. Метод `AppealsRepository.getByClientId` и `ClientsService.getClientAppeals` — фильтрация через `AppealsService.getList`, без дублирования в объекте клиента.

## Контактная информация

Боковая колонка: телефон, email, канал, тип, даты. Пустые значения — «Не указано».

## Объекты и договоры

Отдельные карточки в sidebar. Empty state — «Нет данных» (CL-008 без связей).

## Обращения

Вкладка «Обращения»: таблица, фильтры все/открытые/закрытые. Ссылка «Открыть» → `#/appeals/:id`.

## Документы

Mock в `CLIENT_DOCUMENTS_MOCK`. Просмотр disabled + tooltip.

## История взаимодействия

`CLIENT_HISTORY_MOCK`, сортировка по дате. Формируется в repository.

## Важная информация

Блок в sidebar с пометкой «Видно только сотрудникам». Скрывается без права `client.viewInternalInfo`.

## Права

`client.view`, `client.viewAppeals`, `client.viewDocuments`, `client.viewInternalInfo` — проверка в `Permissions` и `ClientsService`.

## Mock data

Вымышленные ФИО, контакты, договоры. Документы и история — отдельные массивы в data layer.

## Состояния

loading, loaded, not-found; empty для обращений, документов, объектов.

## Ограничения текущего этапа

Только чтение. Нет редактирования, загрузки документов, CRM, карточек объектов/договоров.
