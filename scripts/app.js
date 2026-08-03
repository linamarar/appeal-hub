/**
 * Appeals list + routing + flow
 */

const PRIORITY_META = {
  'Низкий': 'low', 'Обычный': 'normal', 'Средний': 'normal', 'Высокий': 'high', 'Критический': 'critical',
};

const appealCardData = {
  id: 'AH-2026-01847',
  title: 'Некачественное предоставление коммунальных услуг',
  category: 'ЖКХ',
  date: '29.07.2026',
  priority: 'Средний',
  status: 'Новое',
  source: 'PDF-документ',
  region: 'г. Москва',
};

function renderStatusBadge(appeal) {
  const variant = appeal.statusVariant || 'neutral';
  return `<span class="ui-status-badge ui-status-badge--${variant}">${appeal.statusLabel}</span>`;
}

function renderPriorityBadge(priority) {
  const variant = PRIORITY_META[priority] || 'normal';
  return `<span class="ui-priority-badge ui-priority-badge--${variant}">${priority || 'Обычный'}</span>`;
}

function renderFlowAppealCard(container, data) {
  container.innerHTML = `
    <div class="appeal-card__header"><div><div class="appeal-card__id">${data.id}</div><div class="appeal-card__title">${data.title}</div></div>
    <span class="badge badge--neutral">${data.status}</span></div>
    <div class="appeal-card__grid">
      <div><div class="appeal-card__field-label">Категория</div><div class="appeal-card__field-value">${data.category}</div></div>
      <div><div class="appeal-card__field-label">Дата поступления</div><div class="appeal-card__field-value">${data.date}</div></div>
    </div>`;
}

function updateAppealsCount(count) {
  const el = document.getElementById('appeals-count');
  if (el) el.textContent = `Найдено обращений: ${count}`;
}

function setListState(state) {
  const loading = document.getElementById('appeals-loading');
  const empty = document.getElementById('appeals-empty');
  const data = document.getElementById('appeals-data-panel');
  [loading, empty].forEach((panel) => {
    if (panel) panel.classList.toggle('is-visible', panel.dataset.state === state);
  });
  if (data) data.classList.toggle('is-hidden', state !== 'loaded');
}

function renderTable() {
  const tbody = document.getElementById('appeals-table-body');
  if (!tbody) return;

  const appeals = AppealsService.getList();
  updateAppealsCount(appeals.length);
  setListState(appeals.length ? 'loaded' : 'empty');

  tbody.innerHTML = appeals.map((a) => `
    <tr data-appeal-id="${a.id}">
      <td><span class="ui-data-table__id">${a.id}</span></td>
      <td class="ui-data-table__muted">${a.client?.name || 'Нет данных'}</td>
      <td>${a.title}</td>
      <td>${renderStatusBadge(a)}</td>
      <td>${renderPriorityBadge(a.priority)}</td>
      <td class="ui-data-table__muted">${a.assigneeName || 'Не назначен'}</td>
      <td class="ui-data-table__muted">${a.sla?.label || 'Нет данных'}</td>
      <td class="ui-data-table__muted">${a.date}, ${a.time}</td>
      <td><button type="button" class="ui-data-table__link" data-go="appeal-detail" data-appeal-id="${a.id}">Открыть</button></td>
    </tr>
  `).join('');
}

function switchView(viewId) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('view--active'));
  const target = document.getElementById(`view-${viewId}`);
  if (target) target.classList.add('view--active');
  const navActiveMap = {
    dashboard: ['dashboard'],
    clients: ['clients', 'client-preview'],
    templates: ['templates'],
    analytics: ['analytics'],
    settings: ['settings', 'settings-detail'],
  };
  document.querySelectorAll('.shell-nav__item[data-view]').forEach((n) => {
    const group = navActiveMap[n.dataset.view] || [n.dataset.view];
    n.classList.toggle('is-active', group.includes(viewId));
  });
}

