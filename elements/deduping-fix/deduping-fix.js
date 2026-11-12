/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
const _customElementsDefine = globalThis.customElements.define;
globalThis.customElements.define = (name, cl, conf) => {
  if (!globalThis.customElements.get(name)) {
    _customElementsDefine.call(globalThis.customElements, name, cl, conf);
  } else {
    console.warn(`${name} has been defined twice`);
  }
};
