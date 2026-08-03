/**
 * Appeal detail page — render, operations via AppealsService.
 */

const AppealDetailPage = (() => {
  let currentId = null;
  let modalMode = 'assign';
  let operationLoading = false;
  let commentSubmitting = false;
  let selectedFiles = [];

  const PRIORITY_META = {
    'Низкий': 'low', 'Обычный': 'normal', 'Средний': 'normal', 'Высокий': 'high', 'Критический': 'critical',
  };

  const FILE_ACCEPT = ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(',');

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function displayValue(value, emptyLabel = 'Не указано') {
    if (value === null || value === undefined || value === '') return emptyLabel;
    return escapeHtml(value);
  }

  function statusBadge(appeal) {
    const variant = appeal.statusVariant || 'neutral';
    return `<span class="ui-status-badge ui-status-badge--${variant}">${escapeHtml(appeal.statusLabel)}</span>`;
  }

  function priorityBadge(priority) {
    const variant = PRIORITY_META[priority] || 'normal';
    return `<span class="ui-priority-badge ui-priority-badge--${variant}">${escapeHtml(priority || 'Обычный')}</span>`;
  }

  function slaIndicator(appeal) {
    const sla = appeal.sla || {};
    const variantClass = ['success', 'warning', 'danger', 'neutral'].includes(sla.variant) ? sla.variant : 'neutral';
    return `
      <div class="appeal-detail__sla-block" title="${escapeHtml(sla.message || '')}">
        <span class="ui-sla-badge ui-sla-badge--${variantClass}">${escapeHtml(sla.label || 'SLA')}</span>
        <span class="ui-attachment-list__meta">${escapeHtml(SlaService.formatDateTime(appeal.slaDueAt))}</span>
        <span class="ui-attachment-list__meta">${escapeHtml(sla.message || 'Нет данных')}</span>
      </div>`;
  }

  function assigneeBlock(name) {
    const label = name || 'Не назначен';
    const initials = name ? name.split(' ').map((p) => p[0]).join('').slice(0, 2) : '?';
    return `
      <span class="appeal-detail__assignee">
        <span class="ui-avatar ui-avatar--sm" aria-hidden="true">${escapeHtml(initials)}</span>
        ${escapeHtml(label)}
      </span>`;
  }

  function fileIconSvg() {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
  }

  function renderFileItem(file, { removable = false, index = 0 } = {}) {
    const sizeLabel = formatFileSize(file.size);
    const removeBtn = removable
      ? `<button type="button" class="ui-file-item__remove" data-remove-file="${index}" aria-label="Удалить файл ${escapeHtml(file.name)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>`
      : '';
    return `
      <div class="ui-file-item ui-file-item--pending">
        <div class="ui-file-item__info">
          <span class="ui-file-item__icon">${fileIconSvg()}</span>
          <div class="ui-file-item__details">
            <div class="ui-file-item__name">${escapeHtml(file.name)}</div>
            <div class="ui-file-item__meta">${escapeHtml(sizeLabel)}</div>
          </div>
        </div>
        ${removeBtn}
      </div>`;
  }

  function renderAttachments(attachments) {
    if (!attachments?.length) {
      return `<div class="ui-empty-state" style="padding: var(--spacing-7);"><p class="ui-empty-state__text">Вложений нет</p></div>`;
    }
    return `<div class="ui-attachment-list">${attachments.map((file) => `
      <div class="ui-attachment-list__item">
        <div class="ui-attachment-list__info">
          <span class="ui-attachment-list__icon" aria-hidden="true">${fileIconSvg()}</span>
          <div>
            <div class="ui-attachment-list__name">${escapeHtml(file.name)}</div>
            <div class="ui-attachment-list__meta-row">
              <span class="ui-attachment-list__meta">${escapeHtml(file.sizeLabel || formatFileSize(file.size))}</span>
              <span class="ui-attachment-list__source">${escapeHtml(file.sourceLabel || 'Файл')}</span>
              <span class="ui-attachment-list__meta">${escapeHtml(file.uploadedByName || '—')}</span>
              <span class="ui-attachment-list__meta">${escapeHtml(file.dateLabel || '')}</span>
            </div>
          </div>
        </div>
        <button type="button" class="ui-button ui-button--ghost ui-button--sm" disabled>Просмотр</button>
      </div>`).join('')}</div>`;
  }

  function renderMessageAttachments(attachments) {
    if (!attachments?.length) return '';
    return `<div class="ui-timeline__attachments">${attachments.map((file) => `
      <span class="ui-timeline__attachment-link" title="${escapeHtml(file.name)}">
        ${fileIconSvg()}
        ${escapeHtml(file.name)}
      </span>`).join('')}</div>`;
  }

  function renderTimeline(feed) {
    if (!feed?.length) return `<p class="ui-empty-state__text" style="padding: var(--spacing-5);">История пуста</p>`;
    return `<div class="ui-timeline">${feed.map((event) => {
      const kindClass = event.kind || 'user';
      const author = kindClass === 'system' ? 'Система' : event.author;
      const change = event.oldValue && event.newValue
        ? `<div class="ui-timeline__change">${escapeHtml(event.oldValue)} → ${escapeHtml(event.newValue)}</div>` : '';
      const reason = event.reason ? `<div class="ui-timeline__change">Причина: ${escapeHtml(event.reason)}</div>` : '';
      const attachments = renderMessageAttachments(event.attachments);
      return `<div class="ui-timeline__item ui-timeline__item--${kindClass}">
        <div class="ui-timeline__time">${escapeHtml(event.datetime)}</div>
        <div class="ui-timeline__content">
          <div class="ui-timeline__author">${escapeHtml(author)}</div>
          <div class="ui-timeline__text">${escapeHtml(event.text || event.description || '')}</div>
          ${change}${reason}${attachments}
        </div>
      </div>`;
    }).join('')}</div>`;
  }

  function renderCommentForm(canComment, canAttach) {
    if (!canComment) {
      return `<p class="ui-comment-form__hint">Недостаточно прав для добавления внутренних комментариев</p>`;
    }

    return `
      <form class="ui-comment-form" id="appeal-comment-form">
        <label class="ui-field">
          <span class="ui-field__label">Внутренний комментарий</span>
          <textarea class="ui-textarea" id="appeal-comment-input" placeholder="Комментарий виден только сотрудникам…" rows="3" maxlength="${COMMENT_MAX_LENGTH}"></textarea>
        </label>
        <p class="ui-comment-form__hint">Комментарий виден только сотрудникам</p>
        ${canAttach ? `
        <div class="ui-file-uploader" id="appeal-file-uploader">
          <input type="file" class="ui-file-uploader__input" id="appeal-file-input" multiple accept="${FILE_ACCEPT}" />
          <button type="button" class="ui-file-uploader__trigger" id="appeal-file-trigger">
            ${fileIconSvg()}
            Прикрепить файлы
          </button>
          <p class="ui-file-uploader__limits">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT · до 10 файлов · 20 МБ каждый · 50 МБ суммарно</p>
          <div class="ui-file-uploader__list" id="appeal-selected-files"></div>
          <p class="ui-file-uploader__error" id="appeal-file-error" hidden></p>
        </div>` : ''}
        <p class="ui-comment-form__error appeal-detail__comment-error" id="appeal-comment-error" hidden></p>
        <div class="ui-comment-form__actions">
          <button type="submit" class="ui-button ui-button--primary ui-button--md" id="appeal-comment-submit">Добавить комментарий</button>
        </div>
      </form>`;
  }

  function renderClient(client) {
    if (!client) return `<p class="ui-meta-list__value ui-meta-list__value--muted" style="padding: var(--spacing-5);">Нет данных</p>`;
    const rows = [['ФИО', client.name], ['Телефон', client.phone], ['Email', client.email], ['Тип клиента', client.type], ['Обращений клиента', client.appealsCount != null ? String(client.appealsCount) : null]];
    return `<div class="ui-meta-list">${rows.map(([label, value]) => `
      <div class="ui-meta-list__item"><span class="ui-meta-list__label">${label}</span><span class="ui-meta-list__value${!value ? ' ui-meta-list__value--muted' : ''}">${displayValue(value)}</span></div>`).join('')}</div>`;
  }

  function setState(state) {
    ['loading', 'loaded', 'not-found'].forEach((name) => {
      const el = document.getElementById(`appeal-detail-${name}`);
      if (el) el.classList.toggle('is-visible', name === state);
    });
  }

  function showActionError(message) {
    const el = document.getElementById('appeal-action-error');
    if (!el) return;
    if (message) { el.hidden = false; el.textContent = message; }
    else { el.hidden = true; el.textContent = ''; }
  }

  function showCommentError(message) {
    const el = document.getElementById('appeal-comment-error');
    if (!el) return;
    if (message) { el.hidden = false; el.textContent = message; }
    else { el.hidden = true; el.textContent = ''; }
  }

  function showFileError(message) {
    const el = document.getElementById('appeal-file-error');
    if (!el) return;
    if (message) { el.hidden = false; el.textContent = message; }
    else { el.hidden = true; el.textContent = ''; }
  }

  function setOperationLoading(loading) {
    operationLoading = loading;
    document.querySelectorAll('#appeal-accept-btn, #appeal-assign-btn, #appeal-status-select, #assign-modal-submit').forEach((el) => {
      if (!el) return;
      el.disabled = loading;
      el.classList.toggle('is-loading', loading && el.id !== 'appeal-status-select');
    });
  }

  function setCommentSubmitting(loading) {
    commentSubmitting = loading;
    const submitBtn = document.getElementById('appeal-comment-submit');
    const textarea = document.getElementById('appeal-comment-input');
    const fileTrigger = document.getElementById('appeal-file-trigger');
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.classList.toggle('is-loading', loading);
      submitBtn.textContent = loading ? 'Отправка…' : 'Добавить комментарий';
    }
    if (textarea) textarea.disabled = loading;
    if (fileTrigger) fileTrigger.disabled = loading;
  }

  function renderSelectedFilesList() {
    const list = document.getElementById('appeal-selected-files');
    if (!list) return;
    list.innerHTML = selectedFiles.map((file, index) => renderFileItem(file, { removable: true, index })).join('');
    list.querySelectorAll('[data-remove-file]').forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.removeFile, 10);
        selectedFiles.splice(idx, 1);
        renderSelectedFilesList();
        showFileError('');
      };
    });
  }

  function clearCommentForm() {
    selectedFiles = [];
    const input = document.getElementById('appeal-comment-input');
    const fileInput = document.getElementById('appeal-file-input');
    if (input) input.value = '';
    if (fileInput) fileInput.value = '';
    renderSelectedFilesList();
    showCommentError('');
    showFileError('');
  }

  function handleFileSelection(fileList) {
    showFileError('');
    const incoming = Array.from(fileList || []);
    const combined = [...selectedFiles, ...incoming.map((f) => ({
      name: f.name,
      mimeType: f.type,
      size: f.size,
      localId: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      _file: f,
    }))];

    const validation = AttachmentValidator.validate(combined, 0);
    if (!validation.valid) {
      showFileError(validation.message);
      return;
    }

    selectedFiles = combined;
    renderSelectedFilesList();
    const fileInput = document.getElementById('appeal-file-input');
    if (fileInput) fileInput.value = '';
  }

  function bindFileUploader() {
    const trigger = document.getElementById('appeal-file-trigger');
    const fileInput = document.getElementById('appeal-file-input');
    if (!trigger || !fileInput) return;

    trigger.onclick = () => {
      if (commentSubmitting) return;
      fileInput.click();
    };
    fileInput.onchange = () => handleFileSelection(fileInput.files);
  }

  function openAssignModal(mode, appeal) {
    modalMode = mode;
    const modal = document.getElementById('assign-modal');
    const title = document.getElementById('assign-modal-title');
    const error = document.getElementById('assign-modal-error');
    const reasonField = document.getElementById('reassign-reason-field');
    const otherField = document.getElementById('reassign-other-field');
    const userSelect = document.getElementById('assign-user-select');
    const reasonSelect = document.getElementById('reassign-reason-select');

    title.textContent = mode === 'reassign' ? 'Переназначить исполнителя' : 'Назначить исполнителя';
    error.hidden = true;
    reasonField.hidden = mode !== 'reassign';
    otherField.hidden = true;

    userSelect.innerHTML = getActiveUsers().map((u) =>
      `<option value="${u.id}">${escapeHtml(u.name)} · ${escapeHtml(u.department)}</option>`
    ).join('');

    reasonSelect.innerHTML = REASSIGN_REASONS.map((r) =>
      `<option value="${r.code}">${escapeHtml(r.label)}</option>`
    ).join('');

    reasonSelect.onchange = () => {
      otherField.hidden = reasonSelect.value !== 'OTHER';
    };

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeAssignModal() {
    const modal = document.getElementById('assign-modal');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('reassign-other-text').value = '';
  }

  function initModalHandlers(appeal) {
    document.querySelectorAll('[data-modal-close]').forEach((el) => {
      el.onclick = closeAssignModal;
    });

    document.getElementById('assign-modal-submit').onclick = async () => {
      if (operationLoading) return;
      const userId = document.getElementById('assign-user-select').value;
      const errorEl = document.getElementById('assign-modal-error');
      errorEl.hidden = true;
      setOperationLoading(true);

      let result;
      if (modalMode === 'reassign') {
        result = AppealsService.reassignAppeal(
          appeal.id,
          userId,
          document.getElementById('reassign-reason-select').value,
          document.getElementById('reassign-other-text').value
        );
      } else {
        result = AppealsService.assignAppeal(appeal.id, userId);
      }

      setOperationLoading(false);
      if (!result.success) {
        errorEl.hidden = false;
        errorEl.textContent = result.message;
        return;
      }
      closeAssignModal();
      render(result.data);
    };
  }

  function bindActions(appeal) {
    showActionError('');
    initModalHandlers(appeal);

    const acceptBtn = document.getElementById('appeal-accept-btn');
    const assignBtn = document.getElementById('appeal-assign-btn');
    const statusSelect = document.getElementById('appeal-status-select');
    const commentForm = document.getElementById('appeal-comment-form');
    const commentInput = document.getElementById('appeal-comment-input');

    const canAccept = Permissions.canAccept() && appeal.statusCode === 'ASSIGNED';
    const canAssign = Permissions.canAssign() && !appeal.assigneeId;
    const canReassign = Permissions.canReassign() && !!appeal.assigneeId;
    const canChangeStatus = Permissions.canChangeStatus();
    const canComment = Permissions.canAddInternalComment() && Permissions.canViewInternalComments();

    if (acceptBtn) {
      acceptBtn.hidden = !canAccept;
      acceptBtn.onclick = () => {
        if (operationLoading) return;
        setOperationLoading(true);
        const result = AppealsService.acceptAppeal(appeal.id);
        setOperationLoading(false);
        if (!result.success) { showActionError(result.message); return; }
        render(result.data);
      };
    }

    if (assignBtn) {
      assignBtn.textContent = canReassign ? 'Переназначить' : 'Назначить исполнителя';
      assignBtn.hidden = !(canAssign || canReassign);
      assignBtn.onclick = () => openAssignModal(canReassign ? 'reassign' : 'assign', appeal);
    }

    if (statusSelect) {
      statusSelect.disabled = !canChangeStatus || operationLoading;
      const transitions = getAvailableStatusTransitions(appeal.statusCode);
      statusSelect.innerHTML = [
        `<option value="${appeal.statusCode}" selected>${escapeHtml(appeal.statusLabel)}</option>`,
        ...transitions.map((t) => `<option value="${t.code}">${escapeHtml(t.label)}</option>`),
      ].join('');
      statusSelect.onchange = () => {
        if (operationLoading) return;
        const toStatus = statusSelect.value;
        if (toStatus === appeal.statusCode) return;
        setOperationLoading(true);
        const result = AppealsService.changeStatus(appeal.id, toStatus);
        setOperationLoading(false);
        if (!result.success) {
          showActionError(result.message);
          statusSelect.value = appeal.statusCode;
          return;
        }
        render(result.data);
      };
    }

    bindFileUploader();

    if (commentForm && commentInput && canComment) {
      commentForm.onsubmit = async (e) => {
        e.preventDefault();
        if (commentSubmitting || operationLoading) return;

        showCommentError('');
        showFileError('');

        const fileDescriptors = selectedFiles.map(({ name, mimeType, size, localId }) => ({
          name, mimeType, size, localId,
        }));

        setCommentSubmitting(true);
        const result = await AppealsService.addInternalComment(
          appeal.id,
          commentInput.value,
          fileDescriptors
        );
        setCommentSubmitting(false);

        if (!result.success) {
          showCommentError(result.message);
          return;
        }

        clearCommentForm();
        render(result.data);
      };
    }
  }

  function render(appeal) {
    currentId = appeal.id;
    const root = document.getElementById('appeal-detail-content');
    if (!root) return;

    const canViewFeed = Permissions.canViewInternalComments();
    const canComment = Permissions.canAddInternalComment() && canViewFeed;
    const canAttach = Permissions.canAddAttachment() && canComment;
    const feed = appeal.messageFeed || appeal.history || [];
    const attachments = appeal.allAttachments || appeal.attachments || [];

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
          <div class="appeal-detail__badges">${statusBadge(appeal)}${priorityBadge(appeal.priority)}${slaIndicator(appeal)}</div>
        </div>
        <div class="appeal-detail__meta-row">
          <span class="appeal-detail__meta-item">Создано: <strong>${displayValue(`${appeal.date}, ${appeal.time}`)}</strong></span>
          <span class="appeal-detail__meta-item">Обновлено: <strong>${displayValue(`${appeal.updatedDate}, ${appeal.updatedTime}`)}</strong></span>
          <span class="appeal-detail__meta-item">Исполнитель: ${assigneeBlock(appeal.assigneeName)}</span>
        </div>
        <div class="appeal-detail__actions">
          <button type="button" class="ui-button ui-button--primary ui-button--md" id="appeal-accept-btn">Принять в работу</button>
          <button type="button" class="ui-button ui-button--secondary ui-button--md" id="appeal-assign-btn">Назначить исполнителя</button>
          <label><span class="visually-hidden">Изменить статус</span>
            <select class="ui-select" id="appeal-status-select" aria-label="Изменить статус"></select>
          </label>
        </div>
        <div class="ui-alert ui-alert--error appeal-detail__action-error" id="appeal-action-error" hidden></div>
      </header>
      <div class="appeal-detail__grid">
        <main class="appeal-detail__main">
          <section class="ui-card"><div class="ui-card__header"><h2 class="ui-card__title">Описание обращения</h2></div>
            <div class="ui-card__body"><div class="appeal-detail__kv">
              <div class="appeal-detail__kv-item"><div class="appeal-detail__kv-label">Тематика</div><div class="appeal-detail__kv-value">${displayValue(appeal.category)}</div></div>
              <div class="appeal-detail__kv-item"><div class="appeal-detail__kv-label">Источник</div><div class="appeal-detail__kv-value">${displayValue(appeal.source)}</div></div>
              <div class="appeal-detail__kv-item"><div class="appeal-detail__kv-label">Инициатор</div><div class="appeal-detail__kv-value">${displayValue(appeal.initiator)}</div></div>
            </div><div class="appeal-detail__text">${escapeHtml(appeal.description || 'Нет данных')}</div></div>
          </section>
          <section class="ui-card"><div class="ui-card__header"><h2 class="ui-card__title">Все вложения</h2></div>
            <div class="ui-card__body ui-card__body--compact">${renderAttachments(attachments)}</div>
          </section>
          <section class="ui-card"><div class="ui-card__header"><h2 class="ui-card__title">История обращения</h2></div>
            <div class="ui-card__body ui-card__body--compact">${canViewFeed ? renderTimeline(feed) : '<p class="ui-empty-state__text" style="padding: var(--spacing-5);">Недостаточно прав для просмотра истории</p>'}</div>
            <div class="ui-card__body">${renderCommentForm(canComment, canAttach)}</div>
          </section>
        </main>
        <aside class="appeal-detail__sidebar">
          <section class="ui-card"><div class="ui-card__header"><h2 class="ui-card__title">Данные клиента</h2></div>
            <div class="ui-card__body ui-card__body--compact">${renderClient(appeal.client)}</div></section>
          <section class="ui-card"><div class="ui-card__header"><h2 class="ui-card__title">Параметры обращения</h2></div>
            <div class="ui-card__body ui-card__body--compact"><div class="ui-meta-list">
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">Статус</span><span class="ui-meta-list__value">${statusBadge(appeal)}</span></div>
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">Приоритет</span><span class="ui-meta-list__value">${priorityBadge(appeal.priority)}</span></div>
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">SLA</span><span class="ui-meta-list__value">${slaIndicator(appeal)}</span></div>
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">Срок SLA</span><span class="ui-meta-list__value">${displayValue(SlaService.formatDateTime(appeal.slaDueAt), 'Нет данных')}</span></div>
            </div></div></section>
          <section class="ui-card"><div class="ui-card__header"><h2 class="ui-card__title">Ответственные</h2></div>
            <div class="ui-card__body ui-card__body--compact"><div class="ui-meta-list">
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">Исполнитель</span><span class="ui-meta-list__value">${displayValue(appeal.assigneeName, 'Не назначен')}</span></div>
              <div class="ui-meta-list__item"><span class="ui-meta-list__label">Группа</span><span class="ui-meta-list__value">${displayValue(appeal.assigneeGroup)}</span></div>
            </div></div></section>
        </aside>
      </div>`;

    setState('loaded');
    bindActions(appeal);
  }

  function load(id) {
    currentId = id;
    selectedFiles = [];
    setState('loading');
    AppealsService.fetchById(id).then((appeal) => {
      if (!appeal) { setState('not-found'); return; }
      render(appeal);
    });
  }

  return { load, render, getCurrentId: () => currentId };
})();
