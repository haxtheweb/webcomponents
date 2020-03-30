import { LitElement, html, css } from "lit-element/lit-element.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
/**
 * `hax-ce-context`
 * `A context menu that provides common custom-element based authoring options.
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of custom-element based buttons and events for use in a larger solution.
 * @element hax-ce-context
 */
class HaxCeContext extends winEventsElement(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host *[hidden] {
          display: none;
        }
        :host {
          display: block;
        }
        hax-context-item {
          margin: 0;
        }
        :host(.hax-context-pin-top) hax-toolbar {
          position: fixed;
          top: 40px;
          flex-direction: column;
        }
      `
    ];
  }
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated"
    };
    this.haxProperties = {};
    setTimeout(() => {
      import("@lrnwebcomponents/hax-body/lib/hax-context-item.js");
      import("@lrnwebcomponents/hax-body/lib/hax-toolbar.js");
    }, 0);
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
      if (
        e.detail.property === "activeNode" ||
        e.detail.property === "activeContainerNode"
      ) {
        setTimeout(() => {
          this._computeValues();
        }, 0);
      }
    }
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
        <slot slot="primary"></slot>
      </hax-toolbar>
    `;
  }
  static get tag() {
    return "hax-ce-context";
  }
  static get properties() {
    return {
      disableTransform: {
        type: Boolean
      },
      activeTagIcon: {
        type: String
      },
      activeTagName: {
        type: String
      }
    };
  }
  /**
   * HAX properties changed, update buttons available.
   */
  _computeValues() {
    let instance = window.HaxStore.instance;
    if (instance.activeNode != null) {
      if (!instance.isTextElement(instance.activeNode)) {
        if (instance.activeNode.tagName == "GRID-PLATE") {
          this.disableTransform = true;
          this.activeTagName = "Grid";
          this.activeTagIcon = "hax:3/3/3/3";
        } else {
          // detect if this can be transformed into anything else
          this.disableTransform = !instance.activeHaxBody.canTansformNode(
            instance.activeNode
          );
          if (instance.activeGizmo) {
            this.activeTagName = instance.activeGizmo.title;
            this.activeTagIcon = instance.activeGizmo.icon;
          }
        }
      }
    } else {
      this.activeTagName = "";
      this.activeTagIcon = "";
    }
  }
}
window.customElements.define(HaxCeContext.tag, HaxCeContext);
export { HaxCeContext };
