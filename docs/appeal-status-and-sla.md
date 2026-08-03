# Статус, назначение и SLA

> Этап: управление статусом, исполнителем и SLA в карточке обращения.  
> Источник кода: `scripts/data/status-catalog.js`, `scripts/services/appeals-service.js`.

## Статусы

Единый справочник `APPEAL_STATUSES` — коды хранятся в `statusCode`, русские подписи только для UI.

| Код | Название | Variant | Завершён |
|---|---|---|---|
| NEW | Новая | warning | нет |
| SYSTEM_REVIEW | На проверке системой | info | нет |
| ASSIGNED | Назначена исполнителю | info | нет |
| IN_PROGRESS | В работе | info | нет |
| WAITING_SPECIALIST | Ожидает ответа специалиста | warning | нет |
| WAITING_CLIENT | Ожидает ответа клиента | warning | нет |
| RESPONSE_SENT | Ответ отправлен | success | нет |
| CLOSED | Закрыта | success | да |
| REOPENED | Возвращена в работу | danger | нет |

## Макрогруппы

| Группа | Статусы |
|---|---|
| intake | NEW, SYSTEM_REVIEW |
| processing | ASSIGNED, IN_PROGRESS, REOPENED |
| waiting | WAITING_SPECIALIST, WAITING_CLIENT |
| resolution | RESPONSE_SENT |
| closed | CLOSED |

## Разрешённые переходы

См. `docs/status-transition-matrix.md`. Проверка: `isTransitionAllowed()` в service layer.

## Принятие в работу

- Доступно для `ASSIGNED` при праве `appeal.accept`.
- Переводит в `IN_PROGRESS`.
- Если исполнитель не назначен — назначается текущий пользователь (mock).
- Создаётся событие `APPEAL_ACCEPTED`.
- Для `NEW` кнопка скрыта — требуется назначение.

## Назначение

- Действие «Назначить исполнителя» при отсутствии `assigneeId`.
- Список из `getActiveUsers()` (активные, не absent).
- `NEW` → `ASSIGNED` автоматически.
- События: `ASSIGNEE_ASSIGNED`, при смене статуса — `STATUS_CHANGED`.

## Переназначение

- Действие «Переназначить» при наличии исполнителя.
- Modal: новый исполнитель + обязательная причина.
- Событие `ASSIGNEE_CHANGED` с `oldValue`, `newValue`, `reason`.

## Причины переназначения

| Код | Название |
|---|---|
| WRONG_TOPIC | Неверно определена тематика |
| DIFFERENT_PROFILE | Требуется другой профиль специалиста |
| LOAD_BALANCING | Перераспределение нагрузки |
| SUBSTITUTION | Замещение отсутствующего сотрудника |
| OTHER | Другое (обязательный текст) |

## SLA-состояния

| Код | Название | Variant |
|---|---|---|
| ON_TRACK | В срок | success |
| AT_RISK | Срок приближается | warning |
| OVERDUE | Просрочено | danger |
| PAUSED | Приостановлено | neutral |

## Формулы вычисления SLA

```
totalMs = slaDueAt - createdAt
remainingMs = slaDueAt - now

PAUSED     → если appeal.slaState === 'PAUSED'
OVERDUE    → now > slaDueAt
AT_RISK    → remainingMs <= totalMs * 0.2 и не OVERDUE
ON_TRACK   → остальные случаи
```

Реализация: `SlaService.computeState()`.

## События истории

| Тип | Описание |
|---|---|
| CREATED | Создание обращения |
| STATUS_CHANGED | Смена статуса |
| ASSIGNEE_ASSIGNED | Первичное назначение |
| ASSIGNEE_CHANGED | Переназначение |
| APPEAL_ACCEPTED | Принято в работу |
| COMMENT_ADDED | Внутренний комментарий |
| SLA_STATE_CHANGED | Зарезервировано (не пишется автоматически на этапе) |

## Права

Mock-пользователь `CURRENT_USER` с правами:

- `appeal.accept`
- `appeal.changeStatus`
- `appeal.assign`
- `appeal.reassign`

Проверка: `Permissions.can*()` в UI и `AppealsService`.

## Ограничения текущего этапа

- In-memory persistence (сессия браузера).
- Нет RBAC UI, один mock-пользователь.
- SLA без рабочих календарей и пауз по статусам.
- Ручное редактирование SLA недоступно.
- Нет Toast — ошибки через inline alert.

## Что не реализовано

- Делегирование, уведомления, отправка ответа клиенту.
- Автоматическая пауза SLA по статусам.
- Полная статусная машина с guard-условиями по ролям.
- localStorage / backend API.
