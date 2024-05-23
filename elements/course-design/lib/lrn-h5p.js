import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

export class LrnH5p extends LitElement {
  static get properties() {
    return {
      _editing: { type: Boolean },
    };
  }

  constructor() {
    super();
    this._editing = false;
    this._disposer = autorun(() => {
      this._editing = toJS(store.editMode);
    });
    // remove script tags and work against light dom if there
    if (this.querySelector("span")) {
      this.querySelector("span").childNodes.forEach((el, index) => {
        if (el.nodeName === "#text" && el.textContent.includes("<script>")) {
          el.remove();
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
          transition: transform 0.2s ease-in-out;
          background: #2196f3;
          color: white;
          text-decoration: none;
          text-transform: uppercase;
          padding: 0.5em 1em;
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
      const matches = /(https?:\/\/[^\/]*).*embed\/([0-9]*)/g.exec(
        this.querySelector("iframe").src,
      );
      const editUrl = `${matches[1]}/node/${matches[2]}/edit`;
      return html`
        <div id="container">
          ${this._editing
            ? html`<a
                id="edit"
                target="_blank"
                rel="noopener noreferrer"
                href="${editUrl}"
                >edit</a
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
      for (var i in this.tokenData.schema) {
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
customElements.define(LrnH5p.tag, LrnH5p);
