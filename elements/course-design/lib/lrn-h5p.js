import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

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
    this._disposer = autorun(() => {
      const _mobx_val_0 = toJS(store.editMode);
      Promise.resolve().then(() => {
        this._editing = _mobx_val_0;
      });
    });
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
    };
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        /* labelled embed frame shared with the other DDD learning blocks */
        .frame {
          box-sizing: border-box;
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          overflow: hidden;
          font-family: var(--ddd-font-primary);
        }
        .frame-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          min-height: var(--ddd-control-height-sm);
        }
        .frame-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border-radius: var(--ddd-radius-circle);
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .frame-label {
          flex: 1 1 auto;
          min-width: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:lang(ar)) .frame-label,
        :host(:lang(fa)) .frame-label,
        :host(:lang(he)) .frame-label,
        :host(:lang(ur)) .frame-label {
          letter-spacing: 0;
        }
        .frame-open,
        #edit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          box-sizing: border-box;
          height: var(--ddd-control-height-sm);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-rounded);
          background-color: transparent;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          cursor: pointer;
        }
        .frame-open {
          width: var(--ddd-control-height-sm);
          padding: var(--ddd-spacing-0);
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        #edit {
          padding: var(--ddd-spacing-0) var(--ddd-spacing-4);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          text-decoration: none;
          text-transform: uppercase;
        }
        .frame-open:hover,
        #edit:hover {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
        }
        .frame-open:focus-visible,
        #edit:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .frame-body {
          display: block;
          max-width: 100%;
        }
        .frame-body ::slotted(iframe) {
          max-width: 100%;
        }
        .frame-body:fullscreen {
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
    if (globalThis.document) {
      globalThis.document.addEventListener(
        "fullscreenchange",
        this._fullscreenChanged,
      );
    }
  }
  disconnectedCallback() {
    if (globalThis.document) {
      globalThis.document.removeEventListener(
        "fullscreenchange",
        this._fullscreenChanged,
      );
    }
    super.disconnectedCallback();
  }
  /**
   * Full screen is offered only where the browser supports it
   */
  get _canFullscreen() {
    return !!(
      globalThis.document &&
      globalThis.document.fullscreenEnabled &&
      globalThis.HTMLElement &&
      globalThis.HTMLElement.prototype.requestFullscreen
    );
  }
  _fullscreenChanged() {
    const body = this.shadowRoot
      ? this.shadowRoot.querySelector(".frame-body")
      : null;
    this._fullscreen = !!(
      body &&
      this.shadowRoot.fullscreenElement &&
      this.shadowRoot.fullscreenElement === body
    );
  }
  /**
   * Toggle the frame body (the slotted embed) in and out of full screen
   */
  _toggleFullscreen() {
    const body = this.shadowRoot.querySelector(".frame-body");
    if (this._fullscreen && globalThis.document.exitFullscreen) {
      globalThis.document.exitFullscreen();
    } else if (body && body.requestFullscreen) {
      const request = body.requestFullscreen();
      if (request && request.catch) {
        request.catch(() => {});
      }
    }
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
      <div id="container" class="frame">
        <div class="frame-header">
          <span class="frame-chip" aria-hidden="true"
            ><simple-icon-lite icon="icons:extension"></simple-icon-lite
          ></span>
          <span class="frame-label"
            >${this.t.activity} · ${this.t.interactive} (H5P)</span
          >
          ${this._editing && editUrl
            ? html`<a
                id="edit"
                target="_blank"
                rel="noopener noreferrer"
                href="${editUrl}"
                >${this.t.edit}</a
              >`
            : ``}
          ${this._canFullscreen
            ? html`<button
                class="frame-open"
                type="button"
                aria-label="${fsLabel}"
                title="${fsLabel}"
                aria-pressed="${this._fullscreen ? "true" : "false"}"
                @click="${this._toggleFullscreen}"
              >
                <simple-icon-lite
                  icon="${this._fullscreen
                    ? "icons:fullscreen-exit"
                    : "icons:fullscreen"}"
                  aria-hidden="true"
                ></simple-icon-lite>
              </button>`
            : ``}
        </div>
        <div class="frame-body">
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
