/* Arjun R — interaction layer. No ambient animation or third-party motion runtime. */

(function () {
  'use strict';

  var root = document.documentElement;
  var storageKey = 'portfolio-theme';
  var resumeViews = {
    executive: {
      label: 'Executive CV',
      source: 'assets/resume.html',
      download: 'assets/resume.pdf',
      filename: 'Arjun_R_Resume.pdf'
    },
    ats: {
      label: 'ATS CV',
      source: 'assets/resume-ats.html',
      download: 'assets/resume-ats.pdf',
      filename: 'Arjun_R_Resume_ATS.pdf'
    }
  };

  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  function syncThemeControls() {
    var dark = root.classList.contains('dark');
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      button.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
      button.setAttribute('aria-pressed', String(dark));
    });
    document.querySelectorAll('[data-theme-icon]').forEach(function (icon) {
      icon.setAttribute('href', dark ? '#icon-sun' : '#icon-moon');
    });
    var themeColor = document.getElementById('theme-color');
    if (themeColor) themeColor.setAttribute('content', dark ? '#121210' : '#f4f1eb');
  }

  function setTheme(theme, persist) {
    var dark = theme === 'dark';
    root.classList.toggle('dark', dark);
    root.classList.toggle('light', !dark);
    if (persist) {
      try { localStorage.setItem(storageKey, dark ? 'dark' : 'light'); } catch (error) {}
    }
    syncThemeControls();
  }

  function initTheme() {
    syncThemeControls();
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        setTheme(root.classList.contains('dark') ? 'light' : 'dark', true);
      });
    });

    var media = window.matchMedia('(prefers-color-scheme: dark)');
    var followSystemTheme = function (event) {
      var saved = null;
      try { saved = localStorage.getItem(storageKey); } catch (error) {}
      if (!saved) setTheme(event.matches ? 'dark' : 'light', false);
    };
    if (typeof media.addEventListener === 'function') media.addEventListener('change', followSystemTheme);
  }

  function initMobileNavigation() {
    var button = document.getElementById('mobile-menu-button');
    var nav = document.getElementById('site-nav');
    if (!button || !nav) return;

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      var icon = button.querySelector('[data-menu-icon]');
      if (icon) icon.setAttribute('href', open ? '#icon-close' : '#icon-menu');
    }

    button.addEventListener('click', function () {
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        button.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (button.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var sections = links.map(function (link) {
      return document.getElementById(link.getAttribute('data-nav'));
    }).filter(Boolean);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          if (link.getAttribute('data-nav') === entry.target.id) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-18% 0px -66% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function normalize(value) {
    return String(value || '').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  }

  function initProjectFilters() {
    var input = document.getElementById('project-search');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var projects = Array.prototype.slice.call(document.querySelectorAll('[data-project]'));
    if (!input || !buttons.length || !projects.length) return;

    var activeCategory = 'all';
    var featured = document.getElementById('featured-projects');
    var archive = document.getElementById('project-archive');
    var archiveCount = document.getElementById('archive-count');
    var resultsCount = document.getElementById('project-results-count');
    var emptyState = document.getElementById('no-project-results');
    var searchIndex = new WeakMap();
    projects.forEach(function (project) {
      searchIndex.set(project, normalize(project.getAttribute('data-search') + ' ' + project.textContent));
    });

    function applyFilters() {
      var query = normalize(input.value);
      var visibleCount = 0;
      var visibleFeatured = 0;
      var visibleArchive = 0;

      projects.forEach(function (project) {
        var categories = (project.getAttribute('data-category') || '').split(' ');
        var categoryMatch = activeCategory === 'all' || categories.indexOf(activeCategory) !== -1;
        var searchMatch = !query || searchIndex.get(project).indexOf(query) !== -1;
        var visible = categoryMatch && searchMatch;
        project.hidden = !visible;
        if (!visible) return;
        visibleCount += 1;
        if (project.classList.contains('case-study')) visibleFeatured += 1;
        if (project.classList.contains('archive-row')) visibleArchive += 1;
      });

      if (featured) featured.hidden = visibleFeatured === 0;
      if (archive) archive.hidden = visibleArchive === 0;
      if (archiveCount) archiveCount.textContent = visibleArchive + (visibleArchive === 1 ? ' entry' : ' entries');
      if (resultsCount) resultsCount.textContent = visibleCount + ' / ' + projects.length + ' systems';
      if (emptyState) emptyState.hidden = visibleCount !== 0;
    }

    function setCategory(category) {
      activeCategory = category;
      buttons.forEach(function (button) {
        button.setAttribute('aria-pressed', String(button.getAttribute('data-filter') === category));
      });
      applyFilters();
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        setCategory(button.getAttribute('data-filter') || 'all');
      });
    });
    input.addEventListener('input', applyFilters);

    document.querySelectorAll('[data-clear-filters]').forEach(function (button) {
      button.addEventListener('click', function () {
        input.value = '';
        setCategory('all');
        input.focus();
      });
    });

    window.filterProjects = setCategory;
    applyFilters();
  }

  function openDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.classList.add('dialog-open');
  }

  function closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  function syncDialogBodyState() {
    document.body.classList.toggle('dialog-open', Boolean(document.querySelector('dialog[open]')));
  }

  function closeOnBackdrop(dialog) {
    dialog.addEventListener('click', function (event) {
      if (event.target !== dialog) return;
      var rect = dialog.getBoundingClientRect();
      var outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) closeDialog(dialog);
    });
    dialog.addEventListener('close', syncDialogBodyState);
    dialog.addEventListener('cancel', function () {
      window.requestAnimationFrame(syncDialogBodyState);
    });
  }

  function ensureResumeDialog() {
    var dialog = document.getElementById('resume-dialog');
    if (dialog) return dialog;
    document.body.insertAdjacentHTML('beforeend',
      '<dialog id="resume-dialog" class="dialog cv-dialog" aria-labelledby="resume-dialog-title">' +
        '<div class="dialog-panel">' +
          '<div class="dialog-header">' +
            '<div class="dialog-heading"><p class="dialog-kicker">Document viewer / Arjun R</p><h2 id="resume-dialog-title" class="dialog-title">Curriculum Vitae</h2></div>' +
            '<div class="dialog-controls">' +
              '<a id="resume-download" class="dialog-action" href="assets/resume.pdf" download="Arjun_R_Resume.pdf" aria-label="Download CV PDF"><svg class="inline-icon" aria-hidden="true"><use href="#icon-download"></use></svg><span>Download</span></a>' +
              '<a id="resume-open-tab" class="dialog-action" href="assets/resume.html" target="_blank" rel="noopener noreferrer" aria-label="Open CV in a new tab"><svg class="inline-icon" aria-hidden="true"><use href="#icon-external"></use></svg><span>New tab</span></a>' +
              '<button class="dialog-action dialog-close" type="button" data-close-resume aria-label="Close curriculum vitae"><svg class="inline-icon" aria-hidden="true"><use href="#icon-close"></use></svg></button>' +
            '</div>' +
          '</div>' +
          '<div class="cv-tabs" role="tablist" aria-label="Curriculum vitae format">' +
            '<button id="resume-tab-executive" class="cv-tab" type="button" role="tab" data-resume-tab="executive" aria-selected="true" aria-controls="resume-panel">Executive</button>' +
            '<button id="resume-tab-ats" class="cv-tab" type="button" role="tab" data-resume-tab="ats" aria-selected="false" aria-controls="resume-panel" tabindex="-1">ATS / Plain</button>' +
          '</div>' +
          '<div id="resume-panel" class="cv-stage" role="tabpanel" aria-labelledby="resume-tab-executive"></div>' +
        '</div>' +
      '</dialog>'
    );
    dialog = document.getElementById('resume-dialog');
    closeOnBackdrop(dialog);
    dialog.querySelector('[data-close-resume]').addEventListener('click', function () { closeDialog(dialog); });
    dialog.addEventListener('close', function () {
      var panel = document.getElementById('resume-panel');
      if (panel) panel.replaceChildren();
    });

    var tabs = Array.prototype.slice.call(dialog.querySelectorAll('[data-resume-tab]'));
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { switchResumeView(tab.getAttribute('data-resume-tab')); });
      tab.addEventListener('keydown', function (event) {
        var nextIndex = null;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        tabs[nextIndex].focus();
        switchResumeView(tabs[nextIndex].getAttribute('data-resume-tab'));
      });
    });
    return dialog;
  }

  function switchResumeView(viewName) {
    var view = resumeViews[viewName] || resumeViews.executive;
    var normalizedName = resumeViews[viewName] ? viewName : 'executive';
    var dialog = ensureResumeDialog();
    var panel = document.getElementById('resume-panel');
    var activeTab = document.getElementById('resume-tab-' + normalizedName);

    dialog.querySelectorAll('[data-resume-tab]').forEach(function (tab) {
      var selected = tab === activeTab;
      tab.setAttribute('aria-selected', String(selected));
      tab.setAttribute('tabindex', selected ? '0' : '-1');
    });
    panel.setAttribute('aria-labelledby', activeTab.id);
    document.getElementById('resume-dialog-title').textContent = 'Curriculum Vitae / ' + view.label;

    var download = document.getElementById('resume-download');
    download.href = view.download;
    download.setAttribute('download', view.filename);
    download.setAttribute('aria-label', 'Download ' + view.label + ' PDF');
    var openTab = document.getElementById('resume-open-tab');
    openTab.href = view.source;
    openTab.setAttribute('aria-label', 'Open ' + view.label + ' in a new tab');

    if (panel.getAttribute('data-view') !== normalizedName || !panel.firstChild) {
      var frame = document.createElement('iframe');
      frame.className = 'cv-frame';
      frame.title = 'Arjun R — ' + view.label;
      frame.src = view.source;
      panel.replaceChildren(frame);
      panel.setAttribute('data-view', normalizedName);
    }
  }

  function openResumeModal(viewName) {
    var dialog = ensureResumeDialog();
    switchResumeView(viewName || 'executive');
    openDialog(dialog);
  }

  function initResumeModal() {
    if (!document.querySelector('[data-resume]')) return;
    ensureResumeDialog();
    document.querySelectorAll('[data-resume]').forEach(function (button) {
      button.addEventListener('click', function () {
        openResumeModal(button.getAttribute('data-resume') || 'executive');
      });
    });
    window.openResumeModal = openResumeModal;
    window.closeResumeModal = function () { closeDialog(document.getElementById('resume-dialog')); };
    window.switchCvModalTab = switchResumeView;
  }

  function ensurePreviewDialog() {
    var dialog = document.getElementById('project-preview-dialog');
    if (dialog) return dialog;
    document.body.insertAdjacentHTML('beforeend',
      '<dialog id="project-preview-dialog" class="dialog preview-dialog" aria-labelledby="project-preview-title">' +
        '<div class="dialog-panel">' +
          '<div class="dialog-header">' +
            '<div class="dialog-heading"><p class="dialog-kicker">On-demand project preview</p><h2 id="project-preview-title" class="dialog-title">Project preview</h2></div>' +
            '<div class="dialog-controls">' +
              '<a id="preview-open-tab" class="dialog-action" href="#" target="_blank" rel="noopener noreferrer"><svg class="inline-icon" aria-hidden="true"><use href="#icon-external"></use></svg><span>New tab</span></a>' +
              '<button class="dialog-action dialog-close" type="button" data-close-preview aria-label="Close project preview"><svg class="inline-icon" aria-hidden="true"><use href="#icon-close"></use></svg></button>' +
            '</div>' +
          '</div>' +
          '<div id="project-preview-stage" class="preview-stage"></div>' +
        '</div>' +
      '</dialog>'
    );
    dialog = document.getElementById('project-preview-dialog');
    closeOnBackdrop(dialog);
    dialog.querySelector('[data-close-preview]').addEventListener('click', function () { closeDialog(dialog); });
    dialog.addEventListener('close', function () {
      document.getElementById('project-preview-stage').replaceChildren();
    });
    return dialog;
  }

  function initProjectPreviews() {
    var triggers = document.querySelectorAll('[data-preview]');
    if (!triggers.length) return;
    var dialog = ensurePreviewDialog();
    var stage = document.getElementById('project-preview-stage');
    var title = document.getElementById('project-preview-title');
    var openTab = document.getElementById('preview-open-tab');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var url = trigger.getAttribute('data-preview-url');
        var type = trigger.getAttribute('data-preview-type') === 'image' ? 'image' : 'iframe';
        if (!url) return;
        title.textContent = trigger.getAttribute('data-preview-title') || 'Project preview';
        openTab.href = url;
        openTab.setAttribute('aria-label', 'Open ' + title.textContent + ' in a new tab');
        stage.replaceChildren();

        if (type === 'image') {
          var image = document.createElement('img');
          image.src = url;
          image.alt = title.textContent;
          stage.appendChild(image);
        } else {
          var frame = document.createElement('iframe');
          frame.src = url;
          frame.title = title.textContent;
          frame.setAttribute('allowfullscreen', '');
          frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          stage.appendChild(frame);
        }
        openDialog(dialog);
      });
    });
  }

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(value);
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        if (document.execCommand('copy')) resolve();
        else reject(new Error('Copy unavailable'));
      } catch (error) {
        reject(error);
      } finally {
        textarea.remove();
      }
    });
  }

  function initContactTools() {
    var clock = document.querySelector('[data-live-clock]');
    if (clock) {
      var formatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
      var updateClock = function () { clock.textContent = formatter.format(new Date()) + ' IST'; };
      updateClock();
      window.setInterval(updateClock, 1000);
    }

    document.querySelectorAll('[data-copy]').forEach(function (button) {
      var timer = null;
      button.addEventListener('click', function () {
        var status = document.querySelector(button.getAttribute('data-copy-status'));
        var value = button.getAttribute('data-copy') || '';
        copyText(value).then(function () {
          button.textContent = 'Copied';
          if (status) status.textContent = button.getAttribute('data-copy-label') + ' copied to clipboard.';
          window.clearTimeout(timer);
          timer = window.setTimeout(function () {
            button.textContent = 'Copy';
            if (status) status.textContent = '';
          }, 2500);
        }).catch(function () {
          if (status) status.textContent = 'Copy failed. Select the value manually.';
        });
      });
    });

    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = document.getElementById('form-status');
    var whatsappButton = document.getElementById('whatsapp-button');

    function getData() {
      var data = new FormData(form);
      return {
        name: String(data.get('name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        subject: String(data.get('subject') || '').trim() || 'Portfolio engineering inquiry',
        message: String(data.get('message') || '').trim()
      };
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = getData();
      var body = 'From: ' + data.name + ' (' + data.email + ')\n\n' + data.message;
      window.location.href = 'mailto:arjunrthedeveloper@gmail.com?subject=' + encodeURIComponent(data.subject) + '&body=' + encodeURIComponent(body);
      if (status) status.textContent = 'Your email client should now be open with the message prepared.';
    });

    if (whatsappButton) {
      whatsappButton.addEventListener('click', function () {
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        var data = getData();
        var message = 'Portfolio inquiry\nName: ' + data.name + '\nEmail: ' + data.email + '\nSubject: ' + data.subject + '\n\n' + data.message;
        window.open('https://wa.me/918921843248?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
        if (status) status.textContent = 'WhatsApp opened with the message prepared.';
      });
    }
  }

  onReady(function () {
    initTheme();
    initMobileNavigation();
    initScrollSpy();
    initProjectFilters();
    initResumeModal();
    initProjectPreviews();
    initContactTools();
  });
})();
