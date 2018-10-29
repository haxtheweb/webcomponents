import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-item/paper-item.js";
import "./hax-context-item-menu.js";
import "./hax-context-item.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        width: 32px;
      }
      :host:hover {
        opacity: 1;
      }
      hax-context-item {
        display: block;
        margin: 6px 0;
        width: 32px;
      }
      .area {
        width: 32px;
        float: left;
        opacity: .5;
        visibility: visible;
        transition: .8s all ease;
      }
      .area:hover {
        opacity: 1;
      }
    </style>
    <div class="area">
      <hax-context-item light="" mini="" icon="arrow-upward" label="Move up" event-name="grid-plate-up" direction="left"></hax-context-item>
      <hax-context-item light="" mini="" icon="arrow-downward" label="Move down" event-name="grid-plate-down" direction="left"></hax-context-item>
    </div>
`,
  is: "hax-plate-context"
});
