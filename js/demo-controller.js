/**
 * docs/js/demo-controller.js — Feature #95 + #96 + #97 + #98 + #99 + #100 + #101 + #102 + #103
 * Wires BrowserStage tab-change, tab-group-toggle, and group action events to state mutation + renderHome.
 */

import { renderHome, renderHibernate, renderRules, renderSessions, renderInsights, renderOptionsRules, renderOptionsProfiles, renderPalette } from './demo-renderer.js';

export function setActiveTab(state, index) {
  if (state.tabs.length === 0) return;
  // ponytail: clamping formula per spec — typeof+isInteger+<0 covers all invalid inputs
  const effectiveIndex =
    typeof index !== 'number' || !Number.isInteger(index) || index < 0
      ? 0
      : Math.min(index, state.tabs.length - 1);
  state.tabs.forEach((t, i) => {
    t.active = i === effectiveIndex;
  });
}

// ponytail: pure helper — mutates matched group's collapsed via Boolean() coercion; no-op on miss
export function setTabGroupCollapsed(state, id, collapsed) {
  const group = state.tabGroups.find((g) => g.id === id);
  if (group) group.collapsed = Boolean(collapsed);
}

// ponytail: sets all tabGroups[i].collapsed to true; no-op on empty array
export function collapseAll(state) {
  state.tabGroups.forEach((g) => {
    g.collapsed = true;
  });
}

// ponytail: symmetric inverse of collapseAll — sets all tabGroups[i].collapsed to false
export function expandAll(state) {
  state.tabGroups.forEach((g) => {
    g.collapsed = false;
  });
}

// ponytail: symmetric inverse of groupAll — clears all groups and sets every tab's groupId to null
export function ungroupAll(state) {
  if (state.tabs.length === 0) return;
  state.tabGroups = [];
  state.tabs.forEach((t) => {
    t.groupId = null;
  });
}

// ponytail: assigns all falsy-groupId tabs to the first group; creates default group if none exist
export function groupAll(state) {
  if (state.tabs.length === 0) return;
  if (state.tabGroups.length === 0) {
    state.tabGroups.push({ id: 'group-default', title: 'Work', color: 'blue', collapsed: false });
  }
  const target = state.tabGroups[0].id;
  state.tabs.forEach((t) => {
    if (!t.groupId) t.groupId = target;
  });
}

// ponytail: flip rule.enabled; no-op on miss or falsy ruleId (find returns undefined, early return)
export function toggleRule(state, ruleId) {
  const rule = state.rules.find((r) => r.id === ruleId);
  if (!rule) return;
  rule.enabled = !rule.enabled;
}

// ponytail: splice matched hibernated entry → push reconstructed Tab with groupId:null/active:false
export function wakeTab(state, tabId) {
  const idx = state.hibernated.findIndex((h) => h.id === tabId);
  if (idx === -1) return;
  const [h] = state.hibernated.splice(idx, 1);
  state.tabs.push({
    id: h.id,
    title: h.title,
    url: h.url,
    favIconUrl: h.favIconUrl,
    groupId: null,
    active: false,
  });
}

// ponytail: forEach push reconstructed Tab (groupId:null/active:false) → clear hibernated via length=0
export function wakeAll(state) {
  if (state.hibernated.length === 0) return;
  state.hibernated.forEach((h) => {
    state.tabs.push({
      id: h.id,
      title: h.title,
      url: h.url,
      favIconUrl: h.favIconUrl,
      groupId: null,
      active: false,
    });
  });
  state.hibernated.length = 0;
}

// ponytail: findIndex on sessions by id, splice on hit; no-op on miss or falsy sessionId
export function deleteSession(state, sessionId) {
  if (!sessionId) return;
  const idx = state.sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return;
  state.sessions.splice(idx, 1);
}

// ponytail: discard all hibernated entries via length=0 (array identity preserved); does NOT touch tabs
export function clearHibernated(state) {
  if (state.hibernated.length === 0) return;
  state.hibernated.length = 0;
}

