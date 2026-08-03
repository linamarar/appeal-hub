# Аудит репозитория

## Общая структура

Репозиторий содержит **статический HTML/CSS/JS-прототип** без сборщика, без `package.json` и без модульной архитектуры.

```
Appeal Hub/
├── index.html          # Единственная HTML-страница, все «экраны» внутри
├── scripts/
│   └── app.js          # Вся логика приложения (~260 строк)
├── styles/
│   └── main.css        # Все стили (~937 строк)
├── README.md           # Краткое описание прототипа
├── .gitignore          # Игнорирует node_modules, dist, .env и т.д.
└── docs/               # Документация аудита (создана на этапе аудита)
```

**Точка входа:** `index.html`  
**Layout:** фиксированный sidebar + main content area (`.app` → `.sidebar` + `.main`)  
**«Маршрутизация»:** переключение видимости секций через `data-view` / `data-go` и функцию `switchView()` — **без URL-маршрутов, без History API**.

Отсутствуют: `src/`, `components/`, `pages/`, `services/`, `stores/`, `types/`, `hooks/`, тесты, CI/CD, конфигурационные файлы сборки.

## Технологический стек

| Категория | Фактическое значение |
|---|---|
| Frontend framework | **Отсутствует** (vanilla HTML/CSS/JS) |
| Язык | JavaScript (ES6+, без TypeScript) |
| Сборщик | **Отсутствует** |
| Package manager | **Не используется** (`package.json` нет) |
| UI-библиотеки | **Отсутствуют** |
| CSS-подход | Plain CSS + CSS custom properties (`:root`) |
| Управление состоянием | In-memory массив `appeals` в `app.js`, DOM class toggling |
| Маршрутизация | Client-side view switching (не SPA-router) |
| Формы | Нативный `<input type="file">`, `<input type="text">`, `<select>` |
| Валидация | **Отсутствует** |
| Таблицы | Нативный `<table>` + JS-рендеринг строк |
| Иконки | Inline SVG в HTML |
| Работа с датами | Строковые литералы в mock-данных, без date library |
| Тестирование | **Отсутствует** |
| Линтинг | **Отсутствует** |
| Форматирование | **Отсутствует** (нет Prettier/ESLint config) |

## Frontend

- **HTML:** один файл, три `<section class="view">` (dashboard, flow, appeal-detail).
- **CSS:** кастомная дизайн-система на CSS-переменных, вдохновлённая Tailwind/Zinc palette (Inter font, gray scale, blue/green/amber accents).
- **JS:** один файл без модулей; функции: `renderTable`, `renderAppealCard`, `switchView`, `setFlowStep`, `simulateAIProcessing`, `initFlow`, `initNavigation`.
- **Шрифт:** Google Fonts — Inter (400, 500, 600, 700).
- **Адаптивность:** базовые media queries `@1024px` и `@768px` (sidebar скрывается на mobile).

## Backend

**Отсутствует.** Нет серверного кода, API endpoints, serverless functions.

## Хранение данных

- Mock-данные в `scripts/app.js`: массив `appeals` (6 записей) и объект `appealCardData`.
- Данные живут только в памяти браузера; при перезагрузке страницы изменения теряются.
- Единственная мутация: после прохождения AI-flow новая запись добавляется в `appeals` через `unshift()` (один раз за сессию, флаг `isNew`).
- LocalStorage / IndexedDB / cookies — **не используются**.

## Авторизация

**Отсутствует.** Нет login, roles, sessions, tokens.

## Состояние приложения

| Механизм | Использование |
|---|---|
| JS-переменные | `appeals`, `appealCardData` |
| DOM classes | `.view--active`, `.flow-panel--active`, `.nav-item--active`, `.flow-step--done` |
| Hidden attribute | `#upload-zone`, `#incoming-preview` |
| setTimeout chains | Имитация AI-обработки (2s + 800ms + 600ms) |

Нет централизованного store, нет реактивности, нет persistence.

## API и сервисы

**Отсутствуют.** Нет fetch/axios, нет API-слоя, нет сервисных модулей.

## Тестирование

- Unit / integration / e2e тесты — **отсутствуют**.
- Test runner (Jest, Vitest, Playwright) — **не настроен**.

## Команды запуска

| Действие | Команда |
|---|---|
| Установка зависимостей | **Не требуется** (нет зависимостей) |
| Запуск | Открыть `index.html` в браузере или через Live Server |
| Сборка | **Не предусмотрена** |
| Тесты | **Не предусмотрены** |
| Переменные окружения | **Не требуются** (`.env` в `.gitignore`, но не используется) |

## Ограничения

1. Прототип не масштабируется без перехода на framework + сборщик.
2. Вся логика в одном JS-файле — высокий риск регрессий при росте функциональности.
3. Нет типизации, линтинга, тестов.
4. «Маршруты» не отражаются в URL — нельзя делиться ссылкой на экран/обращение.
5. Статистика на дашборде (247 обращений и т.д.) — захардкожена в HTML, не связана с mock-данными.
6. Карточка обращения всегда показывает одно и то же обращение `AH-2026-01847` независимо от выбранной строки таблицы.
7. Поиск и фильтр статусов на дашборде — декоративные, без обработчиков.
8. Кнопки «Экспорт» и «Назначить ответственного» — без обработчиков.

## Технические риски

| Риск | Уровень | Описание |
|---|---|---|
| Отсутствие framework | Высокий | Интеграция Figma UI Kit потребует либо полной переработки на React/Vue/etc., либо ручной CSS-адаптации |
| Монолитный код | Высокий | `index.html` (350 строк) + `app.js` + `main.css` — сложно поддерживать |
| Несовместимость дизайн-токенов | Средний | Прототип использует Inter + Zinc palette; Figma Kit — TT Firs Text Trial Variable + FSK tokens |
| XSS через innerHTML | Средний | `renderAppealCard` и `renderTable` используют template literals + `innerHTML` |
| Нет persistence | Средний | Любые действия пользователя теряются при reload |
| Нет URL routing | Средний | Невозможна навигация по deep links |
| Drag & drop без валидации | Низкий | Файл принимается, но содержимое не читается — всегда показывается один mock-документ |
| Mobile UX | Средний | Sidebar полностью скрывается на `<768px` без альтернативной навигации |

## Рекомендации без реализации

1. **Перед внедрением Figma UI Kit** — принять решение о целевом стеке (рекомендуется SPA-framework + CSS tokens из Figma).
2. **Сохранить как reference:** user flows (upload → AI → card → dashboard), структуру данных обращения, mock-данные как spec для API.
3. **Не адаптировать CSS in-place** — текущие стили слишком далеки от Figma Kit (другой шрифт, palette, component API).
4. **Вынести бизнес-модель** обращения (`id`, `date`, `title`, `category`, `aiStatus`, `status`, `priority`, `source`, `region`) в отдельную спецификацию — она пригодна для backend schema.
5. **Зафиксировать gap** между прототипом и целевым продуктом (клиентский кабинет, роли, SLA и т.д. — см. `current-prototype-inventory.md`).
