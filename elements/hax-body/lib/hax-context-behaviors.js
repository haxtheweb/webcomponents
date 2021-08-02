import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleTourFinder } from "@lrnwebcomponents/simple-popover/lib/SimpleTourFinder";
import { autorun, toJS } from "mobx";
import { HAXStore } from "./hax-store.js";
/**
 *
 * @customElement
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
export const HaxContextBehaviors = function (SuperClass) {
  return class extends SimpleTourFinder(SuperClass) {
    /**
     * LitElement constructable styles enhancement
     */
    static get styles() {
      return [
        css`
          :host {
            display: block;
            pointer-events: none;
            --hax-ui-spacing-sm: 1px;
          }
          :host [hidden] {
            display: none;
          }
          .selected-buttons {
            transition: 0.1s all ease-in-out;
            width: 0;
          }
          :host([has-selected-text]) .selected-buttons {
            width: 100%;
          }
          :host(.hax-context-pin-top) #toolbar {
            position: fixed;
            top: 0px;
          }
          :host(:hover),
          :host(:focus-within) {
            z-index: var(--hax-ui-focus-z-index) !important;
          }
          .group {
            padding: 0;
            background-color: var(--hax-ui-background-color);
          }
          hax-toolbar {
            flex: 0 1 auto;
            border: none !important;
          }
          hax-toolbar[collapse-disabled]::part(morebutton) {
            display: none !important;
          }
          hax-toolbar *[hidden] {
            display: none !important;
          }
          hax-toolbar[collapse-disabled]::part(morebutton) {
            display: none !important;
          }
        `,
      ];
    }

    constructor() {
      super();
      this.viewSource = false;
      autorun(() => {
        this.hasSelectedText = toJS(HAXStore.haxSelectedText).length > 0;
      });
      autorun(() => {
        // this just forces this block to run when editMode is modified
        const editMode = toJS(HAXStore.editMode);
        const activeNode = toJS(HAXStore.activeNode);
        //this.viewSource = false;
        if (activeNode && activeNode.tagName) {
          let schema = HAXStore.haxSchemaFromTag(activeNode.tagName);
          this.parentSchema =
            activeNode && activeNode.parentNode
              ? HAXStore.haxSchemaFromTag(activeNode.parentNode.tagName)
              : undefined;
          //this.sourceView = schema.canEditSource;
        }
      });
    }
    render() {
      return html`<slot></slot> `;
    }
    static get tag() {
      return "hax-context-behaviors";
    }
    static get properties() {
      return {
        ...super.properties,
        activeNode: {
          type: Object,
        },
        parentSchema: {
          type: Object,
        },
        realSelectedValue: {
          type: String,
        },
        sourceView: {
          type: Boolean,
        },
        viewSource: {
          type: Boolean,
          reflect: true,
          attribute: "view-source",
        },
      };
    }

    get slotSchema() {
      let schema;
      if (this.activeNode && this.parentSchema) {
        let slot = this.activeNode.slot || "";
        Object.keys(this.parentSchema.settings || {}).forEach((type) => {
          (this.parentSchema.settings[type] || []).forEach((setting) => {
            if (setting.slot && setting.slot === slot) schema = setting;
          });
        });
      }
      return schema;
    }
    updated(changedProperties) {
      if (super.updated) super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "activeNode" && this.activeNode !== oldValue)
          this.setTarget(this.activeNode);
      });
    }

    setTarget(node = this.activeNode) {
      if (super.setTarget) super.setTarget(node);
      this.parentSchema =
        node && node.parentNode
          ? HAXStore.haxSchemaFromTag(node.parentNode.tagName)
          : undefined;
    }
  };
};
