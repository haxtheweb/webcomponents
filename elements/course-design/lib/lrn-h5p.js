/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
  canDDDBlockFullscreen,
  isDDDBlockFullscreen,
  toggleDDDBlockFullscreen,
  listenDDDBlockFullscreen,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";

/**
 * Remove every `<script ...>...</script >` run (case-insensitive, closing tag
 * may carry whitespace) from plain text, dropping an unclosed trailing run.
 * Linear scan instead of a regex so `</SCRIPT >` style closers are caught
 * (CodeQL js/bad-tag-filter).
 */
function stripScriptRuns(text) {
  const lower = text.toLowerCase();
  let out = "";
  let pos = 0;
  for (;;) {
    const start = lower.indexOf("<script", pos);
    if (start < 0) break;
    out += text.slice(pos, start);
    const close = lower.indexOf("</script", start + 7);
    if (close < 0) return out;
    const gt = lower.indexOf(">", close + 8);
    if (gt < 0) return out;
    pos = gt + 1;
  }
  return out + text.slice(pos);
}

export class LrnH5p extends I18NMixin(LitElement) {
  static get properties() {
    return {
      _editing: { type: Boolean },
      _fullscreen: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      edit: "edit",
      activity: "Activity",
      interactive: "Interactive",
      fullScreen: "Full screen",
      exitFullScreen: "Exit full screen",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    this._editing = false;
    this._fullscreen = false;
    this._fullscreenChanged = this._fullscreenChanged.bind(this);
    // remove script tags and work against light dom if there
    if (this.querySelector && this.querySelector("span")) {
      this.querySelector("span").childNodes.forEach((el, _index) => {
        if (
          el.nodeName === "#text" &&
          el.textContent.toLowerCase().includes("<script")
        ) {
          // strip only the script markup so surrounding text is preserved
          el.textContent = stripScriptRuns(el.textContent);
        }
      });
    }
  }

  static get tag() {
    return "lrn-h5p";
  }

  static get haxProperties() {
    return {
      canScale: false,

      canEditSource: true,
      gizmo: {
        title: "H5P Element",
        description: "LRN H5P",
        icon: "editor:format-quote",
        color: "blue",
        tags: ["Instructional", "h5p", "embed", "interactive"],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            slot: "",
            title: "Text",
            description: "Content of the sidenote",
            inputMethod: "code-editor",
            required: true,
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "lrn-h5p",
          properties: {},
          content: "",
        },
      ],
    };
  }
  static get styles() {
    return [
      DDDBlockStyles,
      css`
        :host {
          display: block;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        #edit {
          padding-inline: var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          text-transform: uppercase;
        }
        .ddd-block-body {
          max-width: 100%;
        }
        .ddd-block-body ::slotted(iframe) {
          max-width: 100%;
        }
        .ddd-block-body:fullscreen {
          overflow: auto;
          padding: var(--ddd-spacing-4);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
      `,
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    listenDDDBlockFullscreen(this._fullscreenChanged, true);
    // follow edit mode while on the page; the autorun holds this element
    // from the store, so it is disposed on removal and made again on return
    if (!this._disposer) {
      this._disposer = autorun(() => {
        const _mobx_val_0 = toJS(store.editMode);
        Promise.resolve().then(() => {
          this._editing = _mobx_val_0;
        });
      });
    }
  }
  disconnectedCallback() {
    listenDDDBlockFullscreen(this._fullscreenChanged, false);
    if (this._disposer) {
      this._disposer();
      this._disposer = null;
    }
    super.disconnectedCallback();
  }
  /**
   * Full screen is offered only where the browser supports it
   */
  get _canFullscreen() {
    return canDDDBlockFullscreen();
  }
  _fullscreenChanged() {
    const body = this.shadowRoot
      ? this.shadowRoot.querySelector(".ddd-block-body")
      : null;
    this._fullscreen = isDDDBlockFullscreen(this.shadowRoot, body);
  }
  /**
   * Toggle the frame body (the slotted embed) in and out of full screen
   */
  _toggleFullscreen() {
    const body = this.shadowRoot.querySelector(".ddd-block-body");
    toggleDDDBlockFullscreen(body, this._fullscreen);
  }
  _editUrl() {
    const iframe = this.querySelector && this.querySelector("iframe");
    if (!iframe) {
      return null;
    }
    const matches = /(https?:\/\/[^/]*).*embed\/([0-9]*)/g.exec(iframe.src);
    if (!matches) {
      return null;
    }
    return `${matches[1]}/node/${matches[2]}/edit`;
  }
  render() {
    const editUrl = this._editUrl();
    const fsLabel = this._fullscreen
      ? this.t.exitFullScreen
      : this.t.fullScreen;
    return html`
      <div id="container" class="ddd-block">
        ${renderDDDBlockHeader({
          icon: "icons:extension",
          label: html`${this.t.activity} · ${this.t.interactive} (H5P)`,
          actions:
            (this._editing && editUrl) || this._canFullscreen
              ? html`${
                  this._editing && editUrl
                    ? html`<a
                        id="edit"
                        class="ddd-block-action has-text"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="${editUrl}"
                        >${this.t.edit}</a
                      >`
                    : ``
                }
                ${
                  this._canFullscreen
                    ? html`<button
                        class="ddd-block-action"
                        type="button"
                        aria-label="${fsLabel}"
                        title="${fsLabel}"
                        aria-pressed="${this._fullscreen ? "true" : "false"}"
                        @click="${this._toggleFullscreen}"
                      >
                        <simple-icon-lite
                          icon="${
                            this._fullscreen
                              ? "icons:fullscreen-exit"
                              : "icons:fullscreen"
                          }"
                          aria-hidden="true"
                        ></simple-icon-lite>
                      </button>`
                    : ``
                }`
              : null,
        })}
        <div class="ddd-block-body">
          <slot></slot>
        </div>
      </div>
    `;
  }
  /**
   * Implements getHaxJSONSchema post processing callback.
   */
  postProcessgetHaxJSONSchema(schema) {
    let href = "";
    let slot = "Edit";
    // if we have values populate them
    if (typeof this.tokenData !== typeof undefined) {
      href = this.tokenData.editEndpoint;
      slot = this.tokenData.editText;
      for (let i in this.tokenData.schema) {
        schema.properties[i] = this.tokenData.schema[i];
      }
    }
    schema.properties["__editThis"] = {
      type: "string",
      component: {
        name: "a",
        properties: {
          id: "cmstokenidtolockonto",
          href: href,
          target: "_blank",
        },
        slot: slot,
      },
    };
    return schema;
  }
}
globalThis.customElements.define(LrnH5p.tag, LrnH5p);
