import { LitElement, html, css } from "lit";
import { SimpleFilterMixin } from "@haxtheweb/simple-filter/simple-filter.js";
import { haxElementToNode } from "@haxtheweb/utils/utils.js";
import { HAXStore } from "./hax-store.js";
import "./hax-element-demo.js";
import "./hax-tray-button.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-toolbar/lib/simple-button-grid.js";
import "@haxtheweb/simple-popover/lib/simple-popover-selection.js";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
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
          font-size: 12px;
          --hax-ui-font-size-sm: 12px;
          --simple-toolbar-button-height: 22px;
          --simple-toolbar-button-width: 22px;
        }
        hax-tray-button[small] {
          font-size: 8px;
          --hax-ui-font-size-sm: 8px;
          --simple-toolbar-button-height: 16px;
          --simple-toolbar-button-width: 16px;
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
          margin: 8px 0px;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.activePreview = null;
    this.daemonKeyCombo = null;
    autorun(() => {
      this.daemonKeyCombo = toJS(HAXStore.daemonKeyCombo);
    });
    this.items = [];
    this.categories = [];
    this.like = "";
    this.value = "";
    this.where = "index";
    this.recentGizmoList = [];
    this.t = {
      filterContentTypes: "Filter Content Types",
      recent: "Recent",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    this.addEventListener("mouseleave", this.closePopover.bind(this));
    this.addEventListener("mouseout", this.closePopover.bind(this));
    autorun(() => {
      if (HAXStore.editMode) {
        const recent = toJS(HAXStore.recentGizmoList);
        let recentList = [];
        let recentTags = [];
        recent.forEach((gizmo) => {
          if (gizmo && gizmo.tag) {
            if (!recentTags.includes(gizmo.tag)) {
              recentTags.push(gizmo.tag);
              recentList.push(gizmo);
              // limit to 5, then remove the 1st one
              if (recentList.length > 5) {
                recentTags.shift();
                recentList.shift();
              }
            }
          }
        });
        this.recentGizmoList = recentList;
      }
    });
  }
  static get properties() {
    return {
      ...super.properties,
      categories: { type: Array },
      hidden: { type: Boolean, reflect: true },
      recentGizmoList: { type: Array },
      activePreview: { type: Number },
    };
  }
  closePopover() {
    this.activePreview = null;
    let popover = globalThis.SimplePopoverManager.requestAvailability();
    popover.opened = false;
  }
  render() {
    return html`${this.hidden
      ? ``
      : html`<div class="toolbar-inner" part="toolbar">
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
          <a11y-collapse
            id="recent"
            heading="${this.t.recent}"
            heading-button
            expanded
          >
            <simple-button-grid columns="5" always-expanded part="grid">
              ${this.recentGizmoList.map(
                (gizmo, i) =>
                  html` <simple-popover-selection
                    data-index="${i}"
                    @opened-changed="${this._hoverForPreviewChange}"
                    event="hover"
                  >
                    <hax-tray-button
                      small
                      show-text-label
                      voice-command="insert ${gizmo.title}"
                      draggable="true"
                      @dragstart="${this._dragStart}"
                      index="${i}"
                      is-current-item
                      label="${gizmo.title}"
                      event-name="insert-tag"
                      event-data="${gizmo.tag}"
                      data-demo-schema="true"
                      icon-position="top"
                      icon="${gizmo.icon}"
                      part="grid-button"
                      slot="button"
                    ></hax-tray-button>
                    ${this.activePreview === parseInt(i)
                      ? html`
                          <hax-element-demo
                            render-tag="${gizmo.tag}"
                            slot="options"
                          ></hax-element-demo>
                        `
                      : ``}
                  </simple-popover-selection>`,
              )}
            </simple-button-grid>
          </a11y-collapse>
          ${this.categories.map(
            (tag) =>
              html` <a11y-collapse
                heading="${this.ucfirst(tag)}"
                heading-button
              >
                <simple-button-grid columns="3" always-expanded part="grid">
                  ${this.filtered.map(
                    (gizmo, i) =>
                      html`${gizmo && gizmo.tags && gizmo.tags.includes(tag)
                        ? html` <simple-popover-selection
                            data-index="${i}"
                            @opened-changed="${this._hoverForPreviewChange}"
                            event="hover"
                          >
                            <hax-tray-button
                              show-text-label
                              is-current-item
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
                            ${this.activePreview === parseInt(i)
                              ? html`
                                  <hax-element-demo
                                    render-tag="${gizmo.tag}"
                                    slot="options"
                                  ></hax-element-demo>
                                `
                              : ``}
                          </simple-popover-selection>`
                        : ``}`,
                  )}
                </simple-button-grid>
              </a11y-collapse>`,
          )} `}`;
  }
  static get tag() {
    return "hax-gizmo-browser";
  }
  // react to "opened" changing on the popover
  _hoverForPreviewChange(e) {
    const popover = e.detail;
    // this is open
    if (popover.opened) {
      this.activePreview = parseInt(popover.dataset.index);
      // @notice
      // timing hack because the act of opening the element triggers a light dom rebuild
      // in which the element is not yet visible, so we need to wait a tick
      // and then tell the pop up it should look at and re-clone it's light dom
      setTimeout(() => {
        e.detail.openedChanged(true);
      }, 10);
    }
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
      target = globalThis.document.createElement(e.target.eventData);
    }
    HAXStore.recentGizmoList.push(schema.gizmo);
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
    if (this.like == "") {
      this.collapseAll();
    } else {
      this.expandAll();
    }
  }
  expandAll() {
    this.shadowRoot.querySelectorAll("a11y-collapse").forEach((item) => {
      item.expanded = true;
    });
  }
  collapseAll() {
    this.shadowRoot
      .querySelectorAll("a11y-collapse:not(#recent)")
      .forEach((item) => {
        item.expanded = false;
      });
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "filtered") {
        this.requestUpdate();
      }
      if (propName == "items" && this[propName] && this[propName].length > 0) {
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
    tags.sort();
    return tags;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    autorun(() => {
      if (HAXStore.editMode) {
        this.resetList(toJS(HAXStore.gizmoList));
      }
    });
  }
  /**
   * Reset this browser.
   */
  resetList(list) {
    if (list) {
      this.like = "";
      this.value = "";
      const items = list.filter((gizmo, i) => {
        // remove inline and hidden references
        if (
          gizmo &&
          gizmo.meta &&
          (gizmo.meta.inlineOnly || gizmo.meta.hidden || gizmo.requiresParent)
        ) {
          return false;
        }
        return true;
      });
      // build index for improved searchability
      items.map((gizmo, i) => {
        items[i].index = gizmo.title + " " + gizmo.tag;
        if (gizmo.tags) {
          items[i].index += " " + gizmo.tags.join(" ");
        }
        if (gizmo.meta && gizmo.meta.author) {
          items[i].index += " " + gizmo.meta.author;
        }
      });
      this.items = [...items];
    }
  }
}
customElements.define(HaxGizmoBrowser.tag, HaxGizmoBrowser);
export { HaxGizmoBrowser };
