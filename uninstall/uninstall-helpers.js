/**
 * uninstall-helpers.js — Pure logic for the uninstall feedback page (Feature #296).
 *
 * No imports, no browser globals: every input is an argument, so the module is
 * unit-tested directly in Node (tests/docs/uninstall-helpers.test.js).
 */

export const REASON_CODES = Object.freeze([
  'too_complex',
  'not_expected',
  'broken',
  'slow',
  'privacy',
  'pricing',
  'switched',
  'no_longer_needed',
  'interruptions',
  'other',
]);

export const FOLLOW_UP_LABEL_KEYS = Object.freeze({
  too_complex: 'uninstall.q2.label.tooComplex',
  not_expected: 'uninstall.q2.label.notExpected',
  broken: 'uninstall.q2.label.broken',
  slow: 'uninstall.q2.label.default',
  privacy: 'uninstall.q2.label.default',
  pricing: 'uninstall.q2.label.pricing',
  switched: 'uninstall.q2.label.switched',
  no_longer_needed: 'uninstall.q2.label.default',
  interruptions: 'uninstall.q2.label.default',
  other: 'uninstall.q2.label.default',
});

export const CONTEXT_KEYS = Object.freeze(['v', 'plan', 'days', 'mode', 'rules', 'lang']);
export const VERSION_RE = /^\d{1,3}(\.\d{1,3}){1,3}$/;
export const PLANS = Object.freeze(['free', 'premium']);
// Bucket lists are a contract with the extension's uninstall-URL builder (#297).
export const DAYS_BUCKETS = Object.freeze(['0', '1', '2-7', '8-30', '31-90', '91+']);
export const RULES_BUCKETS = Object.freeze(['0', '1-5', '6-20', '21+']);
// Literal copies of VALID_GROUPING_MODES (extension) and availableLocales (site loader);
// parity is enforced by tests.
export const GROUPING_MODES = Object.freeze(['rules', 'domain', 'ai', 'none']);
export const SUPPORTED_LOCALES = Object.freeze(['en', 'fr', 'es', 'it', 'de', 'pt']);

export const MAX_SHORT_TEXT = 100;
export const MAX_LONG_TEXT = 2000;
export const MAX_EMAIL = 254;
export const MIN_SUBMIT_MS = 3000;
export const PLACEHOLDER_MARKER = 'REPLACE_ME_';
export const FORMSPARK_ORIGIN = 'https://submit-form.com';

// WHATWG email pattern, but requiring a dot in the domain; ASCII only.
export const EMAIL_RE =
  /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

const DEFAULT_LABEL_KEY = 'uninstall.q2.label.default';
const CONTEXT_ALLOWLISTS = {
  plan: PLANS,
  days: DAYS_BUCKETS,
  rules: RULES_BUCKETS,
  mode: GROUPING_MODES,
  lang: SUPPORTED_LOCALES,
};

export function followUpLabelKey(code) {
  return REASON_CODES.includes(code) ? FOLLOW_UP_LABEL_KEYS[code] : DEFAULT_LABEL_KEY;
}

export function isValidContextValue(key, value) {
  if (!CONTEXT_KEYS.includes(key) || typeof value !== 'string') return false;
  if (key === 'v') return VERSION_RE.test(value);
  return CONTEXT_ALLOWLISTS[key].includes(value);
}

export function parseContext(search) {
  var params = new URLSearchParams(typeof search === 'string' ? search : '');
  var result = {};
  for (var i = 0; i < CONTEXT_KEYS.length; i++) {
    var k = CONTEXT_KEYS[i];
    var vals = params.getAll(k);
    if (vals.length === 1 && isValidContextValue(k, vals[0])) result[k] = vals[0];
  }
  return result;
}

// Fisher–Yates on every code except 'other', which is appended last.
// ponytail: modulo bias ≤ 10/2^32, negligible for 9 items; use rejection sampling if the list grows.
export function shuffleReasons(codes, randomUint32) {
  var a = codes.filter(function (c) {
    return c !== 'other';
  });
  for (var i = a.length - 1; i >= 1; i--) {
    var j = randomUint32() % (i + 1);
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  if (codes.includes('other')) a.push('other');
  return a;
}

export function sanitizeText(value, maxLength, multiline) {
  if (typeof value !== 'string') return '';
  var s = value;
  if (multiline) {
    s = s.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, '');
  } else {
    s = s.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  }
  s = s.replace(/[‪-‮⁦-⁩]/g, '').trim();
  if (s !== '' && '=+-@\t\r'.includes(s[0])) s = "'" + s;
  s = s.slice(0, maxLength);
  var last = s.charCodeAt(s.length - 1);
  if (last >= 0xd800 && last <= 0xdbff) s = s.slice(0, -1);
  return s;
}

// Returns '' (omitted), null (invalid) or the email. Only U+0020 is trimmed,
// so CR/LF/TAB around an address are rejected rather than silently removed.
export function normalizeEmail(value) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return null;
  var s = value.replace(/^ +| +$/g, '');
  if (s === '') return '';
  if (/[\u0000-\u001F\u007F-\u009F]/.test(s)) return null;
  if (s.length > MAX_EMAIL) return null;
  if ('=+-'.includes(s[0])) return null;
  return EMAIL_RE.test(s) ? s : null;
}

export function isConfigured(formId) {
  return typeof formId === 'string' && formId !== '' && !formId.includes(PLACEHOLDER_MARKER);
}

export function checkSubmitGate(input) {
  var g = input || {};
  if (typeof g.honeypot === 'string' && g.honeypot !== '') return 'honeypot';
  if (!REASON_CODES.includes(g.reason)) return 'no_reason';
  if (normalizeEmail(g.email) === null) return 'invalid_email';
  if (!isConfigured(g.formId)) return 'not_configured';
  if (
    !Number.isFinite(g.loadedAt) ||
    !Number.isFinite(g.now) ||
    g.now - g.loadedAt < MIN_SUBMIT_MS
  ) {
    return 'too_fast';
  }
  return 'ok';
}

export function buildPayload(fields, context, displayedLocale) {
  var f = fields || {};
  if (!REASON_CODES.includes(f.reason)) return null;
  var ctx = context || {};
  var result = {};
  result.reason = f.reason;

  var which = f.reason === 'switched' ? sanitizeText(f.whichExtension, MAX_SHORT_TEXT) : '';
  if (which) result.which_extension = which;
  var other = f.reason === 'other' ? sanitizeText(f.otherDetail, MAX_SHORT_TEXT) : '';
  if (other) result.other_detail = other;
  var followUp = sanitizeText(f.followUp, MAX_LONG_TEXT, true);
  if (followUp) result.follow_up = followUp;
  var comeBack = sanitizeText(f.comeBack, MAX_LONG_TEXT, true);
  if (comeBack) result.come_back = comeBack;
  var email = normalizeEmail(f.email);
  if (email) result.email = email;

  for (var i = 0; i < CONTEXT_KEYS.length; i++) {
    var k = CONTEXT_KEYS[i];
    if (isValidContextValue(k, ctx[k])) result[k] = ctx[k];
  }
  if (SUPPORTED_LOCALES.includes(displayedLocale)) result.locale = displayedLocale;
  return result;
}
