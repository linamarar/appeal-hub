# Открытые вопросы перед внедрением дизайн-системы

## Доступ к Figma

1. **Подтверждение актуальности файла:** используется ли `🟠 UI Kit (Copy)` как единственный source of truth, или есть master-файл без «Copy»?
2. **Права доступа команды:** все ли разработчики/designers имеют доступ к Figma MCP / файлу?
3. **Scope UI Kit для Appeal Hub:** Kit ориентирован на marketing site (FSK, квартиры, ипотека). Какие страницы/компоненты применимы к **admin/product UI** Хаба обращений?
4. **Нужен ли отдельный Figma file** для экранов Appeal Hub, собранных из Kit components?
5. **Apple libraries в файле** (iOS/macOS kits) — удалять/игнорировать при работе над web admin?

## Технологический stack

1. **Целевой frontend framework:** остаёмся на vanilla HTML или переходим на React/Vue/Svelte/Next?
2. **Нужен ли сборщик** (Vite, Webpack) и package manager?
3. **CSS strategy:** CSS Modules, Tailwind, CSS-in-JS, или plain CSS + design tokens?
4. **TypeScript:** внедрять или оставить JavaScript?
5. **Routing:** React Router / Vue Router / другой — какой формат URL для обращений?
6. **Backend/API:** будет ли реальный backend или продолжаем с mock на следующем этапе?

## Существующий прототип

1. **Сохранять ли 3-экранную структуру** (Dashboard, Flow, Detail) как MVP scope?
2. **Приоритет экранов:** какие экраны добавить первыми после MVP (список с фильтрами, клиент, admin)?
3. **AI-flow:** остаётся ли upload → AI → card центральным сценарием?
4. **Mock-данные:** использовать текущий `appeals` schema как API contract?
5. **Статистика дашборда:** должна быть connected к real data или остаётся placeholder?

## Компоненты

1. **Table для списка обращений:** какой Figma pattern использовать (List items vs custom table)?
2. **Status/Badge:** какой компонент Figma соответствует status pills (Pins, Tag, Offer, custom)?
3. **Sidebar vs Top nav:** для admin UI — sidebar (как в прототипе) или Figma «Навигация»/«Header FSK»?
4. **AI-specific UI** (log, PII masking, doc preview): проектировать новые компоненты в Figma или в коде?
5. **Modal/Drawer:** нужны ли на ближайшем этапе (assign, export, confirm)?
6. **Empty/Error/Loading states:** обязательны для MVP или следующий этап?

## Дизайн-токены

1. **Font licensing:** TT Firs Text Trial Variable — есть ли лицензия для production web?
2. **Fallback font stack** если TT Firs недоступен?
3. **Экспорт tokens:** кто предоставит JSON/CSS export color/spacing/radius/shadow variables?
4. **Dark mode:** нужен ли для Appeal Hub? (не обнаружен в Kit audit)
5. **Mapping semantic tokens:** как маппить `badge--success` → Figma color variable?

## Иконки и assets

1. **Icon set:** использовать Icons из Assets page — полный export или selective?
2. **SVG strategy:** inline SVG, SVG sprite, или icon font?
3. **Logo Appeal Hub:** заменяет «AH» placeholder — есть ли brand assets?
4. **File type icons** для upload zone — из Figma или custom?

## Адаптивность

1. **Mobile support:** нужен ли admin UI на mobile или только desktop-first?
2. **Sidebar на mobile:** hamburger menu, bottom tabbar (Figma «Таббар»), или desktop-only?
3. **Breakpoints:** использовать Figma Desktop/Mobile typography breakpoints или custom?

## Нужные решения пользователя

| # | Вопрос | Варианты | Блокирует |
|---|---|---|---|
| 1 | Целевой frontend stack | Vanilla / React / Vue / Next / другое | Архитектуру, component strategy |
| 2 | Scope Figma Kit для admin UI | Marketing components / Admin subset / New Figma pages | Mapping, design work |
| 3 | MVP feature set | Текущие 3 экрана / +filters / +roles / +client | Backlog, timeline |
| 4 | Font (TT Firs) licensing | Licensed / Need purchase / Use fallback | Typography tokens |
| 5 | Backend на следующем этапе | Mock / REST API / GraphQL / другое | Data layer, persistence |
| 6 | AI-flow реализация | UI mock / Real API integration | Flow step 2-3 |
| 7 | Status model обращений | Текущие 3 статуса / расширенная модель | Badge, transitions, business logic |
| 8 | Table vs List для обращений | Data table / Card list / Figma List items | Dashboard redesign |
| 9 | Branding | FSK Header / Custom Appeal Hub header | Header component |
| 10 | Design tokens export format | CSS variables / JSON / Tailwind config | Implementation approach |

---

> **Следующий шаг:** после получения ответов на вопросы #1, #2, #3 можно начинать этап проектирования component library и migration plan.
