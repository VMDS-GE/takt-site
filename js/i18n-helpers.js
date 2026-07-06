/**
 * i18n-helpers.js — Pure locale helper functions for the Takt website.
 *
 * All functions are pure: no DOM access, no browser storage, no network requests, no side effects.
 * This module is imported by docs/js/i18n.js (the DOM controller) and tested directly
 * in tests/docs/i18n.test.js using Vitest in a Node environment.
 *
 * Feature #86 — Website i18n Infrastructure
 */

/**
 * Determine the best locale to activate for the user.
 *
 * Priority order (highest to lowest):
 *   1. savedLocale — if non-null, non-empty, and in availableLocales, return it.
 *   2. Browser detection — iterate navigatorLanguages; extract primary subtag (before
 *      the first "-", lowercased); return the matching entry from availableLocales.
 *   3. Ultimate fallback — return 'en'.
 *
 * @param {string[]} navigatorLanguages — navigator.languages values; null/undefined → []
 * @param {string[]} availableLocales   — list of supported locale codes; null/undefined → []
 * @param {string|null|undefined} savedLocale — persisted locale preference
 * @returns {string}
 */
export function pickLocale(navigatorLanguages, availableLocales, savedLocale) {
  var available = availableLocales || [];

  // Priority 1: saved locale
  if (savedLocale && available.includes(savedLocale)) {
    return savedLocale;
  }

  // Priority 2: browser detection
  var langs = navigatorLanguages || [];
  for (var i = 0; i < langs.length; i++) {
    var primarySubtag = langs[i].split('-')[0].toLowerCase();
    for (var j = 0; j < available.length; j++) {
      if (available[j].toLowerCase() === primarySubtag) {
        return available[j];
      }
    }
  }

  // Priority 3: ultimate fallback
  return 'en';
}

/**
 * Parse a data-i18n-attr value into an array of { attr, key } pairs.
 *
 * Input format: semicolon-separated "attr:key" tokens.
 * Only splits on the FIRST colon — keys may contain colons.
 * Skips tokens with no colon, empty attr, or empty key.
 *
 * @param {string|null|undefined} specString
 * @returns {Array<{attr: string, key: string}>}
 */
export function parseI18nAttrSpec(specString) {
  if (!specString) return [];

  var result = [];
  var tokens = specString.split(';');
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i].trim();
    if (!token) continue;

    var colonIdx = token.indexOf(':');
    if (colonIdx === -1) continue;

    var attr = token.slice(0, colonIdx).trim();
    var key = token.slice(colonIdx + 1).trim();

    if (!attr || !key) continue;

    result.push({ attr: attr, key: key });
  }
  return result;
}

/**
 * Look up a key in a locale catalog, falling back to the provided fallback string.
 *
 * @param {Record<string,string>|null|undefined} catalog
 * @param {string} key
 * @param {string} fallback
 * @returns {string}
 */
export function lookupKey(catalog, key, fallback) {
  if (!catalog) return fallback;
  var value = catalog[key];
  if (typeof value === 'string' && value !== '') return value;
  return fallback;
}

/**
 * Extract the leading '../' repetitions from a stylesheet href, giving the
 * relative path prefix from the current page back to the site root. Used
 * instead of counting URL path segments (Feature #198) because that approach
 * requires knowing which segment marks the site root, which differs between
 * the private repo (nested under a 'docs' segment) and the public deployed
 * site (served from the repo root) — the href is already correct either way,
 * since it's authored per-page to point at the real site-root-relative CSS.
 *
 * @param {string|null|undefined} href — e.g. "../../css/tokens.css"
 * @returns {string} e.g. "../../", or "./" when there is no leading '../'
 */
export function basePathFromHref(href) {
  if (!href) return './';
  var match = href.match(/^((?:\.\.\/)*)/);
  return (match && match[1]) || './';
}

/**
 * Render a <select> language-switcher HTML string.
 *
 * Labels and codes are HTML-entity-escaped.
 * The option matching `active` receives the bare `selected` attribute.
 *
 * @param {Array<{code: string, label: string}>|null|undefined} locales
 * @param {string} active — active locale code
 * @returns {string}
 */
export function renderSwitcherHtml(locales, active) {
  var items = locales || [];

  function escape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var options = '';
  for (var i = 0; i < items.length; i++) {
    var code = items[i].code;
    var label = items[i].label;
    var sel = code === active ? ' selected' : '';
    options += '<option value="' + escape(code) + '"' + sel + '>' + escape(label) + '</option>';
  }

  return '<select class="lang-select" aria-label="Select language">' + options + '</select>';
}
