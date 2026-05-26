import { store, iconFromPageType } from "./haxcms-site-store.js";
import { toJS } from "mobx";
import { LitElement, html, css } from "lit";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import "@haxtheweb/simple-img/simple-img.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "../ui-components/lesson-overview/lib/lesson-highlight.js";
import "@github/time-elements/dist/relative-time-element.js";
import "@haxtheweb/iframe-loader/lib/loading-indicator.js";
import { learningComponentTypes } from "@haxtheweb/d-d-d/lib/DDDStyles.js";

enableServices(["haxcms", "core"]);

/**
 * `haxcms-outline-editor-dialog`
 * `Dialog for presenting an editable outline`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 */
class HAXCMSShareDialog extends HAXCMSI18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          --haxcms-insights-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --haxcms-insights-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --haxcms-insights-surface-subtle: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          --haxcms-insights-border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          --haxcms-insights-link-color: light-dark(
            var(--ddd-theme-default-navy),
            var(--ddd-theme-default-linkLight)
          );
          --haxcms-insights-link-hover-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --haxcms-insights-focus-color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-theme-default-keystoneYellow)
          );
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary);
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          padding: var(--ddd-spacing-4);
          color: var(--haxcms-insights-color);
          background: var(--haxcms-insights-surface);
          flex-shrink: 0;
        }
        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          gap: var(--ddd-spacing-2);
        }
        .panel-scroll {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        :host([hide-results*="link-status-false"]) .link-status-false,
        :host([hide-results*="link-status-true"]) .link-status-true {
          display: none;
        }
        .selector-wrapper {
          margin-bottom: var(--ddd-spacing-6);
          font-size: var(--ddd-font-size-m);
          line-height: var(--ddd-lh-120);
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          flex-wrap: wrap;
        }
        .selector-wrapper label {
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-navigation);
          color: var(--haxcms-insights-color);
        }
        .selector-wrapper select {
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-120);
          padding: var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-color: var(--haxcms-insights-border-color);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--haxcms-insights-surface);
          color: var(--haxcms-insights-color);
          font-family: var(--ddd-font-navigation);
        }
        .selector-wrapper select:focus-visible {
          outline: var(--ddd-border-sm) solid var(--haxcms-insights-focus-color);
          outline-offset: 2px;
        }
        .selector-wrapper simple-toolbar-button {
          --simple-toolbar-button-border-width: 1px;
          --simple-toolbar-border-color: var(--haxcms-insights-border-color);
          --simple-toolbar-border-radius: var(--ddd-radius-xs);
          --simple-toolbar-button-padding: var(--ddd-spacing-2);
          background-color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-primary-4)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-navigation);
        }
        .selector-wrapper simple-toolbar-button:focus-within {
          outline: var(--ddd-border-sm) solid var(--haxcms-insights-focus-color);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }
        .selector-wrapper simple-toolbar-button:hover {
          background-color: light-dark(
            var(--ddd-theme-default-original87Pink),
            var(--ddd-primary-5)
          );
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .report-highlight-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--ddd-spacing-3);
          align-items: stretch;
        }
        .group-set {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: var(--ddd-spacing-1);
        }
        details {
          max-width: 100%;
          min-width: 100%;
          box-sizing: border-box;
        }
        .group {
          margin: 0;
          border: var(--ddd-border-sm);
          border-color: var(--haxcms-insights-border-color);
          border-radius: var(--ddd-radius-md);
          background: var(--haxcms-insights-surface);
          padding: var(--ddd-spacing-4);
        }
        .group-summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: var(--ddd-spacing-3);
          margin-bottom: 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--haxcms-insights-color);
          background-color: var(--haxcms-insights-surface-subtle);
          border-radius: var(--ddd-radius-sm);
          text-wrap: wrap;
          padding: var(--ddd-spacing-4);
          user-select: none;
          transition:
            background-color 0.2s ease-in-out,
            color 0.2s ease-in-out;
        }
        .group[open] .group-summary {
          margin-bottom: var(--ddd-spacing-3);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .group-summary::-webkit-details-marker {
          display: none;
        }
        .group-summary::marker {
          content: "";
        }
        .group-summary::after {
          content: "";
        }
        .group-summary:focus,
        .group-summary:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-nittanyNavy)
          );
        }
        .group-summary:focus-visible {
          outline: var(--ddd-border-sm) solid var(--haxcms-insights-focus-color);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }
        .summary-leading {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .summary-toggle-icon {
          display: inline-flex;
          align-items: center;
          margin-left: auto;
        }
        .summary-toggle-icon simple-icon-lite {
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        .group .group-summary .collapse-icon-expanded {
          display: none;
        }
        .group[open] .group-summary .collapse-icon-collapsed {
          display: none;
        }
        .group[open] .group-summary .collapse-icon-expanded {
          display: inline-flex;
        }
        .group-body {
          padding: 0;
          border-top: 0;
          background: transparent;
          color: var(--haxcms-insights-color);
        }
        h2 {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--haxcms-insights-color);
        }
        .summary-leading simple-icon-lite {
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        .group-summary h3 {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
        }
        .group-body a {
          color: var(--haxcms-insights-link-color);
        }
        .group-body a:hover,
        .group-body a:focus,
        .group-body a:active {
          color: var(--haxcms-insights-link-hover-color);
        }
        .group-body a:focus-visible {
          outline: var(--ddd-border-sm) solid var(--haxcms-insights-focus-color);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }
        .group-body loading-indicator {
          --loading-indicator-color: var(--ddd-theme-default-skyBlue);
        }
        simple-fields {
          --simple-fields-color: var(--haxcms-insights-color);
          --simple-fields-background-color: transparent;
          --simple-fields-select-option-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --simple-fields-select-option-selected-background-color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-fields-button-background-color: transparent;
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
        }
        simple-fields-field[type="checkbox"],
        simple-fields-field[type="select"] {
          display: inline-block;
          margin: var(--ddd-spacing-2) var(--ddd-spacing-3) var(--ddd-spacing-2)
            0;
        }
        simple-icon {
          --simple-icon-height: var(--ddd-icon-4xs, 24px);
          --simple-icon-width: var(--ddd-icon-4xs, 24px);
          padding: 2px;
        }
        .content-item {
          min-height: 225px;
          width: 100%;
          max-width: 100%;
          border: var(--ddd-border-sm);
          border-color: var(--haxcms-insights-border-color);
          border-radius: var(--ddd-radius-md);
          background: var(--haxcms-insights-surface-subtle);
          padding: var(--ddd-spacing-4);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
        }
        .content-item .title-link {
          text-decoration: none;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--haxcms-insights-link-color);
          display: inline-flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
        }
        .content-item-title {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-120);
        }
        .content-item .title-link:hover,
        .content-item .title-link:focus,
        .content-item .title-link:active {
          text-decoration: underline;
          color: var(--haxcms-insights-link-hover-color);
        }
        .content-item .title-link:focus-visible {
          outline: var(--ddd-border-sm) solid var(--haxcms-insights-focus-color);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }
        .content-item-preview simple-img {
          width: 100%;
          max-width: 100%;
          min-height: 140px;
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
        }
        .content-item .meta {
          font-size: var(--ddd-font-size-xs, 12px);
          line-height: var(--ddd-lh-140, 1.4);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }
        .content-item .stats {
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--ddd-spacing-1);
        }
        .content-item .stats li {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .content-item .stats li simple-icon {
          --simple-icon-height: var(--ddd-icon-4xs, 20px);
          --simple-icon-width: var(--ddd-icon-4xs, 20px);
          padding: 0;
          flex-shrink: 0;
        }
        .content-list li {
          display: block;
          margin: 0;
          padding: 0;
          font-size: var(--ddd-font-size-xs, 12px);
        }
        .reports {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
          padding: 0;
        }
        .reports lesson-highlight {
          --lesson-highlight-grid-template-columns: 3.5em
            var(--ddd-spacing-2, 8px) minmax(0, 1fr);
          --lesson-highlight-internal-margin: 0;
          --lesson-highlight-internal-padding: var(--ddd-spacing-3);
          --simple-colors-default-theme-accent-8: light-dark(
            var(--ddd-theme-default-navy),
            var(--ddd-theme-default-limestoneLight)
          );
          --simple-colors-default-theme-accent-9: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --simple-colors-default-theme-accent-10: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-colors-default-theme-accent-11: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-colors-default-theme-accent-12: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-colors-default-theme-grey-1: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-colors-default-theme-grey-4: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          --simple-colors-default-theme-grey-8: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --simple-colors-default-theme-grey-10: var(--haxcms-insights-color);
          --simple-colors-default-theme-grey-12: var(--haxcms-insights-color);
          --lesson-highlight-icon-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --lesson-highlight-icon-border-color: light-dark(
            var(--ddd-theme-default-navy),
            var(--ddd-theme-default-limestoneLight)
          );
          --lesson-highlight-icon-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-nittanyNavy)
          );
          --lesson-highlight-text-color: var(--haxcms-insights-color);
          --lesson-highlight-subtext-color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .reports .recently-updated-items {
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-140, 1.4);
          margin: 0;
          padding-left: var(--ddd-spacing-4);
        }
        .reports .recently-updated-items li {
          margin-bottom: var(--ddd-spacing-1);
        }
        .reports-wrapper,
        .linkchecker-wrapper,
        .contentbrowser-wrapper,
        .mediabrowser-wrapper {
          padding: var(--ddd-spacing-4);
        }
        .media-list li {
          margin: 0;
          display: block;
        }
        .media-item {
          width: 100%;
          max-width: 100%;
          border: var(--ddd-border-sm);
          border-color: var(--haxcms-insights-border-color);
          border-radius: var(--ddd-radius-md);
          background: var(--haxcms-insights-surface-subtle);
          padding: var(--ddd-spacing-4);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
          min-height: 100%;
        }
        .media-item-header {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }
        .media-item-title {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-120);
          font-weight: var(--ddd-font-weight-bold);
          word-break: break-word;
        }
        .media-item-meta {
          margin: 0;
          font-size: var(--ddd-font-size-xs, 12px);
          line-height: var(--ddd-lh-120);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .media-item-preview {
          width: 100%;
          max-width: 100%;
        }
        .media-item-preview simple-img,
        .media-item-preview iframe,
        .media-item-preview video-player {
          width: 100%;
          max-width: 100%;
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          border: 0;
        }
        .media-item-preview iframe,
        .media-item-preview video-player {
          min-height: 220px;
        }
        .media-item-preview simple-img {
          min-height: 180px;
        }
        .media-item-audit {
          margin-top: var(--ddd-spacing-2);
        }
        .content-list,
        .media-list {
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--ddd-spacing-4);
        }
        @media screen and (max-width: 900px) {
          :host {
            min-width: 0;
            width: 100%;
            padding: var(--ddd-spacing-3);
          }
          .group {
            padding: var(--ddd-spacing-3);
          }
          .report-highlight-list,
          .content-list,
          .media-list {
            grid-template-columns: 1fr;
          }
        }
      `,
    ];
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "activeTab" && this[propName]) {
        this.refreshData();
      }
    });
  }
  _activeSchema() {
    switch (this.activeTab) {
      case "linkchecker":
        return this.shadowRoot.querySelector("#linkchecker-schema");
      case "contentbrowser":
        return this.shadowRoot.querySelector("#contentbrowser-schema");
      case "mediabrowser":
        return this.shadowRoot.querySelector("#mediabrowser-schema");
      default:
        return null;
    }
  }
  _reportHeading(icon, label) {
    return html`<span class="summary-leading">
      <simple-icon-lite icon="${icon}" aria-hidden="true"></simple-icon-lite>
      <h3>${label}</h3>
    </span>`;
  }
  _groupToggled(e) {
    if (!e || !e.currentTarget) {
      return;
    }
    const item = e.currentTarget;
    const itemId = item.getAttribute("data-id");
    if (!itemId) {
      return;
    }
    if (item.open) {
      this.shadowRoot.querySelectorAll("details.group").forEach((group) => {
        if (group !== item && group.open) {
          group.open = false;
        }
      });
      if (this.activeTab !== itemId) {
        this.activeTab = itemId;
      }
    } else if (this.activeTab === itemId) {
      this.activeTab = "";
    }
  }

  _reportsResponse(data) {
    this.loading = false;
    const responseData =
      data && data.data && typeof data.data === "object" ? data.data : {};
    this.data = responseData;
    // for filtering purposes
    this._originalData = JSON.parse(JSON.stringify(responseData));
    this.filters = {};
    setTimeout(() => {
      const schema = this._activeSchema();
      if (!schema && this.activeTab !== "reports") {
        return;
      }
      switch (this.activeTab) {
        case "linkchecker":
          this.filters = { links: "all" };
          schema.fields = [
            {
              property: "links",
              title: "Link status",
              inputMethod: "select",
              options: {
                all: "All",
                error: "Error only",
                ok: "OK only",
              },
            },
          ];
          break;
        case "contentbrowser":
          this.filters = {
            sort: "title",
            title: "",
            hasVideo: false,
            hasH5P: false,
            hasAuthorNotes: false,
            hasLinks: false,
            hasImages: false,
            hasPlaceholders: false,
            hasSiteRemoteContent: false,
          };
          schema.value = this.filters;
          schema.fields = [
            {
              property: "title",
              title: "Title",
              inputMethod: "textfield",
            },
            {
              property: "pageType",
              title: "Page type",
              inputMethod: "select",
              options: {
                "": "",
                ...learningComponentTypes,
              },
            },
            {
              property: "sort",
              title: "Sort by",
              inputMethod: "select",
              options: {
                title: "Title",
                lastUpdated: "Last updated",
                contentLength: "Content length",
              },
            },
            {
              property: "hasAuthorNotes",
              title: "Author notes",
              description: "Includes content editor notes",
              inputMethod: "boolean",
            },
            {
              property: "hasVideo",
              title: "Video",
              description: "Includes video",
              inputMethod: "boolean",
            },
            {
              property: "hasH5P",
              title: "H5P",
              description: "Includes h5p",
              inputMethod: "boolean",
            },
            {
              property: "hasPlaceholders",
              title: "Placeholders",
              description: "Includes placeholders",
              inputMethod: "boolean",
            },
            {
              property: "hasSiteRemoteContent",
              title: "Remote content",
              description: "Includes remote content",
              inputMethod: "boolean",
            },
            {
              property: "hasLinks",
              title: "Links",
              description: "Includes external links",
              inputMethod: "boolean",
            },
            {
              property: "hasImages",
              title: "Images",
              description: "Includes images",
              inputMethod: "boolean",
            },
          ];
          break;
        case "mediabrowser":
          this.filters = { title: "", type: "all", location: "all" };
          schema.fields = [
            {
              property: "title",
              title: "Title",
              inputMethod: "textfield",
            },
            {
              property: "status",
              title: "Status",
              inputMethod: "select",
              options: {
                all: "All",
                info: "No issues",
                warning: "Warnings",
                error: "Errors",
              },
            },
            {
              property: "type",
              title: "Media type",
              inputMethod: "select",
              options: {
                all: "All",
                audio: this.t.audio,
                video: this.t.video,
                image: this.t.images,
                h5p: "H5P",
                document: "Document",
              },
            },
            {
              property: "location",
              title: "Location",
              inputMethod: "select",
              options: {
                all: "All",
                external: "External only",
                internal: "Internal only",
              },
            },
          ];
          schema.value = this.filters;
          schema.values = this.filters;
          break;
      }
    }, 0);
  }
  refreshData() {
    let base = this.base;
    if (base == "" && globalThis.document.querySelector("base")) {
      base = globalThis.document.querySelector("base").href;
    }
    const site = toJS(store.manifest);
    const params = {
      type: "site",
      site: {
        file: base + "site.json",
        id: site.id,
        title: site.title,
        author: site.author,
        description: site.description,
        license: site.license,
        metadata: site.metadata,
        items: site.items,
      },
      activeId: this.shadowRoot.querySelector("#selector").value,
      link: base,
    };
    this.loading = true;
    switch (this.activeTab) {
      case "reports":
        // Backend service remains named "insights" for compatibility; this powers Reports.
        MicroFrontendRegistry.call(
          "@haxcms/insights",
          params,
          this._reportsResponse.bind(this),
          this,
        );
        break;
      case "linkchecker":
        MicroFrontendRegistry.call(
          "@haxcms/linkChecker",
          params,
          this._reportsResponse.bind(this),
          this,
        );
        break;
      case "contentbrowser":
        MicroFrontendRegistry.call(
          "@haxcms/contentBrowser",
          params,
          this._reportsResponse.bind(this),
          this,
        );
        break;
      case "mediabrowser":
        MicroFrontendRegistry.call(
          "@haxcms/mediaBrowser",
          params,
          this._reportsResponse.bind(this),
          this,
        );
        break;
      // bad selection
      default:
        this.loading = false;
        break;
    }
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    // Legacy custom element name retained for compatibility; this element renders Reports UI.
    return "haxcms-site-insights";
  }
  getReadingTime(value) {
    let readVal = [];
    var hours = Math.floor(value / 60);
    var minutes = Math.floor(value - hours * 60);
    // handle hours of reading
    if (hours === 1) {
      readVal.push(`${hours} ${this.t.hour}`);
    } else if (hours === 0) {
      // do nothing for 0
    } else {
      readVal.push(`${hours} ${this.t.hours}`);
    }
    // minutes
    if (minutes === 1) {
      readVal.push(`${minutes} ${this.t.minute}`);
    } else if (minutes === 0) {
      // do nothing for 0
    } else {
      readVal.push(`${minutes} ${this.t.minutes}`);
    }
    return readVal.join(", ");
  }
  closeModal() {
    globalThis.dispatchEvent(new CustomEvent("simple-modal-hide"));
  }
  linkFormChanged(e) {
    this.filters.links = e.detail.value.links;
    // @todo refactor
    if (this.filters.links === "error") {
      this.hideResults = "link-status-true";
    } else if (this.filters.links === "ok") {
      this.hideResults = "link-status-false";
    } else {
      this.hideResults = "";
    }
  }
  contentBrowserFormChanged(e) {
    this.data = JSON.parse(JSON.stringify(this._originalData));
    let val = e.detail.value;
    this.filters = {
      title: val.title ? val.title : "",
      sort: val.sort,
      pageType: val.pageType,
      hasVideo: val.hasVideo,
      hasH5P: val.hasH5P,
      hasAuthorNotes: val.hasAuthorNotes,
      hasPlaceholders: val.hasPlaceholders,
      hasSiteRemoteContent: val.hasSiteRemoteContent,
      hasLinks: val.hasLinks,
      hasImages: val.hasImages,
    };
    if (this.data && this.data.contentData) {
      this.data.contentData = this.data.contentData.filter((item) => {
        if (this.filters.hasVideo === true && item.videos === 0) {
          return false;
        }
        if (this.filters.hasH5P === true && item.h5p === 0) {
          return false;
        }
        if (this.filters.hasAuthorNotes === true && item.authorNotes === 0) {
          return false;
        }
        if (this.filters.hasPlaceholders === true && item.placeholders === 0) {
          return false;
        }
        if (
          this.filters.hasSiteRemoteContent === true &&
          item.siteremotecontent === 0
        ) {
          return false;
        }
        if (this.filters.hasLinks === true && item.links === 0) {
          return false;
        }
        if (this.filters.hasImages === true && item.images === 0) {
          return false;
        }
        // skip type if not set or require exact match
        if (this.filters.pageType == "" || !this.filters.pageType) {
          return true;
        } else if (item.pageType != this.filters.pageType) {
          return false;
        }
        // no filtering, skip
        if (this.filters.title == "") {
          return true;
        } else if (
          !item.title.toLowerCase().includes(this.filters.title.toLowerCase())
        ) {
          return false;
        }
        return true;
      });
      this.data.contentData.sort((a, b) => {
        switch (this.filters.sort) {
          case "title":
            return a.title.localeCompare(b.title);
            break;
          case "contentLength":
            return b.readTime - a.readTime;
            break;
          case "lastUpdated":
            return new Date(b.updated) - new Date(a.updated);
            break;
        }
      });
    }
  }
  mediaBrowserFormChanged(e) {
    this.data = JSON.parse(JSON.stringify(this._originalData));
    let val = e.detail.value;
    this.filters = {
      title: val.title ? val.title : "",
      type: val.type ? val.type : "all",
      status: val.status ? val.status : "all",
      location: val.location ? val.location : "all",
    };
    if (this.data && this.data.mediaData) {
      this.data.mediaData = this.data.mediaData.filter((item) => {
        if (this.filters.location != "all") {
          if (this.filters.location != item.locType) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      });
      this.data.mediaData = this.data.mediaData.filter((item) => {
        if (this.filters.status != "all") {
          if (this.filters.status != item.status) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      });
      this.data.mediaData = this.data.mediaData.filter((item) => {
        if (this.filters.type != "all") {
          if (this.filters.type != item.type) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      });
      this.data.mediaData = this.data.mediaData.filter((item) => {
        // no filtering, skip
        if (!this.filters.title || this.filters.title == "") {
          return true;
        } else if (
          this.filters.title.toLowerCase &&
          !item.name.toLowerCase().includes(this.filters.title.toLowerCase())
        ) {
          return false;
        }
        return true;
      });
    }
  }
  // render function
  render() {
    const data = {
      pages: 0,
      objectives: 0,
      authorNotes: 0,
      specialTags: 0,
      dataTables: 0,
      headings: 0,
      video: 0,
      videoLength: 0,
      h5p: 0,
      audio: 0,
      links: 0,
      readTime: 0,
      readability: null,
      updatedItems: [],
      created: "",
      updated: "",
      ...(this.data && typeof this.data === "object" ? this.data : {}),
    };
    let base = this.base;
    if (base == "" && globalThis.document.querySelector("base")) {
      base = globalThis.document.querySelector("base").href;
    }
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          ${this.pageSelector()}
          <div class="group-set">
            <details
              class="group"
              data-id="reports"
              ?open="${this.activeTab === "reports"}"
              @toggle="${this._groupToggled}"
            >
              <summary class="group-summary">
                ${this._reportHeading("hax:graph", this.t.summary)}
                <span class="summary-toggle-icon" aria-hidden="true">
                  <simple-icon-lite
                    class="collapse-icon-collapsed"
                    icon="add"
                  ></simple-icon-lite>
                  <simple-icon-lite
                    class="collapse-icon-expanded"
                    icon="remove"
                  ></simple-icon-lite>
                </span>
              </summary>
              ${this.activeTab === "reports"
                ? html`
                    <div class="group-body">
                      <loading-indicator
                        full
                        ?loading="${this.loading}"
                      ></loading-indicator>
                      ${this.loading
                        ? html`<p role="status" aria-live="polite">
                            ${this.t.loading} ${this.t.reports}..
                          </p>`
                        : html`
                            <div class="reports reports-wrapper">
                              <h2>
                                ${data && data.title ? data.title : ""}
                                ${this.t.reports}
                              </h2>
                              <ul class="report-highlight-list">
                                <li>
                                  <lesson-highlight
                                    icon="editor:insert-drive-file"
                                  >
                                    <p slot="title">
                                      ${data.pages ? data.pages : html`0`}
                                      ${this.t.pages}
                                    </p>
                                    <p>
                                      ${data.objectives}
                                      ${this.t.learningObjectives},
                                      ${data.authorNotes} ${this.t.authorNotes},
                                      ${data.specialTags}
                                      ${this.t.specialElements},
                                      ${data.dataTables} ${this.t.dataTables},
                                      ${data.headings} ${this.t.headings}
                                    </p>
                                  </lesson-highlight>
                                </li>
                                ${data.video == 0
                                  ? ``
                                  : html`<li>
                                      <lesson-highlight
                                        icon="av:play-circle-outline"
                                      >
                                        <p slot="title">
                                          ${data.video} ${this.t.videos}
                                        </p>
                                        ${data.videoLength != 0
                                          ? html`<p>
                                              ${toHHMMSS(data.videoLength)}
                                            </p>`
                                          : ``}
                                      </lesson-highlight>
                                    </li>`}
                                ${data.h5p == 0
                                  ? ``
                                  : html`<li>
                                      <lesson-highlight icon="lrn:interact">
                                        <p slot="title">${data.h5p} H5P</p>
                                      </lesson-highlight>
                                    </li>`}
                                ${data.audio == 0
                                  ? ``
                                  : html`<li>
                                      <lesson-highlight icon="av:music-video">
                                        <p slot="title">
                                          ${data.audio} ${this.t.audio}
                                        </p>
                                      </lesson-highlight>
                                    </li>`}
                                <li>
                                  <lesson-highlight icon="icons:link">
                                    <p slot="title">
                                      ${data.links} ${this.t.externalLinks}
                                    </p>
                                  </lesson-highlight>
                                </li>
                                <li>
                                  <lesson-highlight
                                    icon="communication:import-contacts"
                                  >
                                    <p slot="title">
                                      ${this.getReadingTime(data.readTime)}
                                      ${this.t.ofReading}
                                    </p>
                                  </lesson-highlight>
                                </li>
                                ${data.readability
                                  ? html`
                                      <li>
                                        <lesson-highlight
                                          icon="editable-table:numbers"
                                        >
                                          <p slot="title">
                                            ${data.readability.gradeLevel}
                                          </p>
                                          <p>
                                            Dale-Chall
                                            ${this.t.basedGradeReadingLevel}
                                          </p>
                                        </lesson-highlight>
                                      </li>
                                      <li>
                                        <lesson-highlight
                                          icon="hax:format-textblock"
                                        >
                                          <p slot="title">
                                            ${data.readability.lexiconCount}
                                            ${this.t.words}
                                          </p>
                                          <p>
                                            ${data.readability.difficultWords}
                                            ${this.t.longWords}
                                          </p>
                                        </lesson-highlight>
                                      </li>
                                    `
                                  : ``}
                                <li>
                                  <lesson-highlight icon="device:access-time">
                                    <p slot="title">
                                      ${this.t.created}:
                                      <relative-time
                                        datetime="${data.created}"
                                      ></relative-time>
                                    </p>
                                  </lesson-highlight>
                                </li>
                                <li>
                                  <lesson-highlight icon="device:access-time">
                                    <p slot="title">
                                      ${this.t.lastUpdated}:
                                      <relative-time
                                        datetime="${data.updated}"
                                      ></relative-time>
                                    </p>
                                  </lesson-highlight>
                                </li>
                                <li>
                                  <lesson-highlight icon="av:av-timer">
                                    <p slot="title">${this.t.recentUpdates}</p>
                                    <ol class="recently-updated-items">
                                      ${data.updatedItems
                                        ? data.updatedItems.map(
                                            (item) =>
                                              html`<li>
                                                <a
                                                  @click="${this.closeModal}"
                                                  href="${item.slug}"
                                                  >${item.title}
                                                  <relative-time
                                                    datetime="${item.metadata
                                                      .updated}"
                                                  ></relative-time
                                                ></a>
                                              </li>`,
                                          )
                                        : ``}
                                    </ol>
                                  </lesson-highlight>
                                </li>
                              </ul>
                            </div>
                          `}
                    </div>
                  `
                : ``}
            </details>
            <details
              class="group"
              data-id="linkchecker"
              ?open="${this.activeTab === "linkchecker"}"
              @toggle="${this._groupToggled}"
            >
              <summary class="group-summary">
                ${this._reportHeading("icons:link", this.t.linkChecker)}
                <span class="summary-toggle-icon" aria-hidden="true">
                  <simple-icon-lite
                    class="collapse-icon-collapsed"
                    icon="add"
                  ></simple-icon-lite>
                  <simple-icon-lite
                    class="collapse-icon-expanded"
                    icon="remove"
                  ></simple-icon-lite>
                </span>
              </summary>
              ${this.activeTab == "linkchecker"
                ? html`
                    <div class="group-body">
                      <loading-indicator
                        full
                        ?loading="${this.loading}"
                      ></loading-indicator>
                      ${this.loading
                        ? html`<p role="status" aria-live="polite">
                            ${this.t.loading} ${this.t.linkChecker}..
                          </p>`
                        : html`
                            <div class="linkchecker-wrapper">
                              <h2>${this.t.linkReport}</h2>
                              <form>
                                <simple-fields
                                  id="linkchecker-schema"
                                  autofocus
                                  @value-changed="${this.linkFormChanged}"
                                ></simple-fields>
                              </form>
                              <ul class="link-list">
                                ${data.linkData
                                  ? Object.keys(data.linkData).map((key) =>
                                      this.renderLinkCheck(data.linkData, key),
                                    )
                                  : html`${this.t.noLinksInSelectedPages}`}
                              </ul>
                            </div>
                          `}
                    </div>
                  `
                : ``}
            </details>
            <details
              class="group"
              data-id="contentbrowser"
              ?open="${this.activeTab === "contentbrowser"}"
              @toggle="${this._groupToggled}"
            >
              <summary class="group-summary">
                ${this._reportHeading(
                  "icons:view-module",
                  this.t.contentBrowser,
                )}
                <span class="summary-toggle-icon" aria-hidden="true">
                  <simple-icon-lite
                    class="collapse-icon-collapsed"
                    icon="add"
                  ></simple-icon-lite>
                  <simple-icon-lite
                    class="collapse-icon-expanded"
                    icon="remove"
                  ></simple-icon-lite>
                </span>
              </summary>
              ${this.activeTab == "contentbrowser"
                ? html`
                    <div class="group-body">
                      <loading-indicator
                        full
                        ?loading="${this.loading}"
                      ></loading-indicator>
                      ${this.loading
                        ? html`<p role="status" aria-live="polite">
                            ${this.t.loading} ${this.t.contentBrowser}..
                          </p>`
                        : html`
                            <div class="contentbrowser-wrapper">
                              <h2>${this.t.contentBrowser}</h2>
                              <form>
                                <simple-fields
                                  id="contentbrowser-schema"
                                  autofocus
                                  @value-changed="${this
                                    .contentBrowserFormChanged}"
                                ></simple-fields>
                              </form>
                              <ul class="content-list">
                                ${data.contentData
                                  ? data.contentData.map(
                                      (item) => html`
                                        <li>
                                          <article class="content-item">
                                            <h3 class="content-item-title">
                                              <a
                                                class="title-link"
                                                href="${item.slug}"
                                                @click="${this.closeModal}"
                                                >${item.pageType
                                                  ? html`
                                                      <simple-icon-lite
                                                        title="${item.pageType}"
                                                        icon="${iconFromPageType(
                                                          item.pageType,
                                                        )}"
                                                      ></simple-icon-lite>
                                                    `
                                                  : ``}
                                                ${item.title}</a
                                              >
                                            </h3>
                                            <div class="content-item-preview">
                                              <simple-img
                                                loading="lazy"
                                                fetchpriority="low"
                                                decoding="async"
                                                src="https://screenshoturl.open-apis.hax.cloud/api/screenshotUrl?quality=25&render=img&urlToCapture=${base}${item.location}"
                                                alt="${item.title} preview"
                                                width="320"
                                                height="180"
                                                quality="80"
                                              ></simple-img>
                                            </div>
                                            <div class="meta">
                                              <div>
                                                ${this.t.created}
                                                <relative-time
                                                  datetime="${item.created}"
                                                ></relative-time>
                                              </div>
                                              <div>
                                                ${this.t.lastUpdated}
                                                <relative-time
                                                  datetime="${item.updated}"
                                                ></relative-time>
                                              </div>
                                            </div>
                                            <ul class="stats">
                                              ${item.objectives > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="editor:format-list-bulleted"
                                                    ></simple-icon
                                                    >${item.objectives}
                                                    ${this.t.learningObjectives}
                                                  </li>`
                                                : ``}
                                              ${item.authorNotes > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="hax:figure"
                                                    ></simple-icon
                                                    >${item.authorNotes}
                                                    ${this.t.authorNotes}
                                                  </li>`
                                                : ``}
                                              ${item.videos > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="av:play-arrow"
                                                    ></simple-icon
                                                    >${item.videos}
                                                    ${this.t.videos}
                                                  </li>`
                                                : ``}
                                              ${item.h5p > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="lrn:interact"
                                                    ></simple-icon
                                                    >${item.h5p} H5P
                                                  </li>`
                                                : ``}
                                              ${item.placeholders > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="hax:placeholder-image"
                                                    ></simple-icon
                                                    >${item.placeholders}
                                                    ${this.t.placeholders}
                                                  </li>`
                                                : ``}
                                              ${item.audio > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="av:music-video"
                                                    ></simple-icon
                                                    >${item.audio}
                                                    ${this.t.audio}
                                                  </li>`
                                                : ``}
                                              ${item.selfChecks > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="hardware:videogame-asset"
                                                    ></simple-icon
                                                    >${item.selfChecks}
                                                    ${this.t.selfChecks}
                                                  </li>`
                                                : ``}
                                              ${item.images > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="image:collections"
                                                    ></simple-icon
                                                    >${item.images}
                                                    ${this.t.images}
                                                  </li>`
                                                : ``}
                                              ${item.dataTables > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="image:grid-on"
                                                    ></simple-icon
                                                    >${item.dataTables}
                                                    ${this.t.dataTables}
                                                  </li>`
                                                : ``}
                                              ${item.specialTags > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="icons:stars"
                                                    ></simple-icon
                                                    >${item.specialTags}
                                                    ${this.t.specialElements}
                                                  </li>`
                                                : ``}
                                              ${item.links > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="icons:link"
                                                    ></simple-icon
                                                    >${item.links}
                                                    ${this.t.links}
                                                  </li>`
                                                : ``}
                                              ${item.readTime > 0
                                                ? html`<li>
                                                    <simple-icon
                                                      icon="icons:chrome-reader-mode"
                                                    ></simple-icon
                                                    >${this.getReadingTime(
                                                      item.readTime,
                                                    )}
                                                    ${this.t.ofReading}
                                                  </li>`
                                                : ``}
                                            </ul>
                                          </article>
                                        </li>
                                      `,
                                    )
                                  : ``}
                              </ul>
                            </div>
                          `}
                    </div>
                  `
                : ``}
            </details>
            <details
              class="group"
              data-id="mediabrowser"
              ?open="${this.activeTab === "mediabrowser"}"
              @toggle="${this._groupToggled}"
            >
              <summary class="group-summary">
                ${this._reportHeading("icons:perm-media", this.t.mediaBrowser)}
                <span class="summary-toggle-icon" aria-hidden="true">
                  <simple-icon-lite
                    class="collapse-icon-collapsed"
                    icon="add"
                  ></simple-icon-lite>
                  <simple-icon-lite
                    class="collapse-icon-expanded"
                    icon="remove"
                  ></simple-icon-lite>
                </span>
              </summary>
              ${this.activeTab == "mediabrowser"
                ? html`
                    <div class="group-body">
                      <loading-indicator
                        full
                        ?loading="${this.loading}"
                      ></loading-indicator>
                      ${this.loading
                        ? html`<p role="status" aria-live="polite">
                            ${this.t.loading} ${this.t.mediaBrowser}..
                          </p>`
                        : html`
                            <div class="mediabrowser-wrapper">
                              <h2>${this.t.mediaBrowser}</h2>
                              <form>
                                <simple-fields
                                  id="mediabrowser-schema"
                                  autofocus
                                  @value-changed="${this
                                    .mediaBrowserFormChanged}"
                                ></simple-fields>
                              </form>
                              <ul class="media-list">
                                ${data.mediaData
                                  ? data.mediaData.map(
                                      (item) => html`
                                        <li>
                                          <article
                                            class="media-item ${item.locType} ${item.type}"
                                          >
                                            <div class="media-item-header">
                                              <h3 class="media-item-title">
                                                ${item.name}
                                                ${item.title
                                                  ? ` ${item.title}`
                                                  : ``}
                                              </h3>
                                              <p class="media-item-meta">
                                                ${item.locType}, ${item.type}
                                              </p>
                                            </div>
                                            <div class="media-item-preview">
                                              ${item.type == "image"
                                                ? html`<simple-img
                                                      loading="lazy"
                                                      fetchpriority="low"
                                                      decoding="async"
                                                      src="${item.source}"
                                                      alt="${item.alt &&
                                                      item.alt != "null"
                                                        ? item.alt
                                                        : ""}"
                                                      width="320"
                                                      height="240"
                                                      quality="80"
                                                    ></simple-img>
                                                    <div
                                                      class="media-item-audit"
                                                    >
                                                      ${this.analyzeAltData(
                                                        item,
                                                      )}
                                                    </div>`
                                                : ``}
                                              ${item.type == "video" &&
                                              item.source.includes(
                                                "videoseries",
                                              )
                                                ? html`<iframe
                                                    src="${item.source}"
                                                    title="${item.title
                                                      ? item.title
                                                      : this.t.video}"
                                                    loading="lazy"
                                                  ></iframe>`
                                                : ``}
                                              ${item.type == "video" &&
                                              !item.source.includes(
                                                "videoseries",
                                              )
                                                ? html`<video-player
                                                    source="${item.source}"
                                                  ></video-player>`
                                                : ``}
                                              ${item.type == "h5p"
                                                ? html`<iframe
                                                    src="${item.source}"
                                                    title="${item.title
                                                      ? item.title
                                                      : "H5P content"}"
                                                    loading="lazy"
                                                  ></iframe>`
                                                : ``}
                                              ${item.type == "audio"
                                                ? html`<video-player
                                                    source="${item.source}"
                                                  ></video-player>`
                                                : ``}
                                              ${item.type == "document"
                                                ? html`<div>
                                                    <a
                                                      href="${item.source}"
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      >${this.t.openInNewTab}</a
                                                    >
                                                  </div>`
                                                : ``}
                                            </div>
                                            <div>
                                              <div>
                                                ${item.itemId
                                                  ? this.renderItemLinkById(
                                                      item.itemId,
                                                    )
                                                  : ``}
                                              </div>
                                            </div>
                                          </article>
                                        </li>
                                      `,
                                    )
                                  : `${this.t.noMediaInSelectedPages}`}
                              </ul>
                            </div>
                          `}
                    </div>
                  `
                : ``}
            </details>
          </div>
        </div>
      </div>
    `;
  }
  // alt feedback
  analyzeAltData(item) {
    if (item.alt == null || item.alt == "null") {
      return html`<simple-icon
        icon="error"
        accent-color="red"
        title="missing alt text"
      ></simple-icon>`;
    } else if (item.name == item.alt || item.source == item.alt) {
      return html`<simple-icon
        icon="error"
        accent-color="red"
        title="alt text matches file name"
      ></simple-icon>`;
    } else if (item.title == item.alt) {
      return html`<simple-icon
        icon="error"
        accent-color="red"
        title="alt text matches title"
      ></simple-icon>`;
    } else if (item.alt == "") {
      return html`<simple-icon
        icon="warning"
        accent-color="yellow"
        title="alt text set to blank, ensure decorative image"
      ></simple-icon>`;
    } else if (item.alt && item.alt.includes("image")) {
      return html`<simple-icon
        icon="warning"
        accent-color="yellow"
        title="alt text includes word 'image'"
      ></simple-icon>`;
    } else if (item.alt && item.alt.includes("picture")) {
      return html`<simple-icon
        icon="warning"
        accent-color="yellow"
        title="alt text includes word 'picture'"
      ></simple-icon>`;
    }
    return html`<simple-icon
      icon="info"
      accent-color="blue"
      title="alt text: ${item.alt}"
    ></simple-icon>`;
  }
  // response is key'ed object by link and response data
  linkValidationResponse(e) {
    let keys = Object.keys(e.data);
    this.linkResponseData[keys[0]] = e.data[keys[0]];
    // basic debounce so we only update every 500ms if we had a lot of links
    clearTimeout(this.__interval);
    this.__interval = setTimeout(() => {
      this.requestUpdate();
    }, 500);
  }
  renderLinkCheck(links, key) {
    // kick off a call that'll satisfy later down the road, but only if its a new key
    if (!this.linkResponseData[key]) {
      // set something so we don't get looped back  over and over
      this.linkResponseData[key] = {
        ok: "loading",
      };
      MicroFrontendRegistry.call(
        "@core/linkValidator",
        { links: key },
        this.linkValidationResponse.bind(this),
      );
    }
    return html`
      <li class="link-status-${this.linkResponseData[key].ok}">
        ${this.linkResponseData[key].ok === "loading"
          ? html`<simple-icon
              icon="hax:loading"
              accent-color="grey"
            ></simple-icon>`
          : ``}
        ${this.linkResponseData[key].ok != "loading"
          ? this.linkResponseData[key].ok
            ? html`<simple-icon
                icon="check"
                accent-color="green"
              ></simple-icon>`
            : html`<simple-icon
                icon="clear"
                accent-color="red"
                title="${this.linkResponseData[key].status}"
              ></simple-icon>`
          : ``}
        ${this.linkResponseData[key].ok != "loading"
          ? this.linkResponseData[key].ok
            ? html`<a
                href="${key}"
                target="_blank"
                rel="noopener nofollow noreferrer"
                >${key}</a
              >`
            : html`${key}`
          : ``}
        (${links[key].map(
          (linkUsage) => html`
            <strong>${linkUsage.linkTitle}</strong> ${this.t.onPage}
            ${linkUsage.itemId ? this.renderItemLinkById(linkUsage.itemId) : ``}
          `,
        )})
      </li>
    `;
  }
  renderItemLinkById(itemId) {
    // trap for highest level of the site
    if (itemId != null) {
      const item = toJS(store.findItem(itemId));
      if (item) {
        return html`<a href="${item.slug}" @click="${this.closeModal}"
          >${item.title}</a
        >`;
      }
    }
    return html``;
  }

  constructor() {
    super();
    this.base = "";
    this.filters = {};
    this.linkResponseData = {};
    this.t = this.t || {};
    this.t = {
      ...this.t,
      pageToProvideReportsAbout: "Page to provide reports about",
      noLinksInSelectedPages: "No links in selected pages",
      noMediaInSelectedPages: "No media in selected pages",
      recentUpdates: "Recent updates",
      created: "Created",
      lastUpdated: "Last updated",
      updateReports: "Update reports",
      onPage: "on page",
      learningObjectives: "learning objectives",
      specialElements: "Special elements",
      headings: "Headings",
      externalLinks: "External links",
      pages: "Pages",
      videos: "videos",
      authorNotes: "Author notes",
      placeholders: "Placeholders",
      video: "Video",
      audio: "Audio",
      selfChecks: "Self checks",
      openInNewTab: "Open in new tab",
      links: "Links",
      images: "Images",
      dataTables: "Data tables",
      ofReading: "of reading",
      basedGradeReadingLevel: "based grade reading level",
      words: "Words",
      longWords: "long words",
      linkReport: "Link report",
      loading: "Loading",
      fullSite: "Full site",
      summary: "Summary",
      reports: "Reports",
      linkChecker: "Link checker",
      mediaBrowser: "Media browser",
      contentBrowser: "Content browser",
      hour: "hour",
      hours: "hours",
      minute: "minute",
      minutes: "minutes",
    };
    this.data = {
      readability: {},
      updatedItems: [],
    };
    this.activeTab = "";
    this.loading = false;
  }
  static get properties() {
    return {
      ...super.properties,
      data: {
        type: Object,
      },
      hideResults: {
        type: String,
        attribute: "hide-results",
        reflect: true,
      },
      filters: {
        type: Object,
      },
      linkResponseData: {
        type: Object,
      },
      activeTab: {
        type: String,
      },
      base: {
        type: String,
        reflect: true,
      },
      loading: { type: Boolean, reflect: true },
    };
  }
  pageSelector() {
    const itemManifest = store.getManifestItems(true);
    // default to null parent as the whole site
    var items = [
      {
        text: `-- ${this.t.fullSite} --`,
        value: null,
      },
    ];
    itemManifest.forEach((el) => {
      // calculate -- depth so it looks like a tree
      let itemBuilder = el;
      // walk back through parent tree
      let distance = "- ";
      while (itemBuilder && itemBuilder.parent != null) {
        itemBuilder = itemManifest.find((i) => i.id == itemBuilder.parent);
        // double check structure is sound
        if (itemBuilder) {
          distance = "--" + distance;
        }
      }
      items.push({
        text: distance + el.title,
        value: el.id,
      });
    });
    return html`<div class="selector-wrapper">
      <label for="selector">${this.t.pageToProvideReportsAbout}:</label>
      <select id="selector">
        ${items.map(
          (item) => html`
            <option
              .value="${item.value}"
              ?selected="${toJS(store.activeId) == item.value}"
            >
              ${item.text}
            </option>
          `,
        )}
      </select>
      <simple-toolbar-button
        @click="${this.refreshData}"
        icon="refresh"
        ?disabled="${this.loading}"
        label="${this.t.updateReports}"
      ></simple-toolbar-button>
    </div>`;
  }
}
globalThis.customElements.define(HAXCMSShareDialog.tag, HAXCMSShareDialog);
export { HAXCMSShareDialog };

// convert seconds back into full time stamp
function toHHMMSS(seconds) {
  var out = "";
  var snum = parseInt(seconds, 10);
  var hours = Math.floor(snum / 3600);
  var minutes = Math.floor((snum - hours * 3600) / 60);

  if (hours !== 0) {
    out += `${hours} hour`;
    if (hours !== 1) {
      out += "s";
    }
    out += ", ";
  }
  if (minutes !== 0) {
    out += `${minutes} minute`;
    if (hours !== 1) {
      out += "s";
    }
  }
  return out;
}
