# Дизайн-токены Хаба обращений

## 1. Источник

| Параметр | Значение |
|---|---|
| Figma file | [🟠 UI Kit (Copy)](https://www.figma.com/design/sFtelWja1vzUGTjPMkBEQn/%F0%9F%9F%A0-UI-Kit--Copy-?m=auto&t=dwdqbG1OXhKpfUnT-6) |
| File key | `sFtelWja1vzUGTjPMkBEQn` |
| Способ получения | Figma MCP (`get_metadata`, `get_variable_defs`) + данные аудита `docs/figma-access-audit.md` |
| Дата извлечения | 2026-08-03 |
| Ограничение | Rate limit MCP на часть запросов; colors/spacing/radius/shadows — из metadata страниц «Атомы» |

### Использованные страницы Figma

| Страница | Node ID | Содержимое |
|---|---|---|
| Цвета | `11128:23828` | Brand, neutral, text, system colors |
| Скругления | `11128:23871` | Radius scale + usage groups |
| Отступы | `13699:14173` | Spacing 2–88 px |
| Тени | `15166:7895` | Shadow for cookies |
| Типографика | `11088:51433` → section «Типографика» | h1–h5, txt-xl/l/m, Button M |
| Молекулы → Кнопки | `3819:198` | Control heights L/M/S, Button variables |

### Figma Variables (подтверждены через `get_variable_defs`)

| Variable | Значение | Node |
|---|---|---|
| `Text/White text` | `#FFFFFF` | Button Primary (`910:3640`) |
| `Text/Grey text` | `#959596` | Color swatches |
| `Button M` | TT Firs, 16px, weight 450, lh 1.36 | Button Primary |
| `Button Primary` | Inner shadows | Button Primary |
| `Accient/Cooper` | *(empty in MCP response)* | Button Primary |
| `Desktop/Headline/H1` | TT Firs, 56px, weight 500 | Typography |

---

## 2. Архитектура токенов

```
styles/tokens/
  primitives.tokens.json   ← исходные значения из Figma
  semantic.tokens.json     ← семантические alias → primitive
  tokens.css               ← CSS custom properties (:root)

styles/foundations/
  typography.css           ← utility classes (.text-heading-xl, …)
  reset.css                ← minimal foundation reset
  base.css                 ← theme marker, без override legacy body
```

### Уровни

| Уровень | Файл | Пример |
|---|---|---|
| Primitive | `primitives.tokens.json` | `color.copper` → `#E84E0E` |
| Semantic | `semantic.tokens.json` | `color.action.primary` → `{color.copper}` |
| Runtime | `tokens.css` | `--color-action-primary: var(--color-copper)` |

### Правила использования

1. **Новые компоненты** — только semantic CSS variables (`var(--color-text-primary)`).
2. **Primitive variables** — только внутри `tokens.css` и JSON; не использовать напрямую в UI.
3. **Legacy prototype** (`styles/main.css`) — пока на старых значениях; миграция отдельным этапом.
4. **Light theme only** — dark mode tokens не созданы.
5. **Шрифт** — token содержит имя TT Firs + fallback; файлы шрифта не подключаются.

### Синхронизация JSON ↔ CSS

**Ручная.** Генератор не используется (нет новых зависимостей).

При изменении Figma:
1. Обновить `primitives.tokens.json`
2. Обновить `semantic.tokens.json` (если меняется семантика)
3. Синхронизировать значения в `tokens.css`
4. Обновить этот документ (§12)

---

## 3. Цвета

### Brand & accent

| Semantic | CSS variable | Primitive | Value | Figma source |
|---|---|---|---|---|
| brand.primary | `--color-brand-primary` | `color.copper` | `#E84E0E` | Copper (accient) |
| brand.primaryHover | `--color-brand-primary-hover` | `color.copper-light` | `#FF8A1E` | Copper gradient end |
| brand.primaryFill | `--color-brand-primary-fill` | `color.copper-fill` | `#C65E18` | Fill cooper |
| brand.secondary | `--color-brand-secondary` | `color.cooper-dark` | `#AC400F` | Cooper gradient start |
| accent.default | `--color-accent-default` | `color.copper` | `#E84E0E` | Copper (accient) |

### Background

| Semantic | CSS variable | Value | Figma |
|---|---|---|---|
| background.page | `--color-background-page` | `#FFFFFF` | White |
| background.surface | `--color-background-surface` | `#FFFFFF` | White |
| background.surfaceMuted | `--color-background-surface-muted` | `#F4F4F4` | Grey soft |
| background.inverse | `--color-background-inverse` | `#1F1F1F` | Black |
| background.tabbar | `--color-background-tabbar` | `#262626` | Tabbar |

### Text

| Semantic | CSS variable | Value | Figma |
|---|---|---|---|
| text.primary | `--color-text-primary` | `#1F1F1F` | Black text |
| text.secondary | `--color-text-secondary` | `#6F6F70` | Grey text on white |
| text.muted | `--color-text-muted` | `#959596` | Grey text / Variable |
| text.inverse | `--color-text-inverse` | `#FFFFFF` | White text |
| text.inverseMuted | `--color-text-inverse-muted` | `rgba(255,255,255,0.64)` | White opacity |
| text.accent | `--color-text-accent` | `#E84E0E` | Copper text |
| text.link | `--color-text-link` | `#0062A8` | Blue |

### Border & divider

| Semantic | CSS variable | Value | Figma |
|---|---|---|---|
| border.default | `--color-border-default` | `#D9D9D9` | Grey light |
| border.subtle | `--color-border-subtle` | `#F4F4F4` | Grey soft |
| border.strong | `--color-border-strong` | `#414141` | Grey Dark |
| divider.default | `--color-divider-default` | `#D9D9D9` | Grey light |

### Interactive & status

| Semantic | CSS variable | Value | Figma |
|---|---|---|---|
| action.primary | `--color-action-primary` | `#E84E0E` | Copper |
| action.primaryHover | `--color-action-primary-hover` | `#FF8A1E` | Copper light |
| status.success | `--color-status-success` | `#147546` | Success |
| status.danger | `--color-status-danger` | `#E64242` | Error |
| status.info | `--color-status-info` | `#0062A8` | Blue |

---

## 4. Типографика

Font family token: `--font-family-primary` = `"TT Firs Text Trial Variable", system-ui, …`

| Style | CSS utilities | Size | Weight | Line height | Figma |
|---|---|---|---|---|---|
| heading-xl | `.text-heading-xl` | 56px | 500 | 56px | h1 desktop |
| heading-lg | `.text-heading-lg` | 36px | 500 | 40px | h2 desktop |
| heading-md | `.text-heading-md` | 28px | 500 | 36px | h3 desktop |
| heading-sm | `.text-heading-sm` | 24px | 500 | 30px | h4 desktop |
| heading-xs | `.text-heading-xs` | 18px | 500 | 24px | h5 desktop |
| body-xl | `.text-body-xl` | 36px | 450 | 48px | txt-xl |
| body-lg | `.text-body-lg` | 22px | 450 | 32px | txt-l |
| body-md | `.text-body-md` | 15px | 450 | 22px | txt-m |
| body-sm | `.text-body-sm` | 16px | 450 | 1.36 | Button M |
| label-md | `.text-label-md` | 15px | 450 | 22px | txt-m |
| label-sm | `.text-label-sm` | 16px | 450 | 1.36 | Button M |
| caption | `.text-caption` | 15px | 450 | 22px | txt-m |

Mobile typography variants (h1 32px, h2 26px, …) зафиксированы в `primitives.tokens.json`, CSS variables для mobile — на следующем этапе (responsive typography).

---

## 5. Spacing

| Token | CSS variable | Value | Figma |
|---|---|---|---|
| spacing.1 | `--spacing-1` | 2px | 2 px |
| spacing.2 | `--spacing-2` | 4px | 4 px |
| spacing.3 | `--spacing-3` | 8px | 8 px |
| spacing.4 | `--spacing-4` | 12px | 12 px |
| spacing.5 | `--spacing-5` | 16px | 16 px |
| spacing.6 | `--spacing-6` | 20px | 20 px |
| spacing.7 | `--spacing-7` | 24px | 24 px |
| spacing.8 | `--spacing-8` | 32px | 32 px |
| spacing.9 | `--spacing-9` | 40px | 40 px |
| spacing.10 | `--spacing-10` | 48px | 48 px |
| … | `--spacing-11` … `--spacing-15` | 56–88px | Отступы |

Semantic: `--spacing-page` (32px), `--spacing-section` (48px), `--spacing-stack-*`, `--spacing-inline-*`.

---

## 6. Radius

| Token | CSS variable | Value | Figma usage |
|---|---|---|---|
| control-sm | `--radius-control-sm` | 8px | Контролы |
| control-md | `--radius-control-md` | 12px | Контролы |
| element-sm | `--radius-element-sm` | 16px | Элементы внутри секций |
| element-md | `--radius-element-md` | 20px | Элементы внутри секций |
| element-lg | `--radius-element-lg` | 24px | Элементы внутри секций |
| section | `--radius-section` | 32px | Секции |

Semantic: `--radius-control`, `--radius-surface`, `--radius-pill`.

**Figma note:** corner smoothing 50% — CSS `border-radius` не воспроизводит smoothing; требует уточнения при pixel-perfect UI.

---

## 7. Borders

Explicit border-width tokens **не найдены** в Figma atoms. Используется implicit 1px при миграции компонентов.

Цвета border — semantic tokens `--color-border-*`.

---

## 8. Shadows

| Token | CSS variable | Value | Figma |
|---|---|---|---|
| elevation-sm | `--shadow-elevation-sm` | `0px 4px 14.8px rgba(0,0,0,0.55)` | Shadow for cookies |
| button-primary | `--shadow-button-primary` | dual inner shadow | Button Primary variable |

Дополнительные elevation levels (md/lg) **не определены** в Figma atoms.

---

## 9. Control sizes

| Size | CSS variable | Height | Figma |
|---|---|---|---|
| sm | `--control-height-sm` | 32px | Button Size=S |
| md | `--control-height-md` | 40px | Button Size=M |
| lg | `--control-height-lg` | 48px | Button Size=L |

---

## 10. States

| State | Token(s) | Status |
|---|---|---|
| hover | `--color-action-primary-hover`, `--color-action-secondary-hover` | ✅ From Figma colors |
| active | — | ❌ Not extracted |
| focus | `--color-focus-ring` | ⚠️ Mapped to Blue; not confirmed in Figma |
| disabled | `--color-disabled-background`, `--color-disabled-text` | ✅ Partial |
| success | `--color-status-success` | ✅ |
| warning | — | ❌ Not in Figma colors page |
| error | `--color-status-danger` | ✅ |

Button states (Default/Hover/Disable/Loading) — variants exist in Figma; per-state color tokens будут добавлены при миграции Button.

---

## 11. Правила использования

1. Import order in `index.html`: `tokens.css` → foundations → `main.css` (legacy overrides).
2. Do not reference hex values in new component CSS.
3. Do not add font files to the repository.
4. Do not install Tailwind or token build tools without separate approval.
5. Marketing Figma colors/components — out of scope (`docs/technical-decisions.md`).
6. Gradient accents (Cooper, Copper, Tabbar) — store endpoints as primitives; apply gradients in components when needed.

---

## 12. Неизвлечённые или неподтверждённые значения

| Категория | Статус | Действие |
|---|---|---|
| Warning color | ❌ Not in Figma | Do not use until confirmed |
| Focus ring spec | ⚠️ Provisional (Blue) | Confirm with design |
| Border width scale | ❌ Not in atoms | Default 1px in components |
| Icon size scale | ❌ Not extracted | Confirm from Assets/Icons |
| Breakpoints (px) | ❌ Not explicit | Mobile typography values exist, breakpoints TBD |
| z-index scale | ❌ Not in Figma | Define at shell implementation |
| Animation duration / easing | ❌ Not in Figma | Define at motion implementation |
| Shadow md/lg/xl | ❌ Only one shadow in atoms | Extend when Figma provides |
| `--radius-full` (pill) | ⚠️ Derived | Confirm against badge/pin components |
| Status surface tints | ⚠️ Derived rgba | Not in Figma atoms |
| `Accient/Cooper` variable | ⚠️ Empty in MCP | Confirm gradient token binding |
| Overlay background | ❌ Not found | TBD for modal/drawer |
| Component density | ❌ Not found | — |

---

## 13. Ограничения лицензирования шрифтов

- **TT Firs Text Trial Variable** — имя используется только в CSS token.
- Font files (`.woff`, `.woff2`, `.ttf`) **не добавлены** в репозиторий.
- `@font-face` **не создан**.
- До corporate web-license браузер использует fallback: `system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`.
- Legacy prototype continues loading **Inter** from Google Fonts for existing screens.

---

## 14. Порядок обновления токенов при изменении Figma

1. Re-run Figma MCP extraction for affected pages (Colors, Typography, …).
2. Update `primitives.tokens.json` with new/changed values; preserve Figma name in `figma` metadata.
3. Update `semantic.tokens.json` references if semantics change.
4. Mirror changes in `styles/tokens/tokens.css`.
5. Update typography utilities if text styles changed.
6. Update this document §3–§12.
7. Run JSON validation: `python3 -m json.tool styles/tokens/primitives.tokens.json`
8. Visual regression check on migrated components only (legacy unchanged until migration).

---

## Подключение в приложении

```html
<link rel="stylesheet" href="styles/tokens/tokens.css" />
<link rel="stylesheet" href="styles/foundations/reset.css" />
<link rel="stylesheet" href="styles/foundations/base.css" />
<link rel="stylesheet" href="styles/foundations/typography.css" />
<link rel="stylesheet" href="styles/main.css" />
```

Legacy `main.css` загружается последним — **визуал прототипа сохранён**.
