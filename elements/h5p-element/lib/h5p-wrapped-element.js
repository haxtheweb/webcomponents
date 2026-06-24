import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { css, html, LitElement } from "lit";
import { autorun, toJS } from "mobx";
import "@haxtheweb/iframe-loader/iframe-loader.js";

// wrapped implementation of h5p which is an iframe on the page
// if we use this method then we can try and see if HAXcms is around
// this won't hurt anything if it's not, but will opt into edit mode if it is
class H5pWrappedElement extends LitElement {
  static get properties() {
    return {
      __editLink: { type: String, attribute: false },
      __editMode: { type: Boolean, attribute: false }
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
      :host [part="container"] {
        display: block;
        position: relative;
      }
      .editing[part="container"] {
        min-height: 100px;
      }
      :host [part="edit-screen"] {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
      }
      :host [part="source-link"] a {
        background: black;
        color: white;
        padding: 1em;
      }
      :host [part="anchor"] {
        display: block;
      }
    `;
  }
  constructor() {
    super();
    this.src = "";
    this.__disposer = autorun(() => {
      const _mobx_val_0 = toJS(store.editMode);
      Promise.resolve().then(() => {
        this.__editMode = _mobx_val_0;
      });
    });
  }
  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
    }
    super.disconnectedCallback();
    this.__disposer();
  }

  firstUpdated() {
    this._observer = new MutationObserver(() => {
      const iframe = this.querySelector("iframe");
      if (iframe && typeof iframe.src !== "undefined") {
        // specific to elms / drupal paths from media system
        this.__editLink = iframe.src.replace("entity_iframe/", "") + "/edit";
      }
    });
    this._observer.observe(this, { childList: true, subtree: true });
  }
  render() {
    return html`
      <div part="container" class="${this.__editMode ? "editing" : "editing"}">
        ${this.__editMode
          ? html`
              <slot></slot>
              <div part="edit-screen">
                <div part="source-link">
                  <a part="anchor" href="${this.__editLink}" target="_blank"
                    >Edit H5P Source</a
                  >
                </div>
              </div>
            `
          : html`
              <iframe-loader><slot></slot></iframe-loader>
            `}
      </div>
    `;
  }
}
globalThis.customElements.define("h5p-wrapped-element", H5pWrappedElement);
export { H5pWrappedElement };