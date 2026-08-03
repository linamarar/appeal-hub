# Сопоставление статусов обращений с визуальными вариантами Figma

> Единый справочник: `scripts/data/status-catalog.js` (`APPEAL_STATUSES`).  
> Системные идентификаторы — коды (`NEW`, `IN_PROGRESS`, …), не русские строки.

## Семантические variants (Figma Offer / Pins, theme=light)

| Variant | CSS class | Цветовая база |
|---|---|---|
| neutral | `ui-status-badge--neutral` | `--color-background-surface-muted` |
| info | `ui-status-badge--info` | `--color-status-info` @ 10% |
| warning | `ui-status-badge--warning` | `--color-brand-primary-fill` @ 10% |
| success | `ui-status-badge--success` | `--color-status-success` @ 10% |
| danger | `ui-status-badge--danger` | `--color-status-danger` @ 10% |

## Код статуса → variant

| Код | Label | Variant |
|---|---|---|
| NEW | Новая | warning |
| SYSTEM_REVIEW | На проверке системой | info |
| ASSIGNED | Назначена исполнителю | info |
| IN_PROGRESS | В работе | info |
| WAITING_SPECIALIST | Ожидает ответа специалиста | warning |
| WAITING_CLIENT | Ожидает ответа клиента | warning |
| RESPONSE_SENT | Ответ отправлен | success |
| CLOSED | Закрыта | success |
| REOPENED | Возвращена в работу | danger |

## SLA indicator variants

| SLA code | Label | CSS class |
|---|---|---|
| ON_TRACK | В срок | `ui-sla-badge--success` |
| AT_RISK | Срок приближается | `ui-sla-badge--warning` |
| OVERDUE | Просрочено | `ui-sla-badge--danger` |
| PAUSED | Приостановлено | `ui-sla-badge--neutral` |

## Mock-данные (начальные statusCode)

| ID | statusCode | Назначение для тестов |
|---|---|---|
| AH-2026-01847 | NEW | Назначение исполнителя |
| AH-2026-01846 | ASSIGNED | Принять в работу, AT_RISK SLA |
| AH-2026-01844 | IN_PROGRESS | OVERDUE SLA |
| AH-2026-01843 | NEW | PAUSED SLA |
| AH-2026-01845, 01842 | CLOSED | Завершённые |

Подробнее: `docs/appeal-status-and-sla.md`, `docs/status-transition-matrix.md`.
