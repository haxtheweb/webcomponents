import { LitElement, html, css } from "lit";
import { SimpleTourFinder } from "@haxtheweb/simple-popover/lib/SimpleTourFinder.js";
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
      let schema = {};
      if (this.activeNode && this.parentSchema) {
        let slot = this.activeNode.slot || "";
        if (!this.activeNode || !this.activeNode.parentNode)
          schema = HAXStore.schemaBySlotId(this.activeNode.parentNode, slot);
      }
      return schema;
    }

    /**
     * closest layout element, self or parent
     *
     * @readonly
     * @memberof HaxPlateContext
     */
    get layoutElement() {
      return this.activeNode && HAXStore.isLayoutElement(this.activeNode)
        ? this.activeNode
        : this.activeNode &&
            this.activeNode.parentNode &&
            HAXStore.isLayoutElement(this.activeNode.parentNode)
          ? this.activeNode.parentNode
          : undefined;
    }
    /**
     * if layout element is itself a slot, get its layout element
     *
     * @readonly
     * @memberof HaxPlateContext
     */
    get layoutParent() {
      return this.layoutElement &&
        this.layoutElement.parentNode &&
        HAXStore.isLayoutElement(this.layoutElement.parentNode) &&
        this.layoutElement.parentNode.tagName &&
        this.layoutElement.parentNode.tagName !== "HAX-BODY"
        ? this.layoutElement.parentNode
        : undefined;
    }
    /**
     * gets slotted items of closest layout element
     *
     * @readonly
     * @memberof HaxPlateContext
     */
    get slottedItems() {
      if (!this.activeNode) return [];
      let slots = HAXStore.slottedContentByNode(this.layoutElement) || {},
        items = Object.keys(slots).map((key) => slots[key]);
      return items;
    }

    /**
     * given an element get its icon from HAX properties gizmo
     *
     * @param {object} node
     * @returns {string}
     * @memberof HaxPlateContext
     */
    elementIcon(node) {
      let gizmo =
        node && this.elementGizmo(node) ? this.elementGizmo(node) : undefined;
      return gizmo ? gizmo.icon : undefined;
    }

    /**
     * given an element get its label from HAX properties gizmo
     *
     * @param {object} node
     * @returns {string}
     * @memberof HaxPlateContext
     */
    elementLabel(node) {
      let gizmo =
        node && this.elementGizmo(node) ? this.elementGizmo(node) : undefined;
      return gizmo
        ? gizmo.title || gizmo.tag
        : node && node.tagName
          ? node.tagName.toLowerCase()
          : "";
    }

    /**
     * given an element get its gizmo data from HAX properties
     *
     * @param {object} node
     * @returns {object}
     * @memberof HaxPlateContext
     */
    elementGizmo(node) {
      let schema =
        node && node.tagName
          ? HAXStore.haxSchemaFromTag(node.tagName)
          : undefined;

      return schema && schema.gizmo ? schema.gizmo : undefined;
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
