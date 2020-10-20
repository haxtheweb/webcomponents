import { LitElement, html, css } from "lit-element/lit-element.js";
import { HAXStore } from "./hax-store.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar.js";
import { autorun, toJS } from "mobx";
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
          top: 40px;
          flex-direction: column;
        }
      `,
    ];
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "onScreen" && this.onScreen) {
        this._computeValues();
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
    };
  }
  firstUpdated() {
    autorun(() => {
      this.activeNode = toJS(HAXStore.activeNode);
      if (this.activeNode && this.activeNode.classList) {
        this._computeValues();
      }
    });
  }
  /**
   * HAX properties changed, update buttons available.
   */
  _computeValues() {
    if (HAXStore.activeHaxBody && this.activeNode != null) {
      if (!HAXStore.isTextElement(this.activeNode)) {
        if (this.activeNode.tagName == "GRID-PLATE") {
          this.disableTransform = true;
          this.activeTagName = "Grid";
          this.activeTagIcon = "hax:3/3/3/3";
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
      this.activeTagIcon = "";
    }
  }
}
window.customElements.define(HaxCeContext.tag, HaxCeContext);
export { HaxCeContext };
