/* theme.js — Light/Dark: theo hệ thống ở lần đầu, nhớ lựa chọn thủ công trong localStorage. */
(function (w, d) {
  'use strict';

  const KEY = 'nqv-theme';
  const root = d.documentElement;
  const mq = w.matchMedia ? w.matchMedia('(prefers-color-scheme: dark)') : null;
  const reduceMq = w.matchMedia ? w.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const BAR_COLOR = { light: '#F8FAFC', dark: '#111827' };
  const listeners = [];
  let animTimer;

  function stored() {
    try {
      const v = w.localStorage.getItem(KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch (e) { return null; }
  }

  function save(theme) {
    try { w.localStorage.setItem(KEY, theme); } catch (e) { /* bỏ qua: chế độ riêng tư */ }
  }

  function get() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }

  function apply(theme, animate) {
    if (animate && root.dataset.motionEffective!=='off') {
      root.classList.add('theme-anim');
      clearTimeout(animTimer);
      animTimer = setTimeout(function () { root.classList.remove('theme-anim'); }, 360);
    }
    root.setAttribute('data-theme', theme);
    const meta = d.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', BAR_COLOR[theme]);
    listeners.forEach(function (fn) { fn(theme); });
  }

  function set(theme, persist) {
    if (theme !== 'light' && theme !== 'dark') return;
    if (persist) save(theme);
    apply(theme, true);
  }

  function toggle() { set(get() === 'dark' ? 'light' : 'dark', true); }

  function onChange(fn) { listeners.push(fn); }

  // Chưa chọn thủ công → đi theo thay đổi của hệ thống.
  if (mq) {
    const onSystem = function (e) { if (!stored()) apply(e.matches ? 'dark' : 'light', true); };
    if (mq.addEventListener) mq.addEventListener('change', onSystem);
    else if (mq.addListener) mq.addListener(onSystem);
  }

  w.NQV = w.NQV || {};
  w.NQV.theme = { get: get, set: set, toggle: toggle, onChange: onChange };

  apply(stored() || (mq && mq.matches ? 'dark' : 'light'), false);
})(window, document);
