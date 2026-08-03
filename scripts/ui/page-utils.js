const PageUtils = (() => {
  function escapeHtml(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function formatDateTime(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return `${d.toLocaleDateString('ru-RU')} ${d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  }
  function setPanelState(prefix, state) {
    [document.getElementById(`${prefix}-loading`), document.getElementById(`${prefix}-empty`)].forEach((panel) => {
      if (panel) panel.classList.toggle('is-visible', panel.dataset.state === state);
    });
    const data = document.getElementById(`${prefix}-data`);
    if (data) data.classList.toggle('is-hidden', state !== 'loaded');
  }
  function statusBadge(label, variant = 'neutral') {
    return `<span class="ui-status-badge ui-status-badge--${variant}">${escapeHtml(label)}</span>`;
  }
  return { escapeHtml, formatDateTime, setPanelState, statusBadge };
})();
