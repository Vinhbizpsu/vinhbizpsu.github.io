/* i18n.js — Chuyển ngôn ngữ VI/EN. Mặc định VI; lựa chọn được nhớ trong localStorage.
   Dùng: data-i18n="khóa" (đổi textContent) và data-i18n-attr="aria-label:khóa;title:khóa". */
(function (w, d) {
  'use strict';

  const KEY = 'nqv-lang';
  const LANGS = ['vi', 'en'];
  const DEFAULT = 'vi';
  const strings = w.NQV_STRINGS || {};
  const listeners = [];
  let current = DEFAULT;

  function stored() {
    try {
      const v = w.localStorage.getItem(KEY);
      return LANGS.indexOf(v) > -1 ? v : null;
    } catch (e) { return null; }
  }

  function save(lang) {
    try { w.localStorage.setItem(KEY, lang); } catch (e) { /* bỏ qua */ }
  }

  function t(key) {
    const own = strings[current] && strings[current][key];
    if (own != null) return own;
    const fallback = strings[DEFAULT] && strings[DEFAULT][key];
    return fallback != null ? fallback : '';
  }

  function apply() {
    d.documentElement.lang = current;

    d.querySelectorAll('[data-i18n]').forEach(function (el) {
      const text = t(el.getAttribute('data-i18n'));
      if (text) el.textContent = text;
    });

    d.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        const i = pair.indexOf(':');
        if (i < 1) return;
        const text = t(pair.slice(i + 1).trim());
        if (text) el.setAttribute(pair.slice(0, i).trim(), text);
      });
    });

    d.title = t('meta.title') || d.title;
    const desc = d.querySelector('meta[name="description"]');
    if (desc && t('meta.description')) desc.setAttribute('content', t('meta.description'));

    d.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === current ? 'true' : 'false');
    });

    listeners.forEach(function (fn) { fn(current); });
  }

  function set(lang, persist) {
    if (LANGS.indexOf(lang) < 0) return;
    current = lang;
    if (persist) save(lang);
    apply();
  }

  function get() { return current; }
  function onChange(fn) { listeners.push(fn); }

  w.NQV = w.NQV || {};
  w.NQV.i18n = { t: t, get: get, set: set, onChange: onChange };

  current = stored() || DEFAULT;
  apply();
})(window, document);
