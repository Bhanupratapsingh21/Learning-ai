/* Excalidraw whiteboard, one board per session, saved to localStorage. Loaded lazily from unpkg. */
(function () {
  const C = window.Core;
  const LIBS = [
    "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
    "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
    "https://unpkg.com/@excalidraw/excalidraw@0.17.6/dist/excalidraw.production.min.js"
  ];
  window.EXCALIDRAW_ASSET_PATH = "https://unpkg.com/@excalidraw/excalidraw@0.17.6/dist/";

  let loading = null, root = null, api = null, currentId = null, saveTimer = null;
  const loadScript = (src) => new Promise((res, rej) => {
    const s = document.createElement("script"); s.src = src; s.crossOrigin = "anonymous";
    s.onload = res; s.onerror = () => rej(new Error("Failed to load " + src)); document.head.appendChild(s);
  });
  const ensureLibs = () => loading || (loading = LIBS.reduce((p, src) => p.then(() => loadScript(src)), Promise.resolve()));

  const theme = () => (window.isDarkTheme && window.isDarkTheme() ? "dark" : "light");

  function read(id) {
    try { return JSON.parse(localStorage.getItem(C.BOARD_PREFIX + id) || "null"); } catch (e) { return null; }
  }
  function write(id, elements, appState, files) {
    const data = {
      elements: elements.filter((e) => !e.isDeleted),
      appState: { viewBackgroundColor: appState.viewBackgroundColor, gridSize: appState.gridSize, zoom: appState.zoom, scrollX: appState.scrollX, scrollY: appState.scrollY },
      files: files || {}
    };
    try {
      localStorage.setItem(C.BOARD_PREFIX + id, JSON.stringify(data));
      if (data.elements.length) C.actions.markBoarded(id);
    } catch (e) {
      window.toast && toast("Whiteboard too large for browser storage — remove big images.");
    }
  }

  async function mount(el, id) {
    unmount();
    currentId = id;
    try { await ensureLibs(); }
    catch (e) {
      el.innerHTML = `<div class="loading" style="padding:24px;text-align:center">Couldn't load the whiteboard (needs internet the first time).<br><span class="small muted">Your notes panel still works.</span></div>`;
      return;
    }
    if (currentId !== id || !document.body.contains(el)) return;
    el.innerHTML = "";
    const saved = read(id);
    const initialData = {
      elements: saved ? saved.elements : [],
      appState: Object.assign({ viewBackgroundColor: "transparent" }, saved ? saved.appState : {}, { theme: theme(), collaborators: new Map() }),
      files: saved ? saved.files : {},
      scrollToContent: !!(saved && saved.elements.length)
    };
    // Excalidraw's dark mode inverts the canvas, so white renders as near-black there.
    if (initialData.appState.viewBackgroundColor === "transparent") initialData.appState.viewBackgroundColor = "#ffffff";
    const { Excalidraw, MainMenu } = window.ExcalidrawLib;
    const h = React.createElement;
    root = ReactDOM.createRoot(el);
    root.render(h(Excalidraw, {
      initialData,
      theme: theme(),
      excalidrawAPI: (a) => { api = a; },
      UIOptions: { canvasActions: { loadScene: true, saveToActiveFile: false, export: { saveFileToDisk: true } } },
      onChange: (elements, appState, files) => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => { if (currentId === id) write(id, elements, appState, files); }, 500);
      }
    }, h(MainMenu, null,
      h(MainMenu.DefaultItems.SaveAsImage),
      h(MainMenu.DefaultItems.Export),
      h(MainMenu.DefaultItems.ClearCanvas),
      h(MainMenu.DefaultItems.ChangeCanvasBackground),
      h(MainMenu.DefaultItems.Help)
    )));
  }

  function unmount() {
    if (api && currentId) {
      clearTimeout(saveTimer);
      try { write(currentId, api.getSceneElementsIncludingDeleted(), api.getAppState(), api.getFiles()); } catch (e) {}
    }
    if (root) { try { root.unmount(); } catch (e) {} }
    root = null; api = null; currentId = null;
  }

  function setTheme(t) {
    if (api) api.updateScene({ appState: { theme: t } });
  }

  window.Board = { mount, unmount, setTheme };
})();
