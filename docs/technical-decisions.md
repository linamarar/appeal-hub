# Технические решения перед следующим этапом

Документ фиксирует согласованные решения команды перед началом реализации интерфейса «Хаб обращений» на базе существующей vanilla-прототипной версии и Figma UI Kit.

**Дата фиксации:** 3 августа 2026  
**Статус:** утверждено, реализация не начата

---

## 1. Stack

**Решение:** технологический stack тестовой версии **не меняем**.

| Параметр | Значение |
|---|---|
| Frontend | Vanilla HTML / CSS / JavaScript |
| Framework | Не используется |
| Сборщик | Не используется |
| Package manager | Не используется (пока нет `package.json`) |

**Ограничение:** миграция на React, Vue, Next.js или другой framework **не выполняется** на текущем этапе. Переход на framework может быть рассмотрен только как **отдельный будущий этап** с отдельным решением и оценкой.

**Следствия:**
- Компоненты реализуются как HTML-разметка + CSS + JS-модули.
- Маршрутизация и состояние — без SPA-framework.
- Не добавлять зависимости без отдельного задания.

---

## 2. Figma scope

**Решение:** использовать только **product/admin subset** Figma UI Kit.

### В scope (переносим)

- Layout
- Header
- Navigation
- Buttons
- Form controls (Input, Select, Checkbox, Radio, Toggle и т.д.)
- Status components
- Tables
- Tabs
- Modal
- Drawer
- Toast
- Pagination
- Cards
- File uploader
- Empty / Loading / Error states

### Вне scope (не переносим)

- Marketing-компоненты и domain-specific blocks: баннеры, ипотека, карта, список квартир, сторис, галерея, блоки ЖК и прочие marketing-страницы из UI Kit.

**Следствия:**
- При mapping компонентов игнорировать страницы «🟢 …» с marketing-контентом, если они не относятся к admin/product UI.
- Новые экраны Appeal Hub собираются из атомов и молекул Kit, а не из готовых landing-блоков.

---

## 3. Первый scope реализации

**Решение:** первый этап реализации охватывает только следующие экраны/области:

| # | Область | Описание |
|---|---|---|
| 1 | Application shell | Общая оболочка приложения (layout, nav, header) |
| 2 | Список обращений | Основная очередь обращений (data table) |
| 3 | Карточка обращения | Детальный просмотр одного обращения |
| 4 | Создание обращения | Flow создания нового обращения |

**Вне первого этапа** (добавляются отдельными итерациями):

- Клиентский кабинет
- Административные разделы (роли, пользователи)
- Аналитика
- Шаблоны ответов и документов
- Уведомления
- Настройки

---

## 4. Fonts

**Решение:** шрифт TT Firs **не скачивать, не добавлять и не распространять** без подтверждённой корпоративной web/production-лицензии.

| Действие | Разрешено |
|---|---|
| Использовать font token из Figma в CSS variables | ✅ |
| Указать fallback font stack | ✅ |
| Добавить `.woff`/`.woff2`/`.ttf` в репозиторий | ❌ |
| Подключать TT Firs через `@font-face` с локальными файлами | ❌ |

**До получения лицензии:** в CSS variables задаётся token-имя (например, `--font-family-primary`) со значением fallback-стека (system-ui, sans-serif или согласованный аналог).

---

## 5. Backend и data layer

**Решение:** на текущем этапе — **mock data layer** через абстракцию service/repository.

### Принципы

1. UI **не обращается напрямую** к массивам mock-данным в `app.js`.
2. Создаётся слой **service/repository** с единым интерфейсом (например, `AppealService.getList()`, `AppealService.getById()`, `AppealService.create()`).
3. Реализация по умолчанию — **MockAppealRepository** (in-memory или static JSON).
4. В будущем mock заменяется на **ApiAppealRepository** без изменения UI-контрактов.

**Следствия:**
- Mock-данные живут в repository-реализации, не в компонентах/экранах.
- Все экраны работают через async service API (даже если mock синхронный внутри).

---

## 6. Lists и таблицы

**Решение:** разделить паттерны отображения списков.

| Паттерн | Компонент | Применение |
|---|---|---|
| Data table | Таблица (Figma Table / custom admin table) | **Основная очередь обращений** |
| List items | Figma List items | История действий, сообщения, вложения, уведомления |
| List items | Figma List items | Мобильное представление очереди (альтернатива table) |

**Следствия:**
- Dashboard/список обращений — table-first на desktop.
- На mobile допустима адаптация к list view через те же данные из service layer.

---

## 7. AI

**Решение:** реализовать только **UI mock** и **абстрактный AIProvider**. Реальный LLM API **не подключается**.

