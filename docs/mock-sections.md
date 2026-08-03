# Mock-разделы Хаба

## Маршруты

| Hash-маршрут | View | Описание |
|---|---|---|
| `#/appeals` | dashboard | Список обращений |
| `#/appeals/:id` | appeal-detail | Карточка обращения |
| `#/clients` | clients | Список клиентов |
| `#/clients/:id` | client-preview | Краткий preview клиента |
| `#/templates` | templates | Шаблоны ответов и документов |
| `#/analytics` | analytics | Mock-дашборд аналитики |
| `#/settings` | settings | Каталог настроек |
| `#/settings/:slug` | settings-detail | Заглушка подраздела настроек |
| `#/flow` | flow | Legacy-создание обращения |

## Клиенты

Страница `#/clients`: поиск, фильтры по типу и открытым обращениям, таблица из 9 mock-клиентов, pagination (mock), preview по клику «Открыть».

## Модель mock-клиента

- `id`, `name`, `phone`, `email`
- `clientType` — Физическое / Юридическое лицо / УК
- `objectOrContract`, `totalAppeals`, `openAppeals`
- `lastActivityAt`, `status` — ACTIVE | ATTENTION | NO_OPEN

Данные: `scripts/data/clients-mock.js`

## Шаблоны ответов

Вкладка «Ответы» на `#/templates`: 6 mock-шаблонов с тематикой, версией, статусом, способом использования.

## Шаблоны документов

Вкладка «Документы»: 6 mock-документов с типом, согласованием, статусом.

Данные: `scripts/data/templates-mock.js`

## Аналитика

Mock-дашборд `#/analytics`: KPI-карточки, bar rows, таблица нагрузки, CSS-столбчатая динамика. Периоды 7д / 30д / квартал меняют mock-значения.

Данные: `scripts/data/analytics-mock.js` (явно помечены как демонстрационные).

## Настройки

Каталог из 15 административных подразделов на `#/settings`. Статусы готовности: Доступно, Mock, Запланировано. Клик по доступным/mock — заглушка `#/settings/:slug`.

Данные: `scripts/data/settings-mock.js`

## Использованные Figma-компоненты

Page header, Button, Input/Search, Select, Tabs, Data table, Badge, Card, Pagination, Empty state, Loader, Tooltip, Progress bars (CSS).

## Ограничения

- Hash routing без router library
- Нет chart library — только CSS/SVG bars
- Нет CRUD, API, редактирования
- Мобильная версия новых разделов — базовая (таблицы с horizontal scroll)

## Что является только mock

Все клиенты, шаблоны, KPI, графики, статусы настроек — вымышленные данные в repository-слое. Preview клиента и подразделы настроек — заглушки.

## Следующие возможные этапы

- Полноценная карточка клиента
- Редактор шаблонов
- CRUD настроек
- Реальная аналитика с backend
- Backend API и интеграции
