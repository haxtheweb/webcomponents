/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { CourseDesignLinkRowStyles } from "./course-design-link-row-styles.js";

export class WorksheetDownload extends I18NMixin(LitElement) {
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      link: { type: String },
    };
  }
  static get tag() {
    return "worksheet-download";
  }

  static get haxProperties() {
    return new URL("./worksheet-download.haxProperties.json", import.meta.url)
      .href;
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    if (val) {
      this._haxstate = val;
    }
  }
  /**
   * Set a flag to test if we should block link clicking on the entire card
   * otherwise when editing in hax you can't actually edit it bc its all clickable.
   * if editMode goes off this helps ensure we also become clickable again
   */
  haxeditModeChanged(val) {
    this._haxstate = val;
  }
  /**
   * special support for HAX since the whole card is selectable
   */
  _clickLink(e) {
    if (this._haxstate) {
      // do not do default
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      worksheet: "Worksheet",
      download: "Download",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    this.title = "";
    this.link = "";
  }
  static get styles() {
    return [
      CourseDesignLinkRowStyles,
      css`
        .title {
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
      `,
    ];
  }
  /**
   * Upper case file extension of the link (PDF, DOCX...) or empty when the
   * link has no recognisable extension
   */
  get fileType() {
    if (!this.link || typeof this.link !== "string") {
      return "";
    }
    let path = "";
    try {
      // pathname only, so a bare domain (example.com) is not read as a type
      path = new URL(this.link, "https://localhost/").pathname;
    } catch {
      path = this.link.split("#")[0].split("?")[0];
    }
    const file = path.split("/").pop();
    const match = /\.([a-z0-9]{1,5})$/i.exec(file);
    return match ? match[1].toUpperCase() : "";
  }
  render() {
    const type = this.fileType;
    return html`
      <div id="button_wrap">
        <a
          class="link-row"
          href="${this.link}"
          target="_blank"
          download
          rel="noopener noreferrer"
          @click="${this._clickLink}"
        >
          <span class="tile" aria-hidden="true"
            ><simple-icon-lite
              icon="icons:file-download"
              aria-hidden="true"
            ></simple-icon-lite
          ></span>
          <span class="text">
            <span class="eyebrow"
              >${
                type ? `${this.t.worksheet} · ${type}` : this.t.worksheet
              }</span
            >
            <span class="title">${this.title}</span>
          </span>
          <span class="action"
            ><simple-icon-lite
              icon="icons:file-download"
              aria-hidden="true"
            ></simple-icon-lite
            ><span class="tip">${this.t.download}</span></span
          >
        </a>
      </div>
    `;
  }
}
globalThis.customElements.define(WorksheetDownload.tag, WorksheetDownload);