function parseRoute() {
  const hash = location.hash.slice(1) || '/appeals';
  const appealMatch = hash.match(/^\/appeals\/([^/?#]+)$/);
  if (appealMatch) return { view: 'appeal-detail', appealId: decodeURIComponent(appealMatch[1]) };
  const clientMatch = hash.match(/^\/clients\/([^/?#]+)$/);
  if (clientMatch) return { view: 'client-preview', clientId: decodeURIComponent(clientMatch[1]) };
  const settingsMatch = hash.match(/^\/settings\/([^/?#]+)$/);
  if (settingsMatch) return { view: 'settings-detail', settingsSlug: decodeURIComponent(settingsMatch[1]) };
  if (hash === '/flow') return { view: 'flow' };
  if (hash === '/clients') return { view: 'clients' };
  if (hash === '/templates') return { view: 'templates' };
  if (hash === '/analytics') return { view: 'analytics' };
  if (hash === '/settings') return { view: 'settings' };
  return { view: 'dashboard' };
}

const ROUTE_HASH = {
  dashboard: '/appeals',
  flow: '/flow',
  clients: '/clients',
  templates: '/templates',
  analytics: '/analytics',
  settings: '/settings',
};

function navigate(view, params = {}) {
  if (view === 'appeal-detail' && params.appealId) {
    location.hash = `/appeals/${encodeURIComponent(params.appealId)}`;
    return;
  }
  if (view === 'client-preview' && params.clientId) {
    location.hash = `/clients/${encodeURIComponent(params.clientId)}`;
    return;
  }
  if (view === 'settings-detail' && params.settingsSlug) {
    location.hash = `/settings/${encodeURIComponent(params.settingsSlug)}`;
    return;
  }
  location.hash = ROUTE_HASH[view] || '/appeals';
}

function handleRoute() {
  const route = parseRoute();
  switchView(route.view);
  if (route.view === 'appeal-detail') AppealDetailPage.load(route.appealId);
  if (route.view === 'dashboard') renderTable();
  if (route.view === 'clients') ClientsPage.load();
  if (route.view === 'client-preview') ClientsPage.loadPreview(route.clientId);
  if (route.view === 'templates') TemplatesPage.load();
  if (route.view === 'analytics') AnalyticsPage.load();
  if (route.view === 'settings') SettingsPage.load();
  if (route.view === 'settings-detail') SettingsPage.loadDetail(route.settingsSlug);
  if (route.view === 'flow') {
    setFlowStep(1);
    const uploadZone = document.getElementById('upload-zone');
    const incomingPreview = document.getElementById('incoming-preview');
    if (uploadZone) uploadZone.hidden = false;
    if (incomingPreview) incomingPreview.hidden = true;
  }
}

function setFlowStep(step) {
  document.querySelectorAll('.flow-panel').forEach((p) => p.classList.remove('flow-panel--active'));
  const panel = document.getElementById(`flow-step-${step}`);
  if (panel) panel.classList.add('flow-panel--active');
  document.querySelectorAll('.flow-step').forEach((s) => {
    const n = parseInt(s.dataset.step, 10);
    s.classList.remove('flow-step--done', 'flow-step--active');
    if (n < step) s.classList.add('flow-step--done');
    if (n === step) s.classList.add('flow-step--active');
  });
}

function simulateAIProcessing() {
  setFlowStep(2);
  const lastItem = document.querySelector('.ai-log__item--active');
  setTimeout(() => {
    lastItem.classList.remove('ai-log__item--active');
    lastItem.classList.add('ai-log__item--done');
    lastItem.querySelector('.ai-log__spinner').outerHTML = '<span class="ai-log__check">✓</span>';
    lastItem.textContent = '';
    lastItem.insertAdjacentHTML('afterbegin', '<span class="ai-log__check">✓</span> Извлечены структурированные данные');
    setTimeout(() => {
      const newItem = document.createElement('div');
      newItem.className = 'ai-log__item ai-log__item--done';
      newItem.innerHTML = '<span class="ai-log__check">✓</span> Карточка обращения создана';
      lastItem.parentElement.appendChild(newItem);
      setTimeout(() => {
        renderFlowAppealCard(document.getElementById('new-appeal-card'), appealCardData);
        setFlowStep(3);
        const list = AppealsService.getList();
        if (!list.find((a) => a.isNew)) {
          AppealsRepository.addAppealFromFlow(appealCardData);
          renderTable();
        }
      }, 600);
    }, 800);
  }, 2000);
}

function initFlow() {
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const incomingPreview = document.getElementById('incoming-preview');
  if (!uploadZone || !fileInput) return;
  document.getElementById('btn-upload').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => { uploadZone.hidden = true; incomingPreview.hidden = false; });
  uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('upload-zone--dragover'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('upload-zone--dragover'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault(); uploadZone.classList.remove('upload-zone--dragover');
    uploadZone.hidden = true; incomingPreview.hidden = false;
  });
  document.getElementById('btn-start-ai').addEventListener('click', simulateAIProcessing);
}

function syncFilterSelects(sourceRoot, targetRoot) {
  if (!sourceRoot || !targetRoot) return;
  sourceRoot.querySelectorAll('[data-filter]').forEach((source) => {
    const key = source.dataset.filter;
    const target = targetRoot.querySelector(`[data-filter="${key}"]`);
    if (target && target !== source) target.selectedIndex = source.selectedIndex;
  });
}

function resetAppealsFilters() {
  document.querySelectorAll('.appeals-toolbar select, #filters-drawer select').forEach((s) => { s.selectedIndex = 0; });
  const search = document.getElementById('appeals-search');
  if (search) search.value = '';
}

function initFiltersDrawer() {
  const drawer = document.getElementById('filters-drawer');
  const openBtn = document.getElementById('filters-drawer-open');
  const inlineRoot = document.querySelector('.appeals-toolbar__inline-filters');
  const drawerBody = drawer?.querySelector('.ui-drawer__body');
  if (!drawer || !openBtn || !inlineRoot || !drawerBody) return;

  function openDrawer() {
    syncFilterSelects(inlineRoot, drawerBody);
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('ui-drawer-open');
  }

  function closeDrawer() {
    syncFilterSelects(drawerBody, inlineRoot);
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('ui-drawer-open');
  }

  openBtn.addEventListener('click', openDrawer);
  drawer.querySelectorAll('[data-drawer-close]').forEach((el) => {
    el.addEventListener('click', closeDrawer);
  });

  drawerBody.querySelectorAll('[data-filter]').forEach((select) => {
    select.addEventListener('change', () => syncFilterSelects(drawerBody, inlineRoot));
  });

  document.getElementById('filters-drawer-reset')?.addEventListener('click', resetAppealsFilters);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });
}

const MOBILE_SIDEBAR_MQ = '(max-width: 1024px)';

function isMobileSidebar() {
  return window.matchMedia(MOBILE_SIDEBAR_MQ).matches;
}

function initSidebarToggle() {
  const shell = document.querySelector('.app-shell');
  const toggle = document.getElementById('sidebar-toggle');
  if (!shell || !toggle) return;
  const storageKey = 'appeal-hub-sidebar-collapsed';
  function setCollapsed(collapsed) {
    shell.classList.toggle('app-shell--sidebar-collapsed', collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? 'Развернуть меню' : 'Свернуть меню');
    const label = toggle.querySelector('span');
    if (label) label.textContent = collapsed ? 'Развернуть' : 'Свернуть';
    try { localStorage.setItem(storageKey, collapsed ? '1' : '0'); } catch (_) {}
  }
  try {
    if (localStorage.getItem(storageKey) === '1') setCollapsed(true);
  } catch (_) {}
  toggle.addEventListener('click', () => {
    if (isMobileSidebar()) return;
    setCollapsed(!shell.classList.contains('app-shell--sidebar-collapsed'));
  });
}

function initMobileSidebar() {
  const shell = document.querySelector('.app-shell');
  const menuToggle = document.getElementById('sidebar-menu-toggle');
  const closeBtn = document.getElementById('sidebar-close');
  const overlay = document.getElementById('shell-sidebar-overlay');
  const mq = window.matchMedia(MOBILE_SIDEBAR_MQ);
  if (!shell || !menuToggle) return;

  function setOpen(open) {
    if (!isMobileSidebar()) return;
    shell.classList.toggle('app-shell--sidebar-open', open);
    document.body.classList.toggle('shell-sidebar-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    if (overlay) overlay.setAttribute('aria-hidden', String(!open));
  }

  function closeSidebar() { setOpen(false); }

  menuToggle.addEventListener('click', () => {
    if (!isMobileSidebar()) return;
    setOpen(!shell.classList.contains('app-shell--sidebar-open'));
  });

  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  document.querySelectorAll('.shell-nav__item[data-view]').forEach((item) => {
    item.addEventListener('click', () => {
      if (isMobileSidebar()) closeSidebar();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileSidebar() && shell.classList.contains('app-shell--sidebar-open')) {
      closeSidebar();
      menuToggle.focus();
    }
  });

  mq.addEventListener('change', (e) => {
    if (!e.matches) closeSidebar();
  });
}

function initNavigation() {
  document.querySelectorAll('.shell-nav__item[data-view]').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.disabled) return;
      navigate(el.dataset.view);
    });
  });
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-go]');
    if (!trigger || trigger.disabled) return;
    const view = trigger.dataset.go;
    const appealId = trigger.dataset.appealId;
    const clientId = trigger.dataset.clientId;
    const settingsSlug = trigger.dataset.settingsSlug;
    if (view === 'appeal-detail' && appealId) navigate('appeal-detail', { appealId });
    else if (view === 'client-preview' && clientId) navigate('client-preview', { clientId });
    else if (view === 'settings-detail' && settingsSlug) navigate('settings-detail', { settingsSlug });
    else navigate(view);
  });
  const tbody = document.getElementById('appeals-table-body');
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      if (e.target.closest('[data-go]')) return;
      const row = e.target.closest('tr[data-appeal-id]');
      if (row) navigate('appeal-detail', { appealId: row.dataset.appealId });
    });
  }
  window.addEventListener('hashchange', handleRoute);
  document.getElementById('filters-reset')?.addEventListener('click', resetAppealsFilters);
  document.getElementById('appeals-refresh')?.addEventListener('click', () => {
    setListState('loading');
    setTimeout(renderTable, 300);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!location.hash) location.hash = '/appeals';
  setListState('loading');
  setTimeout(renderTable, 400);
  initFlow();
  initSidebarToggle();
  initMobileSidebar();
  initFiltersDrawer();
  initNavigation();
  handleRoute();
});
