/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
// Wrapped in a function so that, loaded with a plain script tag, this adds no
// global name of its own: a top-level const in a classic script is a global,
// and it would clash with the same fix inlined in build-haxcms.js or with any
// other script that declares that name.
(() => {
  const _customElementsDefine = globalThis.customElements.define;
  globalThis.customElements.define = (name, cl, conf) => {
    if (!globalThis.customElements.get(name)) {
      _customElementsDefine.call(globalThis.customElements, name, cl, conf);
    } else {
      console.warn(`${name} has been defined twice`);
    }
  };
})();
