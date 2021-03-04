import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFilterMixin } from "@lrnwebcomponents/simple-filter/simple-filter.js";
import { haxElementToNode } from "@lrnwebcomponents/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
/* `hax-gizmo-browser`
 * `Browse a list of gizmos. This provides a listing of custom elements for people to search and select based on what have been defined as gizmos for users to select.`
 * @microcopy - the mental model for this element
 * - gizmo - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxGizmoBrowser extends I18NMixin(SimpleFilterMixin(LitElement)) {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          flex: 0 1 auto;
          overflow-y: auto;
        }
        :host > * {
          max-width: 100%;
        }
        .toolbar-inner {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          flex: 0 0 auto;
        }
        hax-tray-button::part(button) {
          font-size: var(hax-ui-font-size-xs);
        }
        simple-fields-field {
          margin-top: 0;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.where = "title";
    this.t = {
      filterContentTypes: "Filter Content Types",
    };
    this.registerTranslation({
      context: this,
      namespace: "hax",
    });
  }
  render() {
    return html`
      <div class="toolbar-inner" part="toolbar">
        <simple-fields-field
          id="inputfilter"
          @value-changed="${this.inputfilterChanged}"
          aria-controls="filter"
          label="${this.t.filterContentTypes}"
          type="text"
          auto-validate=""
          part="filter"
        ></simple-fields-field>
      </div>
      <simple-button-grid columns="3" always-expanded part="grid">
        ${this.filtered.map(
          (gizmo, i) => html`
            <hax-tray-button
              show-text-label
              voice-command="insert ${gizmo.title}"
              draggable="true"
              @dragstart="${this._dragStart}"
              @dragend="${this._dragEnd}"
              index="${i}"
              label="${gizmo.title}"
              event-name="insert-tag"
              event-data="${gizmo.tag}"
              data-demo-schema="true"
              icon-position="top"
              icon="${gizmo.icon}"
              part="grid-button"
            ></hax-tray-button>
          `
        )}
      </simple-button-grid>
    `;
  }
  static get tag() {
    return "hax-gizmo-browser";
  }
  /**
   * Drag start so we know what target to set
   */
  _dragStart(e) {
    // create the tag
    let schema = HAXStore.haxSchemaFromTag(e.target.eventData);
    var target;
    if (schema.gizmo.tag && schema.demoSchema && schema.demoSchema[0]) {
      target = haxElementToNode(schema.demoSchema[0]);
    } else {
      target = document.createElement(e.target.eventData);
    }
    HAXStore.__dragTarget = target;
    if (e.dataTransfer) {
      this.crt = target.cloneNode(true);
      if (schema.gizmo.tag && schema.demoSchema && schema.demoSchema[0]) {
        this.crt.style.width = "200px";
        this.crt.style.height = "200px";
      } else {
        this.crt.style.position = "absolute";
        this.crt.style.top = "-1000px";
        this.crt.style.right = "-1000px";
        this.crt.style.transform = "scale(0.25)";
      }
      this.crt.style.opacity = ".8";
      this.crt.style.backgroundColor = e.target.getAttribute("drag-color");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      //document.body.appendChild(this.crt);
      e.dataTransfer.setDragImage(this.crt, 0, 0);
    }
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
  /**
   * When we end dragging ensure we remove the mover class.
   */
  _dragEnd(e) {
    this.crt.remove();
  }
  inputfilterChanged(e) {
    this.like = e.target.value;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "activeApp") {
        this._activeAppChanged(this[propName], oldValue);
      }
      if (propName == "filtered") {
        this.requestUpdate();
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    autorun(() => {
      this.resetList(toJS(HAXStore.gizmoList));
    });
  }
  /**
   * Reset this browser.
   */
  resetList(list) {
    super.resetList(list);
    if (list) {
      this.items = [
        ...list.filter((gizmo, i) => {
          // remove inline and hidden references
          if (
            gizmo &&
            gizmo.meta &&
            (gizmo.meta.inlineOnly || gizmo.meta.hidden)
          ) {
            return false;
          }
          return true;
        }),
      ];
    }
  }
}
window.customElements.define(HaxGizmoBrowser.tag, HaxGizmoBrowser);
export { HaxGizmoBrowser };
