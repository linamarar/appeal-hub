# Визуальная проверка: карточка обращения

> Дата: 2026-08-03.

## Совпадает

- Двухколоночный layout (main + sidebar 320px) на desktop.
- Компоненты на токенах: кнопки, badges, select, textarea, cards, meta-list, timeline.
- Header карточки: номер, тема, status/priority/SLA badges, метаданные, actions.
- Loading / not-found states.
- Hash-маршрут `#/appeals/:id`.

## Отличается

| Элемент | Причина |
|---|---|
| Dedicated appeal layout в Figma | Собран из Cards + List items pattern |
| Dropdown «Ещё» | Disabled — нет маршрутов доп. действий |
| Просмотр вложений | Disabled — нет backend |
| Карточка клиента | Кнопка «Открыть клиента» отсутствует — маршрута нет |
| AI-блок legacy | Убран из карточки (вне scope этапа) |

## Неподтверждённые параметры Figma

- Точные gap/padding sidebar cards.
- SLA badge variant spec.
- Attachment list row height (использован 56px по table pattern).

## Не вошло в этап

- AI-помощник, делегирование, отправка ответа клиенту.
- Полная статусная модель (9 статусов).
- Rich text комментарии.
- Загрузка файлов.

## Проверка

| Проверка | Результат |
|---|---|
| Открытие из таблицы по ID | ✅ |
| Прямой URL `#/appeals/AH-2026-01847` | ✅ |
| Not-found `#/appeals/UNKNOWN` | ✅ |
| Возврат к списку | ✅ |
| Комментарий в истории | ✅ |
| Смена статуса / принять в работу | ✅ |
| Build / tests | ✅ N/A |
| Новые dependencies | ✅ нет |