### AIProvider (интерфейс)

Абстракция, которую UI вызывает для обработки документа. Реализация по умолчанию — `MockAIProvider` (имитация с таймерами/фиксированными ответами).

### Обязательные UI-состояния AI

| Состояние | Описание |
|---|---|
| `loading` | Обработка в процессе |
| `success` | Успешное завершение |
| `error` | Ошибка обработки |
| `confidence` | Отображение уверенности модели (число/уровень) |
| `missing_fields` | Не все поля извлечены |
| `manager_accepted` | Менеджер принял результат AI |
| `manager_corrected` | Менеджер скорректировал результат AI |

**Следствия:**
- Логика AI изолирована от UI так же, как data layer.
- Переход на real API — замена provider-реализации, не переписывание экранов.

---

## 8. Statuses

**Решение:** использовать **расширенную модель статусов**. В UI допускается группировка в макрогруппы, но в **модели данных** каждый статус хранится отдельно.

### Канонические статусы

| ID (пример) | Отображаемое название |
|---|---|
| `new` | Новая |
| `system_review` | На проверке системой |
| `assigned` | Назначена исполнителю |
| `in_progress` | В работе |
| `awaiting_specialist` | Ожидает ответа специалиста |
| `awaiting_client` | Ожидает ответа клиента |
| `response_sent` | Ответ отправлен |
| `closed` | Закрыта |
| `reopened` | Возвращена в работу |

### Макрогруппы (только для UI)

Пример группировки (уточняется при проектировании UI):

- **Входящие:** Новая, На проверке системой
- **В работе:** Назначена исполнителю, В работе, Ожидает ответа специалиста
- **Ожидание клиента:** Ожидает ответа клиента
- **Завершённые:** Ответ отправлен, Закрыта
- **Переоткрытые:** Возвращена в работу

**Следствия:**
- Mock repository и service layer используют canonical status IDs.
- Badge/status components маппятся на расширенный набор, не на 3 статуса прототипа.

---

## 9. Branding

**Решение:** создать **custom product shell** с названием **«Хаб обращений»** в визуальном стиле Figma UI Kit.

| Действие | Разрешено |
|---|---|
| Custom header/navigation для продукта | ✅ |
| Название «Хаб обращений» в shell | ✅ |
| Стилизация по tokens Kit | ✅ |
| Marketing **Header FSK** as-is | ❌ |

**Следствия:**
- Header FSK из Figma используется только как reference по layout/spacing, не копируется с брендингом FSK.
- Logo, subtitle и nav items — product-specific.

---

## 10. Design tokens

**Решение:** двухуровневая система токенов.

| Уровень | Формат | Назначение |
|---|---|---|
| Source of truth | **JSON** | Хранение значений design tokens |
| Runtime в приложении | **CSS custom properties** (`var(--…)`) | Применение в стилях |

### Ограничения

- **Tailwind не устанавливать.**
- Tailwind-конфигурацию менять **только если Tailwind уже есть в проекте** (сейчас отсутствует — не добавляем).
- На первом этапе — **только light theme**. Dark mode — отдельный будущий этап.

### Минимальный набор tokens (первый этап)

- Colors (semantic + primitive)
- Typography (family tokens + size/weight/line-height; без font files)
- Spacing
- Border radius
- Shadows
- Component-specific tokens по мере необходимости

**Следствия:**
- `styles/main.css` (или отдельный `tokens.css`) импортирует значения из JSON через build step **или** ручную синхронизацию на первом этапе (уточняется при реализации).
- Прототипные hardcoded `:root` values из `main.css` будут заменены token-based values при рефакторинге.

---

## Связанные документы

- [Аудит репозитория](./repository-audit.md)
- [Инвентаризация прототипа](./current-prototype-inventory.md)
- [Проверка Figma UI Kit](./figma-access-audit.md)
- [UI-компоненты прототипа](./ui-component-inventory.md)
- [Сопоставление прототипа с Figma](./prototype-to-figma-mapping.md)
- [Открытые вопросы](./open-questions.md) — часть вопросов закрыта данным документом

---

## Закрытые вопросы из open-questions.md

| Вопрос | Решение |
|---|---|
| Целевой frontend stack | Vanilla, без миграции |
| Scope Figma Kit | Admin/product subset only |
| MVP feature set | Shell + list + detail + create |
| Font licensing | Token + fallback, без font files |
| Backend | Mock через service/repository |
| Table vs List | Table для очереди, List items для вторичных списков |
| AI-flow | UI mock + AIProvider abstraction |
| Status model | Расширенная модель (9 статусов) |
| Branding | Custom «Хаб обращений» shell |
| Design tokens format | JSON source → CSS variables, light only |
