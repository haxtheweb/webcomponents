import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `code-pen-button`
 * @customElement code-pen-button
 * `Post data to codepen to form a new pen`
 * @demo demo/index.html
 */
class CodePenButton extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <form action="[[endPoint]]" method="POST" target="_blank">
        <input type="hidden" name="data" value\$="[[dataString]]" />
        <input
          type="image"
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-1/cp-arrow-right.svg"
          width="40"
          height="40"
          value="Open code pen in a new window"
          class="codepen-mover-button"
        />
      </form>
    `;
  }

  static get tag() {
    return "code-pen-button";
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("title", this.checkItOut);
  }
  static get properties() {
    return {
      checkItOut: {
        type: String,
        value: "Check it out on codepen"
      },
      /**
       * End point for posting should it change in the future.
       */
      endPoint: {
        type: String,
        value: "https://codepen.io/pen/define"
      },
      /**
       * Data object as a JSON string for the POST data in page.
       */
      dataString: {
        type: String,
        computed: "_getDataString(data)"
      },
      /**
       * Data object to post to code pen
       */
      data: {
        type: Object,
        value: {}
      }
    };
  }

  /**
   * Return string from data object so it can be posted correctly.
   */
  _getDataString(data) {
    return JSON.stringify(data)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}
window.customElements.define(CodePenButton.tag, CodePenButton);
export { CodePenButton };
