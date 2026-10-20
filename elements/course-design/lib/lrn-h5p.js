import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { stripScriptMarkup } from "@haxtheweb/utils/lib/safe-html.js";

export class LrnH5p extends I18NMixin(LitElement) {
  static get properties() {
    return {
      _editing: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      edit: "edit",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    this._editing = false;
    this._disposer = autorun(() => {
      const _mobx_val_0 = toJS(store.editMode);
      Promise.resolve().then(() => {
        this._editing = _mobx_val_0;
      });
    });
    // remove script tags and work against light dom if there
    if (this.querySelector && this.querySelector("span")) {
      this.querySelector("span").childNodes.forEach((el, _index) => {
        if (el.nodeName === "#text" && /<script/i.test(el.textContent)) {
          // strip only the script markup so surrounding text is preserved
          el.textContent = stripScriptMarkup(el.textContent);
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
        #edit {
          display: inline-block;
          position: absolute;
          left: 0;
          top: 0;
          transform: translateY(-100%);
          transition: transform var(--ddd-duration-normal, 0.3s) ease-in-out;
          /* material blue chip migrates to the DDD link tokens */
          background: var(--ddd-theme-default-link);
          color: var(--ddd-theme-default-white);
          text-decoration: none;
          text-transform: uppercase;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
        }
        #container:focus #edit,
        #container:hover #edit {
          transform: translateY(0);
        }
      `,
    ];
  }
  render() {
    if (this.querySelector("iframe")) {
      // origin = scheme + host of the iframe src, id = digits after the last
      // "embed/" (searched with lastIndexOf rather than a `.*embed\/` regex,
      // which backtracks polynomially on long URLs)
      const src = this.querySelector("iframe").src;
      const scheme = /https?:\/\//.exec(src);
      const embedAt = src.lastIndexOf("embed/");
      let matches = null;
      if (scheme && embedAt >= scheme.index + scheme[0].length) {
        const hostStart = scheme.index + scheme[0].length;
        const slash = src.indexOf("/", hostStart);
        const hostEnd = slash === -1 ? src.length : slash;
        matches = [
          null,
          src.slice(scheme.index, Math.min(hostEnd, embedAt)),
          /^[0-9]*/.exec(src.slice(embedAt + "embed/".length))[0],
        ];
      }
      const editUrl = `${matches[1]}/node/${matches[2]}/edit`;
      return html`
        <div id="container">
          ${this._editing
            ? html`<a
                id="edit"
                target="_blank"
                rel="noopener noreferrer"
                href="${editUrl}"
                >${this.t.edit}</a
              >`
            : ``}
          <slot></slot>
        </div>
      `;
    }
    return html`<div id="container">
      <slot></slot>
    </div>`;
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
