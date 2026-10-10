// Runs before any element module: makes customElements.define idempotent so the
// main bundle and the separately bundled libraries can share tags safely.
// Icons ship as data: URI maps (runtime/icons/). Until they load, an element asking
// for an icon waits in needsHydrated instead of resolving to an SVG URL, and a
// URL-based registration never replaces a loaded map. Module-level lookups (no
// element) still get the URL, so CSS masks built at import time keep working.
function patchIconStore(proto) {
  const register = proto.registerIconset, get = proto.getIcon;
  proto.registerIconset = function (name, value) {
    if (typeof value === "string" && this.iconsets && typeof this.iconsets[name] === "object") return;
    return register.call(this, name, value);
  };
  proto.getIcon = function (icon, el) {
    const parts = String(icon).replaceAll("/", "-").split(":"), set = parts.length === 1 ? "icons" : parts[0];
    if (el && !globalThis.DDD_ICONS_READY && typeof (this.iconsets || {})[set] === "string") {
      if (el !== this && !this.needsHydrated.includes(el)) this.needsHydrated.push(el);
      return null;
    }
    return get.call(this, icon, el);
  };
}
if (globalThis.customElements && !globalThis.customElements.__dddIdempotent) {
  const define = globalThis.customElements.define.bind(globalThis.customElements);
  globalThis.customElements.define = (name, ctor, opts) => {
    if (globalThis.customElements.get(name)) return;
    if (name === "simple-iconset") patchIconStore(ctor.prototype);
    return define(name, ctor, opts);
  };
  globalThis.customElements.__dddIdempotent = true;
}
// Every element is already bundled, so nothing needs lazy-loading. HAXcms checks
// for this registry to decide a theme is "imported"; without it, it tries a
// network import() that cannot resolve here and never reveals the theme.
globalThis.WCAutoload = globalThis.WCAutoload || {};
if (typeof globalThis.WCAutoload.process !== "function") globalThis.WCAutoload.process = () => {};
