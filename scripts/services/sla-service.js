/**
 * Вычисление состояния SLA.
 */

const SLA_STATES = {
  ON_TRACK: { code: 'ON_TRACK', label: 'В срок', variant: 'success' },
  AT_RISK: { code: 'AT_RISK', label: 'Срок приближается', variant: 'warning' },
  OVERDUE: { code: 'OVERDUE', label: 'Просрочено', variant: 'danger' },
  PAUSED: { code: 'PAUSED', label: 'Приостановлено', variant: 'neutral' },
};

const SlaService = {
  computeState(appeal, now = new Date()) {
    if (appeal.slaState === 'PAUSED') {
      return { ...SLA_STATES.PAUSED, dueAt: appeal.slaDueAt, message: 'SLA приостановлен' };
    }

    const createdAt = new Date(appeal.createdAt);
    const dueAt = new Date(appeal.slaDueAt);
    const current = new Date(now);

    if (Number.isNaN(dueAt.getTime()) || Number.isNaN(createdAt.getTime())) {
      return { ...SLA_STATES.ON_TRACK, dueAt: appeal.slaDueAt, message: 'Нет данных' };
    }

    const totalMs = dueAt - createdAt;
    const remainingMs = dueAt - current;

    if (remainingMs < 0) {
      return {
        ...SLA_STATES.OVERDUE,
        dueAt: appeal.slaDueAt,
        message: `Просрочено на ${this.formatDuration(Math.abs(remainingMs))}`,
      };
    }

    if (totalMs > 0 && remainingMs <= totalMs * 0.2) {
      return {
        ...SLA_STATES.AT_RISK,
        dueAt: appeal.slaDueAt,
        message: `Осталось ${this.formatDuration(remainingMs)}`,
      };
    }

    return {
      ...SLA_STATES.ON_TRACK,
      dueAt: appeal.slaDueAt,
      message: `Осталось ${this.formatDuration(remainingMs)}`,
    };
  },

  formatDuration(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} дн.`;
    if (hours > 0) return `${hours} ч.`;
    const minutes = Math.max(1, Math.floor(ms / (1000 * 60)));
    return `${minutes} мин.`;
  },

  formatDateTime(iso) {
    if (!iso) return 'Нет данных';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return 'Нет данных';
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};