// ponytail: sets every i.hidden = false; idempotent; no DOM/clock/rng
export function unlockHiddenInsights(state) {
  state.insights.forEach((i) => {
    i.hidden = false;
  });
}

// ponytail: find insight by id → splice on hit; silent no-op on falsy or miss
export function dismissInsight(state, insightId) {
  if (!insightId) return;
  const idx = state.insights.findIndex((i) => i.id === insightId);
  if (idx === -1) return;
  state.insights.splice(idx, 1);
}

// ponytail: find insight by id → push shallow clone of suggestedRule to rules → splice insight; no-op on miss/no-key
export function createRuleFromInsight(state, insightId) {
  const insight = state.insights.find((i) => i.id === insightId);
  if (!insight) return;
  if (!('suggestedRule' in insight)) return;
  state.rules.push({ ...insight.suggestedRule });
  const idx = state.insights.findIndex((i) => i.id === insightId);
  state.insights.splice(idx, 1);
}

// ponytail: pure push — caller generates id/name/createdAt/tabCount; no clock/rng here
export function saveSession(state, { id, name, createdAt, tabCount }) {
  state.sessions.push({ id, name, createdAt, tabCount });
}

// ponytail: pure push — appends rule to state.rules; caller provides all fields
export function addRule(state, rule) {
  state.rules.push(rule);
}

// ponytail: findIndex on rules by id, splice on hit; no-op on miss or falsy ruleId
export function deleteRule(state, ruleId) {
  if (!ruleId) return;
  const idx = state.rules.findIndex((r) => r.id === ruleId);
  if (idx === -1) return;
  state.rules.splice(idx, 1);
}

// ponytail: splice active tab → push 4-field entry to hibernated → re-anchor tabs[0].active
export function hibernateTab(state) {
  const idx = state.tabs.findIndex((t) => t.active === true);
  if (idx === -1) return;
  const [removed] = state.tabs.splice(idx, 1);
  state.hibernated.push({
    id: removed.id,
    title: removed.title,
    url: removed.url,
    favIconUrl: removed.favIconUrl,
  });
  if (state.tabs.length > 0) state.tabs[0].active = true;
}

const mapTabGroups = (state) =>
  state.tabGroups.map((g) => ({
    id: g.id,
    label: g.title,
    color: g.color,
    collapsed: g.collapsed,
  }));

const mapTabs = (state) =>
  state.tabs.map((t) => ({ title: t.title, url: t.url, groupId: t.groupId }));

// ponytail: pure mutator — strict === match on profiles array; no-op on miss or falsy; no DOM access
export function setActiveProfile(state, profileId) {
  if (state.profiles.find((p) => p.id === profileId)) {
    state.activeProfileId = profileId;
  }
}

// ponytail: allowlist guard prevents stray keys; direct assignment, no coercion; no DOM/clock/rng
export function setSetting(state, key, value) {
  if (!state?.settings) return;
  if (!['theme', 'automation', 'autoCollapse'].includes(key)) return;
  state.settings[key] = value;
}

// ponytail: null/undefined → identity; String()+trim otherwise; case-insensitive substring on title OR url
export function filterTabsByQuery(tabs, query) {
  if (query == null) return tabs;
  const q = String(query).trim().toLowerCase();
  if (q === '') return tabs;
  return tabs.filter((t) => t.title?.toLowerCase().includes(q) || t.url?.toLowerCase().includes(q));
}

// ponytail: sets hidden=false, clears input, renders all tabs, focuses input; no-op if palette absent
export function openPalette(state, popupRoot) {
  const palette = popupRoot.querySelector('#cmd-palette');
  if (!palette) return;
  palette.hidden = false;
  const input = popupRoot.querySelector('#cmd-palette-input');
  if (input) input.value = '';
  renderPalette(state, popupRoot, '');
  if (input) input.focus?.();
}

// ponytail: sets hidden=true, clears input; no-op if palette absent
export function closePalette(popupRoot) {
  const palette = popupRoot.querySelector('#cmd-palette');
  if (!palette) return;
  palette.hidden = true;
  const input = popupRoot.querySelector('#cmd-palette-input');
  if (input) input.value = '';
}

