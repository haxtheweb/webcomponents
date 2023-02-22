import { LitElement, html, css } from "lit";
import { SimpleFilterMixin } from "@lrnwebcomponents/simple-filter/simple-filter.js";
import { haxElementToNode } from "@lrnwebcomponents/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import "./hax-element-demo.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js";
import "@lrnwebcomponents/simple-popover/lib/simple-popover-selection.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import "@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js";
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
        simple-popover-selection {
          display: flex;
        }
        hax-tray-button {
          flex: auto;
          font-size: 10px;
          --hax-ui-font-size-sm: 10px;
        }
        .toolbar-inner {
          max-width: 96%;
        }
        hax-tray-button::part(button) {
          font-size: var(hax-ui-font-size-xs);
        }
        simple-button-grid {
          --simple-button-grid-margin: 2px;
        }
        simple-fields-field {
          margin-top: 0;
          margin-bottom: 8px;
        }
        simple-fields-field::part(option-input) {
          padding: 0px 2px;
          font-size: 12px;
        }
        a11y-collapse {
          margin: 0;
          --a11y-collapse-margin: 0;
          --a11y-collapse-vertical-padding: 8px;
          --a11y-collapse-horizontal-padding: 4px;
        }
        a11y-collapse::part(heading) {
          margin: 4px;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.categories = [];
    this.where = "title";
    this.t = {
      filterContentTypes: "Filter Content Types",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    this.addEventListener("mouseleave", this.closePopover.bind(this));
    this.addEventListener("mouseout", this.closePopover.bind(this));
  }
  static get properties() {
    return {...super.properties,
      categories: { type: Array }
    }
  }
  closePopover() {
    let popover = window.SimplePopoverManager.requestAvailability();
    popover.opened = false;
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
      ${this.categories.map((tag) => html`
        <a11y-collapse heading="${this.ucfirst(tag)}" heading-button>
          <simple-button-grid columns="3" always-expanded part="grid">
            ${this.filtered.map(
              (gizmo, i) => html`${gizmo && gizmo.tags && gizmo.tags.includes(tag) ? html`
                <simple-popover-selection event="hover">
                  <hax-tray-button
                    show-text-label
                    voice-command="insert ${gizmo.title}"
                    draggable="true"
                    @dragstart="${this._dragStart}"
                    index="${i}"
                    label="${gizmo.title}"
                    event-name="insert-tag"
                    event-data="${gizmo.tag}"
                    data-demo-schema="true"
                    icon-position="top"
                    icon="${gizmo.icon}"
                    part="grid-button"
                    slot="button"
                  ></hax-tray-button>
                  <hax-element-demo
                    render-tag="${gizmo.tag}"
                    shortcut="${gizmo.shortcut ? gizmo.shortcut : null}"
                    slot="options"
                  ></hax-element-demo>
                </simple-popover-selection>`: ``}`
                )}
            </simple-button-grid>
        </a11y-collapse>`
      )}`;
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
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
    }
    e.stopPropagation();
    e.stopImmediatePropagation();
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
      if (propName == "items") {
        this.categories = [...this.updateCategories(this.items)];
      }
    });
  }
  ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  updateCategories(list) {
    let tags = [];
    list.forEach((gizmo) => {
      if (gizmo.tags && gizmo.tags[0]) {
        if (!tags.includes(gizmo.tags[0])) {
          tags.push(gizmo.tags[0]);
        }
      }
    });
    return tags;
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
            (gizmo.meta.inlineOnly || gizmo.meta.hidden || gizmo.requiresParent)
          ) {
            return false;
          }
          return true;
        }),
      ];
    }
  }
}
customElements.define(HaxGizmoBrowser.tag, HaxGizmoBrowser);
export { HaxGizmoBrowser };
