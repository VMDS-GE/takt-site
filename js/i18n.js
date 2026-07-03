/**
 * i18n.js — Website i18n DOM controller for the Takt website.
 *
 * ES module loaded via <script type="module">. Reads the user's saved locale
 * from localStorage["takt.lang"], falls back to browser language detection,
 * fetches the matching locale JSON, translates the page, and renders a
 * language-switcher <select> in the header.
 *
 * Only the pure helpers in i18n-helpers.js are unit-tested. This controller
 * requires a DOM + fetch + localStorage and is verified via manual browser preview.
 *
 * Trust boundary: docs/locales/*.json files are trusted HTML content. They are
 * checked into the repository, reviewed by humans, and served from the same
 * origin as the pages. No user-generated content ever flows into these files.
 * The innerHTML assignment in applyTranslations is therefore safe. Do NOT use
 * innerHTML on values coming from any dynamic source (URL params, form input,
 * postMessage, etc.).
 *
 * Feature #86 — Website i18n Infrastructure
 * Feature #162 — text branch switched to innerHTML (trusted catalog, fallback preserves child elements)
 */

import {
  pickLocale,
  parseI18nAttrSpec,
  lookupKey,
  renderSwitcherHtml,
} from './i18n-helpers.js';

/** Hard-coded list of available locale codes. Adding a new locale (e.g. 'fr') requires:
 *   (a) Appending the code to this array,
 *   (b) Adding LOCALE_LABELS[code],
 *   (c) Creating docs/locales/<code>.json with translated strings,
 *   (d) Adding data-i18n annotations to the translated HTML pages.
 * No other algorithmic JS changes are needed.
 */
const availableLocales = ['en', 'fr', 'es', 'it', 'de', 'pt'];

/** Native display names for each locale code. */
const LOCALE_LABELS = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  de: 'Deutsch',
  pt: 'Português',
};

// Feature #168 — module-scope caches for in-place language switching
const originalTextCache = new WeakMap();
const originalAttrCache = new WeakMap();
let latestRequestedLocale = null;

/**
 * Determine the base path to the docs/ root from the current page URL.
 * Mirrors the logic in includes.js so locale JSON is always fetched from
 * the correct absolute location regardless of directory depth.
 */
function getBasePath() {
  var depth = 0;
  var path = window.location.pathname;
  var segments = path.replace(/\/+$/, '').split('/');
  var docsIdx = segments.indexOf('docs');
  if (docsIdx === -1) return './';
  depth = segments.length - docsIdx - 2;
  if (depth <= 0) return './';
  var prefix = '';
  for (var i = 0; i < depth; i++) prefix += '../';
  return prefix;
}

/** Apply translations from the catalog to all [data-i18n] and [data-i18n-attr] elements. */
function applyTranslations(catalog) {
  if (!catalog) return;

  var textEls = document.querySelectorAll('[data-i18n]');
  textEls.forEach(function (el) {
    if (!originalTextCache.has(el)) originalTextCache.set(el, el.innerHTML);
    var current = el.innerHTML;
    var next = lookupKey(catalog, el.dataset.i18n, originalTextCache.get(el));
    if (next !== current) el.innerHTML = next;
  });

  var attrEls = document.querySelectorAll('[data-i18n-attr]');
  attrEls.forEach(function (el) {
    if (!originalAttrCache.has(el)) originalAttrCache.set(el, {});
    var attrMap = originalAttrCache.get(el);
    var pairs = parseI18nAttrSpec(el.dataset.i18nAttr);
    pairs.forEach(function (pair) {
      if (attrMap[pair.attr] === undefined) attrMap[pair.attr] = el.getAttribute(pair.attr) || '';
      el.setAttribute(pair.attr, lookupKey(catalog, pair.key, attrMap[pair.attr]));
    });
  });
}

/** Inject the language-switcher <select> into the header. */
function injectSwitcher(activeLocale) {
  var localeList = availableLocales.map(function (code) {
    return { code: code, label: LOCALE_LABELS[code] || code };
  });
  var html = renderSwitcherHtml(localeList, activeLocale);

  var container = document.getElementById('lang-switcher-container');
  if (container) {
    container.innerHTML = html;
  } else {
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      var wrapper = document.createElement('span');
      wrapper.innerHTML = html;
      themeToggle.parentNode.insertBefore(wrapper, themeToggle.nextSibling);
    }
  }

  // Attach change listener to the rendered <select>
  var select = (container || document).querySelector('.lang-select');
  if (select) {
    select.addEventListener('change', function () {
      switchLocale(select.value);
    });
  }
}

/** Fetch a new locale catalog, re-translate the page in place, and update state. */
async function switchLocale(newLocale) {
  latestRequestedLocale = newLocale;
  try {
    var response = await fetch(getBasePath() + 'locales/' + newLocale + '.json');
    if (!response.ok) return false;
    if (latestRequestedLocale !== newLocale) return false;
    var catalog = await response.json();
    if (latestRequestedLocale !== newLocale) return false;
    applyTranslations(catalog);
    localStorage.setItem('takt.lang', newLocale);
    document.documentElement.lang = newLocale;
    var sel = document.querySelector('.lang-select');
    if (sel) sel.value = newLocale;
    return true;
  } catch (_) {
    return false;
  }
}

async function init() {
  var savedLocale = localStorage.getItem('takt.lang');
  var activeLocale = pickLocale(
    Array.from(navigator.languages || []),
    availableLocales,
    savedLocale
  );

  // Set <html lang> as early as possible
  document.documentElement.lang = activeLocale;

  var base = getBasePath();
  var catalog = null;

  try {
    var response = await fetch(base + 'locales/' + activeLocale + '.json');
    if (response.ok) {
      catalog = await response.json();
    }
  } catch (_) {
    // Network error — fall back to in-DOM English text (no crash, no empty content)
  }

  applyTranslations(catalog);
  injectSwitcher(activeLocale);
}

// Initialize on DOMContentLoaded (handles the case where it has already fired)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
