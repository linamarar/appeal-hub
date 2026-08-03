/**
 * Service layer — операции над обращениями с валидацией.
 */

const AppealsService = (() => {
  function enrich(raw, now = new Date()) {
    if (!raw) return null;
    const assignee = raw.assigneeId ? getUserById(raw.assigneeId) : null;
    const sla = SlaService.computeState(raw, now);
    const created = new Date(raw.createdAt);
    const updated = new Date(raw.updatedAt);
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
      history: raw.history.map(formatHistoryEvent),
    };
  }

  function formatHistoryEvent(event) {
    return {
      ...event,
      datetime: SlaService.formatDateTime(event.createdAt),
      author: event.actor,
      kind: event.kind === 'system' ? 'system' : event.type === 'COMMENT_ADDED' ? 'internal' : 'user',
    };
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
    AppealsRepository.pushHistory(record, {
      type: HISTORY_EVENT_TYPES.STATUS_CHANGED,
      actor: actor.name,
      createdAt: record.updatedAt,
      oldValue: oldLabel,
      newValue: getStatusLabel(toStatusCode),
      description: 'Статус изменён',
      kind: 'user',
    });
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
    AppealsRepository.pushHistory(record, {
      type: HISTORY_EVENT_TYPES.APPEAL_ACCEPTED,
      actor: actor.name,
      createdAt: record.updatedAt,
      oldValue: oldStatus,
      newValue: getStatusLabel('IN_PROGRESS'),
      description: 'Обращение принято в работу',
      kind: 'user',
    });
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

    AppealsRepository.pushHistory(record, {
      type: HISTORY_EVENT_TYPES.ASSIGNEE_ASSIGNED,
      actor: actor.name,
      createdAt: record.updatedAt,
      oldValue: 'Не назначен',
      newValue: user.name,
      description: 'Назначен исполнитель',
      kind: 'user',
    });

    if (prevStatus !== record.statusCode) {
      AppealsRepository.pushHistory(record, {
        type: HISTORY_EVENT_TYPES.STATUS_CHANGED,
        actor: actor.name,
        createdAt: record.updatedAt,
        oldValue: getStatusLabel(prevStatus),
        newValue: getStatusLabel(record.statusCode),
        description: 'Статус изменён',
        kind: 'user',
      });
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
    AppealsRepository.pushHistory(record, {
      type: HISTORY_EVENT_TYPES.ASSIGNEE_CHANGED,
      actor: actor.name,
      createdAt: record.updatedAt,
      oldValue: oldUser?.name || 'Не назначен',
      newValue: user.name,
      reason: reasonLabel,
      description: 'Исполнитель переназначен',
      kind: 'user',
    });
    AppealsRepository.saveRecord(record);
    return ok(record);
  }

  function addComment(id, text, actor = getCurrentUser()) {
    const record = AppealsRepository.getRawById(id);
    if (!record) return fail('NOT_FOUND', 'Обращение не найдено');
    if (!text?.trim()) return fail('VALIDATION', 'Введите комментарий');

    AppealsRepository.touchUpdatedAt(record);
    AppealsRepository.pushHistory(record, {
      type: HISTORY_EVENT_TYPES.COMMENT_ADDED,
      actor: actor.name,
      createdAt: record.updatedAt,
      description: text.trim(),
      kind: 'internal',
    });
    AppealsRepository.saveRecord(record);
    return ok(record);
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
    getAvailableStatusTransitions,
  };
})();