// ponytail: optRoot — in production pass document (#opt-rules-list is outside popupRoot); tests omit it
// ponytail: keyboardRoot defaults to globalThis.document — safe in Node.js (returns undefined) and browser (returns document)
export function wireController(el, popupRoot, state, optRoot = popupRoot, keyboardRoot = globalThis.document) {
  // ponytail: private — returns new entry object; caller wraps in [] for Lit reactivity (new array per call)
  const updateToolbarBadge = () => ({ id: 'takt', iconUrl: 'assets/favicon-32.png', title: 'Takt', badge: String(state.hibernated.length || '') });
  el.tabs = mapTabs(state);
  el.toolbar = [updateToolbarBadge()];
  el.tabGroups = mapTabGroups(state);
  renderSessions(state, popupRoot);
  renderInsights(state, popupRoot);
  renderOptionsRules(state, optRoot);
  renderOptionsProfiles(state, optRoot);
  el.addEventListener('tab-change', (event) => {
    setActiveTab(state, event.detail.index);
    renderHome(state, popupRoot);
  });
  el.addEventListener('tab-group-toggle', (event) => {
    setTabGroupCollapsed(state, event.detail.id, event.detail.collapsed);
    el.tabGroups = mapTabGroups(state);
  });
  // ponytail: triggerGroupAll — shared by button click (#97) and Alt+Shift+G shortcut (#118)
  const triggerGroupAll = () => {
    groupAll(state);
    el.tabs = mapTabs(state);
    el.tabGroups = mapTabGroups(state);
    el.showToast('All tabs grouped', { type: 'success', duration: 1500 });
    renderHome(state, popupRoot);
  };
  const btn = popupRoot.querySelector('#btn-group-all');
  if (btn) {
    btn.addEventListener('click', () => triggerGroupAll());
  }
  // ponytail: triggerUngroupAll — shared by button click (#98) and Alt+Shift+U shortcut (#119)
  const triggerUngroupAll = () => {
    ungroupAll(state);
    el.tabs = mapTabs(state);
    el.tabGroups = mapTabGroups(state);
    el.showToast('All groups removed', { type: 'success', duration: 1500 });
    renderHome(state, popupRoot);
  };
  const ungroupBtn = popupRoot.querySelector('#btn-ungroup-all');
  if (ungroupBtn) {
    ungroupBtn.addEventListener('click', () => triggerUngroupAll());
  }
  // ponytail: triggerCollapseAll — shared by button click (#99) and Alt+Shift+C shortcut (#120)
  const triggerCollapseAll = () => {
    collapseAll(state);
    el.tabGroups = mapTabGroups(state);
    el.showToast('All groups collapsed', { type: 'success', duration: 1500 });
    renderHome(state, popupRoot);
  };
  const collapseBtn = popupRoot.querySelector('#btn-collapse-all');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => triggerCollapseAll());
  }
  const expandBtn = popupRoot.querySelector('#btn-expand-all');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      if (state.tabGroups.length === 0) return;
      expandAll(state);
      el.tabGroups = mapTabGroups(state);
      el.showToast('All groups expanded', { type: 'success', duration: 1500 });
      renderHome(state, popupRoot);
    });
  }
  const hibBtn = popupRoot.querySelector('#btn-hibernate-tab');
  if (hibBtn) {
    hibBtn.addEventListener('click', () => {
      hibernateTab(state);
      el.tabs = mapTabs(state);
      el.showToast('Tab hibernated', { type: 'success', duration: 1500 });
      renderHome(state, popupRoot);
      renderHibernate(state, popupRoot);
      el.toolbar = [updateToolbarBadge()];
    });
  }
  const wakeAllBtn = popupRoot.querySelector('#btn-wake-all');
  if (wakeAllBtn) {
    wakeAllBtn.addEventListener('click', () => {
      wakeAll(state);
      el.tabs = mapTabs(state);
      renderHibernate(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('All tabs awakened', { type: 'success', duration: 1500 });
      el.toolbar = [updateToolbarBadge()];
    });
  }
  const clearHibBtn = popupRoot.querySelector('#btn-clear-hib');
  if (clearHibBtn) {
    clearHibBtn.addEventListener('click', () => {
      clearHibernated(state);
      renderHibernate(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('All hibernated tabs cleared', { type: 'success', duration: 1500 });
      el.toolbar = [updateToolbarBadge()];
    });
  }
  const saveSessionBtn = popupRoot.querySelector('#btn-save-session');
  if (saveSessionBtn) {
    saveSessionBtn.addEventListener('click', () => {
      const id = 'ses-' + Date.now();
      const name = 'Session ' + (state.sessions.length + 1);
      const createdAt = new Date().toISOString();
      const tabCount = state.tabs.length;
      saveSession(state, { id, name, createdAt, tabCount });
      renderSessions(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('Session saved', { type: 'success', duration: 1500 });
    });
  }
  const optBtn = popupRoot.querySelector('#btn-open-options');
  if (optBtn) {
    optBtn.addEventListener('click', () => {
      // ponytail: checkbox lives at page level, not in popupRoot
      document.getElementById('opt-view-toggle')?.click();
    });
  }
  popupRoot.addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT' && e.target.dataset.ruleId) {
      const ruleId = e.target.dataset.ruleId;
      toggleRule(state, ruleId);
      const rule = state.rules.find((r) => r.id === ruleId);
      renderRules(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast(rule.enabled ? 'Rule enabled' : 'Rule disabled', {
        type: 'success',
        duration: 1500,
      });
    } else if (e.target.id === 'btn-move-to-group') {
      e.target.disabled = true;
      e.target.textContent = 'Moved!';
      const activeTab = state.tabs.find((t) => t.active);
      const matchedRule = activeTab
        ? state.rules.find((r) => r.enabled && activeTab.url.includes(r.pattern))
        : null;
      if (!matchedRule) return;
      el.showToast('Moved to "' + matchedRule.name + '"', { type: 'success', duration: 1500 });
      setTimeout(() => {
        e.target.disabled = false;
        e.target.textContent = 'Move to group';
      }, 1500);
    } else if (e.target.classList?.contains('tp-wake-btn')) {
      const tabId = e.target.dataset.id;
      wakeTab(state, tabId);
      el.tabs = mapTabs(state);
      renderHibernate(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('Tab awakened', { type: 'success', duration: 1500 });
      el.toolbar = [updateToolbarBadge()];
    } else if (e.target.classList?.contains('tp-restore-btn')) {
      const sessionId = e.target.dataset.sessionId;
      const session = state.sessions.find((s) => s.id === sessionId);
      if (!session) return;
      el.showToast('Restoring… ' + session.name, { type: 'success', duration: 1500 });
    } else if (e.target.classList?.contains('tp-del-btn')) {
      const sessionId = e.target.dataset.sessionId;
      if (!state.sessions.some((s) => s.id === sessionId)) return;
      deleteSession(state, sessionId);
      renderSessions(state, popupRoot);
      el.showToast('Session deleted', { type: 'success', duration: 1500 });
    } else if (e.target.classList?.contains('tp-insight-create')) {
      const insightId = e.target.dataset.insightId;
      if (!state.insights.some((i) => i.id === insightId)) return;
      const insight = state.insights.find((i) => i.id === insightId);
      if (!('suggestedRule' in insight)) return;
      createRuleFromInsight(state, insightId);
      renderRules(state, popupRoot);
      renderInsights(state, popupRoot);
      el.showToast('Rule created', { type: 'success', duration: 1500 });
    } else if (e.target.classList?.contains('tp-insight-dismiss')) {
      const insightId = e.target.dataset.insightId;
      if (!state.insights.some((i) => i.id === insightId)) return;
      dismissInsight(state, insightId);
      renderInsights(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('Insight dismissed', { type: 'success', duration: 1500 });
    } else if (e.target.closest?.('button.tp-insights-cta')) {
      unlockHiddenInsights(state);
      renderInsights(state, popupRoot);
      el.showToast('This is a demo — all features unlocked!', { type: 'success', duration: 1500 });
    }
  });
  // ponytail: #opt-rules-list is in .takt-options (sibling of popupRoot), delegate from optRoot
  optRoot.addEventListener('click', (e) => {
    if (e.target.id === 'opt-rule-add-btn') {
      const name = (optRoot.querySelector('#opt-rule-add-name')?.value || '').trim();
      const pattern = (optRoot.querySelector('#opt-rule-add-pattern')?.value || '').trim();
      if (!name || !pattern) return;
      addRule(state, { id: 'rule-u' + Date.now(), name, pattern, matchType: 'domain', color: 'blue', enabled: true, profileId: state.activeProfileId });
      renderOptionsRules(state, optRoot);
      renderRules(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('Rule added', { type: 'success', duration: 1500 });
    } else if (e.target.classList?.contains('opt-rule-delete-btn')) {
      const ruleId = e.target.dataset.ruleId;
      if (!state.rules.some((r) => r.id === ruleId)) return;
      deleteRule(state, ruleId);
      renderOptionsRules(state, optRoot);
      renderRules(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('Rule deleted', { type: 'success', duration: 1500 });
    } else if (e.target.closest?.('.opt-profile-item')) {
      const row = e.target.closest('.opt-profile-item');
      const profileId = row.dataset.profileId;
      if (!profileId || profileId === state.activeProfileId) return;
      setActiveProfile(state, profileId);
      const profile = state.profiles.find((p) => p.id === profileId);
      renderOptionsProfiles(state, optRoot);
      renderOptionsRules(state, optRoot);
      renderRules(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('Profile: ' + profile.name, { type: 'success', duration: 1500 });
    }
  });
  optRoot.addEventListener('change', (e) => {
    if (e.target.id === 'opt-settings-theme') {
      setSetting(state, 'theme', e.target.value);
      el.showToast('Theme: ' + e.target.value, { type: 'success', duration: 1500 });
    } else if (e.target.id === 'opt-settings-automation') {
      setSetting(state, 'automation', e.target.value);
      el.showToast('Automation: ' + e.target.value, { type: 'success', duration: 1500 });
    } else if (e.target.id === 'opt-settings-autoCollapse') {
      setSetting(state, 'autoCollapse', e.target.checked);
      el.showToast(e.target.checked ? 'Auto-collapse on' : 'Auto-collapse off', { type: 'success', duration: 1500 });
    }
  });
  // ponytail: palette input delegation — filter results on every keystroke
  popupRoot.addEventListener('input', (e) => {
    if (e.target.id === 'cmd-palette-input') {
      renderPalette(state, popupRoot, e.target.value);
    }
  });
  // ponytail: keyboardRoot defaults to document; use optional chaining so Node tests (no document) don't crash
  keyboardRoot?.addEventListener('keydown', (e) => {
    const palette = popupRoot.querySelector('#cmd-palette');
    const isOpen = palette && palette.hidden === false;
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (isOpen) closePalette(popupRoot); else openPalette(state, popupRoot);
      return;
    }
    if (e.altKey && e.shiftKey && (e.key === 'g' || e.key === 'G' || e.code === 'KeyG')) {
      e.preventDefault();
      triggerGroupAll();
      return;
    }
    if (e.altKey && e.shiftKey && (e.key === 'u' || e.key === 'U' || e.code === 'KeyU')) {
      e.preventDefault();
      triggerUngroupAll();
      return;
    }
    if (e.altKey && e.shiftKey && (e.key === 'c' || e.key === 'C' || e.code === 'KeyC')) {
      e.preventDefault();
      triggerCollapseAll();
      return;
    }
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closePalette(popupRoot);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const query = popupRoot.querySelector('#cmd-palette-input')?.value || '';
      const matches = filterTabsByQuery(state.tabs, query);
      if (matches.length === 0) return;
      const targetIndex = state.tabs.indexOf(matches[0]);
      if (targetIndex < 0) return;
      setActiveTab(state, targetIndex);
      el.activeTab = targetIndex;
      renderHome(state, popupRoot);
      closePalette(popupRoot);
    }
  });
}
