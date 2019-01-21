import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-item/paper-item.js";
import "./hax-context-item-menu.js";
import "./hax-context-item.js";
/**
`hax-plate-context`
A context menu that provides common grid plate based authoring options.

* @demo demo/index.html

@microcopy - the mental model for this element
 - context menu - this is a menu of text based buttons and events for use in a larger solution.
 - grid plate - the container / full HTML tag which can have operations applied to it.
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        width: 32px;
      }
      hax-context-item {
        display: block;
        margin: 6px 0;
        width: 28px;
        height: 24px;
      }
      .area {
        width: 32px;
        float: left;
        visibility: visible;
        transition: 0.3s all ease;
      }
    </style>
    <div class="area">
      <hax-context-item
        mini
        light
        icon="hardware:keyboard-arrow-up"
        label="Move up"
        event-name="grid-plate-up"
        direction="left"
      ></hax-context-item>
      <hax-context-item
        mini
        light
        icon="hardware:keyboard-arrow-down"
        label="Move down"
        event-name="grid-plate-down"
        direction="left"
      ></hax-context-item>
    </div>
  `,

  is: "hax-plate-context"
});
