/**
 * Clients list page — mock.
 */

const ClientsPage = (() => {
  let filters = { search: '', clientType: '', openAppeals: '' };
  let eventsBound = false;

  function statusBadge(statusKey) {
    const def = ClientsRepository.CLIENT_STATUSES[statusKey] || { label: statusKey, variant: 'neutral' };
    return PageUtils.statusBadge(def.label, def.variant);
  }

  function filterClients() {
    return ClientsRepository.getAll().filter((c) => {
      const q = filters.search.trim().toLowerCase();
      if (q && !`${c.name} ${c.email} ${c.phone} ${c.objectOrContract}`.toLowerCase().includes(q)) return false;
      if (filters.clientType && c.clientType !== filters.clientType) return false;
      if (filters.openAppeals === 'yes' && c.openAppeals === 0) return false;
      if (filters.openAppeals === 'no' && c.openAppeals > 0) return false;
      return true;
    });
  }

  function renderTable(clients) {
    const tbody = document.getElementById('clients-table-body');
    if (!tbody) return;
    tbody.innerHTML = clients.map((c) => `
      <tr data-client-id="${PageUtils.escapeHtml(c.id)}">
        <td><span class="ui-data-table__id">${PageUtils.escapeHtml(c.name)}</span></td>
        <td class="ui-data-table__muted">${PageUtils.escapeHtml(c.phone)}<br>${PageUtils.escapeHtml(c.email)}</td>
        <td class="ui-data-table__muted">${PageUtils.escapeHtml(c.objectOrContract)}</td>
        <td>${c.totalAppeals}</td>
        <td>${c.openAppeals}</td>
        <td class="ui-data-table__muted">${PageUtils.formatDateTime(c.lastActivityAt)}</td>
        <td>${statusBadge(c.status)}</td>
        <td><button type="button" class="ui-data-table__link" data-go="client-detail" data-client-id="${PageUtils.escapeHtml(c.id)}">Открыть</button></td>
      </tr>
    `).join('');
  }

  function updateCount(count) {
    const el = document.getElementById('clients-count');
    if (el) el.textContent = `Найдено клиентов: ${count}`;
  }

  function applyFilters() {
    const clients = filterClients();
    updateCount(clients.length);
    if (!clients.length) {
      PageUtils.setPanelState('clients', 'empty');
      return;
    }
    PageUtils.setPanelState('clients', 'loaded');
    renderTable(clients);
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;
    document.getElementById('clients-search')?.addEventListener('input', (e) => {
      filters.search = e.target.value;
      applyFilters();
    });
    document.getElementById('clients-type-filter')?.addEventListener('change', (e) => {
      filters.clientType = e.target.value;
      applyFilters();
    });
    document.getElementById('clients-open-filter')?.addEventListener('change', (e) => {
      filters.openAppeals = e.target.value;
      applyFilters();
    });
    document.getElementById('clients-filters-reset')?.addEventListener('click', () => {
      filters = { search: '', clientType: '', openAppeals: '' };
      const search = document.getElementById('clients-search');
      if (search) search.value = '';
      document.getElementById('clients-type-filter').selectedIndex = 0;
      document.getElementById('clients-open-filter').selectedIndex = 0;
      applyFilters();
    });
    document.getElementById('clients-table-body')?.addEventListener('click', (e) => {
      if (e.target.closest('[data-go]')) return;
      const row = e.target.closest('tr[data-client-id]');
      if (row) navigate('client-detail', { clientId: row.dataset.clientId });
    });
  }

  function load() {
    PageUtils.setPanelState('clients', 'loading');
    setTimeout(() => {
      bindEvents();
      applyFilters();
    }, 200);
  }

  return { load };
})();
