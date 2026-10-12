// Icons: the published SVGs ship with this design system as JSON maps of
// data: URIs under project/runtime/icons/. Registering an iconset as an object
// makes SimpleIconsetStore return those URIs and re-hydrates waiting icons.
const ICONSETS_BASE = () => (globalThis.DDD_RUNTIME_BASE || new URL("../../runtime/", globalThis.document.baseURI).href) + "icons/";
async function loadIcons(base = ICONSETS_BASE()) {
  if (globalThis.__dddIconsLoading) return globalThis.__dddIconsLoading;
  return (globalThis.__dddIconsLoading = loadIconsOnce(base));
}
async function loadIconsOnce(base) {
  const store = globalThis.SimpleIconset && globalThis.SimpleIconset.requestAvailability && globalThis.SimpleIconset.requestAvailability();
  if (!store) return;
  try {
    const index = await (await fetch(base + "index.json")).json();
    await Promise.all(index.files.map(async (f) => {
      const part = await (await fetch(base + f)).json();
      for (const [set, icons] of Object.entries(part)) {
        const current = typeof store.iconsets[set] === "object" ? store.iconsets[set] : {};
        store.registerIconset(set, { ...current, ...icons });
      }
    }));
    globalThis.DDD_ICONS_READY = true;
    store.needsHydrated.splice(0).forEach((el) => typeof el.setSrcByIcon === "function" && el.setSrcByIcon(store));
  } catch (e) {
    globalThis.DDD_ICONS_READY = true;
    console.warn("DDD: icons not loaded", e);
  }
}
globalThis.DDD = Object.assign(globalThis.DDD || {}, { loadIcons });
if (globalThis.document && globalThis.document.readyState === "loading") {
  globalThis.document.addEventListener("DOMContentLoaded", () => loadIcons());
} else {
  loadIcons();
}
