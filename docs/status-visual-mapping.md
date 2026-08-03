# Сопоставление статусов обращений с визуальными вариантами Figma

> Модель данных прототипа: `Новое`, `В работе`, `Закрыто`.  
> Расширенная продуктовая модель (9 статусов) — визуально подготовлена через семантические badge variants.

## Семантические variants (Figma Offer / Pins, theme=light)

| Variant | CSS class | Цветовая база |
|---|---|---|
| neutral | `ui-status-badge--neutral` | `--color-background-surface-muted` |
| info | `ui-status-badge--info` | `--color-status-info` @ 10% |
| warning | `ui-status-badge--warning` | `--color-brand-primary-fill` @ 10% |
| success | `ui-status-badge--success` | `--color-status-success` @ 10% |
| danger | `ui-status-badge--danger` | `--color-status-danger` @ 10% |

## Расширенная модель → variant

| Статус (extended) | Variant | Label в UI (при наличии данных) |
|---|---|---|
| Новая | warning | Новая |
| На проверке системой | info | На проверке системой |
| Назначена исполнителю | info | Назначена исполнителю |
| В работе | info | В работе |
| Ожидает ответа специалиста | warning | Ожидает ответа специалиста |
| Ожидает ответа клиента | warning | Ожидает ответа клиента |
| Ответ отправлен | success | Ответ отправлен |
| Закрыта | success | Закрыта |
| Возвращена в работу | danger | Возвращена в работу |

## Текущие данные прототипа → variant

| Статус в mock (`appeals`) | Отображаемый label | Variant |
|---|---|---|
| Новое | Новая | warning |
| В работе | В работе | info |
| Закрыто | Закрыта | success |

## Ограничения этапа

- Бизнес-модель статусов **не расширялась** — mapping зафиксирован для следующего этапа.
- Отдельный AI-status badge в таблице **не выводится** (колонка убрана в пользу product admin columns); AI-status сохранён в mock и legacy views.
