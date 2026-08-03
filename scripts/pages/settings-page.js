/**
 * Settings catalog page — mock admin sections.
 */

const SettingsPage = (() => {
  const ICONS = {
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    channel: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    tag: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
    priority: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    swap: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
    template: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>',
    document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
    auto: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    plug: '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-12 0V8z"/>',
    audit: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  };

  function readinessBadge(key) {
    const def = SettingsRepository.SETTINGS_READINESS[key] || { label: key, variant: 'neutral' };
    return PageUtils.statusBadge(def.label, def.variant);
  }

  function renderCatalog() {
    const root = document.getElementById('settings-catalog');
    if (!root) return;
    const sections = SettingsRepository.getAll();
    root.innerHTML = sections.map((s) => {
      const icon = ICONS[s.icon] || ICONS.document;
      const disabled = s.readiness === 'PLANNED';
      return `
        <button type="button" class="settings-item${disabled ? ' settings-item--disabled' : ''}" data-go="${disabled ? '' : 'settings-detail'}" data-settings-slug="${PageUtils.escapeHtml(s.slug)}" ${disabled ? 'disabled' : ''}>
          <span class="settings-item__icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icon}</svg></span>
          <span class="settings-item__body">
            <span class="settings-item__title">${PageUtils.escapeHtml(s.name)}</span>
            <span class="settings-item__desc">${PageUtils.escapeHtml(s.description)}</span>
          </span>
          <span class="settings-item__badge">${readinessBadge(s.readiness)}</span>
        </button>`;
    }).join('');
  }

  function loadDetail(slug) {
    const section = SettingsRepository.getBySlug(slug);
    const root = document.getElementById('settings-detail-content');
    if (!root) return;
    if (!section) {
      root.innerHTML = '<div class="ui-error-state">Раздел не найден</div>';
      return;
    }
    root.innerHTML = `
      <header class="ui-page__header">
        <div>
          <button type="button" class="ui-page__back" data-go="settings">← К настройкам</button>
          <h1 class="ui-page__title">${PageUtils.escapeHtml(section.name)}</h1>
          <p class="ui-page__desc">${PageUtils.escapeHtml(section.description)}</p>
        </div>
        ${readinessBadge(section.readiness)}
      </header>
      <div class="ui-card">
        <div class="ui-card__body">
          <p class="ui-page__notice">Функциональность будет реализована отдельным этапом. Текущий статус: ${PageUtils.escapeHtml(SettingsRepository.SETTINGS_READINESS[section.readiness]?.label || section.readiness)}.</p>
        </div>
      </div>`;
  }

  function load() {
    PageUtils.setPanelState('settings', 'loading');
    setTimeout(() => {
      PageUtils.setPanelState('settings', 'loaded');
      renderCatalog();
    }, 200);
  }

  return { load, loadDetail };
})();
