import { LitElement, html, css } from "lit";
import "@haxtheweb/map-menu/lib/map-menu-submenu.js";
import "@haxtheweb/map-menu/lib/map-menu-item.js";
class MapMenuBuilder extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.editControls = false;
    this.items = [];
    this.depthCount = 1;
    this.maxDepth = 5;
    this.isFlex = false;
    this.isNested = false;
    this.isHorizontal = false;
    this.progress = null;
    this.lazyChildren = false;
  }
  /**
   * LitElement life cycle - render
   */
  render() {
    if (this.depthCount <= this.maxDepth) {
      if (!this._shouldRenderItems()) {
        return html`<div class="wrapper"></div>`;
      }
      return html`
        <div class="wrapper">
          ${
            this.items
              ? this.items.map(
                  (item) => html`
                    ${
                      item.children.length > 0 && this.hasVisibleChildren(item)
                        ? html`
                            <map-menu-submenu
                              itemtitle="${item.title}"
                              id="${item.id}"
                              url="${item.slug}"
                              icon="${
                                item.metadata && item.metadata.icon
                                  ? item.metadata.icon
                                  : null
                              }"
                              icon-label="${
                                item.metadata && item.metadata.pageType
                                  ? item.metadata.pageType
                                  : ""
                              }"
                              ?edit-controls="${this.editControls}"
                              selected="${this.selected}"
                              ?opened="${this.depthCount > 1 && this.isHorizontal}"
                              ?is-flex="${this.isFlex}"
                              ?is-nested="${this.depthCount > 1}"
                              ?is-horizontal="${this.isHorizontal}"
                              .published="${this.getPublishedStatus(item)}"
                              ?hide-in-menu="${this.hideInMenuStatus(item)}"
                              progress="${this.progressOf(item)}"
                            >
                              <map-menu-builder
                                .items="${item.children}"
                                .progress="${this.progress}"
                                ?edit-controls="${this.editControls}"
                                selected="${this.selected}"
                                depth-count="${this.depthCount + 1}"
                                max-depth="${this.maxDepth}"
                                ?is-flex="${this.isFlex}"
                                ?is-horizontal="${this.isHorizontal}"
                                ?is-nested="${true}"
                                ?lazy-children="${this.lazyChildren}"
                              ></map-menu-builder>
                            </map-menu-submenu>
                          `
                        : html`
                            <map-menu-item
                              ?edit-controls="${this.editControls}"
                              ?is-nested="${this.depthCount > 1}"
                              itemtitle="${item.title}"
                              id="${item.id}"
                              url="${item.slug}"
                              icon="${
                                item.metadata && item.metadata.icon
                                  ? item.metadata.icon
                                  : ""
                              }"
                              icon-label="${
                                item.metadata && item.metadata.pageType
                                  ? item.metadata.pageType
                                  : ""
                              }"
                              selected="${this.selected}"
                              .published="${this.getPublishedStatus(item)}"
                              ?hide-in-menu="${this.hideInMenuStatus(item)}"
                              ?locked="${item.metadata && item.metadata.locked}"
                              status="${
                                item.metadata && item.metadata.status
                                  ? item.metadata.status
                                  : ""
                              }"
                              progress="${this.progressOf(item)}"
                            ></map-menu-item>
                          `
                    }
                  `,
                )
              : ""
          }
        </div>
      `;
    }
  }

  /**
   * lazy-children: a nested list renders once its submenu has opened, or
   * when the selected item is somewhere inside it (so the active trail is
   * always in the DOM and can open itself). Once rendered it stays rendered.
   */
  _shouldRenderItems() {
    if (!this.lazyChildren || this.depthCount <= 1 || this.__itemsShown) {
      return true;
    }
    const submenu = this.parentElement;
    if (
      this.isHorizontal ||
      (submenu && submenu.opened) ||
      this._containsSelected(this.items)
    ) {
      this.__itemsShown = true;
      return true;
    }
    return false;
  }
  _containsSelected(items) {
    if (!this.selected || !Array.isArray(items)) {
      return false;
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.id === this.selected) {
        return true;
      }
      if (item.children && this._containsSelected(item.children)) {
        return true;
      }
    }
    return false;
  }
  // learner progress mark for an item; "" when there is no progress data
  progressOf(item) {
    return this.progress && item && this.progress[item.id]
      ? this.progress[item.id]
      : "";
  }

  hideInMenuStatus(item) {
    if (item.metadata && item.metadata.hideInMenu == true) {
      return true;
    }
    return false;
  }
  /**
   * Whether an item has at least one direct child that is not hidden from
   * the menu. When this is false the builder renders the item as a leaf
   * (map-menu-item) instead of a collapsible submenu, so we never show an
   * expand arrow that opens to nothing. Recursion handles deeper levels:
   * a child that itself has no visible children also renders as a leaf, so
   * empty collapses are pruned at every depth.
   */
  hasVisibleChildren(item) {
    if (!item.children || item.children.length === 0) {
      return false;
    }
    return item.children.some((child) => !this.hideInMenuStatus(child));
  }

  getPublishedStatus(item) {
    if (
      item.metadata &&
      (item.metadata.published == false || item.metadata.published === "false")
    ) {
      return false;
    }
    return true;
  }

  static get tag() {
    return "map-menu-builder";
  }

  static get properties() {
    return {
      items: {
        type: Array,
      },
      selected: {
        type: String,
      },
      editControls: {
        type: Boolean,
        attribute: "edit-controls",
      },
      maxDepth: {
        type: Number,
        attribute: "max-depth",
        reflect: true,
      },
      depthCount: {
        type: Number,
        attribute: "depth-count",
      },
      isFlex: {
        type: Boolean,
        attribute: "is-flex",
      },
      isHorizontal: {
        type: Boolean,
        attribute: "is-horizontal",
      },
      /**
       * Learner progress by item id: { <id>: "done" | "in-progress" |
       * "visited" | "not-started" }. Empty shows no marks.
       */
      progress: {
        type: Object,
      },
      /**
       * Render nested lists only when their submenu opens (see map-menu)
       */
      lazyChildren: {
        type: Boolean,
        attribute: "lazy-children",
      },
    };
  }
  createRenderRoot() {
    return this;
  }
}
globalThis.customElements.define(MapMenuBuilder.tag, MapMenuBuilder);
export { MapMenuBuilder };
