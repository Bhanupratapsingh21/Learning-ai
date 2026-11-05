# Learning AI

A minimalist tracker for my **AI Full-Stack / FDE Roadmap**: Warm-up + 9 weeks, 54 sessions.

## What it does

- **Dashboard**: today's session, last and next sessions, start date and *projected* end date, streak, XP and level, a 7-day strip, an activity heatmap, quick notes, a Job Track nudge and badges.
- **Auto-adjusting schedule**: the next pending session is always placed on today (or tomorrow if you already finished one today). Every later session takes the next day, and the day after each week's Session 6 is that week's free day. Miss a day and everything shifts forward by one day; finish two in a day and everything pulls in.
- **Streaks**: you keep your streak on any day you complete a session. The free day after a week's Session 6 never breaks it.
- **Sessions**: each one has Learn and Build checklists, "Done when", notes that autosave, a copyable tutor prompt (with the minutes and the session block filled in), and controls to mark it completed, not completed or skipped.
- **Let's start**: a study screen with an [Excalidraw](https://excalidraw.com) whiteboard (one per session), a timebox timer, the session checklist and a notes panel.
- **Job Track**: setup checklists, an outreach counter (10 per week), and the eval log table.
- **Settings**: "Where am I?" to set your current session, fix completion dates, export and import a backup, and reset.

All data is stored in this browser's `localStorage`, so it stays on this device. To move to another device, use **Settings → Export backup**.

## Run it

It's a static site with no build step:

```bash
python -m http.server 5317
```

Then open http://localhost:5317.

## Deploy (Vercel)

Import this repo at [vercel.com/new](https://vercel.com/new) with the **Other** framework preset, no build command, and the root directory as the output. Every push to `main` then redeploys automatically. `vercel.json` makes browsers always revalidate the files, so you never get a stale `app.js` after an update.

The whiteboard loads React and Excalidraw from unpkg the first time, so it needs internet. Everything else works offline.

## Files

- `js/data.js`: the roadmap content, transcribed from the PDF
- `js/core.js`: storage, schedule, streaks, XP and badges
- `js/app.js`: views and router
- `js/board.js`: Excalidraw whiteboard
- `css/styles.css`: styles (light and dark)
