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
 * Feature #86 — Website i18n Infrastructure
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
const availableLocales = ['en', 'fr'];

/** Native display names for each locale code. */
const LOCALE_LABELS = {
  en: 'English',
  fr: 'Français',
};

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
  var textEls = document.querySelectorAll('[data-i18n]');
  textEls.forEach(function (el) {
    el.textContent = lookupKey(catalog, el.dataset.i18n, el.textContent);
  });

  var attrEls = document.querySelectorAll('[data-i18n-attr]');
  attrEls.forEach(function (el) {
    var pairs = parseI18nAttrSpec(el.dataset.i18nAttr);
    pairs.forEach(function (pair) {
      el.setAttribute(pair.attr, lookupKey(catalog, pair.key, el.getAttribute(pair.attr) || ''));
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
      localStorage.setItem('takt.lang', select.value);
      window.location.reload();
    });
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
