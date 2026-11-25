/* ui.js — Tương tác giao diện: menu mobile, nút theme/ngôn ngữ, scrollspy,
   trạng thái header khi cuộn, hiện dần khi cuộn, nút Tải CV (chỉ hiện khi có PDF).
   Không phụ thuộc thư viện. Mọi nội dung vẫn hiển thị nếu file này không chạy. */
(function (w, d) {
  'use strict';

  const NQV = w.NQV || {};
  const root = d.documentElement;
  const hasIO = 'IntersectionObserver' in w;

  /* ---- Header: thêm viền/bóng khi đã cuộn khỏi đầu trang -------------- */
  const header = d.querySelector('[data-site-header]');
  const sentinel = d.getElementById('top-sentinel');
  if (header && sentinel && hasIO) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  /* ---- Menu mobile ----------------------------------------------------- */
  const nav = d.getElementById('site-nav');
  const menuBtn = d.querySelector('[data-menu-toggle]');
  const desktopMq = w.matchMedia ? w.matchMedia('(min-width: 820px)') : null;

  function setMenu(open, returnFocus) {
    if (!nav || !menuBtn) return;
    nav.setAttribute('data-open', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open && returnFocus) menuBtn.focus();
  }

  if (nav && menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        setMenu(false, nav.contains(d.activeElement) || d.activeElement === menuBtn);
      }
    });

    d.addEventListener('pointerdown', function (e) {
      if (menuBtn.getAttribute('aria-expanded') === 'true' &&
          !nav.contains(e.target) && !menuBtn.contains(e.target)) {
        setMenu(false);
      }
    });

    if (desktopMq) {
      const onChange = function (e) { if (e.matches) setMenu(false); };
      if (desktopMq.addEventListener) desktopMq.addEventListener('change', onChange);
      else if (desktopMq.addListener) desktopMq.addListener(onChange);
    }
  }

  /* ---- Nút ngôn ngữ & theme -------------------------------------------- */
  d.querySelectorAll('[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (NQV.i18n) NQV.i18n.set(btn.getAttribute('data-lang'), true);
    });
  });

  const themeBtn = d.querySelector('[data-theme-toggle]');
  function syncThemeBtn() {
    if (themeBtn && NQV.theme) themeBtn.setAttribute('aria-pressed', NQV.theme.get() === 'dark' ? 'true' : 'false');
  }
  if (themeBtn && NQV.theme) {
    themeBtn.addEventListener('click', function () { NQV.theme.toggle(); });
    NQV.theme.onChange(syncThemeBtn);
    syncThemeBtn();
  }

  /* ---- Scrollspy: đánh dấu mục đang xem trên thanh điều hướng ----------- */
  const links = Array.prototype.slice.call(d.querySelectorAll('[data-nav]'));
  if (links.length && hasIO) {
    const byId = {};
    links.forEach(function (a) { byId[a.getAttribute('data-nav')] = a; });
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        const a = byId[entry.target.id];
        if (a) a.setAttribute('aria-current', 'true');
      });
    // Dải quan sát mỏng ngay dưới header: mục nào đang cắt dải này là mục hiện tại.
    }, { rootMargin: '-12% 0px -87% 0px' });
    Object.keys(byId).forEach(function (id) {
      const section = d.getElementById(id);
      if (section) spy.observe(section);
    });

    // Cuối trang (chân trang hiện đủ): đánh dấu mục cuối dù nó chưa chạm dải trên.
    const footer = d.querySelector('.site-footer');
    const last = links[links.length - 1];
    if (footer && last) {
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        last.setAttribute('aria-current', 'true');
      }, { threshold: 1 }).observe(footer);
    }
  }

  /* ---- Hiện dần khi cuộn (opacity + transform) --------------------------- */
  const items = Array.prototype.slice.call(d.querySelectorAll('[data-reveal]'));
  if (items.length && hasIO) {
    const vh = w.innerHeight || root.clientHeight;
    const pending = [];
    items.forEach(function (el) {
      // Phần tử đã nằm trong khung nhìn khi tải: hiện luôn, không nhấp nháy.
      if (el.getBoundingClientRect().top < vh * 0.9) el.classList.add('is-visible');
      else pending.push(el);
    });
    root.classList.add('reveal-ready');
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    pending.forEach(function (el) { io.observe(el); });
  }
})(window, document);
