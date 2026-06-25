import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css, render } from "lit";
import {
  renderPreview,
  RENDERER_OPTIONS,
} from "../../core/utils/haxcms-views-render-utility.js";
import {
  extractViewsRecords,
  resolveSiteApiBasePath,
} from "../../core/utils/haxcms-views-spec-utility.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/collection-list/collection-list.js";
import "@haxtheweb/collection-list/lib/collection-item.js";
import "@haxtheweb/play-list/play-list.js";
import "@haxtheweb/video-player/video-player.js";
import "@haxtheweb/accent-card/accent-card.js";
import "@haxtheweb/a11y-collapse/lib/a11y-collapse-group.js";
import "@haxtheweb/a11y-collapse/a11y-collapse.js";
import "@haxtheweb/a11y-tabs/a11y-tabs.js";
import "@haxtheweb/a11y-tabs/lib/a11y-tab.js";
import "@haxtheweb/lrndesign-timeline/lrndesign-timeline.js";
import "@haxtheweb/lrndesign-chart/lib/lrndesign-bar.js";
import "@haxtheweb/map-menu/map-menu.js";
import "@haxtheweb/editable-table/lib/editable-table-display.js";
import "@haxtheweb/image-gallery/image-gallery.js";
import "@haxtheweb/media-playlist/media-playlist.js";

export const mediaKeys = [
  "audio",
  "selfChecks",
  "objectives",
  "authorNotes",
  "images",
  "h5p",
  "headings",
  "dataTables",
  "specialTags",
  "links",
  "placeholders",
  "siteremotecontent",
  "video",
];

