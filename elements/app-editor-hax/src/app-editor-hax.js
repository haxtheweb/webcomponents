import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/h-a-x/h-a-x.js";
/**
`app-editor-hax`
stand alone editor intended for use in a larger application
as the editor. It is like cms-hax in that it's prepackaged
the way HAX will be integrated but the connotation is that there
is no edit state and that it is always editing effectively.

* @demo demo/index.html

@microcopy - the mental model for this element
 - app - an application desktop or mobile that's deployed this
 - editor - in this case HAX is the editor / authoring tool
 - hax - just to make sure we're aware that it's actually HAX based

*/
class AppEditorHax extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-size: 16px;
          box-sizing: content-box;
        }
      `,
    ];
  }
  render() {
    return html` <h-a-x .app-store="${this.appStoreConnection}"></h-a-x> `;
  }

  static get tag() {
    return "app-editor-hax";
  }
  static get properties() {
    return {
      /**
       * Establish the app store connection to pull in our JSON
       */
      appStoreConnection: {
        type: Object,
      },
    };
  }

  /**
   * Basic save event to make targetting easier.
   */
  save() {
    // convert the body area to content
    let content = window.HaxStore.instance.activeHaxBody.haxToContent();
    // fire event so apps can react correctly
    this.dispatchEvent(
      new CustomEvent("app-editor-hax-save", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: content,
      })
    );
  }

  /**
   * Basic import capability abstraction of hax body's import capabilities
   */
  import(html) {
    // import the HTML blob to get going
    window.HaxStore.instance.activeHaxBody.importContent(html);
    // fire event just letting things know this happened
    this.dispatchEvent(
      new CustomEvent("app-editor-hax-import", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true,
      })
    );
  }
}
window.customElements.define(AppEditorHax.tag, AppEditorHax);
export { AppEditorHax };
