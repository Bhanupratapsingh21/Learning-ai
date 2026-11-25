/* Core: dates, storage, schedule (auto-shifting), streaks, XP, badges. */
(function () {
  const R = window.ROADMAP;
  const KEY = "lai.state.v1";
  const BOARD_PREFIX = "lai.board.";

  /* ---------- dates (local, YYYY-MM-DD) ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (k, n) => { const d = fromKey(k); d.setDate(d.getDate() + n); return toKey(d); };
  const diffDays = (a, b) => Math.round((fromKey(b) - fromKey(a)) / 86400000); // b - a
  const todayKey = () => toKey(new Date());
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmt = (k, withDow = true) => {
    if (!k) return "—";
    const d = fromKey(k);
    return `${withDow ? DOW[d.getDay()] + " " : ""}${d.getDate()} ${MON[d.getMonth()]}`;
  };
  const rel = (k) => {
    const n = diffDays(todayKey(), k);
    if (n === 0) return "today";
    if (n === 1) return "tomorrow";
    if (n === -1) return "yesterday";
    return n > 0 ? `in ${n} days` : `${-n} days ago`;
  };

  /* ---------- flattened session list ---------- */
  const sessions = [];
  const byId = {};
  R.weeks.forEach((w) => {
    w.sessions.forEach((s, i) => {
      const item = Object.assign({}, s, {
        id: `w${w.n}s${i + 1}`, week: w.n, num: i + 1, minutes: w.minutes, weekTitle: w.title,
        originalDate: addDays(R.originalStart, (w.n - 1) * 7 + i)
      });
      sessions.push(item);
      byId[item.id] = item;
    });
  });
  byId[R.warmup.id] = Object.assign({ minutes: 40, weekTitle: "Warm-up", originalDate: "2026-09-30" }, R.warmup);
  const weekOf = (n) => R.weeks.find((w) => w.n === n);
  const originalFree = (n) => addDays(R.originalStart, (n - 1) * 7 + 6);

  /* ---------- state ---------- */
  const defaultState = () => {
    const st = {
      version: 1, createdOn: todayKey(),
      sessions: {}, quickNotes: [], job: {}, outreach: {}, evalLog: [],
      settings: { name: "Bhanu" }
    };
    // Seed: Warm-up + everything before Week 4 · Session 2 is already done (before tracking began).
    st.sessions["w0s1"] = { status: "done", completedOn: null };
    for (const s of sessions) {
      if (s.week < 4 || (s.week === 4 && s.num < 2)) st.sessions[s.id] = { status: "done", completedOn: null };
    }
    return st;
  };

  let state;
  try { state = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { state = null; }
  if (!state || state.version !== 1) state = defaultState();

  const listeners = new Set();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { window.toast && toast("Couldn't save — browser storage is full or blocked."); }
    listeners.forEach((fn) => fn());
  }
  const S = (id) => (state.sessions[id] = state.sessions[id] || { status: "pending", completedOn: null });
  const statusOf = (id) => (state.sessions[id] ? state.sessions[id].status : "pending");
  const isClosed = (id) => ["done", "skipped"].includes(statusOf(id));

  /* ---------- schedule ----------
     Rules:
     - Completed sessions keep the date you completed them.
     - The first pending session lands on today (or tomorrow if you already finished one today).
     - Every later pending session takes the next day.
     - After a week's Session 6, the following day is that week's free day.
     So a missed day simply pushes everything forward by one day. */
  function schedule() {
    const today = todayKey();
    const doneToday = Object.values(state.sessions).some((x) => x.status === "done" && x.completedOn === today);
    let cursor = doneToday ? addDays(today, 1) : today;
    const items = [];
    for (const w of R.weeks) {
      const ws = sessions.filter((s) => s.week === w.n);
      for (const s of ws) {
        const st = state.sessions[s.id] || {};
        if (st.status === "done" || st.status === "skipped") {
          items.push({ kind: "session", s, date: st.completedOn || null, status: st.status });
        } else {
          items.push({ kind: "session", s, date: cursor, status: "pending" });
          cursor = addDays(cursor, 1);
        }
      }
      // free day
      const weekClosed = ws.every((s) => isClosed(s.id));
      const nextWeekStarted = sessions.some((s) => s.week === w.n + 1 && isClosed(s.id));
      let fdate = null, fstatus = "upcoming";
      if (weekClosed) {
        const last = state.sessions[ws[5].id];
        const after = last && last.completedOn ? addDays(last.completedOn, 1) : null;
        if (!after || nextWeekStarted || after < cursor) { fdate = after; fstatus = "past"; }
        else { fdate = after; cursor = addDays(after, 1); fstatus = after === today ? "today" : "upcoming"; }
      } else {
        fdate = cursor; cursor = addDays(cursor, 1);
        fstatus = fdate === today ? "today" : "upcoming";
      }
      items.push({ kind: "free", week: w.n, date: fdate, status: fstatus, text: w.free });
    }
    return items;
  }

  function summary() {
    const today = todayKey();
    const items = schedule();
    const sess = items.filter((i) => i.kind === "session");
    const next = sess.find((i) => i.status === "pending") || null;
    const lastDone = sess.filter((i) => i.status === "done")
      .sort((a, b) => (a.date || "").localeCompare(b.date || "") || 0).pop() || null;
    // most recently completed by date; fall back to latest in order
    const lastByOrder = [...sess].reverse().find((i) => i.status === "done") || null;
    const last = lastDone && lastDone.date ? lastDone : lastByOrder;
    const freeToday = items.find((i) => i.kind === "free" && i.date === today && i.status === "today") || null;
    const end = items[items.length - 1].date;
    const doneCount = sess.filter((i) => i.status !== "pending").length;
    const doneTodayItem = sess.find((i) => i.status === "done" && i.date === today) || null;
    const afterNext = next ? sess.filter((i) => i.status === "pending")[1] || null : null;
    const behind = next ? diffDays(next.s.originalDate, next.date) : 0;
    return {
      today, items, next, afterNext, last, freeToday, doneTodayItem,
      start: R.originalStart, end, originalEnd: R.originalEnd,
      shift: end ? diffDays(R.originalEnd, end) : 0, behind,
      doneCount, total: sess.length, pct: Math.round((doneCount / sess.length) * 100),
      daysLeft: end ? Math.max(0, diffDays(today, end)) : 0,
      currentWeek: next ? next.s.week : 9
    };
  }

  /* ---------- streaks ---------- */
  function activeDays() {
    const days = new Set();
    for (const x of Object.values(state.sessions)) if (x.status === "done" && x.completedOn) days.add(x.completedOn);
    return days;
  }
  function restDays() {
    // the day after a week's last session is an earned free day — it never breaks a streak
    const r = new Set();
    for (const w of R.weeks) {
      const last = state.sessions[`w${w.n}s6`];
      if (last && last.completedOn) r.add(addDays(last.completedOn, 1));
    }
    return r;
  }
  function streaks() {
    const act = activeDays(), rest = restDays(), today = todayKey();
    let cur = 0;
    let d = act.has(today) ? today : addDays(today, -1);
    // walk back; rest days keep the chain alive without counting
    for (let guard = 0; guard < 400; guard++) {
      if (act.has(d)) cur++;
      else if (!rest.has(d)) break;
      d = addDays(d, -1);
    }
    // longest
    const sorted = [...act].sort();
    let best = 0, run = 0, prev = null;
    for (const k of sorted) {
      if (prev) {
        let gapOk = true;
        for (let x = addDays(prev, 1); x < k; x = addDays(x, 1)) if (!rest.has(x)) { gapOk = false; break; }
        run = gapOk ? run + 1 : 1;
      } else run = 1;
      best = Math.max(best, run); prev = k;
    }
    const alive = act.has(today);
    return { current: cur, best: Math.max(best, cur), doneToday: alive };
  }

  /* ---------- XP, levels, badges ---------- */
  const LEVELS = [
    [0, "Prompt Apprentice"], [600, "Token Tinkerer"], [1500, "Embedding Explorer"], [2800, "Agent Wrangler"],
    [4400, "Eval Engineer"], [6400, "RAG Architect"], [8800, "Production Pilot"], [11500, "FDE Ready"]
  ];
  function xp() {
    let total = 0;
    for (const [id, x] of Object.entries(state.sessions)) {
      const s = byId[id]; if (!s) continue;
      if (x.status === "done") total += (s.minutes >= 80 ? 200 : 100) + (s.project ? 100 : 0);
      if (x.checks) total += Object.values(x.checks).filter(Boolean).length * 5;
      if (x.notes && x.notes.trim().length > 20) total += 15;
      if (x.boarded) total += 15;
    }
    total += Object.values(state.job).filter(Boolean).length * 20;
    total += state.quickNotes.length * 5;
    total += state.evalLog.length * 30;
    total += streaks().best * 10;
    return total;
  }
  function level(total) {
    let i = 0;
    while (i + 1 < LEVELS.length && total >= LEVELS[i + 1][0]) i++;
    const floor = LEVELS[i][0], ceil = LEVELS[i + 1] ? LEVELS[i + 1][0] : floor;
    return { n: i + 1, title: LEVELS[i][1], floor, ceil, pct: ceil > floor ? (total - floor) / (ceil - floor) : 1, max: !LEVELS[i + 1] };
  }
  function badges() {
    const st = streaks();
    const weekDone = (n) => sessions.filter((s) => s.week === n).every((s) => statusOf(s.id) === "done");
    const notes = Object.values(state.sessions).filter((x) => x.notes && x.notes.trim()).length + state.quickNotes.length;
    const boards = Object.values(state.sessions).filter((x) => x.boarded).length;
    const onTime = Object.entries(state.sessions).some(([id, x]) => x.completedOn && byId[id] && x.completedOn <= byId[id].originalDate);
    const list = [
      { icon: "🚀", name: "Lift-off", desc: "Warm-up done", got: statusOf("w0s1") === "done" },
      { icon: "🔥", name: "Kindling", desc: "3-day streak", got: st.best >= 3 },
      { icon: "⚡", name: "On a roll", desc: "7-day streak", got: st.best >= 7 },
      { icon: "🌋", name: "Unstoppable", desc: "14-day streak", got: st.best >= 14 },
      { icon: "🧱", name: "Basics", desc: "Week 1 complete", got: weekDone(1) },
      { icon: "🛠️", name: "Engineer", desc: "Week 2 complete", got: weekDone(2) },
      { icon: "🤖", name: "Agent smith", desc: "Week 3 complete", got: weekDone(3) },
      { icon: "📏", name: "Measurer", desc: "Week 4 complete", got: weekDone(4) },
      { icon: "📚", name: "Retriever", desc: "Week 5 complete", got: weekDone(5) },
      { icon: "📈", name: "Improver", desc: "Week 6 complete", got: weekDone(6) },
      { icon: "🦾", name: "Operator", desc: "Week 7 complete", got: weekDone(7) },
      { icon: "🛡️", name: "Hardened", desc: "Week 8 complete", got: weekDone(8) },
      { icon: "🎤", name: "Interview ready", desc: "Week 9 complete", got: weekDone(9) },
      { icon: "📝", name: "Scribe", desc: "10 notes written", got: notes >= 10 },
      { icon: "🎨", name: "Sketcher", desc: "Used the whiteboard 5×", got: boards >= 5 },
      { icon: "⏰", name: "Ahead of plan", desc: "Finish a session on/before its original date", got: onTime },
      { icon: "📣", name: "Shipper", desc: "Job-track item ticked", got: Object.values(state.job).some(Boolean) }
    ];
    return list;
  }

  /* ---------- actions ---------- */
  const actions = {
    setStatus(id, status) {
      const x = S(id);
      if (x.status === status) return;
      x.status = status;
      x.completedOn = status === "pending" ? null : todayKey();
      save();
    },
    toggleCheck(id, key) { const x = S(id); x.checks = x.checks || {}; x.checks[key] = !x.checks[key]; save(); },
    setNotes(id, text) { const x = S(id); x.notes = text; save(); },
    markBoarded(id) { const x = S(id); if (!x.boarded) { x.boarded = true; save(); } },
    addMinutes(id, mins) { const x = S(id); x.minutes = (x.minutes || 0) + mins; save(); },
    addQuickNote(text) { state.quickNotes.unshift({ id: Date.now().toString(36), text, createdAt: new Date().toISOString(), pinned: false }); save(); },
    updateQuickNote(id, patch) { const n = state.quickNotes.find((q) => q.id === id); if (n) Object.assign(n, patch); save(); },
    deleteQuickNote(id) { state.quickNotes = state.quickNotes.filter((q) => q.id !== id); save(); },
    toggleJob(key) { state.job[key] = !state.job[key]; save(); },
    bumpOutreach(week, delta) { state.outreach[week] = Math.max(0, (state.outreach[week] || 0) + delta); save(); },
    addEval(row) { state.evalLog.push(row); save(); },
    deleteEval(i) { state.evalLog.splice(i, 1); save(); },
    setPosition(id) {
      // everything before `id` → done (keep existing dates); `id` and after → pending
      const idx = sessions.findIndex((s) => s.id === id);
      sessions.forEach((s, i) => {
        const x = S(s.id);
        if (i < idx) { if (x.status === "pending") { x.status = "done"; x.completedOn = null; } }
        else { x.status = "pending"; x.completedOn = null; }
      });
      save();
    },
    setCompletedOn(id, date) { const x = S(id); x.completedOn = date || null; save(); },
    setName(name) { state.settings.name = name; save(); },
    exportAll() {
      const boards = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith(BOARD_PREFIX)) boards[k] = localStorage.getItem(k);
      }
      const tracks = window.Tracks ? window.Tracks.state : null;
      return JSON.stringify({ app: "learning-ai", exportedAt: new Date().toISOString(), state, tracks, boards }, null, 2);
    },
    importAll(json) {
      const data = JSON.parse(json);
      if (!data.state || data.state.version !== 1) throw new Error("Not a Learning AI backup file");
      state = data.state;
      for (const [k, v] of Object.entries(data.boards || {})) localStorage.setItem(k, v);
      // older backups have no `tracks` — keep the current track progress in that case
      if (data.tracks && window.Tracks) window.Tracks.replace(data.tracks);
      save();
    },
    reset() {
      Object.keys(localStorage).filter((k) => k.startsWith("lai.")).forEach((k) => localStorage.removeItem(k));
      state = defaultState();
      if (window.Tracks) window.Tracks.replace(null);
      save();
    }
  };

  window.Core = {
    R, sessions, byId, weekOf, originalFree, BOARD_PREFIX,
    get state() { return state; },
    statusOf, schedule, summary, streaks, xp, level, badges, actions,
    onChange: (fn) => listeners.add(fn),
    date: { toKey, fromKey, addDays, diffDays, todayKey, fmt, rel, DOW, MON }
  };
})();
