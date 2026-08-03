/**
 * Templates page — mock tabs, search, filters.
 */

const TemplatesPage = (() => {
  let activeTab = 'responses';
  let filters = { search: '', status: '' };
  let eventsBound = false;

  function statusBadge(statusKey) {
    const def = TemplatesRepository.TEMPLATE_STATUSES[statusKey] || { label: statusKey, variant: 'neutral' };
    return PageUtils.statusBadge(def.label, def.variant);
  }

  function usageLabel(key) {
    return TemplatesRepository.USAGE_MODES[key] || key;
  }

  function getItems() {
    const items = activeTab === 'responses'
      ? TemplatesRepository.getResponseTemplates()
      : TemplatesRepository.getDocumentTemplates();
    return items.filter((t) => {
      const q = filters.search.trim().toLowerCase();
      if (q && !t.name.toLowerCase().includes(q)) return false;
      if (filters.status && t.status !== filters.status) return false;
      return true;
    });
  }

  function renderResponses(items) {
    const tbody = document.getElementById('templates-table-body');
    if (!tbody) return;
    tbody.innerHTML = items.map((t) => `
      <tr>
        <td><span class="ui-data-table__id">${PageUtils.escapeHtml(t.name)}</span></td>
        <td class="ui-data-table__muted">${PageUtils.escapeHtml(t.topic)}</td>
        <td>${PageUtils.escapeHtml(t.version)}</td>
        <td>${statusBadge(t.status)}</td>
        <td class="ui-data-table__muted">${PageUtils.escapeHtml(usageLabel(t.usage))}</td>
        <td class="ui-data-table__muted">${PageUtils.formatDateTime(t.updatedAt)}</td>
        <td class="ui-data-table__muted">${PageUtils.escapeHtml(t.author)}</td>
        <td><button type="button" class="ui-data-table__link" disabled title="Будет реализовано на следующем этапе">Открыть</button></td>
      </tr>
    `).join('');
  }

  function renderDocuments(items) {
    const tbody = document.getElementById('templates-table-body');
    if (!tbody) return;
    tbody.innerHTML = items.map((t) => `
      <tr>
        <td><span class="ui-data-table__id">${PageUtils.escapeHtml(t.name)}</span></td>
        <td class="ui-data-table__muted">${PageUtils.escapeHtml(t.docType)}</td>
        <td class="ui-data-table__muted">${PageUtils.escapeHtml(t.topic)}</td>
        <td>${PageUtils.escapeHtml(t.version)}</td>
        <td>${t.needsApproval ? 'Да' : 'Нет'}</td>
        <td>${statusBadge(t.status)}</td>
        <td class="ui-data-table__muted">${PageUtils.formatDateTime(t.updatedAt)}</td>
        <td><button type="button" class="ui-data-table__link" disabled title="Будет реализовано на следующем этапе">Открыть</button></td>
      </tr>
    `).join('');
  }

  function updateHeaders() {
    const head = document.getElementById('templates-table-head');
    if (!head) return;
    head.innerHTML = activeTab === 'responses'
      ? '<tr><th>Название</th><th>Тематика</th><th>Версия</th><th>Статус</th><th>Использование</th><th>Изменён</th><th>Автор</th><th></th></tr>'
      : '<tr><th>Название</th><th>Тип</th><th>Тематика</th><th>Версия</th><th>Согласование</th><th>Статус</th><th>Изменён</th><th></th></tr>';
  }

  function applyFilters() {
    const items = getItems();
    const countEl = document.getElementById('templates-count');
    if (countEl) countEl.textContent = `Найдено: ${items.length}`;
    if (!items.length) {
      PageUtils.setPanelState('templates', 'empty');
      return;
    }
    PageUtils.setPanelState('templates', 'loaded');
    updateHeaders();
    if (activeTab === 'responses') renderResponses(items);
    else renderDocuments(items);
  }

  function setTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.ui-tabs__tab').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.tab === tab);
      btn.setAttribute('aria-selected', btn.dataset.tab === tab ? 'true' : 'false');
    });
    applyFilters();
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;
    document.querySelectorAll('.ui-tabs__tab').forEach((btn) => {
      btn.addEventListener('click', () => setTab(btn.dataset.tab));
    });
    document.getElementById('templates-search')?.addEventListener('input', (e) => {
      filters.search = e.target.value;
      applyFilters();
    });
    document.getElementById('templates-status-filter')?.addEventListener('change', (e) => {
      filters.status = e.target.value;
      applyFilters();
    });
    document.getElementById('templates-filters-reset')?.addEventListener('click', () => {
      filters = { search: '', status: '' };
      document.getElementById('templates-search').value = '';
      document.getElementById('templates-status-filter').selectedIndex = 0;
      applyFilters();
    });
  }

  function load() {
    PageUtils.setPanelState('templates', 'loading');
    setTimeout(() => {
      bindEvents();
      setTab('responses');
    }, 200);
  }

  return { load };
})();
