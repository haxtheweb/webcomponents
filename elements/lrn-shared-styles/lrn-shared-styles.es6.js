import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@polymer/iron-flex-layout/iron-flex-layout.js";const styleElement=document.createElement("dom-module"),css=html`<style include="iron-flex-layout">
  lrn-icon, iron-icon {
    --layout-inline: {
      display: inline-flex;
    }; 
  }
  .sr-only {
    position: absolute;
    left: -9999999px;
    top: 0;
    height: 0;
    width: 0;
    overflow: hidden;
  }
  @media screen {
    .print-only {
      display: none;
    }
  }
  @media print {
    .screen-only {
      display: none;
    }
  }
</style>`;styleElement.appendChild(css);styleElement.register("lrn-shared-styles");console.log(styleElement);