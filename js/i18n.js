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
  basePathFromHref,
  localeFromSearch,
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

// Pages that exist once per language (the blog's feature articles) carry hreflang
// alternates. Their own <html lang> wins over the saved preference, and switching
// language navigates to that language's page instead of translating in place.
// Read now: init() overwrites <html lang> later.
const PAGE_LOCALE = document.querySelector('link[rel="alternate"][hreflang]')
  ? document.documentElement.lang
  : null;

// Feature #168 — module-scope caches for in-place language switching
const originalTextCache = new WeakMap();
const originalAttrCache = new WeakMap();
let latestRequestedLocale = null;

/**
 * Determine the base path to the site root from the current page URL.
 * Feature #198 fix: the previous implementation counted URL path segments
 * from a 'docs' segment (mirroring includes.js's private-repo version), which
 * only resolves correctly for includes.js because a deploy-time script
 * (.github/scripts/patch-includes.py) rewrites *that* file's getBasePath()
 * for the public site — it never patched this file, so locale JSON 404'd on
 * every page nested under /docs/<page>/ and translations silently never
 * applied. Reading the already-correct relative prefix off the page's own
 * tokens.css <link> works on every deployment shape with no patch needed.
 */
function getBasePath() {
  var link = document.querySelector('link[rel="stylesheet"][href*="tokens.css"]');
  return basePathFromHref(link && link.getAttribute('href'));
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

/** Point [data-l10n-href] links (e.g. "blog/getting-started/") at the page in `locale`. */
function localizeLinks(locale) {
  var base = getBasePath();
  document.querySelectorAll('[data-l10n-href]').forEach(function (el) {
    el.setAttribute('href', base + (locale === 'en' ? '' : locale + '/') + el.dataset.l10nHref);
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
  }

  // Attach change listener to the rendered <select>
  var select = (container || document).querySelector('.lang-select');
  if (select) {
    select.addEventListener('change', function () {
      var alt = PAGE_LOCALE && document.querySelector('.lang-links a[hreflang="' + select.value + '"]');
      if (alt) {
        rememberLocale(select.value);
        location.href = alt.href;
        return;
      }
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
    localizeLinks(newLocale);
    rememberLocale(newLocale);
    document.documentElement.lang = newLocale;
    var sel = document.querySelector('.lang-select');
    if (sel) sel.value = newLocale;
    return true;
  } catch (_) {
    return false;
  }
}

/** The single place the preference is saved: only on an explicit user choice. */
function rememberLocale(locale) {
  localStorage.setItem('takt.lang', locale);
}

async function init() {
  var savedLocale =
    PAGE_LOCALE ||
    localeFromSearch(location.search, availableLocales) ||
    localStorage.getItem('takt.lang');
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
  localizeLinks(activeLocale);
  injectSwitcher(activeLocale);
  // Clicking "Español" etc. on a per-language page is an explicit choice too.
  document.querySelectorAll('.lang-links a[hreflang]').forEach(function (a) {
    a.addEventListener('click', function () {
      rememberLocale(a.getAttribute('hreflang'));
    });
  });
}

// Initialize on DOMContentLoaded (handles the case where it has already fired)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
