/* Views + router */
(function () {
  const C = window.Core, R = C.R, D = C.date;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const app = $("#app");

  /* ---------- icons ---------- */
  const I = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const ICON = {
    home: I('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>'),
    map: I('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>'),
    note: I('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'),
    brief: I('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>'),
    gear: I('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon: I('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
    play: I('<path d="m7 4 13 8-13 8z"/>'),
    check: I('<path d="M20 6 9 17l-5-5"/>'),
    copy: I('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>'),
    back: I('<path d="M15 18l-6-6 6-6"/>'),
    next: I('<path d="M9 18l6-6-6-6"/>'),
    panel: I('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/>'),
    pause: I('<path d="M8 5v14M16 5v14"/>'),
    reset: I('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
    spark: I('<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'),
    code: I('<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>'),
    layers: I('<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>'),
    server: I('<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>'),
    plus: I('<path d="M12 5v14M5 12h14"/>')
  };

  /* ---------- helpers ---------- */
  window.toast = function (msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    $(".toasts").appendChild(t); setTimeout(() => t.remove(), 2600);
  };
  async function copy(text, msg = "Copied") {
    try { await navigator.clipboard.writeText(text); toast(msg); }
    catch (e) {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove(); toast(msg);
    }
  }
  function confetti() {
    const cv = $("#confetti"), ctx = cv.getContext("2d");
    cv.width = innerWidth; cv.height = innerHeight;
    const cols = ["#2f6fe4", "#138a4b", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9"];
    const ps = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight * .55, vx: (Math.random() - .5) * 14,
      vy: -Math.random() * 15 - 6, r: Math.random() * 6 + 3, c: cols[(Math.random() * cols.length) | 0], a: Math.random() * 6, va: (Math.random() - .5) * .4
    }));
    let f = 0;
    (function tick() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += .45; p.vx *= .99; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (++f < 150) requestAnimationFrame(tick); else ctx.clearRect(0, 0, cv.width, cv.height);
    })();
  }
  function modal(html) {
    const bg = document.createElement("div"); bg.className = "modal-bg";
    bg.innerHTML = `<div class="modal">${html}</div>`;
    bg.addEventListener("click", (e) => { if (e.target === bg || e.target.closest("[data-close]")) bg.remove(); });
    document.body.appendChild(bg); return bg;
  }
  const sessionLabel = (s) => (s.week === 0 ? "Warm-up" : `Week ${s.week} · Session ${s.num}`);
  function sessionBlock(s) {
    const lines = [`${sessionLabel(s)} — ${s.title}`, "", (s.learnLabel || "Learn")];
    s.learn.forEach((l) => lines.push(`- ${l}`));
    lines.push("", "Build"); s.build.forEach((b) => lines.push(`- ${b}`));
    if (s.extra) { lines.push("", s.extra.label); s.extra.items.forEach((b) => lines.push(`- ${b}`)); }
    if (s.done) lines.push("", `Done when — ${s.done}`);
    return lines.join("\n");
  }
  const tutorPrompt = (s) => R.tutorPrompt.replace("{{MIN}}", s.minutes).replace("{{SESSION}}", sessionBlock(s));

  function completeSession(id) {
    const before = C.level(C.xp());
    const s = C.byId[id];
    C.actions.setStatus(id, "done");
    const after = C.level(C.xp());
    const gain = (s.minutes >= 80 ? 200 : 100) + (s.project ? 100 : 0);
    confetti();
    const st = C.streaks();
    const nxt = C.summary().next;
    modal(`<h2 style="margin:0 0 4px">${after.n > before.n ? `Level ${after.n} — ${esc(after.title)}` : "Session complete"}</h2>
      <p class="muted" style="margin:0 0 4px">${esc(sessionLabel(s))} · ${esc(s.title)}</p>
      <p style="margin:10px 0"><span class="chip blue">+${gain} XP</span> <span class="chip amber">${st.current}-day streak</span></p>
      ${nxt ? `<p class="small muted">Next: <b>${esc(nxt.s.title)}</b> · ${esc(D.fmt(nxt.date))}</p>` : `<p>You finished the whole roadmap. Go get that offer.</p>`}
      <div class="actions" style="justify-content:center"><button class="btn primary" data-close>Nice</button></div>`);
  }

  /* ---------- theme ---------- */
  function applyTheme(t) {
    if (t) document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme");
    $("#themeBtn").innerHTML = isDark() ? ICON.sun : ICON.moon;
  }
  const isDark = () => {
    const t = document.documentElement.getAttribute("data-theme");
    return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  };
  window.isDarkTheme = isDark;

  /* ---------- shared bits ---------- */
  function statusIco(status, now) {
    if (status === "done") return `<span class="status-ico done">✓</span>`;
    if (status === "skipped") return `<span class="status-ico skipped">–</span>`;
    return `<span class="status-ico ${now ? "now" : ""}"></span>`;
  }
  function statsRow(sum) {
    const st = C.streaks(), xp = C.xp(), lv = C.level(xp);
    return `<div class="grid4">
      <div class="stat"><div class="v">${st.current}</div><div class="k">day streak · best ${st.best}</div></div>
      <div class="stat"><div class="v">${xp.toLocaleString()}</div><div class="k">XP · Lv ${lv.n}</div></div>
      <div class="stat"><div class="v">${sum.pct}%</div><div class="k">${sum.doneCount}/${sum.total} sessions</div></div>
      <div class="stat"><div class="v">${sum.daysLeft}</div><div class="k">days to finish</div></div>
    </div>
    <div class="card soft" style="margin-top:10px;padding:12px 14px">
      <div class="row between small"><span><b>Lv ${lv.n}</b> · ${esc(lv.title)}</span><span class="muted">${lv.max ? "Max level" : `${(lv.ceil - xp).toLocaleString()} XP to Lv ${lv.n + 1}`}</span></div>
      <div class="bar" style="margin-top:8px"><i style="width:${Math.round(lv.pct * 100)}%"></i></div>
    </div>`;
  }

  /* ================= HOME ================= */
  function viewHome() {
    const sum = C.summary(), name = C.state.settings.name || "there";
    const { next } = sum;
    const isToday = next && next.date === sum.today;
    const shift = sum.shift;

    let todayCard;
    if (!next) {
      todayCard = `<div class="card hero"><div class="label">All done</div><h2 style="margin-top:6px">Roadmap complete</h2><p class="muted">Keep the outreach running.</p></div>`;
    } else {
      const s = next.s, x = C.state.sessions[s.id] || {};
      const checks = x.checks || {};
      const totalChecks = s.learn.length + s.build.length;
      const doneChecks = Object.values(checks).filter(Boolean).length;
      let head;
      if (isToday) head = `<span class="chip blue"><span class="dot"></span> Today · ${D.fmt(sum.today)}</span>`;
      else if (sum.freeToday) head = `<span class="chip amber">Free day today · next session ${D.rel(next.date)}</span>`;
      else if (sum.doneTodayItem) head = `<span class="chip green">✓ Done for today · next ${D.rel(next.date)}</span>`;
      else head = `<span class="chip">${D.fmt(next.date)}</span>`;
      todayCard = `
      ${sum.freeToday ? `<div class="card amber" style="margin-bottom:12px"><div class="label" style="color:var(--amber)">Week ${sum.freeToday.week} free day</div><div style="margin-top:4px">${esc(sum.freeToday.text)}</div></div>` : ""}
      <div class="card hero today">
        <div class="today-top">${head}<span class="chip">${s.minutes} min</span></div>
        <div class="label" style="margin-top:14px">${esc(sessionLabel(s))} · ${esc(s.weekTitle)}</div>
        <h2>${esc(s.title)}</h2>
        ${totalChecks ? `<div class="row small muted" style="margin-top:6px"><div class="bar green grow" style="max-width:220px"><i style="width:${Math.round((doneChecks / totalChecks) * 100)}%"></i></div>${doneChecks}/${totalChecks} items</div>` : ""}
        <ul class="learn-preview">${s.learn.slice(0, 5).map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
        ${s.done ? `<p class="small" style="margin:12px 0 0"><span class="muted">Done when —</span> ${esc(s.done)}</p>` : ""}
        <div class="actions">
          <a class="btn primary" href="#/study/${s.id}">${ICON.play} Let's start</a>
          <button class="btn" data-done="${s.id}">${ICON.check} Mark done</button>
          <a class="btn" href="#/s/${s.id}">Details</a>
          <button class="btn ghost" data-copyprompt="${s.id}">${ICON.copy} Tutor prompt</button>
        </div>
      </div>`;
    }

    const last = sum.last, after = isToday ? sum.afterNext : sum.afterNext;
    const mini = (lbl, it, extra = "") => it ? `<a class="card" href="#/s/${it.s.id}" style="display:block">
        <div class="label">${lbl}</div>
        <div style="margin-top:6px" class="serif"><span style="font-size:18px">${esc(it.s.title)}</span></div>
        <div class="small muted">${esc(sessionLabel(it.s))} · ${it.date ? `${D.fmt(it.date)} (${D.rel(it.date)})` : "before tracking"}${extra}</div>
      </a>` : `<div class="card"><div class="label">${lbl}</div><div class="muted small" style="margin-top:6px">—</div></div>`;

    app.innerHTML = `<div class="wrap">
      <a class="small muted row" href="#/" style="gap:4px;margin-bottom:14px">${ICON.back.replace("<svg", '<svg width="14" height="14"')} All tracks</a>
      <h1>AI</h1>
      <div class="muted">${esc(R.title)} — Learn, build, ship.</div>
      <div class="small faint" style="margin-top:2px">${esc(R.stack)}</div>

      <div class="daterange">
        <div><div class="label">Started</div><div class="v">${D.fmt(sum.start)}</div><div class="tiny muted">Warm-up done 30 Sep</div></div>
        <div><div class="label">Ends (projected)</div><div class="v">${D.fmt(sum.end)}</div>
          <div class="tiny ${shift > 0 ? "" : "muted"}" style="${shift > 0 ? "color:var(--red)" : ""}">${shift > 0 ? `+${shift} days vs plan (${D.fmt(sum.originalEnd)})` : shift < 0 ? `${-shift} days ahead of plan` : "On the original plan"}</div></div>
        <div><div class="label">Now</div><div class="v">Week ${sum.currentWeek}</div><div class="tiny muted">${next ? esc(sessionLabel(next.s)) : "Complete"}</div></div>
      </div>

      <div class="section">${statsRow(sum)}</div>

      <div class="section">${todayCard}</div>

      <div class="section grid2">
        ${mini("Last session", last, last && last.status === "done" ? " · ✓" : "")}
        ${mini(isToday || !next ? "Up next" : "Up next", isToday ? sum.afterNext : next)}
      </div>

      <div class="section">
        <div class="section-title"><h2>This week</h2><a class="small muted" href="#/roadmap">Full roadmap →</a></div>
        ${weekStrip(sum)}
      </div>

      <div class="section">
        <div class="section-title"><h2>Activity</h2><span class="small muted">since 1 Oct</span></div>
        ${heatmap(sum)}
      </div>

      <div class="section">
        <div class="section-title"><h2>Quick notes</h2><a class="small muted" href="#/notes">All notes →</a></div>
        <textarea class="note" id="qn" placeholder="Jot something down… (Ctrl+Enter to save)"></textarea>
        <div class="row between" style="margin-top:8px"><span class="tiny faint">Saved on this device only (localStorage)</span><button class="btn sm primary" id="qnSave">Save note</button></div>
        <div style="margin-top:12px" id="qnList">${quickNotes(3)}</div>
      </div>

      ${jobNudge(sum)}

      <div class="section">
        <div class="section-title"><h2>Badges</h2><span class="small muted">${C.badges().filter((b) => b.got).length}/${C.badges().length}</span></div>
        <div class="badges">${C.badges().map((b) => `<div class="badge ${b.got ? "" : "locked"}"><div class="nm">${esc(b.name)}</div><div class="ds">${esc(b.desc)}</div><div class="tiny" style="margin-top:6px;color:${b.got ? "var(--green)" : "var(--faint)"}">${b.got ? "Unlocked" : "Locked"}</div></div>`).join("")}</div>
      </div>
    </div>`;

    bindCommon();
    const qn = $("#qn");
    const saveQ = () => { const v = qn.value.trim(); if (!v) return; C.actions.addQuickNote(v); qn.value = ""; $("#qnList").innerHTML = quickNotes(3); bindQuick(); toast("Note saved · +5 XP"); };
    $("#qnSave").onclick = saveQ;
    qn.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) saveQ(); });
    bindQuick();
  }

  function weekStrip(sum) {
    const items = sum.items;
    const byDate = {};
    items.forEach((it) => { if (it.date) (byDate[it.date] = byDate[it.date] || []).push(it); });
    // strip: 3 days back → 3 days ahead
    let html = "";
    for (let i = -3; i <= 3; i++) {
      const k = D.addDays(sum.today, i), d = D.fromKey(k);
      const its = byDate[k] || [];
      const sess = its.filter((x) => x.kind === "session");
      const free = its.find((x) => x.kind === "free");
      const done = sess.some((x) => x.status === "done");
      let t = "";
      if (sess.length) t = sess.map((x) => `W${x.s.week}·S${x.s.num}`).join(", ");
      else if (free) t = "Free day";
      else if (k < sum.today) t = "—";
      html += `<div class="day ${k === sum.today ? "today" : ""} ${done ? "done" : ""} ${!sess.length && free ? "free" : ""}">
        <div class="d">${D.DOW[d.getDay()]}</div><div class="n">${d.getDate()}</div><div class="t">${done ? "✓ " : ""}${t}</div></div>`;
    }
    return `<div class="weekstrip">${html}</div>`;
  }

  function heatmap(sum) {
    const counts = {};
    Object.values(C.state.sessions).forEach((x) => { if (x.status === "done" && x.completedOn) counts[x.completedOn] = (counts[x.completedOn] || 0) + 1; });
    const planned = new Set(sum.items.filter((i) => i.kind === "session" && i.status === "pending").map((i) => i.date));
    const rest = new Set(sum.items.filter((i) => i.kind === "free" && i.date).map((i) => i.date));
    // start on the Monday on/before 1 Oct, end on the Sunday on/after the end date
    let start = sum.start; while (D.fromKey(start).getDay() !== 1) start = D.addDays(start, -1);
    let end = sum.end || sum.today; while (D.fromKey(end).getDay() !== 0) end = D.addDays(end, 1);
    let html = "";
    for (let k = start; k <= end; k = D.addDays(k, 1)) {
      const c = counts[k] || 0;
      let cls = c >= 2 ? "l2" : c === 1 ? "l1" : "";
      if (!c && k > sum.today && planned.has(k)) cls = "planned";
      if (!c && rest.has(k)) cls = "rest";
      if (!c && k < C.state.createdOn) cls = "pre";
      if (k < sum.start) cls = "rest";
      html += `<i class="${cls} ${k === sum.today ? "now" : ""}" title="${D.fmt(k)}${c ? ` · ${c} session${c > 1 ? "s" : ""}` : ""}"></i>`;
    }
    return `<div class="heat">${html}</div>
      <div class="legend"><span><i style="background:var(--soft);opacity:.5"></i>before tracking</span><span><i style="background:var(--soft-2)"></i>missed</span><span><i style="background:var(--green)"></i>done</span><span><i style="outline:1px solid var(--line);outline-offset:-1px"></i>planned</span><span><i style="outline:1px dashed var(--line);outline-offset:-1px"></i>free day</span></div>`;
  }

  function quickNotes(limit) {
    const notes = [...C.state.quickNotes].sort((a, b) => (b.pinned - a.pinned) || b.createdAt.localeCompare(a.createdAt));
    const list = limit ? notes.slice(0, limit) : notes;
    if (!list.length) return `<div class="small faint">No notes yet.</div>`;
    return list.map((n) => `<div class="qnote ${n.pinned ? "pinned" : ""}" data-q="${n.id}">
      <div class="body">${esc(n.text)}</div>
      <div class="meta"><span class="tiny faint">${new Date(n.createdAt).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
      <span class="row"><button class="tiny-btn" data-qa="pin">${n.pinned ? "Unpin" : "Pin"}</button><button class="tiny-btn" data-qa="copy">Copy</button><button class="tiny-btn" data-qa="edit">Edit</button><button class="tiny-btn" data-qa="del">Delete</button></span></div>
    </div>`).join("") + (limit && notes.length > limit ? `<a class="small muted" href="#/notes" style="display:block;margin-top:8px">+${notes.length - limit} more</a>` : "");
  }
  function bindQuick() {
    $$("[data-q]").forEach((el) => {
      const id = el.dataset.q, n = C.state.quickNotes.find((q) => q.id === id);
      el.querySelectorAll("[data-qa]").forEach((b) => b.onclick = () => {
        const a = b.dataset.qa;
        if (a === "pin") C.actions.updateQuickNote(id, { pinned: !n.pinned });
        if (a === "copy") return copy(n.text);
        if (a === "del") { if (!confirm("Delete this note?")) return; C.actions.deleteQuickNote(id); }
        if (a === "edit") {
          const body = el.querySelector(".body");
          body.innerHTML = `<textarea class="note">${esc(n.text)}</textarea><div class="row" style="margin-top:6px"><button class="btn sm primary">Save</button><button class="btn sm">Cancel</button></div>`;
          const [sv, cn] = body.querySelectorAll("button");
          sv.onclick = () => { C.actions.updateQuickNote(id, { text: body.querySelector("textarea").value }); route(); };
          cn.onclick = () => route();
          return;
        }
        route();
      });
    });
  }

  function jobNudge(sum) {
    const wk = sum.currentWeek;
    const groups = R.jobTrack.filter((g) => g.fromWeek <= wk);
    if (!groups.length) return "";
    const open = [];
    groups.forEach((g) => g.items.forEach((it, i) => { if (!C.state.job[`${g.id}-${i}`]) open.push(it); }));
    const out = C.state.outreach[wk] || 0;
    return `<div class="section"><div class="card amber">
      <div class="row between"><div class="label" style="color:var(--amber)">Job Track · Week ${wk}</div><a class="small" href="#/job">Open →</a></div>
      <div style="margin-top:6px">${open.length ? `${open.length} open item${open.length > 1 ? "s" : ""} — next: <b>${esc(open[0])}</b>` : "All set-up items done. Keep the outreach running."}</div>
      ${wk >= 6 ? `<div class="small" style="margin-top:6px">Outreach this week: <b>${out}/10</b></div>` : ""}
    </div></div>`;
  }

  function bindCommon() {
    $$("[data-done]").forEach((b) => b.onclick = () => { completeSession(b.dataset.done); route(); });
    $$("[data-copyprompt]").forEach((b) => b.onclick = () => copy(tutorPrompt(C.byId[b.dataset.copyprompt]), "Tutor prompt copied — paste it into your AI"));
  }

  /* ================= HUB (home) ================= */
  const T = window.Tracks;
  const crumb = (href, label) => `<a class="small muted row" href="${href}" style="gap:4px;margin-bottom:14px">${ICON.back.replace("<svg", '<svg width="14" height="14"')} ${esc(label)}</a>`;
  const totalXp = () => C.xp() + T.xp();

  function viewHub() {
    const name = C.state.settings.name || "there";
    const sum = C.summary();
    const os = T.overallStreak();
    const xp = totalXp(), lv = C.level(xp);
    const all = T.list.map((t) => T.stats(t.id));
    const doneAll = sum.doneCount + all.reduce((a, s) => a + s.done, 0);
    const totalAll = sum.total + all.reduce((a, s) => a + s.total, 0);

    const aiNext = sum.next;
    const aiCard = `<a class="card track-card" href="#/ai">
      <div class="row between"><h3>AI</h3><span class="chip blue">${sum.pct}%</span></div>
      <div class="small muted">AI Full-Stack / FDE roadmap · ends ${D.fmt(sum.end)}</div>
      <div class="bar" style="margin-top:12px"><i style="width:${sum.pct}%"></i></div>
      <div class="small" style="margin-top:10px">${aiNext ? `<span class="muted">${aiNext.date === sum.today ? "Today" : D.fmt(aiNext.date)}:</span> W${aiNext.s.week}·S${aiNext.s.num} ${esc(aiNext.s.title)}` : "Roadmap complete"}</div>
      <div class="tiny faint" style="margin-top:4px">${sum.doneCount}/${sum.total} sessions</div>
    </a>`;

    const trackCard = (t) => {
      const s = T.stats(t.id);
      return `<a class="card track-card" href="#/t/${t.id}">
        <div class="row between"><h3>${esc(t.name)}</h3><span class="chip ${s.pct === 100 ? "green" : ""}">${s.pct}%</span></div>
        <div class="small muted">${esc(t.tagline)}</div>
        <div class="bar green" style="margin-top:12px"><i style="width:${s.pct}%"></i></div>
        <div class="small" style="margin-top:10px">${s.next ? `<span class="muted">${T.statusOf(s.next.id) === "doing" ? "In progress" : "Next"}:</span> ${esc(s.next.title)}` : "All done"}</div>
        <div class="tiny faint" style="margin-top:4px">${s.done}/${s.total} ${t.itemWord}s</div>
      </a>`;
    };

    app.innerHTML = `<div class="wrap">
      <div class="hello"><h1>Hey, <span class="avatar"><i></i><i></i></span> <span class="under">${esc(name)}</span></h1></div>
      <div class="muted">What are we learning today?</div>
      <div class="small faint" style="margin-top:2px">AI · DSA · System Design · Full-stack</div>

      <div class="section grid4">
        <div class="stat"><div class="v">${os.current}</div><div class="k">day streak, all tracks</div></div>
        <div class="stat"><div class="v">${xp.toLocaleString()}</div><div class="k">total XP · Lv ${lv.n}</div></div>
        <div class="stat"><div class="v">${os.today}</div><div class="k">finished today</div></div>
        <div class="stat"><div class="v">${Math.round((doneAll / totalAll) * 100)}%</div><div class="k">${doneAll}/${totalAll} overall</div></div>
      </div>
      <div class="card soft" style="margin-top:10px;padding:12px 14px">
        <div class="row between small"><span><b>Lv ${lv.n}</b> · ${esc(lv.title)}</span><span class="muted">${lv.max ? "Max level" : `${(lv.ceil - xp).toLocaleString()} XP to Lv ${lv.n + 1}`}</span></div>
        <div class="bar" style="margin-top:8px"><i style="width:${Math.round(lv.pct * 100)}%"></i></div>
      </div>

      <div class="section"><div class="section-title"><h2>Tracks</h2></div>
        <div class="grid2">${aiCard}${T.list.filter((t) => t.id !== "other").map(trackCard).join("")}${trackCard(T.byId.other)}</div>
      </div>

      <div class="section"><div class="section-title"><h2>Quick notes</h2><a class="small muted" href="#/notes">All notes →</a></div>
        <textarea class="note" id="qn" placeholder="Jot something down… (Ctrl+Enter to save)"></textarea>
        <div class="row between" style="margin-top:8px"><span class="tiny faint">Saved on this device only</span><button class="btn sm primary" id="qnSave">Save note</button></div>
        <div style="margin-top:12px" id="qnList">${quickNotes(3)}</div>
      </div>
    </div>`;
    const qn = $("#qn");
    const saveQ = () => { const v = qn.value.trim(); if (!v) return; C.actions.addQuickNote(v); qn.value = ""; $("#qnList").innerHTML = quickNotes(3); bindQuick(); toast("Note saved · +5 XP"); };
    $("#qnSave").onclick = saveQ;
    qn.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) saveQ(); });
    bindQuick();
  }

  /* ================= TRACK LIST ================= */
  let trackFilter = "all";
  function completeTrackItem(t, it) {
    const before = C.level(totalXp());
    T.actions.setStatus(it.id, "done");
    const after = C.level(totalXp());
    confetti();
    const s = T.stats(t.id), os = T.overallStreak();
    modal(`<h2 style="margin:0 0 4px">${after.n > before.n ? `Level ${after.n} — ${esc(after.title)}` : "Nice — done!"}</h2>
      <p class="muted" style="margin:0 0 4px">${esc(it.title)}</p>
      <p style="margin:10px 0"><span class="chip blue">+${t.xp} XP</span> <span class="chip amber">${os.current}-day streak</span></p>
      <p class="small muted">${esc(t.name)}: ${s.done}/${s.total}${s.next ? ` · next: <b>${esc(s.next.title)}</b>` : " — track complete!"}</p>
      <div class="actions" style="justify-content:center">${s.next ? `<a class="btn primary" data-close href="#/t/${t.id}/${s.next.id}">Next ${t.itemWord}</a>` : ""}<button class="btn" data-close>Close</button></div>`);
  }

  function viewTrack(tid) {
    const t = T.byId[tid]; if (!t) return viewNotFound();
    const s = T.stats(tid);
    const groups = T.groupsOf(tid);
    const nxt = s.next;
    const row = (it) => {
      const st = T.statusOf(it.id);
      const show = trackFilter === "all" || (trackFilter === "done" ? st === "done" : st !== "done");
      return `<div class="srow ${nxt && nxt.id === it.id ? "current" : ""} ${show ? "" : "hidden"}" data-open="${it.id}">
        <button class="status-ico ${st === "done" ? "done" : st === "doing" ? "now" : ""}" data-tick="${it.id}" title="${st === "done" ? "Mark not done" : "Mark done"}" style="padding:0;background-clip:padding-box">${st === "done" ? "✓" : ""}</button>
        <span class="num">#${it.n}</span>
        <span class="title">${esc(it.title)}</span>
        ${st === "doing" ? `<span class="chip blue">in progress</span>` : ""}
        ${T.rec(it.id).notes ? `<span class="tiny faint">notes</span>` : ""}
      </div>`;
    };
    app.innerHTML = `<div class="wrap">
      ${crumb("#/", "All tracks")}
      <h1>${esc(t.name)}</h1>
      <div class="muted">${esc(t.tagline)}</div>
      <div class="row" style="margin-top:14px"><div class="bar green grow"><i style="width:${s.pct}%"></i></div><span class="small mono">${s.done}/${s.total}</span></div>

      ${nxt ? `<div class="section"><div class="card hero">
        <div class="row between"><span class="chip ${T.statusOf(nxt.id) === "doing" ? "blue" : ""}">${T.statusOf(nxt.id) === "doing" ? "In progress" : "Up next"}</span><span class="tiny faint">#${nxt.n} · ${esc(nxt.group)}</span></div>
        <h2 style="margin:10px 0 4px">${esc(nxt.title)}</h2>
        ${nxt.sub.length ? `<ul class="learn-preview">${nxt.sub.slice(0, 4).map((x) => `<li>${esc(x)}</li>`).join("")}${nxt.sub.length > 4 ? `<li>+${nxt.sub.length - 4} more</li>` : ""}</ul>` : ""}
        <div class="actions">
          <a class="btn primary" href="#/ts/${tid}/${nxt.id}">${ICON.play} Let's start</a>
          <button class="btn" data-donebig="${nxt.id}">${ICON.check} Mark done</button>
          <a class="btn" href="#/t/${tid}/${nxt.id}">Details</a>
        </div></div></div>` : `<div class="section"><div class="card hero"><h2>Track complete</h2><p class="muted">Every ${t.itemWord} is done.</p></div></div>`}

      <div class="section row" id="filters">
        ${["all", "todo", "done"].map((f) => `<button class="btn sm ${trackFilter === f ? "primary" : ""}" data-filter="${f}">${f === "all" ? "All" : f === "todo" ? "To do" : "Done"}</button>`).join("")}
      </div>

      ${groups.map((g) => {
        const gd = g.items.filter((i) => T.statusOf(i.id) === "done").length;
        return `<div class="week-block"><div class="row between" style="margin-bottom:6px"><h3>${esc(g.name)}</h3><span class="small muted mono">${gd}/${g.items.length}</span></div>
          ${g.items.map(row).join("")}</div>`;
      }).join("")}

      ${t.allowCustom ? `<div class="section"><div class="card"><h3>Add your own topic</h3>
        <input class="field" id="ctitle" placeholder="Topic, e.g. Redis internals" style="margin-top:10px">
        <textarea class="note" id="csub" placeholder="Sub-topics, one per line (optional)" style="margin-top:8px;min-height:70px"></textarea>
        <div class="row" style="margin-top:8px;justify-content:flex-end"><button class="btn sm primary" id="cadd">${ICON.plus} Add topic</button></div></div></div>` : ""}

      ${t.tips ? `<div class="section"><div class="card soft"><div class="label">Tips</div><ul class="learn-preview">${t.tips.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>` : ""}
    </div>`;

    $$("[data-open]").forEach((r) => r.onclick = (e) => { if (!e.target.closest("[data-tick]")) location.hash = `#/t/${tid}/${r.dataset.open}`; });
    $$("[data-tick]").forEach((b) => b.onclick = (e) => {
      e.stopPropagation();
      const id = b.dataset.tick;
      if (T.statusOf(id) === "done") { T.actions.setStatus(id, "todo"); viewTrack(tid); }
      else { T.actions.setStatus(id, "done"); toast(`✓ ${T.item(tid, id).title} · +${t.xp} XP`); viewTrack(tid); }
    });
    $$("[data-donebig]").forEach((b) => b.onclick = () => { completeTrackItem(t, T.item(tid, b.dataset.donebig)); viewTrack(tid); });
    $$("[data-filter]").forEach((b) => b.onclick = () => { trackFilter = b.dataset.filter; viewTrack(tid); });
    if ($("#cadd")) $("#cadd").onclick = () => {
      const title = $("#ctitle").value.trim(); if (!title) return toast("Give the topic a name");
      const sub = $("#csub").value.split("\n").map((x) => x.trim()).filter(Boolean);
      T.actions.addCustom(tid, title, sub); toast("Topic added"); viewTrack(tid);
    };
  }

  /* ================= TRACK ITEM ================= */
  function trackChecklist(it) {
    const ch = T.rec(it.id).checks || {};
    return `<ul class="checks">${it.sub.map((x, i) => `<li class="${ch["c" + i] ? "on" : ""}" data-tcheck="c${i}"><span class="box"></span><span class="txt">${esc(x)}</span></li>`).join("")}</ul>`;
  }
  function bindTrackChecks(it) {
    $$("[data-tcheck]").forEach((li) => li.onclick = () => { T.actions.toggleCheck(it.id, li.dataset.tcheck); li.classList.toggle("on"); });
  }
  function bindTrackNotes(it) {
    let tmr;
    $("#tnote").addEventListener("input", (e) => { clearTimeout(tmr); $("#saved").textContent = "saving…"; tmr = setTimeout(() => { T.actions.setNotes(it.id, e.target.value); $("#saved").textContent = "saved ✓"; }, 400); });
    $("#copyNote").onclick = () => copy($("#tnote").value || "");
    // Tab inserts spaces in code notes instead of leaving the field
    $("#tnote").addEventListener("keydown", (e) => {
      if (e.key !== "Tab" || !e.target.classList.contains("mono")) return;
      e.preventDefault(); const ta = e.target, s = ta.selectionStart;
      ta.value = ta.value.slice(0, s) + "  " + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 2;
      ta.dispatchEvent(new Event("input"));
    });
  }
  const refTable = (tb) => `<div class="tablewrap"><table class="t"><thead><tr>${tb.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>${tb.rows.map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="muted"' : ""}>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

  function viewTrackItem(tid, id) {
    const t = T.byId[tid], it = t && T.item(tid, id); if (!it) return viewNotFound();
    const r = T.rec(id), st = T.statusOf(id);
    const all = T.itemsOf(tid), idx = all.findIndex((x) => x.id === id);
    const prev = all[idx - 1], nxt = all[idx + 1];
    app.innerHTML = `<div class="wrap">
      ${crumb(`#/t/${tid}`, t.name)}
      <div class="label">${esc(t.name)} · ${esc(it.group)} · #${it.n}</div>
      <h1 style="margin-top:6px">${esc(it.title)}</h1>
      <div class="row" style="margin-top:8px">
        <span class="chip ${st === "done" ? "green" : st === "doing" ? "blue" : ""}">${st === "done" ? "✓ Done" : st === "doing" ? "In progress" : "To do"}</span>
        ${r.doneOn ? `<span class="small muted">finished ${D.fmt(r.doneOn)}</span>` : ""}
      </div>
      <div class="actions">
        <a class="btn primary" href="#/ts/${tid}/${id}">${ICON.play} Let's start</a>
        ${st !== "done" ? `<button class="btn" id="idone">${ICON.check} Mark done</button>` : `<button class="btn" data-ist="todo">Mark not done</button>`}
        ${st === "todo" ? `<button class="btn ghost" data-ist="doing">Mark in progress</button>` : ""}
        ${it.custom ? `<button class="btn ghost" id="iremove" style="color:var(--red)">Remove topic</button>` : ""}
      </div>
      ${it.sub.length ? `<div class="section"><h3>${tid === "sd" ? "Checklist" : "Cover"}</h3><div style="margin-top:8px">${trackChecklist(it)}</div></div>` : ""}
      ${it.done ? `<div class="section"><div class="done-when"><div class="label" style="color:var(--green)">Done when</div>${esc(it.done)}</div></div>` : ""}
      ${it.table ? `<div class="section"><h3>Reference</h3><div style="margin-top:8px">${refTable(it.table)}</div></div>` : ""}
      <div class="section"><div class="section-title"><h3>${t.codeNotes ? "Approach & code" : "Notes"}</h3><span class="tiny faint" id="saved">autosaves</span></div>
        <textarea class="note ${t.codeNotes ? "mono" : ""}" id="tnote" style="min-height:${t.codeNotes ? 240 : 160}px" placeholder="${t.codeNotes ? "Approach, code, time & space complexity, edge cases…" : "Key takeaways, trade-offs, links…"}">${esc(r.notes || "")}</textarea>
        <div class="row" style="margin-top:8px"><button class="btn sm" id="copyNote">${ICON.copy} Copy</button>
        ${localStorage.getItem(C.BOARD_PREFIX + "t." + id) ? `<a class="btn sm" href="#/ts/${tid}/${id}">Open whiteboard</a>` : ""}</div>
      </div>
      <div class="section row between">
        ${prev ? `<a class="btn sm" href="#/t/${tid}/${prev.id}">← #${prev.n}</a>` : "<span></span>"}
        ${nxt ? `<a class="btn sm" href="#/t/${tid}/${nxt.id}">#${nxt.n} →</a>` : ""}
      </div>
    </div>`;
    bindTrackChecks(it); bindTrackNotes(it);
    if ($("#idone")) $("#idone").onclick = () => { completeTrackItem(t, it); viewTrackItem(tid, id); };
    $$("[data-ist]").forEach((b) => b.onclick = () => { T.actions.setStatus(id, b.dataset.ist); viewTrackItem(tid, id); });
    if ($("#iremove")) $("#iremove").onclick = () => { if (confirm("Remove this topic and its notes?")) { T.actions.removeCustom(tid, id); location.hash = `#/t/${tid}`; } };
  }

  /* ================= TRACK STUDY (whiteboard) ================= */
  function viewTrackStudy(tid, id) {
    const t = T.byId[tid], it = t && T.item(tid, id); if (!it) return viewNotFound();
    document.body.classList.add("studying");
    if (T.statusOf(id) === "todo") T.actions.setStatus(id, "doing");
    const r = T.rec(id);
    const TKEY = "lai.timer.t." + id;
    let tstate; try { tstate = JSON.parse(sessionStorage.getItem(TKEY)) || null; } catch (e) { tstate = null; }
    tstate = tstate || { elapsed: 0, running: false, since: null };
    app.innerHTML = `<div class="study">
      <div class="study-bar">
        <a class="icon-btn" href="#/t/${tid}/${id}" title="Back">${ICON.back}</a>
        <div class="ttl"><div class="tiny muted">${esc(t.name)} · #${it.n}</div><b>${esc(it.title)}</b></div>
        <span class="timer" id="timer">00:00</span>
        <button class="icon-btn" id="tToggle" title="Start / pause timer">${ICON.play}</button>
        <button class="icon-btn" id="tReset" title="Reset timer">${ICON.reset}</button>
        ${T.statusOf(id) !== "done" ? `<button class="btn sm primary" id="studyDone">${ICON.check} Complete</button>` : `<span class="chip green">✓ Done</span>`}
        <button class="icon-btn" id="sideToggle" title="Checklist & notes panel">${ICON.panel}</button>
      </div>
      <div class="study-main">
        <div class="board" id="board"><div class="loading">Loading whiteboard…</div></div>
        <aside class="side" id="side">
          <div class="tabs"><button class="${it.sub.length || it.table ? "on" : ""}" data-tab="session">${it.sub.length ? "Checklist" : "Topic"}</button><button class="${it.sub.length || it.table ? "" : "on"}" data-tab="notes">${t.codeNotes ? "Code" : "Notes"}</button></div>
          <div class="side-body ${it.sub.length || it.table ? "" : "hidden"}" id="tab-session">
            ${it.sub.length ? trackChecklist(it) : `<p class="small muted">${esc(it.title)}</p>`}
            ${it.done ? `<div class="done-when small" style="margin-top:14px"><b>Done when</b> — ${esc(it.done)}</div>` : ""}
            ${it.table ? `<div style="margin-top:14px">${refTable(it.table)}</div>` : ""}
          </div>
          <div class="side-body ${it.sub.length || it.table ? "hidden" : ""}" id="tab-notes">
            <textarea class="note ${t.codeNotes ? "mono" : ""}" id="tnote" placeholder="${t.codeNotes ? "Approach, code, complexity…" : "Notes — autosaved to this device."}">${esc(r.notes || "")}</textarea>
            <div class="row between" style="margin-top:8px"><span class="tiny faint" id="saved">autosaves</span><button class="btn sm" id="copyNote">${ICON.copy} Copy</button></div>
          </div>
        </aside>
      </div>
    </div>`;
    bindTrackChecks(it); bindTrackNotes(it);
    if (innerWidth < 820) $("#side").classList.add("closed");
    $("#sideToggle").onclick = () => $("#side").classList.toggle("closed");
    $$("[data-tab]").forEach((b) => b.onclick = () => {
      $$("[data-tab]").forEach((x) => x.classList.toggle("on", x === b));
      $("#tab-session").classList.toggle("hidden", b.dataset.tab !== "session");
      $("#tab-notes").classList.toggle("hidden", b.dataset.tab !== "notes");
    });
    const doneBtn = $("#studyDone");
    if (doneBtn) doneBtn.onclick = () => { completeTrackItem(t, it); const el = $("#studyDone"); if (el) el.outerHTML = `<span class="chip green">✓ Done</span>`; };

    const elapsed = () => tstate.elapsed + (tstate.running ? (Date.now() - tstate.since) / 1000 : 0);
    const persist = () => sessionStorage.setItem(TKEY, JSON.stringify(tstate));
    const paint = () => {
      const e = Math.floor(elapsed()), el = $("#timer"); if (!el) return;
      el.textContent = `${String(Math.floor(e / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
      el.className = "timer " + (tstate.running ? "run" : "");
      $("#tToggle").innerHTML = tstate.running ? ICON.pause : ICON.play;
    };
    $("#tToggle").onclick = () => {
      if (tstate.running) { tstate.elapsed = elapsed(); tstate.running = false; } else { tstate.running = true; tstate.since = Date.now(); }
      persist(); paint();
    };
    $("#tReset").onclick = () => { tstate = { elapsed: 0, running: false, since: null }; persist(); paint(); };
    clearInterval(studyTimer); studyTimer = setInterval(paint, 1000); paint();

    window.Board.mount($("#board"), "t." + id, { onUsed: () => T.actions.markBoarded(id) });
  }

  /* ================= ROADMAP ================= */
  function viewRoadmap() {
    const sum = C.summary();
    const items = sum.items;
    const openWeek = sum.currentWeek;
    let html = `<div class="wrap">
      <h1>Roadmap</h1>
      <div class="muted">Each week: 6 sessions + 1 free day · Weeks 1–4: 40 min · Weeks 5–9: 80 min</div>
      <div class="card soft small" style="margin-top:16px">Dates shift automatically. Miss a day and every pending session moves forward by one; finish early and they pull in. Ends <b>${D.fmt(sum.end)}</b>${sum.shift > 0 ? ` (+${sum.shift} days vs ${D.fmt(sum.originalEnd)})` : ""}.</div>
      <div class="section">
      <div class="week-block"><div class="week-head" onclick="location.hash='#/s/w0s1'"><div class="row">${statusIco(C.statusOf("w0s1"))}<div><div class="serif" style="font-size:19px">Warm-up</div><div class="small muted">Done 30 Sep · setup + decide RAG corpus & agent task</div></div></div></div></div>`;
    for (const w of R.weeks) {
      const wi = items.filter((i) => (i.kind === "session" && i.s.week === w.n) || (i.kind === "free" && i.week === w.n));
      const ws = wi.filter((i) => i.kind === "session");
      const done = ws.filter((i) => i.status !== "pending").length;
      const first = ws[0].date, free = wi.find((i) => i.kind === "free");
      const range = !first && !(free && free.date) ? "done before tracking"
        : `${first ? D.fmt(first, false) : "earlier"} → ${free && free.date ? D.fmt(free.date, false) : "—"}`;
      const open = w.n === openWeek;
      html += `<div class="week-block" data-week="${w.n}">
        <div class="week-head" data-toggle="${w.n}">
          <div class="row" style="flex-wrap:nowrap;min-width:0"><div class="mini-ring" style="--p:${Math.round((done / 6) * 100)}"></div>
          <div style="min-width:0"><div class="serif" style="font-size:19px">Week ${w.n} — ${esc(w.title)}</div>
          <div class="small muted">${range} · ${w.minutes} min · ${done}/6 <span class="faint">· plan: ${esc(w.dates)}</span></div></div></div>
          <span class="muted">${open ? "▾" : "▸"}</span>
        </div>
        <div class="week-body ${open ? "" : "hidden"}" style="margin-top:8px">
          ${w.rule ? `<div class="small" style="margin:4px 0 8px"><span class="chip blue">Rule</span> ${esc(w.rule)}</div>` : ""}
          ${ws.map((it) => { const isNow = sum.next && sum.next.s.id === it.s.id; return `<a class="srow ${isNow ? "current" : ""}" href="#/s/${it.s.id}">
            ${statusIco(it.status, isNow)}<span class="num">S${it.s.num}</span>
            <span class="title">${esc(it.s.title)}${it.s.project ? ' <span class="chip">project</span>' : ""}</span>
            <span class="when">${it.status === "pending" ? `${D.fmt(it.date)}` : it.date ? `✓ ${D.fmt(it.date)}` : "✓ earlier"}</span></a>`; }).join("")}
          <div class="srow" style="cursor:default"><span class="status-ico" style="border-style:dashed"></span><span class="num">Free</span>
            <span class="title small muted">${esc(w.free)}</span><span class="when">${free && free.date ? D.fmt(free.date) : "—"}</span></div>
          ${w.job ? `<div class="small" style="margin:6px 12px"><span class="chip amber">Job Track</span> ${esc(w.job)}</div>` : ""}
        </div></div>`;
    }
    html += `</div>
      <div class="section"><div class="card"><div class="label">Explicitly cut</div><p class="small" style="margin:6px 0 0">${esc(R.cut)}</p></div>
      <div class="card"><div class="label">One honest note</div><p class="small" style="margin:6px 0 0">${esc(R.honestNote)}</p></div></div>
    </div>`;
    app.innerHTML = html;
    $$("[data-toggle]").forEach((h) => h.onclick = () => {
      const body = h.parentElement.querySelector(".week-body");
      body.classList.toggle("hidden");
      h.querySelector(":scope > span").textContent = body.classList.contains("hidden") ? "▸" : "▾";
    });
    const cur = $(".srow.current"); if (cur) setTimeout(() => cur.scrollIntoView({ block: "center" }), 50);
  }

  /* ================= SESSION ================= */
  function checklist(s, kind, list) {
    const x = C.state.sessions[s.id] || {}, ch = x.checks || {};
    return `<ul class="checks">${list.map((t, i) => { const k = `${kind}${i}`; return `<li class="${ch[k] ? "on" : ""}" data-check="${k}"><span class="box"></span><span class="txt">${esc(t)}</span></li>`; }).join("")}</ul>`;
  }
  function bindChecks(s, rerender) {
    $$("[data-check]").forEach((li) => li.onclick = () => {
      C.actions.toggleCheck(s.id, li.dataset.check);
      li.classList.toggle("on");
      if (rerender) rerender();
    });
  }
  function viewSession(id) {
    const s = C.byId[id]; if (!s) return viewNotFound();
    const sum = C.summary();
    const it = sum.items.find((i) => i.kind === "session" && i.s.id === id);
    const x = C.state.sessions[id] || {}, status = C.statusOf(id);
    const idx = C.sessions.findIndex((q) => q.id === id);
    const prev = idx > 0 ? C.sessions[idx - 1] : (idx === 0 ? C.byId.w0s1 : null), nxt = idx >= 0 ? C.sessions[idx + 1] : C.sessions[0];
    const when = status === "pending" ? `Scheduled ${D.fmt(it && it.date)} (${D.rel(it && it.date)})` : x.completedOn ? `${status === "done" ? "Completed" : "Skipped"} ${D.fmt(x.completedOn)}` : "Completed before tracking";
    app.innerHTML = `<div class="wrap">
      <a class="small muted row" href="#/roadmap" style="gap:4px">${ICON.back.replace("<svg", '<svg width="14" height="14"')} Roadmap</a>
      <div class="label" style="margin-top:18px">${esc(sessionLabel(s))} · ${esc(s.weekTitle)} · ${s.minutes} min</div>
      <h1 style="margin-top:6px">${esc(s.title)}</h1>
      <div class="row" style="margin-top:8px">
        <span class="chip ${status === "done" ? "green" : status === "skipped" ? "" : "blue"}">${status === "done" ? "✓ Completed" : status === "skipped" ? "Skipped" : "Not completed"}</span>
        <span class="small muted">${when}</span>
        ${s.originalDate ? `<span class="small faint">· original plan ${D.fmt(s.originalDate)}</span>` : ""}
      </div>
      <div class="actions">
        <a class="btn primary" href="#/study/${id}">${ICON.play} Let's start</a>
        ${status !== "done" ? `<button class="btn" data-done="${id}">${ICON.check} Mark completed</button>` : `<button class="btn" data-set="pending">Mark not completed</button>`}
        ${status === "pending" ? `<button class="btn ghost" data-set="skipped">Skip</button>` : status === "skipped" ? `<button class="btn ghost" data-set="pending">Un-skip</button>` : ""}
        <button class="btn ghost" data-copyprompt="${id}">${ICON.copy} Tutor prompt</button>
      </div>

      <div class="section"><h3>${esc(s.learnLabel || "Learn")}</h3><div style="margin-top:8px">${s.learn.length ? checklist(s, "l", s.learn) : `<p class="muted small">Nothing new.</p>`}</div></div>
      <div class="section"><h3>Build</h3><div style="margin-top:8px">${checklist(s, "b", s.build)}</div></div>
      ${s.extra ? `<div class="section"><h3>${esc(s.extra.label)}</h3><ul class="learn-preview">${s.extra.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>` : ""}
      ${s.done ? `<div class="section"><div class="done-when"><div class="label" style="color:var(--green)">Done when</div>${esc(s.done)}</div></div>` : ""}

      <div class="section"><div class="section-title"><h3>Notes</h3><span class="tiny faint" id="saved">autosaves</span></div>
        <textarea class="note" id="snote" style="min-height:160px" placeholder="3-line takeaway, gotchas, links…">${esc(x.notes || "")}</textarea>
        <div class="row" style="margin-top:8px"><button class="btn sm" id="copyNote">${ICON.copy} Copy notes</button>
        ${localStorage.getItem(C.BOARD_PREFIX + id) ? `<a class="btn sm" href="#/study/${id}">Open whiteboard</a>` : ""}</div>
      </div>

      <div class="section"><details><summary class="small muted" style="cursor:pointer">Tutor prompt for this session</summary>
        <pre class="prompt" style="margin-top:10px">${esc(tutorPrompt(s))}</pre></details></div>

      <div class="section row between">
        ${prev ? `<a class="btn sm" href="#/s/${prev.id}">← ${esc(prev.week === 0 ? "Warm-up" : `W${prev.week} S${prev.num}`)}</a>` : "<span></span>"}
        ${nxt ? `<a class="btn sm" href="#/s/${nxt.id}">W${nxt.week} S${nxt.num} →</a>` : ""}
      </div>
    </div>`;
    bindCommon();
    bindChecks(s);
    $$("[data-set]").forEach((b) => b.onclick = () => { C.actions.setStatus(id, b.dataset.set); route(); });
    let tmr; $("#snote").addEventListener("input", (e) => { clearTimeout(tmr); $("#saved").textContent = "saving…"; tmr = setTimeout(() => { C.actions.setNotes(id, e.target.value); $("#saved").textContent = "saved ✓"; }, 400); });
    $("#copyNote").onclick = () => copy($("#snote").value || "");
  }

  /* ================= STUDY (whiteboard) ================= */
  let studyTimer = null;
  function viewStudy(id) {
    const s = C.byId[id]; if (!s) return viewNotFound();
    document.body.classList.add("studying");
    const x = C.state.sessions[id] || {};
    const TKEY = "lai.timer." + id;
    let tstate; try { tstate = JSON.parse(sessionStorage.getItem(TKEY)) || null; } catch (e) { tstate = null; }
    tstate = tstate || { elapsed: 0, running: false, since: null };
    app.innerHTML = `<div class="study">
      <div class="study-bar">
        <a class="icon-btn" href="#/s/${id}" title="Back">${ICON.back}</a>
        <div class="ttl"><div class="tiny muted">${esc(sessionLabel(s))} · ${s.minutes} min</div><b>${esc(s.title)}</b></div>
        <span class="timer" id="timer">00:00</span>
        <button class="icon-btn" id="tToggle" title="Start / pause timer">${ICON.play}</button>
        <button class="icon-btn" id="tReset" title="Reset timer">${ICON.reset}</button>
        <button class="btn sm" data-copyprompt="${id}">${ICON.copy} Prompt</button>
        ${C.statusOf(id) !== "done" ? `<button class="btn sm primary" id="studyDone">${ICON.check} Complete</button>` : `<span class="chip green">✓ Completed</span>`}
        <button class="icon-btn" id="sideToggle" title="Session & notes panel">${ICON.panel}</button>
      </div>
      <div class="study-main">
        <div class="board" id="board"><div class="loading">Loading whiteboard…</div></div>
        <aside class="side" id="side">
          <div class="tabs"><button class="on" data-tab="session">Session</button><button data-tab="notes">Notes</button></div>
          <div class="side-body" id="tab-session">
            <div class="label">${esc(s.learnLabel || "Learn")}</div>${s.learn.length ? checklist(s, "l", s.learn) : `<p class="small muted">Nothing new. Assembly session.</p>`}
            <div class="label" style="margin-top:14px">Build</div>${checklist(s, "b", s.build)}
            ${s.done ? `<div class="done-when small" style="margin-top:14px"><b>Done when</b> — ${esc(s.done)}</div>` : ""}
          </div>
          <div class="side-body hidden" id="tab-notes">
            <textarea class="note" id="snote" placeholder="Notes for this session — autosaved to this device.">${esc(x.notes || "")}</textarea>
            <div class="row between" style="margin-top:8px"><span class="tiny faint" id="saved">autosaves</span><button class="btn sm" id="copyNote">${ICON.copy} Copy</button></div>
          </div>
        </aside>
      </div>
    </div>`;
    bindCommon();
    bindChecks(s);
    // side panel
    if (innerWidth < 820) $("#side").classList.add("closed");
    $("#sideToggle").onclick = () => $("#side").classList.toggle("closed");
    $$("[data-tab]").forEach((b) => b.onclick = () => {
      $$("[data-tab]").forEach((x) => x.classList.toggle("on", x === b));
      $("#tab-session").classList.toggle("hidden", b.dataset.tab !== "session");
      $("#tab-notes").classList.toggle("hidden", b.dataset.tab !== "notes");
    });
    let tmr; $("#snote").addEventListener("input", (e) => { clearTimeout(tmr); $("#saved").textContent = "saving…"; tmr = setTimeout(() => { C.actions.setNotes(id, e.target.value); $("#saved").textContent = "saved ✓"; }, 400); });
    $("#copyNote").onclick = () => copy($("#snote").value || "");
    const doneBtn = $("#studyDone");
    if (doneBtn) doneBtn.onclick = () => { completeSession(id); const el = $("#studyDone"); if (el) el.outerHTML = `<span class="chip green">✓ Completed</span>`; };

    // timer (counts up; turns red past the timebox)
    const limit = s.minutes * 60;
    const elapsed = () => tstate.elapsed + (tstate.running ? (Date.now() - tstate.since) / 1000 : 0);
    const persist = () => sessionStorage.setItem(TKEY, JSON.stringify(tstate));
    const paint = () => {
      const e = Math.floor(elapsed()), m = Math.floor(e / 60), sec = e % 60;
      const el = $("#timer"); if (!el) return;
      el.textContent = `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")} / ${s.minutes}`;
      el.className = "timer " + (e > limit ? "over" : tstate.running ? "run" : "");
      $("#tToggle").innerHTML = tstate.running ? ICON.pause : ICON.play;
    };
    $("#tToggle").onclick = () => {
      if (tstate.running) { tstate.elapsed = elapsed(); tstate.running = false; }
      else { tstate.running = true; tstate.since = Date.now(); }
      persist(); paint();
    };
    $("#tReset").onclick = () => { tstate = { elapsed: 0, running: false, since: null }; persist(); paint(); };
    clearInterval(studyTimer); studyTimer = setInterval(paint, 1000); paint();

    window.Board.mount($("#board"), id, { onUsed: (bid) => C.actions.markBoarded(bid) });
  }

  /* ================= NOTES ================= */
  function viewNotes() {
    const withNotes = C.sessions.filter((s) => (C.state.sessions[s.id] || {}).notes);
    if ((C.state.sessions.w0s1 || {}).notes) withNotes.unshift(C.byId.w0s1);
    const trackNotes = T.list.flatMap((t) => T.itemsOf(t.id).filter((it) => (T.rec(it.id).notes || "").trim()).map((it) => ({ t, it })));
    app.innerHTML = `<div class="wrap">
      <h1>Notes</h1><div class="muted">Everything stays on this device.</div>
      <div class="section"><input class="field" id="search" placeholder="Search notes…"></div>
      <div class="section"><div class="section-title"><h2>Quick notes</h2></div>
        <textarea class="note" id="qn" placeholder="New note… (Ctrl+Enter to save)"></textarea>
        <div class="row" style="margin-top:8px;justify-content:flex-end"><button class="btn sm primary" id="qnSave">Save note</button></div>
        <div style="margin-top:12px" id="qnList">${quickNotes(0)}</div>
      </div>
      <div class="section"><div class="section-title"><h2>Session notes</h2><button class="btn sm" id="copyAll">${ICON.copy} Copy all as Markdown</button></div>
        ${withNotes.length ? withNotes.map((s) => `<a class="card" href="#/s/${s.id}" style="display:block" data-searchable>
          <div class="label">${esc(sessionLabel(s))}</div><div class="serif" style="font-size:18px">${esc(s.title)}</div>
          <div class="small muted" style="white-space:pre-wrap;margin-top:6px;max-height:120px;overflow:hidden">${esc(C.state.sessions[s.id].notes)}</div></a>`).join("") : `<p class="small faint">No session notes yet. Open a session and write your 3-line takeaway.</p>`}
      </div>
      ${trackNotes.length ? `<div class="section"><div class="section-title"><h2>Track notes</h2></div>
        ${trackNotes.map(({ t, it }) => `<a class="card" href="#/t/${t.id}/${it.id}" style="display:block" data-searchable>
          <div class="label">${esc(t.name)} · #${it.n}</div><div class="serif" style="font-size:18px">${esc(it.title)}</div>
          <div class="small muted ${t.codeNotes ? "mono" : ""}" style="white-space:pre-wrap;margin-top:6px;max-height:120px;overflow:hidden">${esc(T.rec(it.id).notes)}</div></a>`).join("")}</div>` : ""}
      </div>`;
    const qn = $("#qn");
    const saveQ = () => { const v = qn.value.trim(); if (!v) return; C.actions.addQuickNote(v); route(); toast("Note saved"); };
    $("#qnSave").onclick = saveQ;
    qn.addEventListener("keydown", (e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) saveQ(); });
    bindQuick();
    $("#search").oninput = (e) => {
      const q = e.target.value.toLowerCase();
      $$(".qnote, [data-searchable]").forEach((el) => el.classList.toggle("hidden", q && !el.textContent.toLowerCase().includes(q)));
    };
    $("#copyAll").onclick = () => copy(
      withNotes.map((s) => `## ${sessionLabel(s)} — ${s.title}\n\n${C.state.sessions[s.id].notes}`)
        .concat(trackNotes.map(({ t, it }) => `## ${t.name} #${it.n} — ${it.title}\n\n${T.rec(it.id).notes}`)).join("\n\n"),
      "All notes copied as Markdown");
  }

  /* ================= JOB TRACK ================= */
  function viewJob() {
    const sum = C.summary(), wk = sum.currentWeek;
    const ev = C.state.evalLog;
    app.innerHTML = `<div class="wrap">
      <h1>Job Track</h1><div class="muted">Parallel, from Week 4. The nine weeks build the evidence; the outreach converts it.</div>
      ${R.jobTrack.map((g) => `<div class="section"><div class="section-title"><h3>${esc(g.label)}</h3>${g.fromWeek > wk ? `<span class="chip">from week ${g.fromWeek}</span>` : ""}</div>
        <ul class="checks">${g.items.map((t, i) => { const k = `${g.id}-${i}`; return `<li class="${C.state.job[k] ? "on" : ""}" data-job="${k}"><span class="box"></span><span class="txt">${esc(t)}</span></li>`; }).join("")}</ul></div>`).join("")}

      <div class="section"><div class="section-title"><h3>Outreach — 10 per week</h3><span class="small muted">from Week 6</span></div>
        <div class="card">${[6, 7, 8, 9].map((w) => { const n = C.state.outreach[w] || 0; return `<div class="row between" style="padding:6px 0">
          <span>Week ${w}${w === wk ? ' <span class="chip blue">now</span>' : ""}</span>
          <div class="row"><div class="bar green" style="width:120px"><i style="width:${Math.min(100, n * 10)}%"></i></div><span class="mono small" style="width:40px;text-align:right">${n}/10</span>
          <button class="btn sm" data-out="${w}" data-d="-1">−</button><button class="btn sm" data-out="${w}" data-d="1">+</button></div></div>`; }).join("")}</div></div>

      <div class="section"><div class="section-title"><h3>Eval log</h3><span class="small muted">one change → one eval run → one row</span></div>
        <div class="tablewrap"><table class="t"><thead><tr><th>Week</th><th>Project</th><th>Change</th><th>Metric</th><th>Before</th><th>After</th><th>Δ</th><th>Keep?</th><th></th></tr></thead><tbody>
        <tr class="faint"><td>ex.</td><td>RAG</td><td>Hybrid search (RRF)</td><td>recall@5</td><td>0.62</td><td>0.71</td><td>+0.09</td><td>Yes</td><td></td></tr>
        ${ev.map((r, i) => { const d = (parseFloat(r.after) - parseFloat(r.before)); return `<tr><td>${esc(r.week)}</td><td>${esc(r.project)}</td><td>${esc(r.change)}</td><td>${esc(r.metric)}</td><td>${esc(r.before)}</td><td>${esc(r.after)}</td><td>${isFinite(d) ? (d > 0 ? "+" : "") + d.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") : ""}</td><td>${esc(r.keep)}</td><td><button class="tiny-btn" data-delev="${i}">Delete</button></td></tr>`; }).join("")}
        </tbody></table></div>
        <form id="evForm" class="grid4" style="margin-top:10px">
          <input class="field" name="week" placeholder="Week" value="${wk}"><input class="field" name="project" placeholder="Project">
          <input class="field" name="change" placeholder="Change"><input class="field" name="metric" placeholder="Metric">
          <input class="field" name="before" placeholder="Before"><input class="field" name="after" placeholder="After">
          <select class="field" name="keep"><option>Yes</option><option>No</option></select><button class="btn primary" type="submit">Add row</button>
        </form>
      </div>
    </div>`;
    $$("[data-job]").forEach((li) => li.onclick = () => { C.actions.toggleJob(li.dataset.job); li.classList.toggle("on"); });
    $$("[data-out]").forEach((b) => b.onclick = () => { C.actions.bumpOutreach(b.dataset.out, +b.dataset.d); viewJob(); });
    $$("[data-delev]").forEach((b) => b.onclick = () => { C.actions.deleteEval(+b.dataset.delev); viewJob(); });
    $("#evForm").onsubmit = (e) => {
      e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
      if (!f.change) return toast("Add what you changed");
      C.actions.addEval(f); toast("Row added · +30 XP"); viewJob();
    };
  }

  /* ================= SETTINGS ================= */
  function viewSettings() {
    const sum = C.summary();
    const opts = C.sessions.map((s) => `<option value="${s.id}" ${sum.next && sum.next.s.id === s.id ? "selected" : ""}>Week ${s.week} · Session ${s.num} — ${esc(s.title)}</option>`).join("");
    const done = C.sessions.filter((s) => C.statusOf(s.id) === "done").slice(-8).reverse();
    app.innerHTML = `<div class="wrap">
      <h1>Settings</h1><div class="muted">Your progress lives in this browser's localStorage.</div>

      <div class="section"><h3>Your name</h3>
        <div class="row" style="margin-top:8px;flex-wrap:nowrap"><input class="field" id="name" value="${esc(C.state.settings.name || "")}"><button class="btn" id="saveName">Save</button></div></div>

      <div class="section"><h3>Where am I?</h3>
        <p class="small muted" style="margin:4px 0 8px">Pick the session you're on now. Everything before it is marked completed; it and everything after become pending and get scheduled from today.</p>
        <select class="field" id="pos">${opts}</select>
        <div class="row" style="margin-top:8px"><button class="btn primary" id="setPos">Update progress</button></div></div>

      <div class="section"><h3>Fix completion dates</h3>
        <p class="small muted" style="margin:4px 0 8px">Did a session on a different day than you ticked it? Correct the date — streaks and the schedule recalculate.</p>
        ${done.length ? done.map((s) => `<div class="row between" style="padding:6px 0;flex-wrap:nowrap"><span class="small" style="min-width:0">W${s.week} S${s.num} · ${esc(s.title)}</span>
          <input type="date" class="field" style="width:170px" data-date="${s.id}" value="${C.state.sessions[s.id].completedOn || ""}"></div>`).join("") : `<p class="small faint">Nothing completed yet.</p>`}
      </div>

      <div class="section"><h3>Backup</h3>
        <p class="small muted" style="margin:4px 0 8px">localStorage is per-browser. Export to move devices or keep a copy.</p>
        <div class="row"><button class="btn" id="exp">Export backup (.json)</button><label class="btn">Import backup<input type="file" id="imp" accept=".json,application/json" hidden></label></div></div>

      <div class="section"><h3>Danger zone</h3>
        <div class="row" style="margin-top:8px"><button class="btn" id="reset" style="color:var(--red)">Reset everything</button></div></div>
    </div>`;
    $("#saveName").onclick = () => { C.actions.setName($("#name").value.trim()); toast("Saved"); };
    $("#setPos").onclick = () => {
      const id = $("#pos").value, s = C.byId[id];
      if (!confirm(`Set progress to Week ${s.week} · Session ${s.num}?`)) return;
      C.actions.setPosition(id); toast(`Now at Week ${s.week} · Session ${s.num}`); location.hash = "#/ai";
    };
    $$("[data-date]").forEach((inp) => inp.onchange = () => { C.actions.setCompletedOn(inp.dataset.date, inp.value); toast("Date updated"); });
    $("#exp").onclick = () => {
      const blob = new Blob([C.actions.exportAll()], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `learning-ai-backup-${D.todayKey()}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $("#imp").onchange = async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { C.actions.importAll(await f.text()); toast("Backup restored"); location.hash = "#/"; } catch (err) { toast("Import failed: " + err.message); }
    };
    $("#reset").onclick = () => { if (confirm("Erase all progress, notes and whiteboards on this device?")) { C.actions.reset(); toast("Reset done"); location.hash = "#/"; } };
  }

  function viewNotFound() { app.innerHTML = `<div class="wrap"><h1>Not found</h1><a class="btn" href="#/">Home</a></div>`; }

  /* ---------- router ---------- */
  const NAV = [["#/", "home", "Home"], ["#/ai", "spark", "AI"], ["#/t/dsa", "code", "DSA"], ["#/t/sd", "layers", "System design"], ["#/t/fs", "server", "Full-stack"], ["#/notes", "note", "Notes"], ["#/settings", "gear", "Settings"]];
  function renderDock(hash) {
    const parts = hash.split("/");
    const base = "#/" + (parts[1] || "");
    let active = base;
    if (["#/s", "#/roadmap", "#/job"].includes(base)) active = "#/ai";
    if (base === "#/t" || base === "#/ts") active = parts[2] === "other" ? "#/" : `#/t/${parts[2]}`;
    $(".dock").innerHTML = NAV.map(([h, ic, lbl]) => `<a href="${h}" class="${active === h ? "active" : ""}" title="${lbl}">${ICON[ic]}<span>${lbl}</span></a>`).join("");
  }
  function route() {
    const hash = location.hash || "#/";
    const [, page, arg, arg2] = hash.split("/");
    if (page !== "study" && page !== "ts") { document.body.classList.remove("studying"); window.Board && window.Board.unmount(); clearInterval(studyTimer); }
    renderDock(hash);
    if (!page) viewHub();
    else if (page === "ai") viewHome();
    else if (page === "t" && arg2) viewTrackItem(arg, arg2);
    else if (page === "t") viewTrack(arg);
    else if (page === "ts") viewTrackStudy(arg, arg2);
    else if (page === "roadmap") viewRoadmap();
    else if (page === "s") viewSession(arg);
    else if (page === "study") viewStudy(arg);
    else if (page === "notes") viewNotes();
    else if (page === "job") viewJob();
    else if (page === "settings") viewSettings();
    else viewNotFound();
    if (page !== "study" && page !== "roadmap") window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);
  // re-render at midnight / when returning to the tab, so "today" stays correct
  let lastDay = D.todayKey();
  document.addEventListener("visibilitychange", () => { if (!document.hidden && D.todayKey() !== lastDay) { lastDay = D.todayKey(); route(); } });

  let theme = null; try { theme = localStorage.getItem("lai.theme"); } catch (e) {}
  applyTheme(theme);
  $("#themeBtn").onclick = () => {
    const t = isDark() ? "light" : "dark";
    try { localStorage.setItem("lai.theme", t); } catch (e) {}
    applyTheme(t); window.Board && window.Board.setTheme(t);
  };
  route();
})();
