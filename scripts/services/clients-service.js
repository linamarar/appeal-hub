/**
 * Service layer — клиенты, связанные обращения, документы, история.
 */

const ClientsService = (() => {
  function enrichClient(raw, actor = getCurrentUser()) {
    if (!raw) return null;
    const def = ClientsRepository.CLIENT_STATUSES[raw.status] || { label: raw.status, variant: 'neutral' };
    const result = {
      ...raw,
      statusLabel: def.label,
      statusVariant: def.variant,
      objectCount: (raw.relatedObjects || []).length,
      contractCount: (raw.relatedContracts || []).length,
    };
    if (!Permissions.canViewClientInternalInfo(actor)) {
      result.importantNote = null;
      result.importantNoteUpdatedAt = null;
    }
    return result;
  }

  function getById(id, actor = getCurrentUser()) {
    if (!Permissions.canViewClient(actor)) return null;
    return enrichClient(ClientsRepository.getById(id), actor);
  }

  function getClientAppeals(clientId, filter = 'all', actor = getCurrentUser()) {
    if (!Permissions.canViewClientAppeals(actor)) return [];
    let list = AppealsService.getList(actor).filter((a) => a.clientId === clientId);
    if (filter === 'open') list = list.filter((a) => a.statusCode !== 'CLOSED');
    if (filter === 'closed') list = list.filter((a) => a.statusCode === 'CLOSED');
    return list;
  }

  function getClientDocuments(clientId, actor = getCurrentUser()) {
    if (!Permissions.canViewClientDocuments(actor)) return [];
    return ClientsRepository.getDocuments(clientId);
  }

  function getClientHistory(clientId, actor = getCurrentUser()) {
    if (!Permissions.canViewClient(actor)) return [];
    return ClientsRepository.getHistory(clientId);
  }

  function getDetail(clientId, actor = getCurrentUser()) {
    const client = getById(clientId, actor);
    if (!client) return { found: false, client: null };
    return {
      found: true,
      client,
      appeals: getClientAppeals(clientId, 'all', actor),
      documents: getClientDocuments(clientId, actor),
      history: getClientHistory(clientId, actor),
    };
  }

  return { getById, getClientAppeals, getClientDocuments, getClientHistory, getDetail };
})();
