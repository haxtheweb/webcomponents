import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { css, html, LitElement } from "lit-element/lit-element.js";
import { autorun, toJS } from "mobx/dist/mobx.esm.js";
import "@lrnwebcomponents/iframe-loader/iframe-loader.js";

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
      this.__editMode = toJS(store.editMode);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__disposer();
  }

  firstUpdated() {
    this._observer = new FlattenedNodesObserver(this, info => {
      info.addedNodes.forEach(item => {
        const iframe =
          item.nodeName === "IFRAME" ? item : this.querySelector("iframe");
        if (iframe) {
          if (typeof iframe.src !== "undefined") {
            // specific to elms / drupal paths from media system
            this.__editLink = iframe.src.replace("entity_iframe/","") + "/edit";
          }
        }
      });
    });
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
customElements.define("h5p-wrapped-element", H5pWrappedElement);
export { H5pWrappedElement };