export class SiteView extends DDD {
  static get tag() {
    return "site-view";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: var(--ddd-spacing-8);
        }
        .loading simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-lg);
          --simple-icon-width: var(--ddd-icon-lg);
          color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-theme-default-futureLime)
          );
        }
        .empty {
          padding: var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .error {
          padding: var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-4xs);
          color: var(--ddd-theme-default-original87Pink);
          border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-original87Pink);
          border-radius: var(--ddd-radius-sm);
          background: light-dark(
            var(--ddd-theme-default-potentialMidnight),
            rgba(255, 255, 255, 0.04)
          );
        }
        .refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin-top: var(--ddd-spacing-2);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.src = "";
    this.renderer = "collection";
    this.entity = "";
    this.loading = false;
    this.results = [];
    this.error = "";
    this.editMode = false;
    this.breakSiteView = false;
    this.__fetchDebounce = null;
  }

  static get properties() {
    return {
      ...super.properties,
      src: { type: String },
      renderer: { type: String },
      entity: { type: String },
      loading: { type: Boolean, reflect: true },
      results: { type: Array, attribute: false },
      error: { type: String },
      editMode: { type: Boolean, attribute: false },
      breakSiteView: {
        type: Boolean,
        reflect: true,
        attribute: "break-site-view",
      },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (this.children.length > 0) {
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
    }
    this._fetchData();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (["src", "renderer", "entity"].includes(propName)) {
        this._fetchData();
      }
      if (propName === "breakSiteView" && this.breakSiteView) {
        this._breakSiteView();
      }
    });
  }

  _fetchData() {
    clearTimeout(this.__fetchDebounce);
    this.__fetchDebounce = setTimeout(() => {
      this._doFetch();
    }, 100);
  }

  _getFetchUrl() {
    if (!this.src) {
      return "";
    }
    const trimmed = this.src.trim();
    if (
      trimmed.indexOf("http://") === 0 ||
      trimmed.indexOf("https://") === 0 ||
      trimmed.indexOf("/x/api/") !== -1
    ) {
      return trimmed;
    }
    const apiBasePath = resolveSiteApiBasePath();
    const entityName = this.entity || "item";
    const endpoint = `${apiBasePath}/v1/${entityName}s`;
    const query = trimmed.startsWith("?")
      ? trimmed
      : trimmed
        ? `?${trimmed}`
        : "";
    return `${endpoint}${query}`;
  }

  async _doFetch() {
    const url = this._getFetchUrl();
    if (!url) {
      return;
    }
    this.loading = true;
    this.error = "";
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Fetch failed (${response.status})`);
      }
      const payload = await response.json();
      const extracted = extractViewsRecords(payload, { name: this.entity });
      const records = Array.isArray(extracted.records) ? extracted.records : [];
      if (!this._recordsEqual(records, this.results)) {
        this.results = records;
      }
    } catch (e) {
      this.error = e.message || "Unable to load view data.";
    } finally {
      this.loading = false;
    }
  }

  _recordsEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch (e) {
      return false;
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading">
          <simple-icon-lite icon="hax:loading"></simple-icon-lite>
        </div>
      `;
    }
    if (this.error && (!this.results || this.results.length < 1)) {
      return html`
        <div class="error" role="status" aria-live="polite">
          ${this.error}
        </div>
      `;
    }
    if (!this.results || this.results.length < 1) {
      return html`
        <div class="empty" role="status" aria-live="polite">
          No results found.
        </div>
      `;
    }
    return html`
      ${renderPreview(this.results, this.renderer, {
        selectedEntity: this.entity,
      })}
    `;
  }

  _breakSiteView() {
    if (!this.shadowRoot) {
      return;
    }
    const container = globalThis.document.createElement("div");
    render(
      renderPreview(this.results, this.renderer, {
        selectedEntity: this.entity,
      }),
      container,
    );
    const parent = this.parentNode;
    if (parent) {
      while (container.firstChild) {
        parent.insertBefore(container.firstChild, this);
      }
      parent.removeChild(this);
    }
  }

  refreshView() {
    this._fetchData();
  }

  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
      inlineContextMenu: "haxinlineContextMenu",
      preProcessNodeToContent: "haxPreProcessNodeToContent",
    };
  }

  haxeditModeChanged(value) {
    this.editMode = value;
  }

  haxactiveElementChanged(element, value) {
    if (value) {
      this.editMode = value;
    }
  }

  haxPreProcessNodeToContent(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    if (this.shadowRoot) {
      Array.from(this.shadowRoot.children).forEach((child) => {
        const className = child.className || "";
        if (
          className.includes("loading") ||
          className.includes("empty") ||
          className.includes("error")
        ) {
          return;
        }
        node.appendChild(child.cloneNode(true));
      });
    }
    return node;
  }

  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "icons:refresh",
        callback: "refreshView",
        label: "Refresh view",
      },
      {
        icon: "icons:open-in-browser",
        callback: "breakSiteView",
        label: "Break into static content",
      },
    ];
  }

  static get haxProperties() {
    return {
      canScale: false,
      canEditSource: false,
      gizmo: {
        title: "Site View",
        description:
          "A dynamic block that queries and displays site data based on criteria",
        icon: "hax:view-gallery",
        color: "grey",
        tags: ["Other", "site", "views", "data", "display", "filter", "view"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            property: "src",
            title: "View URL",
            description:
              "Query parameters for the view data feed. You can obtain this from the Views dashboard.",
            inputMethod: "textfield",
            required: true,
          },
          {
            property: "renderer",
            title: "Display mode",
            description: "How the view results should be rendered",
            inputMethod: "select",
            options: RENDERER_OPTIONS.reduce((acc, opt) => {
              acc[opt.value] = opt.text;
              return acc;
            }, {}),
          },
          {
            property: "entity",
            title: "Entity type",
            description: "Entity type used for parsing the response",
            inputMethod: "select",
            options: {
              "": "Default (items)",
              item: "Item",
              page: "Page",
              file: "File",
              tag: "Tag",
              block: "Block",
              view: "View",
              theme: "Theme",
              region: "Region",
              customElement: "Custom Element",
            },
          },
        ],
        developer: [
          {
            property: "breakSiteView",
            title: "Break site view",
            description:
              "Convert to static content for direct editing; stops auto-updating from source.",
            inputMethod: "boolean",
          },
        ],
      },
      saveOptions: {
        unsetAttributes: [
          "editMode",
          "edit-mode",
          "loading",
          "error",
          "results",
        ],
      },
      demoSchema: [
        {
          tag: "site-view",
          properties: {
            src: "?display=list&displayOf=title&parent=__ACTIVE__",
            renderer: "collection",
          },
          content: "",
        },
      ],
    };
  }
}

globalThis.customElements.define(SiteView.tag, SiteView);
