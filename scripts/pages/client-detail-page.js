/**
 * Client detail card page.
 */

const ClientDetailPage = (() => {
  let currentId = null;
  let appealFilter = 'all';
  let activeTab = 'appeals';
  let eventsBound = false;

  const PRIORITY_META = {
    'Низкий': 'low', 'Обычный': 'normal', 'Средний': 'normal', 'Высокий': 'high', 'Критический': 'critical',
  };

  function showState(state) {
    ['loading', 'not-found', 'loaded'].forEach((s) => {
      const el = document.getElementById(`client-detail-${s}`);
      if (el) el.classList.toggle('is-visible', s === state);
    });
  }

  function priorityBadge(priority) {
    const variant = PRIORITY_META[priority] || 'normal';
    return `<span class="ui-priority-badge ui-priority-badge--${variant}">${PageUtils.escapeHtml(priority || 'Обычный')}</span>`;
  }

  function renderTags(tags) {
    if (!tags?.length) return '';
    return tags.map((t) => `<span class="client-detail__tag">${PageUtils.escapeHtml(t)}</span>`).join('');
  }

  function renderAppealsTable(appeals) {
    if (!appeals.length) {
      return '<div class="ui-empty-state ui-empty-state--compact"><p class="ui-empty-state__text">У клиента пока нет обращений</p></div>';
    }
    return `
      <div class="ui-data-table-wrap">
        <table class="ui-data-table">
          <thead><tr><th>№</th><th>Тема</th><th>Статус</th><th>Приоритет</th><th>Исполнитель</th><th>SLA</th><th>Обновлено</th><th></th></tr></thead>
          <tbody>${appeals.map((a) => `
            <tr>
              <td><span class="ui-data-table__id">${PageUtils.escapeHtml(a.id)}</span></td>
              <td>${PageUtils.escapeHtml(a.title)}</td>
              <td><span class="ui-status-badge ui-status-badge--${a.statusVariant}">${PageUtils.escapeHtml(a.statusLabel)}</span></td>
              <td>${priorityBadge(a.priority)}</td>
              <td class="ui-data-table__muted">${PageUtils.escapeHtml(a.assigneeName || 'Не назначен')}</td>
              <td class="ui-data-table__muted">${PageUtils.escapeHtml(a.sla?.label || 'Нет данных')}</td>
              <td class="ui-data-table__muted">${PageUtils.escapeHtml(a.updatedDate || '—')}</td>
              <td><button type="button" class="ui-data-table__link" data-go="appeal-detail" data-appeal-id="${PageUtils.escapeHtml(a.id)}">Открыть</button></td>
            </tr>`).join('')}</tbody>
        </table>
      </div>`;
  }

  function renderDocuments(docs) {
    if (!docs.length) {
      return '<div class="ui-empty-state ui-empty-state--compact"><p class="ui-empty-state__text">Документов пока нет</p></div>';
    }
    return `
      <div class="ui-data-table-wrap">
        <table class="ui-data-table">
          <thead><tr><th>Название</th><th>Тип</th><th>Дата</th><th>Источник</th><th>Обращение</th><th>Статус</th><th></th></tr></thead>
          <tbody>${docs.map((d) => {
            const viewBtn = d.mockUrl
              ? `<button type="button" class="ui-data-table__link" disabled title="Файл недоступен в прототипе">Просмотр</button>`
              : `<span class="ui-tooltip"><button type="button" class="ui-data-table__link" disabled>Просмотр</button><span class="ui-tooltip__bubble">Файл недоступен в прототипе</span></span>`;
            return `<tr>
              <td><span class="ui-data-table__id">${PageUtils.escapeHtml(d.name)}</span></td>
              <td class="ui-data-table__muted">${PageUtils.escapeHtml(d.documentType)}</td>
              <td class="ui-data-table__muted">${PageUtils.formatDateTime(d.createdAt)}</td>
              <td class="ui-data-table__muted">${PageUtils.escapeHtml(d.source)}</td>
              <td class="ui-data-table__muted">${d.relatedAppealId ? `<button type="button" class="ui-data-table__link" data-go="appeal-detail" data-appeal-id="${PageUtils.escapeHtml(d.relatedAppealId)}">${PageUtils.escapeHtml(d.relatedAppealId)}</button>` : '—'}</td>
              <td>${PageUtils.statusBadge(d.status, 'neutral')}</td>
              <td>${viewBtn}</td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>`;
  }

  function renderHistory(items) {
    if (!items.length) {
      return '<div class="ui-empty-state ui-empty-state--compact"><p class="ui-empty-state__text">История взаимодействия пуста</p></div>';
    }
    return `<ul class="ui-timeline client-detail__timeline">${items.map((h) => `
      <li class="ui-timeline__item">
        <time class="ui-timeline__time">${PageUtils.formatDateTime(h.createdAt)}</time>
        <div class="ui-timeline__content">
          <div class="ui-timeline__author">${PageUtils.escapeHtml(h.author)} · ${PageUtils.escapeHtml(h.typeLabel)}</div>
          <p class="ui-timeline__text">${PageUtils.escapeHtml(h.description)}</p>
          ${h.appealId ? `<button type="button" class="ui-data-table__link" data-go="appeal-detail" data-appeal-id="${PageUtils.escapeHtml(h.appealId)}">${PageUtils.escapeHtml(h.appealId)}</button>` : ''}
        </div>
      </li>`).join('')}</ul>`;
  }

  function renderSidebar(client, detail) {
    const emptyObj = !client.relatedObjects?.length;
    const emptyCtr = !client.relatedContracts?.length;
    return `
      <div class="client-detail__sidebar">
        <div class="ui-card">
          <div class="ui-card__header"><span class="ui-card__title">Контактная информация</span></div>
          <div class="ui-card__body">
            <div class="ui-meta-list">
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">Телефон</span><span class="ui-meta-list__value${!client.phone ? ' ui-meta-list__value--muted' : ''}">${PageUtils.escapeHtml(client.phone || 'Не указано')}</span></div>
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">Email</span><span class="ui-meta-list__value${!client.email ? ' ui-meta-list__value--muted' : ''}">${PageUtils.escapeHtml(client.email || 'Не указано')}</span></div>
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">Канал связи</span><span class="ui-meta-list__value${!client.preferredContactChannel ? ' ui-meta-list__value--muted' : ''}">${PageUtils.escapeHtml(client.preferredContactChannel || 'Не указано')}</span></div>
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">Тип клиента</span><span class="ui-meta-list__value">${PageUtils.escapeHtml(client.clientType || 'Нет данных')}</span></div>
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">Создан</span><span class="ui-meta-list__value">${PageUtils.formatDateTime(client.createdAt)}</span></div>
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">Последняя активность</span><span class="ui-meta-list__value">${PageUtils.formatDateTime(client.lastActivityAt)}</span></div>
            </div>
          </div>
        </div>
        <div class="ui-card">
          <div class="ui-card__header"><span class="ui-card__title">Связанные объекты</span></div>
          <div class="ui-card__body">${emptyObj ? '<p class="client-detail__empty-inline">Нет данных</p>' : client.relatedObjects.map((o) => `
            <div class="client-detail__list-item"><strong>${PageUtils.escapeHtml(o.name)}</strong><span>${PageUtils.escapeHtml(o.type)} · ${PageUtils.statusBadge(o.linkStatus, 'success')}</span></div>`).join('')}</div>
        </div>
        <div class="ui-card">
          <div class="ui-card__header"><span class="ui-card__title">Связанные договоры</span></div>
          <div class="ui-card__body">${emptyCtr ? '<p class="client-detail__empty-inline">Нет данных</p>' : client.relatedContracts.map((c) => `
            <div class="client-detail__list-item"><strong>${PageUtils.escapeHtml(c.number)}</strong><span>${PageUtils.escapeHtml(c.type)} · ${PageUtils.formatDateTime(c.date)} · ${PageUtils.statusBadge(c.status, 'neutral')}</span></div>`).join('')}</div>
        </div>
        ${Permissions.canViewClientInternalInfo() && (client.importantNote || client.tags?.length) ? `
        <div class="ui-card client-detail__internal">
          <div class="ui-card__header"><span class="ui-card__title">Важная информация</span><span class="client-detail__internal-badge">Видно только сотрудникам</span></div>
          <div class="ui-card__body">
            ${client.importantNote ? `<p>${PageUtils.escapeHtml(client.importantNote)}</p>` : ''}
            ${client.tags?.length ? `<div class="client-detail__tags">${renderTags(client.tags)}</div>` : ''}
            ${client.importantNoteUpdatedAt ? `<p class="client-detail__meta-note">Обновлено: ${PageUtils.formatDateTime(client.importantNoteUpdatedAt)}</p>` : ''}
          </div>
        </div>` : ''}
      </div>`;
  }

  function renderMainTab(detail) {
    const appeals = ClientsService.getClientAppeals(currentId, appealFilter);
    if (activeTab === 'appeals') {
      return `
        <div class="client-detail__tab-toolbar">
          <select class="ui-select" id="client-appeals-filter" aria-label="Фильтр обращений">
            <option value="all"${appealFilter === 'all' ? ' selected' : ''}>Все обращения</option>
            <option value="open"${appealFilter === 'open' ? ' selected' : ''}>Открытые</option>
            <option value="closed"${appealFilter === 'closed' ? ' selected' : ''}>Закрытые</option>
          </select>
        </div>
        ${renderAppealsTable(appeals)}`;
    }
    if (activeTab === 'documents') return renderDocuments(detail.documents);
    return renderHistory(detail.history);
  }

  function render(detail) {
    const { client } = detail;
    const root = document.getElementById('client-detail-content');
    if (!root) return;
    root.innerHTML = `
      <header class="client-detail__header">
        <button type="button" class="ui-back-link" data-go="clients">← К списку клиентов</button>
        <div class="client-detail__title-row">
          <div class="client-detail__title-block">
            <h1 class="client-detail__title">${PageUtils.escapeHtml(client.name)}</h1>
            <div class="client-detail__badges">
              <span class="ui-status-badge ui-status-badge--${client.statusVariant}">${PageUtils.escapeHtml(client.statusLabel)}</span>
              <span class="client-detail__type">${PageUtils.escapeHtml(client.clientType)}</span>
              ${renderTags(client.tags)}
            </div>
          </div>
          <div class="client-detail__header-actions">
            <span class="ui-tooltip"><button type="button" class="ui-button ui-button--secondary ui-button--md" disabled>Редактировать</button><span class="ui-tooltip__bubble">Будет реализовано отдельным этапом</span></span>
          </div>
        </div>
        <div class="client-detail__stats">
          <span>Обращений: <strong>${client.totalAppeals}</strong></span>
          <span>Открытых: <strong>${client.openAppeals}</strong></span>
          <span>Объектов: <strong>${client.objectCount}</strong></span>
          <span>Договоров: <strong>${client.contractCount}</strong></span>
          <span class="client-detail__stats-muted">Активность: ${PageUtils.formatDateTime(client.lastActivityAt)}</span>
        </div>
      </header>
      <div class="client-detail__layout">
        <div class="client-detail__main">
          <div class="ui-tabs client-detail__tabs" role="tablist">
            <button type="button" class="ui-tabs__tab${activeTab === 'appeals' ? ' is-active' : ''}" data-client-tab="appeals" role="tab">Обращения</button>
            <button type="button" class="ui-tabs__tab${activeTab === 'documents' ? ' is-active' : ''}" data-client-tab="documents" role="tab">Документы</button>
            <button type="button" class="ui-tabs__tab${activeTab === 'history' ? ' is-active' : ''}" data-client-tab="history" role="tab">История</button>
          </div>
          <div class="ui-card"><div class="ui-card__body" id="client-detail-tab-panel">${renderMainTab(detail)}</div></div>
        </div>
        ${renderSidebar(client, detail)}
      </div>`;
    bindTabEvents();
  }

  function bindTabEvents() {
    document.querySelectorAll('[data-client-tab]').forEach((btn) => {
      btn.onclick = () => {
        activeTab = btn.dataset.clientTab;
        const detail = ClientsService.getDetail(currentId);
        if (detail.found) render(detail);
      };
    });
    const filterEl = document.getElementById('client-appeals-filter');
    if (filterEl) {
      filterEl.onchange = () => {
        appealFilter = filterEl.value;
        const panel = document.getElementById('client-detail-tab-panel');
        const detail = ClientsService.getDetail(currentId);
        if (panel && detail.found) panel.innerHTML = renderMainTab(detail);
      };
    }
  }

  function bindEventsOnce() {
    if (eventsBound) return;
    eventsBound = true;
  }

  function load(clientId) {
    currentId = clientId;
    activeTab = 'appeals';
    appealFilter = 'all';
    bindEventsOnce();
    showState('loading');
    setTimeout(() => {
      if (!Permissions.canViewClient()) {
        showState('not-found');
        return;
      }
      const detail = ClientsService.getDetail(clientId);
      if (!detail.found) {
        showState('not-found');
        return;
      }
      showState('loaded');
      render(detail);
    }, 200);
  }

  return { load };
})();
