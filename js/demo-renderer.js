/**
 * docs/js/demo-renderer.js — Feature #94
 * Pure ES module: six named exports, no side effects on import.
 * Projects initialState (demo-state.js) into five popup panes.
 */

export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderHome(state, popupRoot) {
  const statusEl = popupRoot.querySelector('#tp-status');
  const activeTab = state.tabs.find(t => t.active === true);
  const matchedRule = activeTab
    ? state.rules.find(r => r.enabled && activeTab.url.includes(r.pattern))
    : null;
  if (matchedRule) {
    statusEl.innerHTML =
      `<span class="tp-color-dot" style="background:${matchedRule.color}"></span>` +
      ` Matched: "${escapeHtml(matchedRule.name)}"` +
      `<button id="btn-move-to-group" type="button">Move to group</button>`;
  } else {
    statusEl.innerHTML = '<span class="tp-status-no-match">No matching rule</span>';
  }
}

export function renderRules(state, popupRoot) {
  const listEl = popupRoot.querySelector('#tp-rules-list');
  const countEl = popupRoot.querySelector('#tp-rules-count');
  const filteredRules = state.rules.filter(r => (r.profileId || 'prof-default') === state.activeProfileId);
  const activeCount = filteredRules.filter(r => r.enabled).length;
  countEl.textContent = `(${activeCount} active)`;
  listEl.innerHTML = filteredRules.map((rule) =>
    `<li class="tp-rule-item">` +
    `<label class="tp-toggle"><input type="checkbox"${rule.enabled ? ' checked' : ''} data-rule-id="${rule.id}">` +
    `<span class="tp-toggle-track"></span></label>` +
    `<span class="tp-rule-name">${escapeHtml(rule.name)}</span>` +
    `<span class="tp-color-dot" style="background:${rule.color}"></span>` +
    `<span class="tp-rule-group">${escapeHtml(rule.name)}</span>` +
    `</li>`
  ).join('');
}

export function renderSessions(state, popupRoot) {
  const listEl = popupRoot.querySelector('#tp-sessions-list');
  if (!state.sessions.length) {
    listEl.innerHTML =
      '<div style="font-size:11px;color:#8e8e93;padding:4px 0">No saved sessions.</div>';
    return;
  }
  listEl.innerHTML = state.sessions.map(session =>
    `<div class="tp-session-item">` +
    `<div class="tp-session-info">` +
    `<span class="tp-session-name">${escapeHtml(session.name)}</span>` +
    `<span class="tp-session-meta">${session.tabCount} tabs · ${session.createdAt.slice(0, 10)}</span>` +
    `</div>` +
    `<div class="tp-session-actions">` +
    `<button class="tp-btn-link tp-restore-btn" data-session-id="${escapeHtml(session.id)}" style="font-size:11px;color:#007aff">Restore</button>` +
    `<button class="tp-btn-link tp-del-btn" data-session-id="${escapeHtml(session.id)}" style="font-size:11px;color:#aeaeb2">✕</button>` +
    `</div>` +
    `</div>`
  ).join('');
}

export function renderHibernate(state, popupRoot) {
  const badge = popupRoot.querySelector('#tp-hib-badge');
  const statsEl = popupRoot.querySelector('#tp-hib-stats');
  const listEl = popupRoot.querySelector('#tp-hib-list');
  const count = state.hibernated.length;
  if (count > 0) {
    badge.textContent = String(count);
    badge.hidden = false;
    statsEl.innerHTML = `<span class="tp-hib-stat">~${count * 16}MB saved</span>`;
    listEl.innerHTML = state.hibernated.map(tab =>
      `<div class="tp-hib-item">` +
      `<img class="tp-hib-favicon" src="${escapeHtml(tab.favIconUrl)}" alt="" />` +
      `<div class="tp-hib-info"><div class="tp-hib-title">${escapeHtml(tab.title)}</div></div>` +
      `<button class="tp-wake-btn" data-id="${escapeHtml(tab.id)}">Wake</button>` +
      `</div>`
    ).join('');
  } else {
    badge.hidden = true;
    statsEl.innerHTML = '';
    listEl.innerHTML =
      '<div style="padding:40px 24px;text-align:center;color:#8e8e93;font-size:13px">No hibernated tabs</div>';
  }
}

