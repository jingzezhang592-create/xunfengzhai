/* 薰風齋 — 交互腳本 */
(function () {
  'use strict';

  /* ---- 導覽：滾動變色 / 深色區塊反白 / 移動端展開 ---- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.textContent = '☰';
      }
    });
  }

  var darkZones = [];
  function measureDark() {
    darkZones = [].slice.call(document.querySelectorAll('.hero, .page-hero, .band-dark'))
      .map(function (el) {
        var r = el.getBoundingClientRect();
        var top = r.top + window.pageYOffset;
        return { top: top, bottom: top + r.height };
      });
  }

  function onScroll() {
    if (!nav) return;
    var y = window.pageYOffset;
    nav.classList.toggle('solid', y > 70);

    var probe = y + 30;
    var onDark = darkZones.some(function (z) { return probe >= z.top && probe < z.bottom; });
    nav.classList.toggle('on-dark', onDark);

    spyActive(y);
  }

  /* ---- 錨點高亮 ---- */
  var spyTargets = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'))
    .map(function (a) {
      var el = document.querySelector(a.getAttribute('href'));
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  function spyActive(y) {
    if (!spyTargets.length) return;
    var current = null;
    spyTargets.forEach(function (t) {
      if (t.el.getBoundingClientRect().top + y - 140 <= y) current = t;
    });
    spyTargets.forEach(function (t) {
      t.link.classList.toggle('active', current === t);
    });
  }

  /* ---- 滾動進場 ---- */
  var revealables = [].slice.call(document.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- 七湯：懸停時盞中沫饽漸生 ---- */
  [].slice.call(document.querySelectorAll('.tang')).forEach(function (t, i) {
    var lvl = t.querySelector('.lvl');
    if (!lvl) return;
    var base = 0.16 + i * 0.12;
    lvl.style.opacity = base.toFixed(2);
    t.addEventListener('mouseenter', function () { lvl.style.opacity = '1'; });
    t.addEventListener('mouseleave', function () { lvl.style.opacity = base.toFixed(2); });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measureDark(); onScroll(); });
  window.addEventListener('load', function () { measureDark(); onScroll(); });
  measureDark();
  onScroll();
})();
