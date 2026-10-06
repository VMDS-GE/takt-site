/**
 * uninstall.js — DOM controller for the uninstall feedback page (Feature #296).
 *
 * Never builds HTML, never reads the locale catalog and never writes to storage:
 * it only toggles `hidden`, reorders existing nodes and reads/writes control values.
 * Pure logic lives in uninstall-helpers.js; the hardening rationale is in the spec.
 */
import {
  REASON_CODES,
  FORMSPARK_ORIGIN,
  followUpLabelKey,
  parseContext,
  shuffleReasons,
  checkSubmitGate,
  buildPayload,
} from './uninstall-helpers.js';
import { FORMSPARK_FORM_ID, BOTPOISON_PUBLIC_KEY } from './config.js';

const loadedAt = Date.now();
const context = parseContext(location.search);
let sending = false;

function init() {
  const form = document.getElementById('uninstall-form');
  if (window.top !== window.self) {
    form.hidden = true;
    return;
  }

  const $ = (id) => document.getElementById(id);
  const list = $('reason-list');
  const whichField = $('which-extension-field');
  const otherField = $('other-detail-field');
  const followUpField = $('follow-up-field');
  const errorReason = $('error-reason');
  const errorEmail = $('error-email');
  const statusSending = $('status-sending');
  const statusError = $('status-error');
  const submitBtn = $('submit-btn');
  const emailInput = $('email');

  // Random reason order (bias control); 'other' always stays last.
  shuffleReasons(REASON_CODES, () => crypto.getRandomValues(new Uint32Array(1))[0]).forEach(
    (code) => list.appendChild(list.querySelector('[data-reason="' + code + '"]'))
  );

  const checkedReason = () => {
    const checked = form.querySelector('input[name="reason"]:checked');
    return checked ? checked.value : '';
  };

  list.addEventListener('change', () => {
    const code = checkedReason();
    const labelKey = followUpLabelKey(code);
    followUpField.hidden = false;
    $('follow-up-label')
      .querySelectorAll('span')
      .forEach((span) => {
        span.hidden = span.dataset.i18n !== labelKey;
      });
    whichField.hidden = code !== 'switched';
    otherField.hidden = code !== 'other';
    if (whichField.hidden) $('which-extension').value = '';
    if (otherField.hidden) $('other-detail').value = '';
    errorReason.hidden = true;
  });

  emailInput.addEventListener('input', () => {
    errorEmail.hidden = true;
  });

  const showError = () => {
    sending = false;
    submitBtn.disabled = false;
    statusSending.hidden = true;
    statusError.hidden = false;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;

    const reason = checkedReason();
    const gate = checkSubmitGate({
      honeypot: $('hp-website').value,
      reason,
      email: emailInput.value,
      formId: FORMSPARK_FORM_ID,
      publicKey: BOTPOISON_PUBLIC_KEY,
      loadedAt,
      now: Date.now(),
    });

    if (gate === 'honeypot') {
      // Silent drop: bots see the thank-you state and learn nothing.
      form.hidden = true;
      $('thanks').hidden = false;
      return;
    }
    if (gate === 'no_reason') {
      errorReason.hidden = false;
      return;
    }
    if (gate === 'invalid_email') {
      errorEmail.hidden = false;
      return;
    }
    errorEmail.hidden = true;
    if (gate !== 'ok') {
      statusError.hidden = false;
      return;
    }

    sending = true;
    submitBtn.disabled = true;
    statusSending.hidden = false;
    statusError.hidden = true;
    errorReason.hidden = true;

    try {
      if (typeof window.Botpoison !== 'function') throw new Error('botpoison unavailable');
      const { solution } = await new window.Botpoison({ publicKey: BOTPOISON_PUBLIC_KEY }).challenge();
      const payload = buildPayload(
        {
          reason,
          whichExtension: $('which-extension').value,
          otherDetail: $('other-detail').value,
          followUp: $('follow-up').value,
          comeBack: $('come-back').value,
          email: emailInput.value,
        },
        context,
        document.documentElement.lang,
        solution
      );
      const response = await fetch(FORMSPARK_ORIGIN + '/' + encodeURIComponent(FORMSPARK_FORM_ID), {
        method: 'POST',
        credentials: 'omit',
        redirect: 'error',
        referrerPolicy: 'no-referrer',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('rejected');
      form.hidden = true;
      statusSending.hidden = true;
      $('thanks').hidden = false;
    } catch (_) {
      showError();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
