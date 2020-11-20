import { LitElement, html, css } from "lit-element/lit-element.js";
import { HAXStore } from "./hax-store.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar.js";
import { autorun, toJS } from "mobx";
import { wipeSlot } from "@lrnwebcomponents/utils/utils";
/**
 * `hax-ce-context`
 * `A context menu that provides common custom-element based authoring options.
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of custom-element based buttons and events for use in a larger solution.
 * @element hax-ce-context
 */
class HaxCeContext extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        hax-context-item {
          margin: 0;
        }
        :host(.hax-context-pin-top) hax-toolbar {
          position: fixed;
          top: 0px;
          flex-direction: column;
        }
        div[slot="primary"] {
          display: inline-flex;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.haxUIElement = true;
    this.onScreen = false;
    this.ceButtons = [];
    this.activeTagName = "";
    this.activeTagIcon = "hax:paragraph";
    this.addEventListener(
      "hax-context-item-selected",
      this.handleCECustomEvent.bind(this)
    );
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "onScreen" && this.onScreen) {
        this._resetCEMenu();
      }
    });
  }
  render() {
    return html`
      <hax-toolbar hide-more>
        <hax-context-item
          mini
          action
          more
          slot="prefix"
          icon="${this.activeTagIcon}"
          label="${this.activeTagName}, click to change"
          ?disabled="${this.disableTransform}"
          event-name="hax-transform-node"
        ></hax-context-item>
        ${this.ceButtons.map((el) => {
          return html` <hax-context-item
            mini
            action
            slot="prefix"
            icon="${el.icon}"
            label="${el.label}"
            event-name="hax-ce-custom-button"
            value="${el.callback}"
          ></hax-context-item>`;
        })}
        <div slot="primary">
          <slot></slot>
        </div>
      </hax-toolbar>
    `;
  }

  static get tag() {
    return "hax-ce-context";
  }
  static get properties() {
    return {
      disableTransform: {
        type: Boolean,
      },
      onScreen: {
        type: Boolean,
        attribute: "on-screen",
        reflect: true,
      },
      activeTagIcon: {
        type: String,
      },
      activeTagName: {
        type: String,
      },
      ceButtons: {
        type: Array,
      },
    };
  }
  handleCECustomEvent(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "hax-ce-custom-button":
        if (
          this.activeNode &&
          typeof this.activeNode[detail.value] === "function"
        ) {
          if (this.activeNode[detail.value](e)) {
            HAXStore.refreshActiveNodeForm();
          }
        }
        break;
    }
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    autorun(() => {
      this.activeNode = toJS(HAXStore.activeNode);
      if (this.activeNode && this.activeNode.classList) {
        this._resetCEMenu();
      }
    });
  }
  /**
   * HAX properties changed, update buttons available.
   */
  _resetCEMenu() {
    if (this.shadowRoot) {
      wipeSlot(this, "*");
    }
    // reset buttons in-case this element has new ones
    this.ceButtons = [];
    if (HAXStore.activeHaxBody && this.activeNode != null) {
      if (!HAXStore.isTextElement(this.activeNode)) {
        if (this.activeNode.tagName == "GRID-PLATE") {
          this.disableTransform = true;
          this.activeTagName = "Grid";
          this.activeTagIcon = "hax:3-3-3-3";
        } else {
          // detect if this can be transformed into anything else
          this.disableTransform = !HAXStore.activeHaxBody.canTansformNode(
            this.activeNode
          );
          if (HAXStore.activeGizmo) {
            this.activeTagName = HAXStore.activeGizmo.title;
            this.activeTagIcon = HAXStore.activeGizmo.icon;
          }
        }
      }
    } else {
      this.activeTagName = "";
      this.activeTagIcon = "hax:paragraph";
    }
    // @see haxHook inlineContextMenu
    HAXStore.runHook(this.activeNode, "inlineContextMenu", [this]);
  }
}
window.customElements.define(HaxCeContext.tag, HaxCeContext);
export { HaxCeContext };
