/**
 * docs/js/demo-controller.js — Feature #95 + #96
 * Wires BrowserStage tab-change and tab-group-toggle events to state mutation + renderHome.
 */

import { renderHome } from './demo-renderer.js';

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

const mapTabGroups = (state) =>
  state.tabGroups.map((g) => ({
    id: g.id,
    label: g.title,
    color: g.color,
    collapsed: g.collapsed,
  }));

export function wireController(el, popupRoot, state) {
  el.tabs = state.tabs.map((t) => ({ title: t.title, url: t.url, groupId: t.groupId }));
  el.tabGroups = mapTabGroups(state);
  el.addEventListener('tab-change', (event) => {
    setActiveTab(state, event.detail.index);
    renderHome(state, popupRoot);
  });
  el.addEventListener('tab-group-toggle', (event) => {
    setTabGroupCollapsed(state, event.detail.id, event.detail.collapsed);
    el.tabGroups = mapTabGroups(state);
  });
}