// ponytail: root defaults to document — #opt-rules-list lives in .takt-options, not popupRoot
export function renderOptionsRules(state, root = document) {
  const listEl = root.querySelector('#opt-rules-list');
  if (!listEl) return;
  const filteredRules = state.rules.filter(r => (r.profileId || 'prof-default') === state.activeProfileId);
  listEl.innerHTML =
    filteredRules.map(rule =>
      `<li class="opt-rule-item" data-rule-id="${escapeHtml(rule.id)}">` +
      `<span class="opt-rule-name">${escapeHtml(rule.name)}</span>` +
      `<span class="opt-rule-pattern">${escapeHtml(rule.pattern)}</span>` +
      `<button class="opt-rule-delete-btn" type="button" data-rule-id="${escapeHtml(rule.id)}">Delete</button>` +
      `</li>`
    ).join('') +
    `<li class="opt-rule-add-row">` +
    `<input type="text" id="opt-rule-add-name" placeholder="Name">` +
    `<input type="text" id="opt-rule-add-pattern" placeholder="Pattern (e.g. github.com)">` +
    `<button id="opt-rule-add-btn" type="button">Add Rule</button>` +
    `</li>`;
}

// ponytail: root defaults to document — #opt-profiles-list lives in .takt-options
export function renderOptionsProfiles(state, root = document) {
  const listEl = root.querySelector('#opt-profiles-list');
  if (!listEl) return;
  listEl.innerHTML = state.profiles.map(profile =>
    `<div class="opt-profile-item" data-profile-id="${escapeHtml(profile.id)}">` +
    escapeHtml(profile.name) +
    (profile.id === state.activeProfileId ? '<span class="opt-active-badge">Active</span>' : '') +
    `</div>`
  ).join('');
}

// ponytail: inline filter (no import from controller — avoids circular dep); escapeHtml on all tab fields
export function renderPalette(state, root, query) {
  const resultsEl = root.querySelector('#cmd-palette-results');
  if (!resultsEl) return;
  // ponytail: duplicate of filterTabsByQuery logic — 2 lines, third module fails ponytail rung 6
  const q = (query == null) ? '' : String(query).trim().toLowerCase();
  const filtered = q === '' ? state.tabs : state.tabs.filter(
    (t) => t.title?.toLowerCase().includes(q) || t.url?.toLowerCase().includes(q)
  );
  if (filtered.length === 0) {
    resultsEl.innerHTML = '<li class="cmd-palette-empty">No results</li>';
    return;
  }
  resultsEl.innerHTML = filtered.map((t) =>
    `<li data-tab-id="${escapeHtml(String(t.id))}">` +
    `<span class="cmd-palette-title">${escapeHtml(t.title)}</span>` +
    `<span class="cmd-palette-url">${escapeHtml(t.url)}</span>` +
    `</li>`
  ).join('');
}

export function renderInsights(state, popupRoot) {
  const listEl = popupRoot.querySelector('#tp-insights-list');
  const badge = popupRoot.querySelector('#tp-insights-badge');
  const visible = state.insights.filter((i) => i.hidden !== true);
  if (!visible.length) {
    listEl.innerHTML =
      '<div style="padding:40px 24px;text-align:center;color:#8e8e93;font-size:13px;line-height:1.5">Your tabs are well-organized!</div>';
    badge.hidden = true;
    return;
  }
  badge.textContent = String(visible.length);
  badge.hidden = false;
  const cards = visible.map((insight) => {
    const ruleHtml = 'suggestedRule' in insight
      ? `<div class="tp-insight-rule"><span class="tp-insight-rule-name">${escapeHtml(insight.suggestedRule.name)}</span></div>`
      : '';
    const createBtn = insight.type === 'suggestion'
      ? `<button class="tp-insight-btn tp-insight-create" data-insight-id="${escapeHtml(insight.id)}">Create rule</button>`
      : '';
    return `<div class="tp-insight-card">` +
      `<div class="tp-insight-header">` +
      `<span class="tp-insight-title">${escapeHtml(insight.title)}</span>` +
      `<span class="tp-insight-type">${escapeHtml(insight.type)}</span>` +
      `</div>` +
      `<p class="tp-insight-body">${escapeHtml(insight.body)}</p>` +
      ruleHtml +
      `<div class="tp-insight-actions">` +
      createBtn +
      `<button class="tp-insight-btn tp-insight-dismiss" data-insight-id="${escapeHtml(insight.id)}">Dismiss</button>` +
      `</div>` +
      `</div>`;
  }).join('');
  listEl.innerHTML =
    cards + '<button type="button" class="tp-insights-cta"><span>Unlock full insights with</span><strong>Takt Premium</strong></button>';
}
