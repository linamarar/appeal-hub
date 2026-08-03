/**
 * Service layer — операции над обращениями с валидацией.
 */

const AppealsService = (() => {
  const SOURCE_LABELS = {
    initial: 'Исходный документ',
    client: 'Сообщение клиента',
    comment: 'Внутренний комментарий',
    system: 'Система',
  };

  function enrich(raw, now = new Date(), actor = getCurrentUser()) {
    if (!raw) return null;
    const assignee = raw.assigneeId ? getUserById(raw.assigneeId) : null;
    const sla = SlaService.computeState(raw, now);
    const created = new Date(raw.createdAt);
    const updated = new Date(raw.updatedAt);
    const feed = buildMessageFeed(raw, actor);
    const allAttachments = buildAttachmentList(raw, actor);

    return {
      ...raw,
      statusCode: raw.statusCode,
      statusLabel: getStatusLabel(raw.statusCode),
      statusVariant: getStatusDefinition(raw.statusCode)?.variant || 'neutral',
      assigneeName: assignee?.name || null,
      assignee,
      sla,
      date: created.toLocaleDateString('ru-RU'),
      time: created.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      updatedDate: updated.toLocaleDateString('ru-RU'),
      updatedTime: updated.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      messageFeed: feed,
      allAttachments,
      history: feed,
      attachments: allAttachments,
    };
  }

  function buildMessageFeed(record, actor) {
    const messages = AppealsRepository.getMessages(record);
    const attachments = AppealsRepository.getAttachments(record);
    const canViewInternal = Permissions.canViewInternalComments(actor);

    return messages
      .filter((m) => m.visibility === MESSAGE_VISIBILITY.CLIENT || canViewInternal)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((m) => formatMessage(m, attachments));
  }

  function buildAttachmentList(record, actor) {
    const attachments = AppealsRepository.getAttachments(record);
    const canViewInternal = Permissions.canViewInternalComments(actor);

    return attachments
      .filter((a) => a.visibility === MESSAGE_VISIBILITY.CLIENT || canViewInternal)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(formatAttachment);
  }

  function formatMessage(message, allAttachments) {
    const kind = messageTypeToKind(message.type);
    const msgAttachments = (message.attachments || [])
      .map((id) => allAttachments.find((a) => a.id === id))
      .filter(Boolean)
      .map(formatAttachment);

    const change = message.oldValue && message.newValue
      ? { oldValue: message.oldValue, newValue: message.newValue }
      : null;

    return {
      id: message.id,
      type: message.type,
      kind,
      author: message.authorName || 'Система',
      authorRole: message.authorRole,
      text: message.text,
      description: message.text,
      datetime: SlaService.formatDateTime(message.createdAt),
      createdAt: message.createdAt,
      visibility: message.visibility,
      attachments: msgAttachments,
      oldValue: message.oldValue,
      newValue: message.newValue,
      reason: message.reason,
      eventType: message.eventType,
      change,
    };
  }

  function messageTypeToKind(type) {
    if (type === MESSAGE_TYPES.CLIENT_MESSAGE) return 'client';
    if (type === MESSAGE_TYPES.INTERNAL_COMMENT) return 'internal';
    if (type === MESSAGE_TYPES.SYSTEM_EVENT) return 'system';
    return 'user';
  }

  function formatAttachment(att) {
    return {
      ...att,
      sizeLabel: formatFileSize(att.size),
      dateLabel: SlaService.formatDateTime(att.createdAt),
      sourceLabel: SOURCE_LABELS[att.source] || att.source || 'Файл',
    };
  }

  function createSystemMessage(record, event, actor) {
    return {
      id: generateMessageId(),
      appealId: record.id,
      type: MESSAGE_TYPES.SYSTEM_EVENT,
      authorId: actor?.id || null,
      authorName: event.actor || actor?.name || 'Система',
      authorRole: event.kind === 'system' ? 'Система' : actor?.role || null,
      text: event.description || '',
      createdAt: event.createdAt || record.updatedAt,
      visibility: MESSAGE_VISIBILITY.INTERNAL,
      attachments: [],
      eventType: event.type,
      oldValue: event.oldValue || null,
      newValue: event.newValue || null,
      reason: event.reason || null,
    };
  }

  function pushSystemEvent(record, event, actor) {
    AppealsRepository.pushHistory(record, event);
    AppealsRepository.pushMessage(record, createSystemMessage(record, event, actor));
  }

  function fail(error, message) {
    return { success: false, error, message };
  }

  function ok(data) {
    return { success: true, data: enrich(data) };
  }

  function getList(now) {
    return AppealsRepository.getList().map((r) => enrich(r, now));
  }

  function getById(id, now) {
    return enrich(AppealsRepository.getRawById(id), now);
  }

  async function fetchById(id, now) {
    const raw = await AppealsRepository.getById(id);
    return enrich(raw, now);
  }

  function changeStatus(id, toStatusCode, actor = getCurrentUser()) {
    if (!Permissions.canChangeStatus(actor)) return fail('FORBIDDEN', 'Недостаточно прав для изменения статуса');

    const record = AppealsRepository.getRawById(id);
    if (!record) return fail('NOT_FOUND', 'Обращение не найдено');
    if (!isTransitionAllowed(record.statusCode, toStatusCode)) {
      return fail('INVALID_TRANSITION', 'Переход статуса не разрешён');
    }

    const oldLabel = getStatusLabel(record.statusCode);
    record.statusCode = toStatusCode;
    AppealsRepository.touchUpdatedAt(record);
    pushSystemEvent(record, {
      type: HISTORY_EVENT_TYPES.STATUS_CHANGED,
      actor: actor.name,
      createdAt: record.updatedAt,
      oldValue: oldLabel,
      newValue: getStatusLabel(toStatusCode),
      description: 'Статус изменён',
      kind: 'user',
    }, actor);
    AppealsRepository.saveRecord(record);
    return ok(record);
  }

  function acceptAppeal(id, actor = getCurrentUser()) {
    if (!Permissions.canAccept(actor)) return fail('FORBIDDEN', 'Недостаточно прав для принятия в работу');

    const record = AppealsRepository.getRawById(id);
    if (!record) return fail('NOT_FOUND', 'Обращение не найдено');
    if (record.statusCode !== 'ASSIGNED') {
      return fail('INVALID_STATE', 'Принять в работу можно только обращение в статусе «Назначена исполнителю»');
    }

    if (!record.assigneeId) {
      record.assigneeId = actor.id === 'user-admin' ? 'user-004' : actor.id;
    }

    const oldStatus = getStatusLabel(record.statusCode);
    record.statusCode = 'IN_PROGRESS';
    AppealsRepository.touchUpdatedAt(record);
    pushSystemEvent(record, {
      type: HISTORY_EVENT_TYPES.APPEAL_ACCEPTED,
      actor: actor.name,
      createdAt: record.updatedAt,
      oldValue: oldStatus,
      newValue: getStatusLabel('IN_PROGRESS'),
      description: 'Обращение принято в работу',
      kind: 'user',
    }, actor);
    AppealsRepository.saveRecord(record);
    return ok(record);
  }

  function assignAppeal(id, userId, actor = getCurrentUser()) {
    if (!Permissions.canAssign(actor)) return fail('FORBIDDEN', 'Недостаточно прав для назначения');

    const record = AppealsRepository.getRawById(id);
    if (!record) return fail('NOT_FOUND', 'Обращение не найдено');
    if (record.assigneeId) return fail('ALREADY_ASSIGNED', 'Используйте переназначение');

    const user = getUserById(userId);
    if (!user || !user.active || user.absent) return fail('INVALID_USER', 'Исполнитель недоступен');

    const prevStatus = record.statusCode;
    record.assigneeId = userId;
    record.assigneeGroup = user.department;
    if (record.statusCode === 'NEW') record.statusCode = 'ASSIGNED';
    AppealsRepository.touchUpdatedAt(record);

    pushSystemEvent(record, {
      type: HISTORY_EVENT_TYPES.ASSIGNEE_ASSIGNED,
      actor: actor.name,
      createdAt: record.updatedAt,
      oldValue: 'Не назначен',
      newValue: user.name,
      description: 'Назначен исполнитель',
      kind: 'user',
    }, actor);

    if (prevStatus !== record.statusCode) {
      pushSystemEvent(record, {
        type: HISTORY_EVENT_TYPES.STATUS_CHANGED,
        actor: actor.name,
        createdAt: record.updatedAt,
        oldValue: getStatusLabel(prevStatus),
        newValue: getStatusLabel(record.statusCode),
        description: 'Статус изменён',
        kind: 'user',
      }, actor);
    }

    AppealsRepository.saveRecord(record);
    return ok(record);
  }

  function reassignAppeal(id, userId, reasonCode, reasonText, actor = getCurrentUser()) {
    if (!Permissions.canReassign(actor)) return fail('FORBIDDEN', 'Недостаточно прав для переназначения');

    const record = AppealsRepository.getRawById(id);
    if (!record) return fail('NOT_FOUND', 'Обращение не найдено');
    if (!record.assigneeId) return fail('NOT_ASSIGNED', 'Сначала назначьте исполнителя');

    const user = getUserById(userId);
    if (!user || !user.active || user.absent) return fail('INVALID_USER', 'Исполнитель недоступен');

    const reason = REASSIGN_REASONS.find((r) => r.code === reasonCode);
    if (!reason) return fail('VALIDATION', 'Укажите причину переназначения');
    if (reasonCode === 'OTHER' && !reasonText?.trim()) {
      return fail('VALIDATION', 'Укажите текст причины для варианта «Другое»');
    }

    const oldUser = getUserById(record.assigneeId);
    const reasonLabel = reasonCode === 'OTHER' ? reasonText.trim() : reason.label;

    record.assigneeId = userId;
    record.assigneeGroup = user.department;
    AppealsRepository.touchUpdatedAt(record);
    pushSystemEvent(record, {
      type: HISTORY_EVENT_TYPES.ASSIGNEE_CHANGED,
      actor: actor.name,
      createdAt: record.updatedAt,
      oldValue: oldUser?.name || 'Не назначен',
      newValue: user.name,
      reason: reasonLabel,
      description: 'Исполнитель переназначен',
      kind: 'user',
    }, actor);
    AppealsRepository.saveRecord(record);
    return ok(record);
  }

  function addComment(id, text, actor = getCurrentUser()) {
    return addInternalComment(id, text, [], actor);
  }

  async function addInternalComment(id, text, fileDescriptors = [], actor = getCurrentUser()) {
    if (!Permissions.canAddInternalComment(actor)) {
      return fail('FORBIDDEN', 'Недостаточно прав для добавления комментария');
    }
    if (!Permissions.canViewInternalComments(actor)) {
      return fail('FORBIDDEN', 'Недостаточно прав для просмотра внутренних комментариев');
    }

    const record = AppealsRepository.getRawById(id);
    if (!record) return fail('NOT_FOUND', 'Обращение не найдено');

    const trimmed = text?.trim() || '';
    if (!trimmed && (!fileDescriptors || fileDescriptors.length === 0)) {
      return fail('VALIDATION', 'Введите комментарий или прикрепите файл');
    }
    if (trimmed.length > COMMENT_MAX_LENGTH) {
      return fail('VALIDATION', `Комментарий не должен превышать ${COMMENT_MAX_LENGTH} символов`);
    }

    if (fileDescriptors.length && !Permissions.canAddAttachment(actor)) {
      return fail('FORBIDDEN', 'Недостаточно прав для прикрепления файлов');
    }

    const validation = AttachmentValidator.validate(fileDescriptors);
    if (!validation.valid) return fail('VALIDATION', validation.message);

    const messageId = generateMessageId();
    const attachmentIds = [];
    const now = new Date().toISOString();

    if (fileDescriptors.length) {
      await mockUploadDelay();
      for (const file of fileDescriptors) {
        const attId = generateAttachmentId();
        attachmentIds.push(attId);
        AppealsRepository.pushAttachment(record, {
          id: attId,
          appealId: record.id,
          messageId,
          name: file.name,
          mimeType: file.mimeType || file.type || EXTENSION_MIME_MAP[getFileExtension(file.name)] || 'application/octet-stream',
          size: file.size || 0,
          createdAt: now,
          uploadedBy: actor.id,
          uploadedByName: actor.name,
          visibility: MESSAGE_VISIBILITY.INTERNAL,
          mockUrl: `mock://${attId}`,
          localId: file.localId || null,
          status: ATTACHMENT_STATUS.READY,
          source: 'comment',
        });
      }
    }

    const message = {
      id: messageId,
      appealId: record.id,
      type: MESSAGE_TYPES.INTERNAL_COMMENT,
      authorId: actor.id,
      authorName: actor.name,
      authorRole: actor.role,
      text: trimmed || 'Прикреплены файлы',
      createdAt: now,
      visibility: MESSAGE_VISIBILITY.INTERNAL,
      attachments: attachmentIds,
    };

    AppealsRepository.pushMessage(record, message);
    AppealsRepository.touchUpdatedAt(record);

    AppealsRepository.pushHistory(record, {
      type: HISTORY_EVENT_TYPES.COMMENT_ADDED,
      actor: actor.name,
      authorId: actor.id,
      createdAt: now,
      description: message.text,
      kind: 'internal',
      attachmentIds,
    });

    AppealsRepository.saveRecord(record);
    return ok(record);
  }

  function mockUploadDelay() {
    return new Promise((resolve) => setTimeout(resolve, 300));
  }

  return {
    enrich,
    getList,
    getById,
    fetchById,
    changeStatus,
    acceptAppeal,
    assignAppeal,
    reassignAppeal,
    addComment,
    addInternalComment,
    getAvailableStatusTransitions,
  };
})();
