// TailBook HQ front end. Plain JS, no dependencies.
(() => {
  'use strict';

  // ---------- helpers ----------
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const LONG_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const parseDay = (s) => { const [y, m, d] = String(s).slice(0, 10).split('-').map(Number); return new Date(y, m - 1, d); };
  const today = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
  const daysUntil = (s) => Math.round((parseDay(s) - today()) / 86400000);
  const shortDate = (s) => { const d = parseDay(s); return `${MONTHS[d.getMonth()]} ${d.getDate()}`; };
  const inDays = (n) => (n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n === -1 ? 'Yesterday' : n > 0 ? `In ${n} days` : `${-n} days ago`);

  function ago(iso) {
    if (!iso) return '';
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 45) return 'just now';
    if (s < 3600) return `${Math.round(s / 60)}m ago`;
    if (s < 86400) return `${Math.round(s / 3600)}h ago`;
    const d = Math.round(s / 86400);
    if (d < 7) return `${d}d ago`;
    const dt = new Date(iso);
    return `${MONTHS[dt.getMonth()]} ${dt.getDate()}`;
  }
  const clock = (iso) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const kb = (n) => (n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`);
  const plural = (n, w, p = `${w}s`) => `${n} ${n === 1 ? w : p}`;

  function prettyName(file) {
    const base = file.replace(/\.[^.]+$/, '').replace(/^\d+[-_ ]+/, '').replace(/[-_]+/g, ' ').trim();
    return base ? base[0].toUpperCase() + base.slice(1) : file;
  }
  const niceThreshold = (t) => String(t || '')
    .replace(/>=/g, '≥').replace(/<=/g, '≤')
    .replace(/(\d{4})-(\d{2})-(\d{2})/g, (m) => shortDate(m));

  // ---------- icons ----------
  const P = {
    overview: '<path d="M3.5 10.2 12 3.5l8.5 6.7"/><path d="M5.5 8.8V20h13V8.8"/><path d="M10 20v-5.5h4V20"/>',
    team: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 19.5c.8-3.3 3.3-5.2 6.2-5.2s5.4 1.9 6.2 5.2"/><path d="M15.6 4.8a3.4 3.4 0 0 1 0 6.5"/><path d="M18 14.6c1.8.7 2.9 2.3 3.3 4.9"/>',
    metrics: '<path d="M4 20V11"/><path d="M10 20V5"/><path d="M16 20v-6"/><path d="M21 20H3"/>',
    library: '<path d="M4.5 5A1.5 1.5 0 0 1 6 3.5h13v14H6A1.5 1.5 0 0 0 4.5 19z"/><path d="M4.5 19A1.5 1.5 0 0 0 6 20.5h13"/><path d="M9 8h6"/>',
    activity: '<path d="M21.5 12h-4l-3 8-5-16-3 8h-4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.6A8.2 8.2 0 1 1 9.4 4a6.6 6.6 0 0 0 10.6 10.6z"/>',
    check: '<path d="M5 12.5 9.5 17 19 7.5"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    doc: '<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5"/><path d="M8.5 13h7M8.5 16.5h5"/>',
    sheet: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9.5h16M4 14.5h16M10 9.5V20"/>',
    code: '<path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m13.5 5-3 14"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m20.5 16-5-5-9 8.5"/>',
    search: '<circle cx="11" cy="11" r="6.8"/><path d="m20 20-4-4"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    save: '<path d="M5 12.5 9.5 17 19 7.5"/>',
    research: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9z"/>',
    design: '<path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    marketing: '<path d="M3.5 10.5v3a1 1 0 0 0 1 1H7l5.5 4.5v-14L7 9.5H4.5a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.8 6.3a8 8 0 0 1 0 11.4"/>',
    sales: '<rect x="3" y="7.5" width="18" height="12.5" rx="2.2"/><path d="M8.5 7.5V5.8A1.8 1.8 0 0 1 10.3 4h3.4a1.8 1.8 0 0 1 1.8 1.8v1.7"/><path d="M3 12.5h18"/>',
    ios: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.8"/><path d="M10.5 18.5h3"/>',
    web: '<rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M8 20.5h8M12 16.5v4"/>',
    growth: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    plane: '<path d="M10.5 21v-2l2-1.5V13l-9 2.5v-2L12.5 8V4.5a1.5 1.5 0 0 1 3 0V8l9 5.5v2l-9-2.5v4.5l2 1.5v2l-3.5-1z" transform="translate(-2 0)"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
  };
  const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || P.doc}</svg>`;
  const TEAM_ICON = { research: 'research', design: 'design', marketing: 'marketing', sales: 'sales', ios: 'ios', web: 'web', growth: 'growth' };
  const STATUS_LABEL = { working: 'Working', done: 'Done', blocked: 'Blocked', queued: 'Queued' };

  // ---------- state ----------
  const state = {
    status: null, metrics: null, files: null, git: null,
    lastSync: null, online: true, showAllTodos: false,
    week: null, drafts: {}, docCache: new Map(), libQuery: '', libExpanded: {},
  };

  const VIEWS = [
    { id: 'overview', label: 'Overview' },
    { id: 'team', label: 'Team' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'library', label: 'Library' },
    { id: 'activity', label: 'Activity' },
  ];

  // ---------- API ----------
  async function api(path, opts) {
    const res = await fetch(path, { cache: 'no-store', ...opts });
    let data = null;
    try { data = await res.json(); } catch { /* ignore */ }
    if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
    return data;
  }
  const post = (path, body) => api(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  async function refresh({ force = false } = {}) {
    const results = await Promise.allSettled([api('/api/status'), api('/api/metrics'), api('/api/files'), api('/api/git')]);
    const [s, m, f, g] = results;
    if (s.status === 'fulfilled') state.status = s.value;
    if (m.status === 'fulfilled') state.metrics = m.value;
    if (f.status === 'fulfilled') state.files = f.value;
    if (g.status === 'fulfilled') state.git = g.value;
    state.online = results.some((r) => r.status === 'fulfilled');
    if (state.online) state.lastSync = Date.now();
    updateLive(true);
    if (!state.status) { renderError(s.reason); return; }
    // Don't yank the page out from under someone who is typing.
    const active = document.activeElement;
    if (!force && active && active.closest('main') && /INPUT|TEXTAREA|SELECT/.test(active.tagName)) return;
    render({ soft: !force });
  }

  function updateLive(flash) {
    const el = $('#live');
    const t = $('#live-text');
    if (!state.online) { el.classList.add('is-stale'); t.textContent = 'Offline, retrying'; return; }
    el.classList.remove('is-stale');
    t.textContent = state.lastSync ? `Synced ${ago(new Date(state.lastSync).toISOString())}` : 'Live';
    if (flash) { el.classList.remove('is-flash'); void el.offsetWidth; el.classList.add('is-flash'); }
  }

  // ---------- routing ----------
  function route() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const [head, ...rest] = h.split('/');
    let view = VIEWS.find((v) => v.id === head.split('?')[0]) ? head.split('?')[0] : 'overview';
    const q = new URLSearchParams(h.includes('?') ? h.slice(h.indexOf('?') + 1) : '');
    const docPath = view === 'library' ? rest.join('/').split('?')[0] : '';
    return { view, docPath, dept: q.get('d') || '' };
  }

  function renderNav(view) {
    const items = VIEWS.map((v) => `<a class="tab" href="#/${v.id}" ${v.id === view ? 'aria-current="page"' : ''}>${icon(v.id)}<span>${v.label}</span></a>`).join('');
    $('#tabs').innerHTML = items;
    $('#bottombar').innerHTML = VIEWS.map((v) => `<a href="#/${v.id}" ${v.id === view ? 'aria-current="page"' : ''}>${icon(v.id)}<span>${v.label}</span></a>`).join('');
  }

  let lastView = null;
  function render({ soft = false } = {}) {
    const r = route();
    renderNav(r.view);
    const main = $('#main');
    const changed = lastView !== r.view;
    const scroll = window.scrollY;
    const html = ({ overview: viewOverview, team: viewTeam, metrics: viewMetrics, library: viewLibrary, activity: viewActivity })[r.view](r);
    main.innerHTML = `<div class="view${soft && !changed ? ' no-anim' : ''}">${html}</div>`;
    if (soft && !changed) { main.firstElementChild.style.animation = 'none'; window.scrollTo(0, scroll); }
    else if (changed) window.scrollTo(0, 0);
    lastView = r.view;
    if (r.view === 'library') loadDoc(r);
    document.title = `${VIEWS.find((v) => v.id === r.view).label} · TailBook HQ`;
  }

  function renderError(err) {
    renderNav(route().view);
    $('#main').innerHTML = `<div class="card error-card"><h2>HQ can’t reach its server</h2><p class="muted">${esc(err?.message || 'Is “npm run hq” still running?')} It will try again in 30 seconds.</p></div>`;
  }

  // ---------- Overview ----------
  function weekInfo() {
    const m = state.metrics;
    if (!m || !m.weeks?.length) return null;
    const t = today();
    const w = m.weeks.find((x) => t >= parseDay(x.start) && t <= parseDay(x.end));
    if (!w) return t < parseDay(m.weeks[0].start) ? { label: 'Before kickoff' } : { label: 'Decision time' };
    const n = Number(w.week.slice(1));
    return { label: n === 0 ? 'Week 0 · Setup week' : `Week ${n} of ${m.weeks.length - 1} · Validation run`, week: w };
  }

  function greeting() {
    const h = new Date().getHours();
    return h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }

  function viewOverview() {
    const s = state.status;
    const t = today();
    const dateStr = `${DAYS[t.getDay()]}, ${LONG_MONTHS[t.getMonth()]} ${t.getDate()}`;
    const wk = weekInfo();
    const decisionPhase = (s.phases || []).find((p) => p.date) || { date: '2026-12-15', name: 'Go / No-go' };
    const dLeft = daysUntil(decisionPhase.date);
    const upcoming = (s.milestones || []).filter((m) => daysUntil(m.date) > 0 && m.date !== decisionPhase.date);
    const nextM = upcoming[0];

    const countdown = `
      <div class="countdown">
        <div class="count-box primary">
          <div class="n">${dLeft >= 0 ? dLeft : 0}<small>${dLeft === 1 ? 'day' : 'days'}</small></div>
          <div class="l">to ${esc(decisionPhase.name)}<br>${esc(shortDate(decisionPhase.date))}</div>
        </div>
        ${nextM ? `<div class="count-box">
          <div class="n">${daysUntil(nextM.date)}<small>${daysUntil(nextM.date) === 1 ? 'day' : 'days'}</small></div>
          <div class="l">to ${esc(nextM.title.charAt(0).toLowerCase() + nextM.title.slice(1))}<br>${esc(shortDate(nextM.date))}</div>
        </div>` : ''}
      </div>`;

    const hero = `
      <section class="hero" aria-label="Where we are">
        <div>
          <div class="eyebrow">${esc(greeting())} <span class="chip">${esc(dateStr)}</span>${wk ? `<span class="chip">${esc(wk.label)}</span>` : ''}</div>
          <h1>${esc(s.headline || '')}</h1>
        </div>
        ${countdown}
      </section>`;

    const phases = `
      <section class="card phases" aria-label="Phase tracker">
        <div class="card-head"><h2>The road to launch</h2><span class="sub">${esc(phaseSummary(s.phases))}</span></div>
        <ol class="phase-track">
          ${(s.phases || []).map((p, i) => `
            <li class="phase ${esc(p.status)}${p.date ? ' goal' : ''}" title="${esc(p.detail || '')}">
              <span class="phase-dot">${p.status === 'done' ? icon('check') : p.date ? icon('flag') : i + 1}</span>
              <div class="phase-name">${esc(p.name)}</div>
              <div class="phase-when">${esc(p.status === 'done' ? `Done · ${p.when}` : p.status === 'active' ? `Now · ${p.when}` : p.when)}</div>
            </li>`).join('')}
        </ol>
      </section>`;

    return `${featuredDecision()}${hero}${phases}
      <div class="overview-grid">
        <div class="stack">
          ${todosCard()}
          ${milestonesCard()}
        </div>
        <div class="stack">
          ${decisionsCard()}
          ${teamPulseCard()}
        </div>
      </div>`;
  }

  function featuredDecision() {
    const f = state.status.headlineDecision;
    if (!f || f.decided) return '';
    return `<section class="feature" aria-label="Headline decision">
      <div class="feature-body">
        <div class="eyebrow feature-eyebrow"><span class="qmark">!</span>Decision needed</div>
        <h2>${esc(f.title || f.question)}</h2>
        <p>${esc(f.summary || '')}</p>
        <div class="feature-q">${esc(f.question)}</div>
        ${f.options?.length ? `<div class="feature-opts">${f.options.map((o) => `<span class="chip">${esc(o)}</span>`).join('')}</div>` : ''}
      </div>
      <div class="feature-side">
        ${f.recommendation ? `<div class="rec"><b>Team suggests</b>${esc(f.recommendation)}</div>` : ''}
        ${f.doc ? `<a class="btn primary" href="#/library/${esc(f.doc)}">${icon('doc')}Read the report</a>` : ''}
      </div>
    </section>`;
  }

  function phaseSummary(phases = []) {
    const done = phases.filter((p) => p.status === 'done').length;
    return `${done} of ${phases.length} phases complete`;
  }

  function todosCard() {
    const todos = state.status.todos || [];
    const open = todos.filter((x) => !x.done);
    const done = todos.filter((x) => x.done);
    const shown = state.showAllTodos ? open : open.slice(0, 5);
    const pct = todos.length ? done.length / todos.length : 0;
    const C = 2 * Math.PI * 13;
    const ring = `<div class="progress-ring"><svg viewBox="0 0 34 34" aria-hidden="true"><circle class="bg" cx="17" cy="17" r="13"/><circle class="fg" cx="17" cy="17" r="13" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg><span>${done.length} of ${todos.length} done</span></div>`;
    const body = open.length === 0
      ? `<div class="all-done"><div class="seal">${icon('check')}</div><div class="big">You’re all caught up.</div><p class="muted">Nothing is waiting on you right now. Nice work.</p></div>`
      : `<ul class="todos">${shown.map((x, i) => todoItem(x, i + 1)).join('')}</ul>
         ${open.length > 5 ? `<button class="more-btn" type="button" data-action="toggle-todos">${icon('chevron')}${state.showAllTodos ? 'Show only the next 5' : `Show ${open.length - 5} more`}</button>` : ''}`;
    const doneList = done.length ? `<details class="done-group"${state.doneOpen ? ' open' : ''}><summary>${icon('chevron')}Done · ${done.length}</summary><ul class="todos">${done.map((x) => todoItem(x)).join('')}</ul></details>` : '';
    return `<section class="card" aria-label="Your next moves">
      <div class="card-head"><div><h2>Your next 5 moves</h2><div class="sub">Only you can do these. Tick them off as you go.</div></div>${ring}</div>
      ${body}${doneList}
    </section>`;
  }

  function todoItem(x, n) {
    const meta = [x.cost && `<span class="chip">${esc(x.cost)}</span>`, x.time && `<span class="chip">${esc(x.time)}</span>`,
      x.doc && `<a href="#/library/${esc(x.doc)}">How-to guide</a>`].filter(Boolean).join('');
    return `<li class="todo${x.done ? ' is-done' : ''}" data-id="${esc(x.id)}">
      <button class="check" type="button" role="checkbox" aria-checked="${x.done ? 'true' : 'false'}" data-todo="${esc(x.id)}" aria-label="${esc(x.title)}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12.5 10 17l8.5-9.5"/></svg>
      </button>
      <div>
        <div class="todo-title">${n ? `<span class="todo-num">${n}.</span> ` : ''}${esc(x.title)}</div>
        ${x.detail ? `<div class="todo-detail">${esc(x.detail)}</div>` : ''}
        ${meta ? `<div class="todo-meta">${meta}</div>` : ''}
      </div>
    </li>`;
  }

  function decisionsCard() {
    const ds = state.status.decisions || [];
    const featured = state.status.headlineDecision?.id;
    const open = ds.filter((d) => !d.decided && d.id !== featured);
    return `<section class="card" aria-label="Decisions waiting on you">
      <div class="card-head"><h2>Decisions waiting on you</h2><span class="chip">${open.length}</span></div>
      ${open.length ? open.map((d) => `<div class="decision">
        <div class="decision-q"><span class="qmark">?</span><span>${esc(d.question)}</span></div>
        ${d.context ? `<p>${esc(d.context)}</p>` : ''}
        ${d.recommendation ? `<div class="rec"><b>Team suggests:</b> ${esc(d.recommendation)}</div>` : ''}
        ${d.doc ? `<a class="doc-link link-arrow" href="#/library/${esc(d.doc)}">Background ${icon('arrow')}</a>` : ''}
      </div>`).join('') : '<p class="muted">No decisions waiting. 🎉</p>'}
    </section>`;
  }

  function teamPulseCard() {
    const teams = state.status.teams || [];
    const c = (st) => teams.filter((t) => t.status === st).length;
    return `<section class="card" aria-label="Team right now">
      <div class="card-head"><h2>Agent teams right now</h2><a class="link-arrow" href="#/team">All teams ${icon('arrow')}</a></div>
      <div class="pulse-stats">
        <div class="pulse-stat working"><div class="n">${c('working')}</div><div class="l">Working</div></div>
        <div class="pulse-stat done"><div class="n">${c('done')}</div><div class="l">Done</div></div>
        <div class="pulse-stat ${c('blocked') ? 'blocked' : ''}"><div class="n">${c('blocked')}</div><div class="l">Blocked</div></div>
        ${c('queued') ? `<div class="pulse-stat"><div class="n">${c('queued')}</div><div class="l">Queued</div></div>` : ''}
      </div>
      <div class="avatars">${teams.map((t) => `<span class="mini-team" title="${esc(t.name)}: ${esc(STATUS_LABEL[t.status] || t.status)}"><span class="ic ${esc(t.status)}">${icon(TEAM_ICON[t.id] || 'team')}</span>${esc(t.name)}</span>`).join('')}</div>
    </section>`;
  }

  function milestonesCard() {
    const ms = state.status.milestones || [];
    let nextMarked = false;
    return `<section class="card" aria-label="Coming up">
      <div class="card-head"><h2>Coming up</h2><span class="sub">Key dates</span></div>
      <ul class="milestones">${ms.map((m) => {
        const n = daysUntil(m.date);
        let cls = n < 0 ? 'past' : '';
        if (n >= 0 && !nextMarked) { cls = 'next'; nextMarked = true; }
        const d = parseDay(m.date);
        return `<li class="milestone ${cls}">
          <div class="date-tile"><span class="m">${MONTHS[d.getMonth()]}</span><span class="d">${d.getDate()}</span></div>
          <div><div class="milestone-title">${esc(m.title)} <span class="in-days">${esc(inDays(n))}</span></div><div class="milestone-detail">${esc(m.detail || '')}</div></div>
        </li>`;
      }).join('')}</ul>
    </section>`;
  }

  // ---------- Team ----------
  function deptStats(folders = []) {
    const deps = state.files?.departments || [];
    const hits = deps.filter((d) => d.folders.some((f) => folders.includes(f)));
    return {
      exists: hits.some((d) => d.exists),
      count: hits.reduce((s, d) => s + d.count, 0),
      docs: hits.reduce((s, d) => s + d.docCount, 0),
      last: hits.map((d) => d.lastModified).filter(Boolean).sort().pop() || null,
    };
  }

  function viewTeam() {
    const teams = state.status.teams || [];
    const counts = ['working', 'done', 'blocked', 'queued'].map((s) => [s, teams.filter((t) => t.status === s).length]).filter(([, n]) => n);
    return `<div class="page-head"><div><div class="eyebrow">Agent teams</div><h1>Who’s doing what</h1><p>Each team is an AI agent working in its own folder of the repo. Statuses update as they work.</p></div>
      <div class="team-summary">${counts.map(([s, n]) => `<span class="pill ${s}">${n} ${esc(STATUS_LABEL[s])}</span>`).join('')}</div></div>
      <div class="team-grid">${teams.map(teamCard).join('')}</div>`;
  }

  function teamCard(t) {
    const st = deptStats(t.folders);
    const deliver = st.exists ? `<span><b>${st.count}</b> ${st.count === 1 ? 'file' : 'files'}${st.docs && st.docs !== st.count ? ` · <b>${st.docs}</b> ${st.docs === 1 ? 'doc' : 'docs'}` : ''}</span>` : '<span>No files yet</span>';
    const link = st.exists ? `<a class="link-arrow" href="#/library?d=${esc(t.folders[0])}">Open docs ${icon('arrow')}</a>` : '<span class="muted">Folder starts soon</span>';
    const updated = [t.updatedAt, st.last].filter(Boolean).sort().pop();
    return `<article class="card team-card ${esc(t.status)}">
      <div class="team-top">
        <div class="team-ident"><span class="ic ${esc(t.status)}">${icon(TEAM_ICON[t.id] || 'team')}</span><div><div class="team-name">${esc(t.name)}</div><div class="team-role">${esc(t.role || '')}</div></div></div>
        <span class="pill ${esc(t.status)}">${esc(STATUS_LABEL[t.status] || t.status)}</span>
      </div>
      <div class="team-now"><div class="label">${t.status === 'done' ? 'Delivered' : t.status === 'blocked' ? 'Blocked on' : 'Working on'}</div><div class="team-task">${esc(t.task || '')}</div>
        ${t.next ? `<div class="team-next">${icon('arrow')}<span>${esc(t.next)}</span></div>` : ''}
      </div>
      <div class="team-foot">${deliver}${link}</div>
      ${updated ? `<div class="muted" style="font-size:12px;margin-top:10px">Last activity ${esc(ago(updated))}</div>` : ''}
    </article>`;
  }

  // ---------- Metrics ----------
  const fmtVal = (v, pct) => (v == null ? '—' : `${Number.isInteger(v) ? v : v.toFixed(1)}${pct ? '%' : ''}`);
  const VERDICT = { pass: 'On track', between: 'Watch zone', fail: 'Below the line', nodata: 'No data yet', later: 'After launch' };

  function meter(m) {
    const pass = m.pass && m.pass.op.startsWith('>') ? m.pass.value : null;
    const fail = m.fail && m.fail.op.startsWith('<') ? m.fail.value : null;
    const v = m.latest?.value ?? null;
    if (pass == null) return '';
    let max = Math.max(pass * 1.3, v != null ? v * 1.08 : 0, fail || 0);
    if (m.percent) max = Math.min(100, Math.max(max, pass * 1.6));
    const pct = (x) => Math.max(0, Math.min(100, (x / max) * 100));
    const bands = [];
    if (fail != null) bands.push(['fail', pct(fail)]);
    bands.push(['between', pct(pass) - (fail != null ? pct(fail) : 0)]);
    bands.push(['pass', 100 - pct(pass)]);
    const labels = [`<span class="l0">0</span>`];
    if (fail != null && pct(pass) - pct(fail) > 14 && pct(fail) > 8) labels.push(`<span class="fail-l" style="left:${pct(fail)}%">&lt;${fmtVal(fail, m.percent)}</span>`);
    labels.push(`<span class="pass-l" style="left:${pct(pass)}%">≥${fmtVal(pass, m.percent)}</span>`);
    return `<div class="meter-wrap" role="img" aria-label="Actual ${esc(fmtVal(v, m.percent))}, pass at ${esc(fmtVal(pass, m.percent))}${fail != null ? `, fail under ${esc(fmtVal(fail, m.percent))}` : ''}">
      <div class="meter">${bands.map(([c, w]) => `<span class="band ${c}" style="width:${w}%"></span>`).join('')}</div>
      ${v != null ? `<span class="meter-fill ${esc(m.verdict)}" style="width:${Math.max(pct(v), 1.5)}%"></span>` : ''}
      <div class="meter-labels">${labels.join('')}</div>
    </div>`;
  }

  function expCard(ex) {
    const main = ex.metrics.find((m) => m.key === ex.mainKey);
    if (!main) return '';
    if (ex.postBuildOnly) {
      return `<article class="card exp later">
        <div class="exp-head"><div class="exp-id"><span class="exp-badge">${esc(ex.id)}</span><div><div class="exp-title">${esc(ex.title)}</div><div class="exp-blurb">${esc(ex.blurb)}</div></div></div><span class="pill later">${VERDICT.later}</span></div>
        <div class="exp-main"><div class="later-note">Runs once the app is on the App Store. Target: <b>${esc(niceThreshold(main.passText))}</b> ${esc(main.unit ? `(${main.unit.split(';')[0]})` : '')}. Pre-launch signal: the E2 deposit rate.</div></div>
      </article>`;
    }
    const others = ex.metrics.filter((m) => m.key !== ex.mainKey);
    const v = main.latest?.value ?? null;
    const verdict = main.verdict;
    return `<article class="card exp">
      <div class="exp-head">
        <div class="exp-id"><span class="exp-badge">${esc(ex.id)}</span><div><div class="exp-title">${esc(ex.title)}</div><div class="exp-blurb">${esc(ex.blurb)}</div></div></div>
        <span class="pill ${esc(verdict)}">${VERDICT[verdict]}</span>
      </div>
      <div class="exp-main">
        <div class="label">${esc(main.metric)}${main.proxy ? ' · proxy' : ''}</div>
        <div class="exp-figure">
          <div class="val ${v == null ? 'empty' : ''}">${v == null ? '—' : esc(fmtVal(v, main.percent))}${v == null ? '<small>no data yet</small>' : ''}</div>
          ${main.pass ? `<div class="goal">Target <b>${esc(main.pass.op === '>=' ? '≥' : main.pass.op)}${esc(fmtVal(main.pass.value, main.pass.percent))}</b></div>` : ''}
        </div>
        ${meter(main)}
        <div class="exp-rule"><span><b>Pass</b> ${esc(niceThreshold(main.passText))}</span>${main.failText && !/^n\/a/i.test(main.failText) ? `<span><b>Fail</b> ${esc(niceThreshold(main.failText))}</span>` : ''}</div>
      </div>
      ${others.length ? `<div class="sub-metrics">${others.map((m) => `<div class="sub-metric">
        <div class="nm">${esc(m.metric)}${m.proxy ? '<span class="tag">proxy</span>' : ''}${m.postBuild ? '<span class="tag">after launch</span>' : ''}<span class="tg">Pass ${esc(niceThreshold(m.passText))}</span></div>
        <div class="av">${esc(m.postBuild ? '—' : fmtVal(m.latest?.value ?? null, m.percent))}<span class="dot ${m.postBuild ? '' : esc(m.verdict)}"></span></div>
      </div>`).join('')}</div>` : ''}
      <div class="when">${icon('calendar')}${esc(ex.when)}</div>
    </article>`;
  }

  function viewMetrics() {
    const m = state.metrics;
    if (!m) return `<div class="card error-card"><h2>Metrics aren’t available</h2><p class="muted">The experiment tracker couldn’t be read.</p></div>`;
    const anyData = m.experiments.some((e) => e.anyData);
    const core = m.experiments.filter((e) => !e.supporting);
    const support = m.experiments.filter((e) => e.supporting);
    const postStart = (state.status.milestones || []).find((x) => x.id === 'm-post');
    const startLabel = postStart ? shortDate(postStart.date) : 'Oct 26';
    const banner = anyData ? '' : `<div class="empty-banner">
        <span class="ic">${icon('calendar')}</span>
        <div><h3>No data yet — starts when posting begins ${esc(startLabel)}</h3><p>Every Sunday, add the week’s numbers in the form below. Bars fill in and turn green, amber or red on their own.</p></div>
        <a class="btn" href="#entry" data-action="jump-entry">Enter numbers</a>
      </div>`;
    return `<div class="page-head"><div><div class="eyebrow">Validation</div><h1>Are owners biting?</h1><p>Targets versus actuals for experiments E1–E6, read live from the experiment tracker.</p></div>
      <div class="legend"><span><i style="background:var(--ok)"></i>Pass</span><span><i style="background:var(--warn)"></i>Watch</span><span><i style="background:var(--bad)"></i>Fail</span></div></div>
      ${banner}
      <div class="exp-grid">${core.map(expCard).join('')}</div>
      <h2 class="section">Supporting signals</h2>
      <div class="exp-grid">${support.map(expCard).join('')}</div>
      ${entryForm()}`;
  }

  function entryForm() {
    const m = state.metrics;
    const weeks = m.weeks || [];
    const sel = state.week || m.currentWeek || weeks[0]?.week;
    const rows = [];
    for (const ex of m.experiments) for (const met of ex.metrics) for (const w of met.weeks) {
      if (w.week === sel) rows.push({ ex, met, w });
    }
    rows.sort((a, b) => a.w.row - b.w.row);
    const draft = (row, col, orig) => (state.drafts[`${row}:${col}`] ?? orig ?? '');
    const hint = (w, met) => {
      const t = String(w.target || '').trim();
      if (/^\d/.test(t)) return `Target so far: ${t}${met.percent ? '%' : ''}`;
      if (!t || /^track$/i.test(t)) return 'Just track it';
      return t.charAt(0).toUpperCase() + t.slice(1);
    };
    const wk = weeks.find((w) => w.week === sel);
    return `<section class="card entry" id="entry" aria-label="Enter weekly actuals">
      <div class="card-head"><div><h2>Enter this week’s numbers</h2><div class="sub">Saves straight into validation/06-experiment-tracker.csv. Only the actual columns change.</div></div></div>
      <div class="weeks" role="group" aria-label="Week">${weeks.map((w) => `<button type="button" class="week-btn" data-week="${esc(w.week)}" aria-pressed="${w.week === sel}"><b>${esc(w.week === 'W0' ? 'Setup' : `Week ${w.week.slice(1)}`)}${w.week === m.currentWeek ? '<span class="now">Now</span>' : ''}</b>${esc(shortDate(w.start))} – ${esc(shortDate(w.end))}</button>`).join('')}</div>
      <form id="entry-form" novalidate>
        <div class="entry-row head"><div>${esc(wk ? `${shortDate(wk.start)} – ${shortDate(wk.end)}` : '')}</div><div>This week</div><div>Total so far</div></div>
        ${rows.map(({ ex, met, w }) => `<div class="entry-row" data-row="${w.row}">
          <div class="entry-name"><span class="exp-badge">${esc(ex.id)}</span>${esc(met.metric)}<div class="entry-hint">${esc(hint(w, met))}${met.percent ? ' · enter a %' : ''}</div></div>
          <div class="field"><label for="f-${w.row}-w">This week</label><input id="f-${w.row}-w" inputmode="decimal" autocomplete="off" placeholder="${met.percent ? '0%' : '0'}" data-row="${w.row}" data-col="actual_week" data-orig="${esc(w.actualWeek)}" value="${esc(draft(w.row, 'actual_week', w.actualWeek))}" aria-label="${esc(met.metric)}, this week"></div>
          <div class="field"><label for="f-${w.row}-c">Total so far</label><input id="f-${w.row}-c" inputmode="decimal" autocomplete="off" placeholder="${met.percent ? '0%' : '0'}" data-row="${w.row}" data-col="actual_cumulative" data-orig="${esc(w.actualCumulative)}" value="${esc(draft(w.row, 'actual_cumulative', w.actualCumulative))}" aria-label="${esc(met.metric)}, total so far"></div>
        </div>`).join('')}
        <div class="entry-foot"><span class="msg" id="entry-msg">Numbers only, like 12, 4.5 or 15%. Leave blank if you don’t know yet.</span>
          <button class="btn primary" type="submit" id="entry-save">${icon('save')}Save numbers</button></div>
      </form>
    </section>`;
  }

  const VALID = /^\d{1,7}(\.\d{1,2})?%?$/;
  async function saveEntry(form) {
    const msg = $('#entry-msg');
    const updates = new Map();
    let bad = null;
    for (const inp of $$('input[data-row]', form)) {
      const v = inp.value.trim().replace(/,/g, '');
      inp.classList.remove('invalid');
      if (v && (!VALID.test(v) || (v.endsWith('%') && parseFloat(v) > 100))) { inp.classList.add('invalid'); bad = bad || inp; continue; }
      if (v === (inp.dataset.orig || '')) continue;
      const row = Number(inp.dataset.row);
      const meta = findRow(row);
      if (!meta) continue;
      const u = updates.get(row) || { row, week: meta.w.week, experiment: meta.met.experiment, metric: meta.met.metric };
      u[inp.dataset.col] = v;
      updates.set(row, u);
    }
    if (bad) { msg.className = 'msg err'; msg.textContent = 'Some numbers don’t look right. Use digits like 12, 4.5 or 15%.'; bad.focus(); return; }
    if (!updates.size) { msg.className = 'msg'; msg.textContent = 'Nothing changed yet.'; return; }
    const btn = $('#entry-save');
    btn.disabled = true;
    try {
      const r = await post('/api/metrics', { updates: [...updates.values()] });
      state.drafts = {};
      toast(r.changed ? `Saved ${plural(r.changed, 'number')} to the tracker` : 'Already up to date');
      document.activeElement?.blur?.();
      await refresh({ force: true });
    } catch (e) {
      msg.className = 'msg err'; msg.textContent = e.message;
      btn.disabled = false;
    }
  }
  function findRow(row) {
    for (const ex of state.metrics.experiments) for (const met of ex.metrics) for (const w of met.weeks) if (w.row === row) return { ex, met, w };
    return null;
  }

  // ---------- Library ----------
  const DEPT_LABEL = { research: 'Research', validation: 'Growth & Validation', design: 'UI/UX', marketing: 'Marketing', sales: 'Sales', engine: 'Rules engine', landing: 'Landing page', ios: 'iOS app' };
  const KIND_ICON = { doc: 'doc', sheet: 'sheet', code: 'code', image: 'image', other: 'doc' };

  function viewLibrary(r) {
    const deps = state.files?.departments || [];
    const q = state.libQuery.trim().toLowerCase();
    const groups = deps.filter((d) => !r.dept || d.folders.includes(r.dept)).map((d) => {
      const match = (f) => !q || f.path.toLowerCase().includes(q) || prettyName(f.name).toLowerCase().includes(q);
      const docs = d.files.filter((f) => (f.kind === 'doc' || f.kind === 'sheet') && match(f));
      const rest = d.files.filter((f) => !(f.kind === 'doc' || f.kind === 'sheet') && f.kind !== 'other' && match(f));
      const expanded = state.libExpanded[d.id] || (q && docs.length === 0) || (r.docPath && rest.some((f) => f.path === r.docPath));
      const item = (f) => `<a class="lib-item" href="#/library/${esc(f.path)}" ${f.path === r.docPath ? 'aria-current="page"' : ''}>${icon(KIND_ICON[f.kind])}<span class="t">${esc(f.kind === 'doc' || f.kind === 'sheet' ? prettyName(f.name) : f.path.split('/').slice(1).join('/'))}<span class="d">${esc(f.kind === 'sheet' ? 'Sheet' : f.kind === 'doc' ? 'Doc' : f.ext.slice(1).toUpperCase())} · ${esc(ago(f.mtime))}</span></span></a>`;
      if (q && !docs.length && !rest.length) return '';
      return `<div class="lib-group">
        <div class="lib-group-h"><span>${esc(DEPT_LABEL[d.id] || d.name)}</span><span class="n">${d.exists ? d.count : ''}</span></div>
        ${!d.exists ? '<div class="lib-empty">Nothing here yet</div>' : ''}
        ${docs.map(item).join('')}
        ${rest.length ? (expanded ? rest.map(item).join('') : `<button class="lib-more" type="button" data-expand="${esc(d.id)}">+ ${plural(rest.length, docs.length ? 'other file' : 'file')}</button>`) : ''}
        ${d.exists && !docs.length && !rest.length ? '<div class="lib-empty">Nothing here yet</div>' : ''}
      </div>`;
    }).join('');
    return `<div class="page-head"><div><div class="eyebrow">Library</div><h1>Everything the teams have written</h1></div>
      ${r.dept ? `<a class="btn" href="#/library">Show all departments</a>` : ''}</div>
      <div class="library ${r.docPath ? 'has-doc' : ''}">
        <aside class="card lib-side" aria-label="Documents">
          <div class="search">${icon('search')}<input type="search" id="lib-q" placeholder="Search documents" value="${esc(state.libQuery)}" aria-label="Search documents"></div>
          ${groups || '<div class="lib-empty">No matches</div>'}
        </aside>
        <article class="card reader" id="reader">${r.docPath ? '<div class="loading"><span class="spinner"></span>Opening…</div>' : libraryWelcome()}</article>
      </div>`;
  }

  function libraryWelcome() {
    const all = (state.files?.departments || []).flatMap((d) => d.files.filter((f) => f.kind === 'doc' || f.kind === 'sheet').map((f) => ({ ...f, dept: d.id })));
    const recent = all.sort((a, b) => b.mtime.localeCompare(a.mtime)).slice(0, 6);
    return `<div class="welcome"><div class="ic">${icon('library')}</div><h2>Pick a document to read</h2><p>Plans, playbooks and research from every team, always the latest version.</p>
      <div class="doc-grid">${recent.map((f) => `<a class="doc-card" href="#/library/${esc(f.path)}"><div class="k">${esc(DEPT_LABEL[f.dept] || f.dept)} · ${esc(ago(f.mtime))}</div><div class="t">${esc(prettyName(f.name))}</div></a>`).join('')}</div></div>`;
  }

  async function loadDoc(r) {
    if (!r.docPath) return;
    const el = $('#reader');
    const fileMeta = (state.files?.departments || []).flatMap((d) => d.files).find((f) => f.path === r.docPath);
    const key = `${r.docPath}@${fileMeta?.mtime || ''}`;
    let doc = state.docCache.get(key);
    try {
      if (!doc) {
        doc = await api(`/api/doc?path=${encodeURIComponent(r.docPath)}`);
        state.docCache.set(key, doc);
      }
    } catch (e) {
      if (route().docPath !== r.docPath) return;
      el.innerHTML = `${backLink()}<div class="error-card"><h2>Can’t open this file</h2><p class="muted">${esc(e.message)}</p></div>`;
      return;
    }
    if (route().docPath !== r.docPath || !$('#reader')) return;
    const top = doc.path.split('/')[0];
    const readMin = doc.words ? Math.max(1, Math.round(doc.words / 230)) : null;
    const toc = (doc.toc || []).filter((t) => t.level === 2);
    const body = doc.kind === 'image'
      ? `<img class="doc-img" src="/api/raw?path=${encodeURIComponent(doc.path)}" alt="${esc(doc.name)}">`
      : `<div class="prose ${doc.kind !== 'doc' ? 'wide' : ''}">${doc.html}</div>`;
    $('#reader').innerHTML = `${backLink()}
      <div class="reader-meta"><span class="crumb">${esc(DEPT_LABEL[top] || top)}</span><span>·</span><span>${esc(doc.path)}</span><span>·</span><span>Updated ${esc(ago(doc.mtime))}</span>${readMin ? `<span>·</span><span>${readMin} min read</span>` : ''}</div>
      ${doc.kind !== 'doc' ? `<h1 style="font:680 26px/1.2 var(--font-display);letter-spacing:-.02em;margin:0 0 20px">${esc(prettyName(doc.name))}</h1>` : ''}
      ${toc.length >= 4 ? `<details class="toc"><summary>Contents · ${toc.length} sections</summary><ol>${toc.map((t) => `<li><a href="#" data-anchor="${esc(t.id)}">${esc(t.text)}</a></li>`).join('')}</ol></details>` : ''}
      ${body}`;
  }
  const backLink = () => `<a class="reader-back link-arrow" href="#/library">${icon('back')}Library</a>`;

  function resolveRel(from, href) {
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) return null;
    const parts = from.split('/').slice(0, -1);
    for (const seg of clean.split('/')) {
      if (seg === '..') parts.pop(); else if (seg && seg !== '.') parts.push(seg);
    }
    return parts.join('/');
  }

  // ---------- Activity ----------
  function viewActivity() {
    const g = state.git;
    if (!g || !g.available) return `<div class="page-head"><div><div class="eyebrow">Activity</div><h1>What changed</h1></div></div><div class="card error-card"><h2>No history yet</h2><p class="muted">${esc(g?.error || 'Git history isn’t available.')}</p></div>`;
    const days = new Map();
    for (const c of g.commits) {
      const d = new Date(c.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!days.has(key)) days.set(key, []);
      days.get(key).push(c);
    }
    const dayLabel = (k) => { const n = daysUntil(k); const d = parseDay(k); return n === 0 ? 'Today' : n === -1 ? 'Yesterday' : `${DAYS[d.getDay()]}, ${LONG_MONTHS[d.getMonth()]} ${d.getDate()}`; };
    return `<div class="page-head"><div><div class="eyebrow">Activity</div><h1>What changed</h1><p>The last ${plural(g.commits.length, 'saved change')} to the project, newest first.</p></div></div>
      <div class="timeline">${[...days.entries()].map(([k, cs]) => `<section class="day"><h3 class="day-h">${esc(dayLabel(k))}</h3>
        ${cs.map((c) => `<div class="commit"><span class="av" aria-hidden="true">${esc((c.author || '?').trim().charAt(0).toUpperCase())}</span>
          <div class="commit-card"><div class="commit-title">${esc(c.subject)}</div>
            <div class="commit-meta"><span>${esc(c.author)} · ${esc(clock(c.date))}</span><span>${plural(c.files, 'file')}</span>
              ${c.areas.length ? `<span class="chips">${c.areas.map((a) => `<span class="chip">${esc(DEPT_LABEL[a] || (a === 'hq' ? 'HQ' : a))}</span>`).join('')}</span>` : ''}</div>
            ${c.body ? `<details><summary>Details</summary><pre>${esc(c.body)}</pre></details>` : ''}
          </div></div>`).join('')}
      </section>`).join('')}</div>`;
  }

  // ---------- interactions ----------
  async function toggleTodo(id, btn) {
    const todo = state.status.todos.find((t) => t.id === id);
    if (!todo) return;
    const next = !todo.done;
    todo.done = next;
    btn.setAttribute('aria-checked', String(next));
    if (next) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
    setTimeout(() => render({ soft: true }), next ? 700 : 150);
    try {
      await post('/api/todo', { id, done: next });
      if (next) toast(state.status.todos.every((t) => t.done) ? 'All done. Great work.' : 'Nice. One less thing.');
    } catch (e) {
      todo.done = !next;
      render({ soft: true });
      toast(`Couldn’t save: ${e.message}`, true);
    }
  }

  let toastTimer;
  function toast(text, err = false) {
    const el = $('#toast');
    el.textContent = text;
    el.classList.toggle('err', err);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  function effectiveTheme() {
    const t = document.documentElement.dataset.theme;
    if (t) return t;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function paintThemeBtn() {
    const dark = effectiveTheme() === 'dark';
    const b = $('#theme-btn');
    b.innerHTML = icon(dark ? 'sun' : 'moon');
    b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  document.addEventListener('click', (e) => {
    const chk = e.target.closest('[data-todo]');
    if (chk) { e.preventDefault(); toggleTodo(chk.dataset.todo, chk); return; }
    if (e.target.closest('[data-action="toggle-todos"]')) { state.showAllTodos = !state.showAllTodos; render({ soft: true }); return; }
    if (e.target.closest('[data-action="jump-entry"]')) { e.preventDefault(); $('#entry')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const wb = e.target.closest('[data-week]');
    if (wb && wb.classList.contains('week-btn')) { state.week = wb.dataset.week; render({ soft: true }); return; }
    const ex = e.target.closest('[data-expand]');
    if (ex) { state.libExpanded[ex.dataset.expand] = true; render({ soft: true }); return; }
    const anchor = e.target.closest('[data-anchor]');
    if (anchor) { e.preventDefault(); document.getElementById(anchor.dataset.anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const rel = e.target.closest('.prose a[data-rel]');
    if (rel) {
      e.preventDefault();
      const href = rel.getAttribute('href');
      if (href.startsWith('#')) { document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' }); return; }
      const target = resolveRel(route().docPath, href);
      if (target) location.hash = `#/library/${target}`;
      return;
    }
    if (e.target.closest('#theme-btn')) {
      const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('hq-theme', next); } catch { /* private mode */ }
      paintThemeBtn();
    }
  });
  document.addEventListener('toggle', (e) => { if (e.target.classList?.contains('done-group')) state.doneOpen = e.target.open; }, true);
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('input[data-row]')) { state.drafts[`${t.dataset.row}:${t.dataset.col}`] = t.value; t.classList.remove('invalid'); }
    if (t.id === 'lib-q') {
      state.libQuery = t.value;
      const pos = t.selectionStart;
      render({ soft: true });
      const n = $('#lib-q'); n.focus(); n.setSelectionRange(pos, pos);
    }
  });
  document.addEventListener('submit', (e) => { if (e.target.id === 'entry-form') { e.preventDefault(); saveEntry(e.target); } });
  window.addEventListener('hashchange', () => render());
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', paintThemeBtn);

  paintThemeBtn();
  refresh({ force: true });
  setInterval(() => refresh(), 30000);
  setInterval(() => updateLive(false), 10000);
})();
