/**
 * `hax-plate-context`
 * `A context menu that provides common grid plate based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 * - grid plate - the container / full HTML tag which can have operations applied to it.
 */
class HaxPlateContext extends HTMLElement {
  constructor(delayRender = false) {
    super();
    import("@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js");
    import("@lrnwebcomponents/hax-body/lib/hax-context-item.js");
    // set tag for later use
    this.tag = HaxPlateContext.tag;
    this.template = document.createElement("template");

    this.attachShadow({ mode: "open" });

    if (!delayRender) {
      this.render();
    }
  }
  static get tag() {
    return "hax-plate-context";
  }
  get html() {
    return `
    <style>
    :host {
      display: block;
      width: 40px;
      margin-top: -2px;
    }
    hax-context-item {
      display: block;
    }
    .area {
      width: 40px;
      float: left;
      visibility: visible;
      transition: 0.3s all ease;
    }
    </style>
    <div class="area">
      <hax-context-item
        light
        icon="hardware:keyboard-arrow-up"
        label="Move up"
        event-name="grid-plate-up"
        direction="left"
      ></hax-context-item>
      <hax-context-item
        light
        icon="hardware:keyboard-arrow-down"
        label="Move down"
        event-name="grid-plate-down"
        direction="left"
      ></hax-context-item>
    </div>`;
  }
  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }
}
window.customElements.define(HaxPlateContext.tag, HaxPlateContext);
export { HaxPlateContext };
