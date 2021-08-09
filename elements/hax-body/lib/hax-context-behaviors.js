import { LitElement, html, css } from "lit";
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
            max-width: 100%;
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
          }
          hax-toolbar::part(morebutton) {
            border: 1px solid
              var(
                --simple-toolbar-group-border-width,
                var(--simple-toolbar-border-width, 1px)
              ) !important;
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
        this.sourceView = false;
        if (activeNode && activeNode.tagName) {
          let schema = HAXStore.haxSchemaFromTag(activeNode.tagName);
          this.parentSchema =
            activeNode && activeNode.parentNode
              ? HAXStore.haxSchemaFromTag(activeNode.parentNode.tagName)
              : undefined;
          this.sourceView = schema.canEditSource;
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

    getFilteredBlocks(blocks = []) {
      return blocks.filter((block) => {
        if (!block.tag) return;
        let tag = block.tag || "",
          wrapper =
            !!this.slotSchema &&
            !!this.slotSchema.slotWrapper &&
            !!this.slotSchema.slotWrapper
              ? this.slotSchema.slotWrapper
              : undefined,
          allowed =
            !!this.slotSchema &&
            !!this.slotSchema.slotWrapper &&
            !!this.slotSchema.allowedSlotWrappers
              ? this.slotSchema.allowedSlotWrappers
              : undefined,
          excluded =
            !!this.slotSchema &&
            !!this.slotSchema.slotWrapper &&
            !!this.slotSchema.excludedSlotWrappers
              ? this.slotSchema.excludedSlotWrappers
              : undefined,
          //allow any tag since there is no allowed list specified
          allowAny = !this.slotSchema || !allowed,
          //only allow that are the default wrapper or part of the allowed list
          allowOnly =
            (!!wrapper && wrapper === tag) ||
            (!!allowed && allowed.includes(tag)),
          //don't allow tags on the excluded list
          allowExcept = !!excluded && excluded.includes(tag),
          //show only if tag is not excluded and is either part of allow any or allow only
          show = !allowExcept && (allowAny || allowOnly);
        if (this.tag == "hax-plate-context")
          console.log(
            tag,
            wrapper,
            excluded,
            allowAny,
            allowOnly,
            allowExcept,
            show
          );
        return show;
      });
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
