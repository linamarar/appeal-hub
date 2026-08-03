/**
 * Appeal detail page — render, actions, states.
 */

const AppealDetailPage = (() => {
  let currentId = null;

  const STATUS_META = {
    'Новое': { label: 'Новая', variant: 'warning' },
    'В работе': { label: 'В работе', variant: 'info' },
    'Закрыто': { label: 'Закрыта', variant: 'success' },
  };

  const PRIORITY_META = {
    'Низкий': 'low',
    'Обычный': 'normal',
    'Средний': 'normal',
    'Высокий': 'high',
    'Критический': 'critical',
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function displayValue(value, emptyLabel = 'Не указано') {
    if (value === null || value === undefined || value === '') return emptyLabel;
    return escapeHtml(value);
  }

  function statusBadge(status) {
    const meta = STATUS_META[status] || { label: status, variant: 'neutral' };
    return `<span class="ui-status-badge ui-status-badge--${meta.variant}">${meta.label}</span>`;
  }

  function priorityBadge(priority) {
    const variant = PRIORITY_META[priority] || 'normal';
    return `<span class="ui-priority-badge ui-priority-badge--${variant}">${escapeHtml(priority || 'Обычный')}</span>`;
  }

  function slaBadge(sla) {
    if (!sla || sla === 'Нет данных') {
      return `<span class="ui-sla-badge ui-sla-badge--warning">SLA: Нет данных</span>`;
    }
    return `<span class="ui-sla-badge">SLA: ${escapeHtml(sla)}</span>`;
  }

  function assigneeBlock(name) {
    const label = name && name !== 'Не назначен' ? name : 'Не назначен';
    const initials = label !== 'Не назначен'
      ? label.split(' ').map((p) => p[0]).join('').slice(0, 2)
      : '?';
    return `
      <span class="appeal-detail__assignee">
        <span class="ui-avatar ui-avatar--sm" aria-hidden="true">${escapeHtml(initials)}</span>
        ${escapeHtml(label)}
      </span>`;
  }

  function renderAttachments(attachments) {
    if (!attachments || !attachments.length) {
      return `
        <div class="ui-empty-state" style="padding: var(--spacing-7);">
          <p class="ui-empty-state__text">Вложений нет</p>
        </div>`;
    }
    return `
      <div class="ui-attachment-list">
        ${attachments.map((file) => `
          <div class="ui-attachment-list__item">
            <div class="ui-attachment-list__info">
              <span class="ui-attachment-list__icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </span>
              <div>
                <div class="ui-attachment-list__name">${escapeHtml(file.name)}</div>
                <div class="ui-attachment-list__meta">${escapeHtml(file.type)}${file.size ? ` · ${escapeHtml(file.size)}` : ''}${file.date ? ` · ${escapeHtml(file.date)}` : ''}${file.author ? ` · ${escapeHtml(file.author)}` : ''}</div>
              </div>
            </div>
            <button type="button" class="ui-button ui-button--ghost ui-button--sm" disabled title="Просмотр недоступен в прототипе">Просмотр</button>
          </div>
        `).join('')}
      </div>`;
  }

  function renderTimeline(history) {
    if (!history || !history.length) {
      return `<p class="ui-empty-state__text" style="padding: var(--spacing-5);">История пуста</p>`;
    }
    return `
      <div class="ui-timeline">
        ${history.map((event) => {
          const kindClass = event.kind === 'internal' ? 'internal' : event.kind === 'client' ? 'client' : 'system';
          const author = event.kind === 'system' ? 'Система' : event.author;
          const change = event.oldValue && event.newValue
            ? `<div class="ui-timeline__change">${escapeHtml(event.oldValue)} → ${escapeHtml(event.newValue)}</div>`
            : '';
          return `
            <div class="ui-timeline__item ui-timeline__item--${kindClass}">
              <div class="ui-timeline__time">${escapeHtml(event.datetime)}</div>
              <div class="ui-timeline__content">
                <div class="ui-timeline__author">${escapeHtml(author)}</div>
                <div class="ui-timeline__text">${escapeHtml(event.description)}</div>
                ${change}
              </div>
            </div>`;
        }).join('')}
      </div>`;
  }

  function renderClient(client) {
    if (!client) {
      return `<p class="ui-meta-list__value ui-meta-list__value--muted" style="padding: var(--spacing-5);">Нет данных</p>`;
    }
    const rows = [
      ['ФИО', client.name],
      ['Телефон', client.phone],
      ['Email', client.email],
      ['Тип клиента', client.type],
      ['Обращений клиента', client.appealsCount != null ? String(client.appealsCount) : null],
    ];
    return `
      <div class="ui-meta-list">
        ${rows.map(([label, value]) => `
          <div class="ui-meta-list__item">
            <span class="ui-meta-list__label">${label}</span>
            <span class="ui-meta-list__value${!value ? ' ui-meta-list__value--muted' : ''}">${displayValue(value)}</span>
          </div>
        `).join('')}
      </div>`;
  }

  function setState(state) {
    ['loading', 'loaded', 'not-found'].forEach((name) => {
      const el = document.getElementById(`appeal-detail-${name}`);
      if (el) el.classList.toggle('is-visible', name === state);
    });
  }

  function bindActions(appeal) {
    const acceptBtn = document.getElementById('appeal-accept-btn');
    const statusSelect = document.getElementById('appeal-status-select');
    const commentForm = document.getElementById('appeal-comment-form');
    const commentInput = document.getElementById('appeal-comment-input');

    if (acceptBtn) {
      acceptBtn.hidden = appeal.status !== 'Новое';
      acceptBtn.onclick = () => {
        const updated = AppealsRepository.acceptToWork(appeal.id);
        if (updated) render(updated);
      };
    }

    if (statusSelect) {
      statusSelect.value = appeal.status;
      statusSelect.onchange = () => {
        const updated = AppealsRepository.updateStatus(appeal.id, statusSelect.value);
        if (updated) render(updated);
      };
    }

    if (commentForm && commentInput) {
      commentForm.onsubmit = (e) => {
        e.preventDefault();
        const updated = AppealsRepository.addComment(appeal.id, commentInput.value);
        if (updated) {
          commentInput.value = '';
          render(updated);
        }
      };
    }
  }

  function render(appeal) {
    currentId = appeal.id;
    const root = document.getElementById('appeal-detail-content');
    if (!root) return;

    root.innerHTML = `
      <header class="appeal-detail__header">
        <button type="button" class="ui-back-link" data-go="dashboard">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          К списку обращений
        </button>
        <div class="appeal-detail__title-row">
          <div class="appeal-detail__title-block">
            <div class="appeal-detail__number">${escapeHtml(appeal.id)}</div>
            <h1 class="appeal-detail__title">${escapeHtml(appeal.title)}</h1>
          </div>
          <div class="appeal-detail__badges">
            ${statusBadge(appeal.status)}
            ${priorityBadge(appeal.priority)}
            ${slaBadge(appeal.sla)}
          </div>
        </div>
        <div class="appeal-detail__meta-row">
          <span class="appeal-detail__meta-item">Создано: <strong>${displayValue(`${appeal.date}, ${appeal.time}`)}</strong></span>
          <span class="appeal-detail__meta-item">Обновлено: <strong>${displayValue(`${appeal.updatedDate || appeal.date}, ${appeal.updatedTime || appeal.time}`)}</strong></span>
          <span class="appeal-detail__meta-item">Исполнитель: ${assigneeBlock(appeal.assignee)}</span>
        </div>
        <div class="appeal-detail__actions">
          <button type="button" class="ui-button ui-button--primary ui-button--md" id="appeal-accept-btn">Принять в работу</button>
          <label>
            <span class="visually-hidden">Изменить статус</span>
            <select class="ui-select" id="appeal-status-select" aria-label="Изменить статус">
              <option value="Новое">Новая</option>
              <option value="В работе">В работе</option>
              <option value="Закрыто">Закрыта</option>
            </select>
          </label>
          <button type="button" class="ui-button ui-button--secondary ui-button--md" disabled title="Недоступно в прототипе">Ещё</button>
        </div>
      </header>

      <div class="appeal-detail__grid">
        <main class="appeal-detail__main">
          <section class="ui-card">
            <div class="ui-card__header"><h2 class="ui-card__title">Описание обращения</h2></div>
            <div class="ui-card__body">
              <div class="appeal-detail__kv">
                <div class="appeal-detail__kv-item"><div class="appeal-detail__kv-label">Тематика</div><div class="appeal-detail__kv-value">${displayValue(appeal.category)}</div></div>
                <div class="appeal-detail__kv-item"><div class="appeal-detail__kv-label">Источник</div><div class="appeal-detail__kv-value">${displayValue(appeal.source)}</div></div>
                <div class="appeal-detail__kv-item"><div class="appeal-detail__kv-label">Инициатор</div><div class="appeal-detail__kv-value">${displayValue(appeal.initiator)}</div></div>
                <div class="appeal-detail__kv-item"><div class="appeal-detail__kv-label">Дата создания</div><div class="appeal-detail__kv-value">${displayValue(`${appeal.date}, ${appeal.time}`)}</div></div>
              </div>
              <div class="appeal-detail__text">${escapeHtml(appeal.description || 'Нет данных')}</div>
            </div>
          </section>

          <section class="ui-card">
            <div class="ui-card__header"><h2 class="ui-card__title">Вложения</h2></div>
            <div class="ui-card__body ui-card__body--compact">${renderAttachments(appeal.attachments)}</div>
          </section>

          <section class="ui-card">
            <div class="ui-card__header"><h2 class="ui-card__title">История обращения</h2></div>
            <div class="ui-card__body ui-card__body--compact">${renderTimeline(appeal.history)}</div>
            <div class="ui-card__body">
              <form class="ui-comment-form" id="appeal-comment-form">
                <label class="ui-field">
                  <span class="ui-field__label">Внутренний комментарий</span>
                  <textarea class="ui-textarea" id="appeal-comment-input" placeholder="Комментарий виден только сотрудникам…" rows="3"></textarea>
                </label>
                <p class="ui-comment-form__hint">Комментарий не виден клиенту</p>
                <div class="ui-comment-form__actions">
                  <button type="submit" class="ui-button ui-button--primary ui-button--md">Добавить комментарий</button>
                </div>
              </form>
            </div>
          </section>
        </main>

        <aside class="appeal-detail__sidebar">
          <section class="ui-card">
            <div class="ui-card__header"><h2 class="ui-card__title">Данные клиента</h2></div>
            <div class="ui-card__body ui-card__body--compact">${renderClient(appeal.client)}</div>
          </section>

          <section class="ui-card">
            <div class="ui-card__header"><h2 class="ui-card__title">Параметры обращения</h2></div>
            <div class="ui-card__body ui-card__body--compact">
              <div class="ui-meta-list">
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Статус</span><span class="ui-meta-list__value">${statusBadge(appeal.status)}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Приоритет</span><span class="ui-meta-list__value">${priorityBadge(appeal.priority)}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Тематика</span><span class="ui-meta-list__value">${displayValue(appeal.category)}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Источник</span><span class="ui-meta-list__value">${displayValue(appeal.source)}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Канал</span><span class="ui-meta-list__value">${displayValue(appeal.channel)}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Формат ответа</span><span class="ui-meta-list__value">${displayValue(appeal.responseFormat)}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">SLA</span><span class="ui-meta-list__value">${displayValue(appeal.sla, 'Нет данных')}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Создано</span><span class="ui-meta-list__value">${displayValue(`${appeal.date}, ${appeal.time}`)}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Обновлено</span><span class="ui-meta-list__value">${displayValue(`${appeal.updatedDate || appeal.date}, ${appeal.updatedTime || appeal.time}`)}</span></div>
              </div>
            </div>
          </section>

          <section class="ui-card">
            <div class="ui-card__header"><h2 class="ui-card__title">Ответственные</h2></div>
            <div class="ui-card__body ui-card__body--compact">
              <div class="ui-meta-list">
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Исполнитель</span><span class="ui-meta-list__value">${displayValue(appeal.assignee, 'Не назначен')}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Группа</span><span class="ui-meta-list__value">${displayValue(appeal.assigneeGroup)}</span></div>
              </div>
            </div>
          </section>

          <section class="ui-card">
            <div class="ui-card__header"><h2 class="ui-card__title">Источник и ответ</h2></div>
            <div class="ui-card__body ui-card__body--compact">
              <div class="ui-meta-list">
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Источник</span><span class="ui-meta-list__value">${displayValue(appeal.source)}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Канал</span><span class="ui-meta-list__value">${displayValue(appeal.channel)}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Формат ответа</span><span class="ui-meta-list__value">${displayValue(appeal.responseFormat)}</span></div>
                <div class="ui-meta-list__item"><span class="ui-meta-list__label">Регион</span><span class="ui-meta-list__value">${displayValue(appeal.region)}</span></div>
              </div>
            </div>
          </section>
        </aside>
      </div>`;

    setState('loaded');
    bindActions(appeal);
  }

  function load(id) {
    currentId = id;
    setState('loading');
    AppealsRepository.getById(id).then((appeal) => {
      if (!appeal) {
        setState('not-found');
        return;
      }
      render(appeal);
    });
  }

  function init() {
    /* delegated in app.js */
  }

  return { load, render, getCurrentId: () => currentId };
})();
