import "@polymer/polymer/lib/elements/dom-module.js";

const styleElement = document.createElement("dom-module");
styleElement.innerHTML = `<template>
  <style>
  :host, :host * ::slotted(*) {
    line-height: 1.8;
  }
  :host ul, :host * ::slotted(ul),
  :host ol, :host * ::slotted(ol) {
    padding-left: 20px;
    margin-left: 20px;
  }
  :host ul, :host * ::slotted(ul) {
    list-style-type: disc;
  }
  :host li, :host * ::slotted(li) {
    margin-bottom: 6px;
  }
</style>
</template>`;
styleElement.register("hax-shared-styles");
