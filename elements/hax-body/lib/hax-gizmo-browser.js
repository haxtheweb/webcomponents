import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/grafitto-filter/grafitto-filter.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";

/**
 * `hax-gizmo-browser`
 * @customElement hax-gizmo-browser
 * `Browse a list of gizmos. This provides a listing of custom elements for people to search and select based on what have been defined as gizmos for users to select.`
 * @microcopy - the mental model for this element
 * - gizmo - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxGizmoBrowser extends winEventsElement(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .toolbar-inner {
          display: inline-flex;
          padding: 0 16px;
        }
        .item-wrapper {
          text-align: center;
        }
      `
    ];
  }
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated"
    };
    this.__gizmoList = [];
    this.filtered = [];
    import("@polymer/paper-input/paper-input.js");
  }
  render() {
    return html`
      <div class="toolbar-inner">
        <paper-input
          label="Filter"
          id="inputfilter"
          aria-controls="filter"
          @value-changed="${this.inputfilterChanged}"
          value=""
        ></paper-input>
      </div>
      <grafitto-filter
        id="filter"
        .items="${this.__gizmoList}"
        like=""
        where="title"
        like=""
        @filtered-changed="${this.filteredChanged}"
        ><template></template
      ></grafitto-filter>
      <div class="item-wrapper">
        ${this.filtered.map(
          gizmo => html`
            <hax-tray-button
              draggable="true"
              @dragstart="${this._dragStart}"
              @dragend="${this._dragEnd}"
              index="${gizmo.index}"
              label="${gizmo.title}"
              event-name="insert-tag"
              event-data="${gizmo.tag}"
              icon="${gizmo.icon}"
              color="${gizmo.color}"
              drag-color="${gizmo.color}"
            ></hax-tray-button>
          `
        )}
      </div>
    `;
  }
  static get tag() {
    return "hax-gizmo-browser";
  }
  static get properties() {
    return {
      filtered: {
        type: Array
      },
      __gizmoList: {
        type: Array
      }
    };
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    // create the tag
    let target = document.createElement(e.target.eventData);
    window.HaxStore.instance.__dragTarget = target;
    if (e.dataTransfer) {
      this.crt = target.cloneNode(true);
      this.crt.style.position = "absolute";
      this.crt.style.top = "-1000px";
      this.crt.style.right = "-1000px";
      this.crt.style.transform = "scale(0.25)";
      this.crt.style.opacity = ".8";
      this.crt.style.backgroundColor = e.target.getAttribute("drag-color");
      e.dataTransfer.dropEffect = "move";
      document.body.appendChild(this.crt);
      e.dataTransfer.setDragImage(this.crt, 0, 0);
    }
    e.stopPropagation();
    e.stopImmediatePropagation();
    // show where things can be dropped only during the drag
    if (
      !window.HaxStore.instance.activeHaxBody.openDrawer &&
      window.HaxStore.instance.editMode
    ) {
      let children = window.HaxStore.instance.activeHaxBody.children;
      // walk the children and apply the draggable state needed
      for (var i in children) {
        if (children[i].classList && target !== children[i]) {
          children[i].classList.add("mover");
        }
      }
    }
  }
  /**
   * When we end dragging ensure we remove the mover class.
   */
  _dragEnd(e) {
    this.crt.remove();
    let children = window.HaxStore.instance.activeHaxBody.children;
    // walk the children and apply the draggable state needed
    for (var i in children) {
      if (typeof children[i].classList !== typeof undefined) {
        children[i].classList.remove(
          "mover",
          "hovered",
          "moving",
          "grid-plate-active-item"
        );
      }
    }
  }
  filteredChanged(e) {
    this.filtered = [...e.detail.value];
  }
  inputfilterChanged(e) {
    this.shadowRoot.querySelector("#filter").like = e.target.value;
  }
  firstUpdated(changedProperties) {
    this.resetBrowser();
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "activeApp") {
        this._activeAppChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      this[e.detail.property] = e.detail.value;
    }
  }

  /**
   * Reset this browser.
   */
  resetBrowser() {
    this.__gizmoList = window.HaxStore.instance.gizmoList;
    this.filtered = this.__gizmoList;
    this.shadowRoot.querySelector("#inputfilter").value = "";
    this.shadowRoot.querySelector("#filter").value = "";
    this.shadowRoot.querySelector("#filter").filter();
    this.shadowRoot.querySelector("#filter").where = "title";
    this.shadowRoot.querySelector("#filter").like = "";
  }
}
window.customElements.define(HaxGizmoBrowser.tag, HaxGizmoBrowser);
export { HaxGizmoBrowser };
