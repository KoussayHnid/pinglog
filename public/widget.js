/**
 * PingLog Embeddable Widget
 * Usage: <script src="https://[DOMAIN]/widget.js" data-key="[API_KEY]" async></script>
 */
(function () {
  'use strict';

  var currentScript = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var apiKey = currentScript ? currentScript.getAttribute('data-key') : null;
  var demoMode = currentScript && currentScript.getAttribute('data-demo') === 'true';
  if (!apiKey && !demoMode) {
    console.warn('[PingLog] Missing API key (data-key attribute not found).');
    return;
  }

  // Derive API host from script source
  var scriptUrl = new URL(currentScript.src, window.location.href);
  var apiBase = scriptUrl.origin;
  var demoVoted = {};

  // Generate lightweight browser fingerprint
  function getFingerprint() {
    var raw = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
    ].join('|');
    var hash = 0;
    for (var i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return 'fp_' + Math.abs(hash).toString(36);
  }

  var fingerprint = getFingerprint();
  var isOpen = false;
  var currentTab = 'changelog';
  var widgetData = null;

  // Create UI elements
  var container = document.createElement('div');
  container.id = 'pinglog-widget-root';
  container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

  // Floating trigger button
  var triggerBtn = document.createElement('button');
  triggerBtn.style.cssText = 'width:48px;height:48px;border-radius:50%;background:#4F46E5;color:#fff;border:none;box-shadow:0 4px 14px rgba(0,0,0,0.16);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform 0.2s,box-shadow 0.2s;';
  triggerBtn.setAttribute('type', 'button');
  triggerBtn.setAttribute('aria-label', 'Open PingLog changelog and roadmap');
  triggerBtn.setAttribute('aria-expanded', 'false');
  triggerBtn.setAttribute('title', 'Explore product updates');
  triggerBtn.innerHTML = '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>';

  // Floating Modal / Drawer
  var drawer = document.createElement('div');
  drawer.style.cssText = 'display:none;position:absolute;bottom:64px;right:0;width:380px;max-width:calc(100vw - 32px);height:540px;max-height:calc(100vh - 100px);background:#ffffff;border-radius:16px;box-shadow:0 12px 36px rgba(0,0,0,0.15),0 0 0 1px rgba(0,0,0,0.06);overflow:hidden;flex-direction:column;';

  container.appendChild(drawer);
  container.appendChild(triggerBtn);
  document.body.appendChild(container);

  // Fetch project data
  function loadData() {
    if (demoMode) {
      if (!widgetData) {
        widgetData = {
        project: { id: 'demo-project', name: 'Acme Cloud', accent_color: '#4F46E5' },
        changelogs: [
          {
            id: 'demo-update-1',
            category: 'New',
            published_at: '2026-11-05T12:00:00.000Z',
            title: 'A faster way to find anything',
            content: 'Search across your workspace is now instant, so you can get back to what matters.',
          },
          {
            id: 'demo-update-2',
            category: 'Improvement',
            published_at: '2026-10-28T12:00:00.000Z',
            title: 'Your dashboard, your way',
            content: 'Rearrange your dashboard widgets and keep your most important metrics close.',
          },
        ],
        feedback: [
          {
            id: 'demo-idea-1',
            title: 'Dark mode for the dashboard',
            description: 'A comfortable dark theme for late-night work.',
            status: 'Planned',
            votes_count: 38,
          },
          {
            id: 'demo-idea-2',
            title: 'Slack notifications',
            description: 'Get notified when something changes in your workspace.',
            status: 'In Progress',
            votes_count: 24,
          },
          {
            id: 'demo-idea-3',
            title: 'More export formats',
            description: 'Export reports as CSV and PDF.',
            status: 'Under Review',
            votes_count: 16,
          },
        ],
        };
      }
      triggerBtn.style.backgroundColor = widgetData.project.accent_color;
      renderContent();
      return;
    }

    fetch(apiBase + '/api/widget?key=' + encodeURIComponent(apiKey))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.project) {
          widgetData = data;
          if (data.project.accent_color) {
            triggerBtn.style.backgroundColor = data.project.accent_color;
          }
          renderContent();
        }
      })
      .catch(function (err) {
        console.error('[PingLog] Erreur lors du chargement des données:', err);
      });
  }

  function renderContent() {
    if (!widgetData) {
      drawer.innerHTML = '<div style="padding:32px;text-align:center;color:#71717a;font-size:13px;">Loading...</div>';
      return;
    }

    var p = widgetData.project;
    var changelogs = widgetData.changelogs || [];
    var feedback = widgetData.feedback || [];
    var accent = p.accent_color || '#4F46E5';
    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (character) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        }[character];
      });
    }

    var html = '';
    // Header
    html += '<div style="padding:16px;border-bottom:1px solid #f4f4f5;display:flex;align-items:center;justify-content:space-between;background:#fafafa;">';
    html += '<div style="display:flex;align-items:center;gap:8px;"><div style="width:10px;height:10px;border-radius:50%;background:' + escapeHtml(accent) + '"></div><span style="font-weight:600;font-size:14px;color:#09090b;">' + escapeHtml(p.name) + '</span></div>';
    html += '<button id="pinglog-close-btn" style="background:none;border:none;cursor:pointer;color:#a1a1aa;padding:4px;"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>';
    html += '</div>';

    // Tabs
    html += '<div style="display:flex;border-bottom:1px solid #f4f4f5;background:#ffffff;">';
    html += '<button id="tab-changelog" style="flex:1;padding:10px;font-size:12px;font-weight:600;border:none;background:none;cursor:pointer;border-bottom:2px solid ' + escapeHtml(currentTab === 'changelog' ? accent : 'transparent') + ';color:' + (currentTab === 'changelog' ? '#09090b' : '#71717a') + '">Changelog (' + changelogs.length + ')</button>';
    html += '<button id="tab-feedback" style="flex:1;padding:10px;font-size:12px;font-weight:600;border:none;background:none;cursor:pointer;border-bottom:2px solid ' + escapeHtml(currentTab === 'feedback' ? accent : 'transparent') + ';color:' + (currentTab === 'feedback' ? '#09090b' : '#71717a') + '">Ideas & Roadmap (' + feedback.length + ')</button>';
    html += '</div>';

    // Body
    html += '<div style="flex:1;overflow-y:auto;padding:16px;">';
    if (currentTab === 'changelog') {
      if (changelogs.length === 0) {
        html += '<div style="text-align:center;padding:32px 0;color:#71717a;font-size:12px;">No updates published yet.</div>';
      } else {
        changelogs.forEach(function (c) {
          var badgeBg = c.category === 'Fix' ? '#ecfdf5' : c.category === 'Improvement' ? '#f5f3ff' : '#eff6ff';
          var badgeColor = c.category === 'Fix' ? '#047857' : c.category === 'Improvement' ? '#6d28d9' : '#1d4ed8';

          html += '<div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #f4f4f5;">';
          html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">';
          html += '<span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:12px;background:' + badgeBg + ';color:' + badgeColor + '">' + escapeHtml(c.category) + '</span>';
          html += '<span style="font-size:11px;color:#a1a1aa;">' + (c.published_at ? new Date(c.published_at).toLocaleDateString() : '') + '</span>';
          html += '</div>';
          html += '<div style="font-size:13px;font-weight:600;color:#09090b;margin-bottom:4px;">' + escapeHtml(c.title) + '</div>';
          html += '<div style="font-size:12px;color:#52525b;line-height:1.5;white-space:pre-wrap;">' + escapeHtml(c.content) + '</div>';
          html += '</div>';
        });
      }
    } else {
      // Feedback tab
      html += '<div style="margin-bottom:16px;padding:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">';
      html += '<div style="font-size:12px;font-weight:600;color:#0f172a;margin-bottom:6px;">Suggest an idea</div>';
      html += '<input id="pinglog-fb-title" placeholder="Your idea title..." style="width:100%;box-sizing:border-box;padding:8px 10px;font-size:12px;border:1px solid #cbd5e1;border-radius:6px;margin-bottom:6px;outline:none;" />';
      html += '<textarea id="pinglog-fb-desc" rows="2" placeholder="Short description (optional)..." style="width:100%;box-sizing:border-box;padding:8px 10px;font-size:12px;border:1px solid #cbd5e1;border-radius:6px;margin-bottom:8px;outline:none;resize:none;"></textarea>';
      html += '<button id="pinglog-fb-submit" style="width:100%;padding:7px;background:' + escapeHtml(accent) + ';color:#ffffff;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">Submit idea</button>';
      html += '</div>';

      if (feedback.length === 0) {
        html += '<div style="text-align:center;padding:24px 0;color:#71717a;font-size:12px;">Be the first to suggest an idea!</div>';
      } else {
        feedback.forEach(function (f) {
          var statusBg = f.status === 'Completed' ? '#ecfdf5' : f.status === 'In Progress' ? '#f0f9ff' : f.status === 'Planned' ? '#fff7ed' : '#fefce8';
          var statusColor = f.status === 'Completed' ? '#047857' : f.status === 'In Progress' ? '#0284c7' : f.status === 'Planned' ? '#c2410c' : '#a16207';

          html += '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;padding:10px;border:1px solid #f4f4f5;border-radius:10px;background:#fff;">';
          html += '<button class="pinglog-vote-btn" data-id="' + escapeHtml(f.id) + '" style="display:flex;flex-direction:column;align-items:center;min-width:38px;padding:6px 4px;border:1px solid #e4e4e7;border-radius:8px;background:#fafafa;cursor:pointer;">';
          html += '<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>';
          html += '<span style="font-size:11px;font-weight:700;color:#18181b;margin-top:2px;">' + (f.votes_count || 0) + '</span>';
          html += '</button>';

          html += '<div style="flex:1;">';
          html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:4px;">';
          html += '<span style="font-size:12px;font-weight:600;color:#09090b;">' + escapeHtml(f.title) + '</span>';
          html += '<span style="font-size:9px;font-weight:600;padding:2px 6px;border-radius:8px;background:' + statusBg + ';color:' + statusColor + '">' + escapeHtml(f.status) + '</span>';
          html += '</div>';
          if (f.description) {
            html += '<div style="font-size:11px;color:#71717a;line-height:1.4;">' + escapeHtml(f.description) + '</div>';
          }
          html += '</div>';
          html += '</div>';
        });
      }
    }
    html += '</div>';

    // Free plans include PingLog attribution; Pro plans are fully white-label.
    if (widgetData.plan !== 'pro') {
      html += '<div style="padding:8px;text-align:center;border-top:1px solid #f4f4f5;font-size:10px;color:#a1a1aa;background:#fafafa;">Powered by <a href="https://pinglog.io" target="_blank" rel="noopener noreferrer" style="color:#4F46E5;text-decoration:none;font-weight:600;">PingLog</a></div>';
    }

    drawer.innerHTML = html;

    // Attach events
    var closeBtn = document.getElementById('pinglog-close-btn');
    if (closeBtn) closeBtn.onclick = toggleDrawer;

    var tabC = document.getElementById('tab-changelog');
    if (tabC) tabC.onclick = function () { currentTab = 'changelog'; renderContent(); };

    var tabF = document.getElementById('tab-feedback');
    if (tabF) tabF.onclick = function () { currentTab = 'feedback'; renderContent(); };

    var submitBtn = document.getElementById('pinglog-fb-submit');
    if (submitBtn) {
      submitBtn.onclick = function () {
        var titleEl = document.getElementById('pinglog-fb-title');
        var descEl = document.getElementById('pinglog-fb-desc');
        var title = titleEl ? titleEl.value.trim() : '';
        var desc = descEl ? descEl.value.trim() : '';

        if (!title) {
          alert('Please enter a title for your idea.');
          return;
        }

        if (demoMode) {
          widgetData.feedback.unshift({
            id: 'demo-idea-' + Date.now(),
            title: title,
            description: desc,
            status: 'Under Review',
            votes_count: 0,
          });
          renderContent();
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';

        fetch(apiBase + '/api/widget?key=' + encodeURIComponent(apiKey), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'submit_feedback', title: title, description: desc }),
        })
          .then(function (res) { return res.json(); })
          .then(function () {
            loadData();
          })
          .catch(function () {
            alert('Erreur lors de l\'envoi de la suggestion.');
            submitBtn.disabled = false;
            submitBtn.innerText = 'Submit idea';
          });
      };
    }

    var voteBtns = drawer.querySelectorAll('.pinglog-vote-btn');
    voteBtns.forEach(function (btn) {
      btn.onclick = function () {
        var fid = btn.getAttribute('data-id');
        if (demoMode) {
          var item = widgetData.feedback.find(function (entry) { return entry.id === fid; });
          if (item) {
            var hasVoted = Boolean(demoVoted[fid]);
            item.votes_count = Math.max(0, item.votes_count + (hasVoted ? -1 : 1));
            demoVoted[fid] = !hasVoted;
            renderContent();
          }
          return;
        }

        fetch(apiBase + '/api/widget?key=' + encodeURIComponent(apiKey), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'vote', feedback_id: fid, voter_fingerprint: fingerprint }),
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            if (data.error) {
              alert(data.error);
            } else {
              loadData();
            }
          });
      };
    });
  }

  function toggleDrawer() {
    isOpen = !isOpen;
    drawer.style.display = isOpen ? 'flex' : 'none';
    triggerBtn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      loadData();
    }
  }

  triggerBtn.onclick = toggleDrawer;

  // Initial load
  loadData();
})();
