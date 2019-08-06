import "@polymer/polymer/lib/elements/dom-module.js";

const styleElement = document.createElement("dom-module");
styleElement.innerHTML = `<template>
  <style>
  :host, :host * ::slotted(*) {
    --hax-color-bg: #ffffff;
    --hax-color-bg-accent: #f1f1f1;
    --hax-color-border-outline: #191e23;
    --hax-color-menu-heading-bg: #f3f4f5;
    --hax-color-text: #191e23;
    --hax-color-accent-text: #555d66;
    --hax-color-accent1: var(--simple-colors-default-theme-light-blue-7, #0085ba);
    --hax-color-accent1-text: #FFFFFF;
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
