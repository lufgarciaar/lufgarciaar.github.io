/* ---------------------------------------------------------------------------
 * Portfolio — theme toggle, scroll spy, lightbox gallery.
 * No dependencies, no build step.
 * ------------------------------------------------------------------------ */
(function () {
  'use strict';

  /* --- Theme toggle ------------------------------------------------------ */
  /* The theme is applied in <head> before first paint; this only handles the
     switch and remembers the choice. Storage can throw in private mode, so
     every access is guarded. */

  function initTheme() {
    var button = document.getElementById('theme-toggle');
    if (!button) return;

    var root = document.documentElement;

    button.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');

      if (!current) {
        // No explicit choice yet — flip away from whatever the OS prefers.
        var prefersDark = window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        current = prefersDark ? 'dark' : 'light';
      }

      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);

      try {
        localStorage.setItem('theme', next);
      } catch (e) { /* nothing to do — the choice just won't persist */ }
    });
  }

  /* --- Scroll spy -------------------------------------------------------- */
  /* Highlights the nav link for whichever section is currently in view. */

  function initScrollSpy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.nav__links a[href^="#"]')
    );
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) {
        byId[id] = link;
        sections.push(section);
      }
    });

    var visible = {};

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });

      // The topmost visible section wins, so the highlight never flickers
      // between two sections that overlap the viewport.
      var active = null;
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) { active = sections[i].id; break; }
      }

      links.forEach(function (link) { link.classList.remove('is-active'); });
      if (active && byId[active]) byId[active].classList.add('is-active');
    }, {
      // Trigger around the middle of the viewport, below the sticky header.
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* --- Lightbox gallery -------------------------------------------------- */

  function initLightbox() {
    var box = document.getElementById('lightbox');
    if (!box) return;

    var img      = document.getElementById('lightbox-img');
    var title    = document.getElementById('lightbox-title');
    var caption  = document.getElementById('lightbox-caption');
    var counter  = document.getElementById('lightbox-counter');
    var prevBtn  = box.querySelector('[data-prev]');
    var nextBtn  = box.querySelector('[data-next]');
    var closeBtn = box.querySelector('.lightbox__close');

    var items = [];
    var index = 0;
    var opener = null;   // element focus returns to on close

    function show(i) {
      if (!items.length) return;

      // Wrap around, so the arrows always do something.
      index = (i + items.length) % items.length;
      var item = items[index];

      img.src = item.src;
      img.alt = item.alt || '';
      caption.textContent = item.caption || '';
      counter.textContent = (index + 1) + ' / ' + items.length;

      var single = items.length < 2;
      prevBtn.disabled = single;
      nextBtn.disabled = single;
    }

    function open(button) {
      var nodes = button.querySelectorAll('.card__gallery-data span');
      if (!nodes.length) return;

      items = Array.prototype.map.call(nodes, function (node) {
        return {
          src: node.getAttribute('data-src'),
          alt: node.getAttribute('data-alt'),
          caption: node.getAttribute('data-caption')
        };
      });

      opener = button;
      title.textContent = button.getAttribute('data-title') || '';
      show(0);

      box.hidden = false;
      document.body.classList.add('is-locked');
      closeBtn.focus();
    }

    function close() {
      box.hidden = true;
      document.body.classList.remove('is-locked');
      // Release the image so a large file isn't held in memory.
      img.src = '';
      items = [];

      if (opener) { opener.focus(); opener = null; }
    }

    document.querySelectorAll('[data-gallery]').forEach(function (button) {
      button.addEventListener('click', function () { open(button); });
    });

    box.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });

    prevBtn.addEventListener('click', function () { show(index - 1); });
    nextBtn.addEventListener('click', function () { show(index + 1); });

    document.addEventListener('keydown', function (event) {
      if (box.hidden) return;

      if (event.key === 'Escape')     { close(); }
      else if (event.key === 'ArrowLeft')  { show(index - 1); }
      else if (event.key === 'ArrowRight') { show(index + 1); }
      else if (event.key === 'Tab')   { trapFocus(event); }
    });

    // Keeps keyboard focus inside the dialog while it is open.
    function trapFocus(event) {
      var focusable = box.querySelectorAll(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  /* --- Go ---------------------------------------------------------------- */

  initTheme();
  initScrollSpy();
  initLightbox();
})();
