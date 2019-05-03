import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `hax-plate-context`
 * `A context menu that provides common grid plate based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 * - grid plate - the container / full HTML tag which can have operations applied to it.
 */
class HaxPlateContext extends PolymerElement {
  constructor() {
    super();
    import("@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js");
    import("@lrnwebcomponents/hax-body/lib/hax-context-item.js");
  }
  static get template() {
    return html`
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
    `;
  }
  static get tag() {
    return "hax-plate-context";
  }
}
window.customElements.define(HaxPlateContext.tag, HaxPlateContext);
export { HaxPlateContext };
