# Матрица переходов статусов

> Источник: `scripts/data/status-catalog.js` → `STATUS_TRANSITIONS`.

| Текущий статус | Доступный следующий статус | Действие | Условие |
|---|---|---|---|
| NEW | SYSTEM_REVIEW | Изменить статус | `appeal.changeStatus`, переход разрешён |
| NEW | ASSIGNED | Назначить исполнителя / изменить статус | Назначение или ручной переход |
| SYSTEM_REVIEW | ASSIGNED | Назначить исполнителя / изменить статус | — |
| SYSTEM_REVIEW | RESPONSE_SENT | Изменить статус | — |
| ASSIGNED | IN_PROGRESS | Принять в работу / изменить статус | Accept только из ASSIGNED |
| IN_PROGRESS | WAITING_SPECIALIST | Изменить статус | — |
| IN_PROGRESS | WAITING_CLIENT | Изменить статус | — |
| IN_PROGRESS | RESPONSE_SENT | Изменить статус | — |
| IN_PROGRESS | CLOSED | Изменить статус | — |
| WAITING_SPECIALIST | IN_PROGRESS | Изменить статус | — |
| WAITING_CLIENT | IN_PROGRESS | Изменить статус | — |
| WAITING_CLIENT | RESPONSE_SENT | Изменить статус | — |
| WAITING_CLIENT | CLOSED | Изменить статус | — |
| RESPONSE_SENT | CLOSED | Изменить статус | — |
| RESPONSE_SENT | REOPENED | Изменить статус | — |
| CLOSED | REOPENED | Изменить статус | — |
| REOPENED | IN_PROGRESS | Изменить статус | — |

## Запрещённые переходы

Любой переход не из таблицы блокируется `AppealsService.changeStatus()` с ошибкой `INVALID_TRANSITION`, даже если UI не показывает опцию.

## Связанные операции (не прямой переход)

| Операция | Эффект на статус |
|---|---|
| Назначить исполнителя (NEW) | NEW → ASSIGNED |
| Принять в работу | ASSIGNED → IN_PROGRESS |
| Переназначить | Статус не меняется |
