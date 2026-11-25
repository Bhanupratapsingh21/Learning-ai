/* Storage + stats for the extra tracks (DSA, System Design, Full-stack, Other).
   Stored under its own key so the AI roadmap data (lai.state.v1) is never touched. */
(function () {
  const C = window.Core, D = C.date;
  const KEY = "lai.tracks.v1";

  // Flatten every track into numbered items: id "<track>-<n>", n is 1-based across groups.
  const tracks = window.TRACKS.map((t) => {
    let n = 0;
    const groups = t.groups.map((g) => ({
      name: g.name,
      items: g.items.map((raw) => {
        n++;
        const o = typeof raw === "string" ? { t: raw } : raw;
        return Object.assign({ id: `${t.id}-${n}`, n, track: t.id, group: g.name, title: o.t, sub: o.sub || [] }, o.done ? { done: o.done } : {}, o.table ? { table: o.table } : {});
      })
    }));
    return Object.assign({}, t, { groups });
  });
  const byId = Object.fromEntries(tracks.map((t) => [t.id, t]));

  let st;
  try { st = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { st = null; }
  if (!st || st.version !== 1) st = { version: 1, items: {}, custom: {} };

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(st)); }
    catch (e) { window.toast && toast("Couldn't save — browser storage is full or blocked."); }
  }

  function itemsOf(trackId) {
    const t = byId[trackId]; if (!t) return [];
    const base = t.groups.flatMap((g) => g.items);
    const custom = (st.custom[trackId] || []).map((c, i) => ({ id: c.id, n: base.length + i + 1, track: trackId, group: "Added by you", title: c.title, sub: c.sub || [], custom: true }));
    return base.concat(custom);
  }
  function groupsOf(trackId) {
    const t = byId[trackId];
    const custom = itemsOf(trackId).filter((i) => i.custom);
    return custom.length ? t.groups.concat([{ name: "Added by you", items: custom }]) : t.groups;
  }
  const item = (trackId, id) => itemsOf(trackId).find((i) => i.id === id) || null;
  const rec = (id) => (st.items[id] = st.items[id] || { status: "todo" });
  const statusOf = (id) => (st.items[id] ? st.items[id].status : "todo");

  function stats(trackId) {
    const all = itemsOf(trackId);
    const done = all.filter((i) => statusOf(i.id) === "done").length;
    const doing = all.find((i) => statusOf(i.id) === "doing");
    const next = doing || all.find((i) => statusOf(i.id) !== "done") || null;
    return { total: all.length, done, pct: all.length ? Math.round((done / all.length) * 100) : 0, next };
  }

  function xp() {
    let total = 0;
    for (const t of tracks) {
      for (const i of itemsOf(t.id)) {
        const r = st.items[i.id]; if (!r) continue;
        if (r.status === "done") total += t.xp;
        if (r.checks) total += Object.values(r.checks).filter(Boolean).length * 5;
        if (r.notes && r.notes.trim().length > 20) total += 10;
        if (r.boarded) total += 10;
      }
    }
    return total;
  }

  // Days on which anything was finished — AI sessions or track items.
  function activity() {
    const days = {};
    for (const x of Object.values(C.state.sessions)) if (x.status === "done" && x.completedOn) days[x.completedOn] = (days[x.completedOn] || 0) + 1;
    for (const r of Object.values(st.items)) if (r.status === "done" && r.doneOn) days[r.doneOn] = (days[r.doneOn] || 0) + 1;
    return days;
  }
  function overallStreak() {
    const act = activity(), today = D.todayKey();
    // AI free days (day after a week's Session 6) don't break the chain
    const rest = new Set();
    for (const w of C.R.weeks) { const l = C.state.sessions[`w${w.n}s6`]; if (l && l.completedOn) rest.add(D.addDays(l.completedOn, 1)); }
    let cur = 0, d = act[today] ? today : D.addDays(today, -1);
    for (let g = 0; g < 400; g++) { if (act[d]) cur++; else if (!rest.has(d)) break; d = D.addDays(d, -1); }
    return { current: cur, today: act[today] || 0 };
  }

  const actions = {
    setStatus(id, status) {
      const r = rec(id); if (r.status === status) return;
      r.status = status; r.doneOn = status === "done" ? D.todayKey() : null; save();
    },
    toggleCheck(id, k) { const r = rec(id); r.checks = r.checks || {}; r.checks[k] = !r.checks[k]; save(); },
    setNotes(id, text) { rec(id).notes = text; save(); },
    markBoarded(id) { const r = rec(id); if (!r.boarded) { r.boarded = true; save(); } },
    addCustom(trackId, title, sub) {
      (st.custom[trackId] = st.custom[trackId] || []).push({ id: `${trackId}-c${Date.now().toString(36)}`, title, sub });
      save();
    },
    removeCustom(trackId, id) {
      st.custom[trackId] = (st.custom[trackId] || []).filter((c) => c.id !== id);
      delete st.items[id]; save();
    }
  };

  window.Tracks = {
    KEY, list: tracks, byId, itemsOf, groupsOf, item, statusOf, stats, xp, activity, overallStreak, actions,
    rec: (id) => st.items[id] || {},
    get state() { return st; },
    replace(next) { st = next && next.version === 1 ? next : { version: 1, items: {}, custom: {} }; save(); }
  };
})();
