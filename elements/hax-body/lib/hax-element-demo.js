import { LitElement, html, css } from "lit";
import { HAXStore } from "./hax-store.js";
import { haxElementToNode } from "@haxtheweb/utils/utils.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
export class HaxElementDemo extends IntersectionObserverMixin(LitElement) {
  static get tag() {
    return "hax-element-demo";
  }
  constructor() {
    super();
    this.renderTag = null;
    this.activePickerSchema = -1;
    this.gizmoTitle = '';
    this.gizmoDescription = '';
    this.gizmoIcon = '';
  }
  static get properties() {
    return {
      ...super.properties,
      renderTag: { type: String, attribute: "render-tag" },
      activePickerSchema: { type: Number, attribute: "active-picker-schema" },
      gizmoTitle: { type: String, attribute: "gizmo-title" },
      gizmoDescription: { type: String, attribute: "gizmo-description" },
      gizmoIcon: { type: String, attribute: "gizmo-icon" },
    };
  }
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          width: 300px;
          background-color: light-dark(
            var(--simple-colors-default-theme-accent-1, #fff),
            var(--simple-colors-default-theme-accent-12, #222)
          );
        }
        .preview-wrap {
          height: 200px;
          width: 300px;
          overflow: hidden;
          padding: var(--ddd-spacing-2);
        }
        .preview-wrap ::slotted(*) {
          transform: scale(0.5);
          transform-origin: top left;
          width: 575px;
          max-height: 300px;
          pointer-events: none;
        }
        .info {
          padding: var(--ddd-spacing-2);
          border-top: var(--ddd-border-xs);
          background-color: light-dark(
            var(--simple-colors-default-theme-accent-1, #fff),
            var(--simple-colors-default-theme-accent-12, #222)
          );
          max-height: var(--ddd-spacing-16);
          overflow: hidden;
        }
        .title {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-4xs);
          margin-bottom: var(--ddd-spacing-1);
          color: light-dark(
            var(--simple-colors-default-theme-accent-12, #000),
            var(--simple-colors-default-theme-accent-1, #fff)
          );
        }
        .title simple-icon {
          --simple-icon-height: var(--ddd-spacing-4);
          --simple-icon-width: var(--ddd-spacing-4);
          flex-shrink: 0;
        }
        .description {
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
          color: light-dark(
            var(--simple-colors-default-theme-accent-11, #222),
            var(--simple-colors-default-theme-accent-2, #ddd)
          );
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
      `,
    ];
  }
  render() {
    // Truncate description to 200 characters
    const truncatedDescription = this.gizmoDescription && this.gizmoDescription.length > 200
      ? this.gizmoDescription.substring(0, 200) + '...'
      : this.gizmoDescription;
    
    return html`
      <div class="preview-wrap">
        <slot></slot>
      </div>
      ${this.gizmoTitle || truncatedDescription ? html`
        <div class="info">
          ${this.gizmoTitle ? html`
            <div class="title">
              ${this.gizmoIcon ? html`<simple-icon-lite icon="${this.gizmoIcon}"></simple-icon-lite>` : ''}
              <span>${this.gizmoTitle}</span>
            </div>
          ` : ''}
          ${truncatedDescription ? html`<div class="description">${truncatedDescription}</div>` : ''}
        </div>
      ` : ''}
    `;
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "renderTag" && this[propName]) {
        this.innerHTML = "";
        let schema = HAXStore.haxSchemaFromTag(this[propName]);
        var el;
        // support for active element being run through for a conversion
        if (
          this.activePickerSchema !== -1 &&
          globalThis.document.querySelector("hax-picker") &&
          globalThis.document.querySelector("hax-picker")._elements &&
          globalThis.document.querySelector("hax-picker")._elements.length > 0
        ) {
          // bc of data rendering we need to get full schema from source
          // this is bizarre looking for sure but we template stamp
          // the element into the modal and so it's globlly available at this time
          // the element also has prebuilt all of the known valid transformations
          // so instead of rebuilding and finding ours again we can just set the active
          // index to what it was at render time
          el = haxElementToNode(
            globalThis.document.querySelector("hax-picker")._elements[
              this.activePickerSchema
            ],
          );
        } else if (
          schema &&
          schema.gizmo &&
          schema.gizmo.tag &&
          schema.demoSchema &&
          schema.demoSchema[0]
        ) {
          el = haxElementToNode(schema.demoSchema[0]);
        } else {
          el = globalThis.document.createElement(this[propName]);
        }
        this.appendChild(el);
      }
    });
  }
}

globalThis.customElements.define(HaxElementDemo.tag, HaxElementDemo);
