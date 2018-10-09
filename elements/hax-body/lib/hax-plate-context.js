import "@polymer/polymer/polymer.js";
import "@polymer/paper-item/paper-item.js";
import "./hax-context-item-menu.js";
import "./hax-context-item.js";
/**
`hax-plate-context`
A context menu that provides common grid plate based authoring options.

@demo demo/index.html

@microcopy - the mental model for this element
 - context menu - this is a menu of text based buttons and events for use in a larger solution.
 - grid plate - the container / full HTML tag which can have operations applied to it.
*/
Polymer({
  _template: `
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
        opacity: .3;
        visibility: visible;
        transition: .8s all ease;
      }
      .area:hover {
        opacity: 1;
      }
    </style>
    <div class="area">
      <hax-context-item light="" mini="" icon="editor:vertical-align-top" label="Move first" event-name="grid-plate-first" direction="left"></hax-context-item>
      <hax-context-item light="" mini="" icon="arrow-upward" label="Move up" event-name="grid-plate-up" direction="left"></hax-context-item>
      <hax-context-item light="" mini="" icon="arrow-downward" label="Move down" event-name="grid-plate-down" direction="left"></hax-context-item>
      <hax-context-item light="" mini="" icon="editor:vertical-align-bottom" label="Move last" event-name="grid-plate-last" direction="left"></hax-context-item>
    </div>
`,

  is: "hax-plate-context"
});
