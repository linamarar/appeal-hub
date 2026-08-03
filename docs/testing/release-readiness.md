# Готовность к релизу / демо

**Дата оценки:** 03.08.2026  
**Версия:** v0.1 · прототип  
**Production URL:** https://appealhub.mararx.com/ (HTTP 200, smoke curl)

---

## Вердикт

| Критерий | Оценка |
|---|---|
| **Demo readiness** | **ДА — с оговорками** |
| **Production release** | **НЕТ** (прототип без backend) |
| **Build** | **PASS** |
| **Blockers (P0/P1)** | **0** |

Прототип **готов к демонстрации** основных сценариев: список обращений, карточка (статусы, назначение, комментарии), flow создания, mock-разделы (клиенты, шаблоны, аналитика, настройки). Критических блокеров нет.

---

## Матрица готовности

| Область | Статус | Комментарий |
|---|---|---|
| Загрузка приложения | ✅ | Статика, все assets 200 |
| Маршрутизация | ✅ | 9 маршрутов + fallback |
| Список обращений | ✅ | Поиск + фильтры работают (code verified) |
| Карточка обращения | ✅ | Полный mock CRUD in-memory |
| Flow создания | ✅ | Draft guard, dynamic ID; preview файла только из selectedFile (DEF-009 FIXED) |
| Mock-клиенты | ⚠️ | DEF-001: SLA в табе обращений |
| Mock-аналитика | ✅ | Demo data, периоды |
| Mock-настройки | ✅ | Каталог + stubs |
| GitHub Pages deploy | ✅ | Workflow на push master |
| Custom domain | ✅ | appealhub.mararx.com отвечает |
| A11y | ⚠️ | 4 a11y gaps (P3) |
| Автотесты | ❌ | NOT IMPLEMENTED |

---

## Риски для демо

| # | Риск | Severity | Mitigation на демо |
|---|---|---|---|
| 1 | SLA в карточке клиента некорректен | Low | Показывать SLA из карточки обращения |
| 2 | Нельзя фильтровать по конкретному исполнителю | Low | Не демонстрировать этот фильтр |
| 3 | Пагинация — декоративная | Low | ≤14 записей помещаются на экран |
| 4 | In-memory data | Medium | Не перезагружать страницу mid-demo после изменений |
| 5 | README обещает KPI на дашборде | Low | Использовать раздел «Аналитика» |

---

## Рекомендации перед публичным demo

1. **P2:** исправить `AppealsService.getList()` вызов в `clients-service.js` (DEF-001)
2. **P3:** добавить `aria-label` на `#appeals-search` (DEF-003)
3. Обновить `README.md` — убрать упоминание KPI на дашборде или добавить ссылку на `#/analytics`
4. Задокументировать production URL в README

---

## Рекомендации перед production (out of scope v0.1)

- Backend API + persistence
- Реальная auth / RBAC
- Пагинация server-side
- E2E test suite (Playwright/Cypress)
- WCAG audit + focus management
- Мониторинг ошибок (Sentry)

---

## Sign-off checklist

| # | Пункт | Done |
|---|---|---|
| 1 | Build pass | ✅ |
| 2 | P0 = 0 | ✅ |
| 3 | P1 = 0 | ✅ |
| 4 | Regression docs complete | ✅ |
| 5 | Production smoke | ✅ |
| 6 | Browser E2E | ❌ (не выполнялся) |
| 7 | Stakeholder sign-off | ⏳ |

---

## Связанные документы

- [regression-results.md](./regression-results.md) — 78 кейсов: 68 pass, 5 fail, 5 N/A
- [defects.md](./defects.md) — 8 дефектов (P2×3, P3×5)
- [current-scope.md](./current-scope.md) — инвентаризация
