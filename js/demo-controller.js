/**
 * docs/js/demo-controller.js — Feature #95
 * Wires BrowserStage tab-change events to state mutation + renderHome.
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

export function wireController(el, popupRoot, state) {
  el.tabs = state.tabs.map(t => ({ title: t.title, url: t.url, groupId: t.groupId }));
  el.addEventListener('tab-change', (event) => {
    setActiveTab(state, event.detail.index);
    renderHome(state, popupRoot);
  });
}
