import { LitElement, html, css } from "lit-element/lit-element.js";
import { HAXStore } from "./hax-store.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-menu.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-menu-item.js";
import { HaxToolbarBehaviors } from "@lrnwebcomponents/hax-body/lib/hax-toolbar.js";
import { wipeSlot } from "@lrnwebcomponents/utils/utils";
/**
 * `hax-ce-context`
 * `A context menu that provides common custom-element based authoring options.
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of custom-element based buttons and events for use in a larger solution.
 * @element hax-ce-context
 */
class HaxCeContext extends HaxToolbarBehaviors(LitElement) {
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
  static get styles() {
    return [...super.styles, css``];
  }
  render() {
    return html`
      <div id="buttons">
        <hax-context-item
          action
          more
          icon="${this.activeTagIcon}"
          label="${this.activeTagName}, click to change"
          ?disabled="${this.disableTransform}"
          event-name="hax-transform-node"
        ></hax-context-item>
        ${this.ceButtons.map((el) => {
          return html` <hax-context-item
            action
            icon="${el.icon}"
            label="${el.label}"
            event-name="hax-ce-custom-button"
            value="${el.callback}"
          ></hax-context-item>`;
        })}
        <slot name="primary"></slot>
        <hax-context-item
          action
          icon="icons:code"
          label="Modify HTML source"
          ?disabled="${!this.sourceView}"
          event-name="hax-source-view-toggle"
          toggles
          ?toggled="${this.viewSource}"
          @click="${(e) => (this.viewSource = !this.viewSource)}"
        ></hax-context-item>
        <hax-toolbar-menu icon="add" label="Insert item above or below">
          <simple-toolbar-menu-item slot="menuitem">
            <hax-context-item
              action
              show-text-label
              role="menuitem"
              icon="hardware:keyboard-arrow-up"
              event-name="insert-above-active"
              label="Insert item above"
            ></hax-context-item>
          </simple-toolbar-menu-item>
          <simple-toolbar-menu-item slot="menuitem">
            <hax-context-item
              action
              show-text-label
              role="menuitem"
              icon="hardware:keyboard-arrow-down"
              event-name="insert-below-active"
              label="Insert item below"
            ></hax-context-item>
          </simple-toolbar-menu-item>
        </hax-toolbar-menu>
        <slot name="secondary"></slot>
        <slot name="more"></slot>
      </div>
      ${this.moreButton}
    `;
  }

  static get tag() {
    return "hax-ce-context";
  }
  static get properties() {
    return {
      ...super.properties,
      disableTransform: {
        type: Boolean,
      },
      onScreen: {
        type: Boolean,
        attribute: "on-screen",
        reflect: true,
      },
      sourceView: {
        type: Boolean,
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
      viewSource: {
        type: Boolean,
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
    this.viewSource = false;
    if (HAXStore.activeHaxBody && this.activeNode != null) {
      let schema = HAXStore.haxSchemaFromTag(this.activeNode.tagName);
      this.sourceView = schema.canEditSource;
      if (!HAXStore.isTextElement(this.activeNode)) {
        // detect if this can be transformed into anything else
        this.disableTransform = !HAXStore.activeHaxBody.canTansformNode(
          this.activeNode
        );
        if (HAXStore.activeGizmo) {
          this.activeTagName = HAXStore.activeGizmo.title;
          this.activeTagIcon = HAXStore.activeGizmo.icon;
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
