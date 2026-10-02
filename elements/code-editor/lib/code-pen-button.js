import { LitElement, html, css } from "lit";
/**
 * `code-pen-button`
 * `Post data to codepen to form a new pen`
 * @demo demo/index.html
 * @element code-pen-button
 */
class CodePenButton extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
  render() {
    return html`
      <form action="${this.endPoint}" method="post" target="_blank">
        <input type="hidden" name="data" value="${this.dataString}" />
        <!-- on-prem: inline data-URI arrow replaces the former hardcoded
             remote S3 asset so rendering never performs a network request
             (issue #3102 bug 20) -->
        <input
          type="image"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cpath fill='%23ffffff' d='M24 8l-2.8 2.8L30.4 20H6v2h24.4l-9.2 9.2L24 34l14-14z'/%3E%3C/svg%3E"
          width="40"
          height="40"
          value="Open code pen in a new window"
          alt="${this.checkItOut}"
          class="codepen-mover-button"
          part="button"
        />
      </form>
    `;
  }

  static get tag() {
    return "code-pen-button";
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.setAttribute("title", this.checkItOut);
  }
  constructor() {
    super();
    this.checkItOut = "Check it out on codepen";
    this.endPoint = "https://codepen.io/pen/define";
    this.data = {};
    this.dataString = "";
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "data" && this[propName] && this.dataString == "") {
        this.dataString = this._getDataString(this[propName]);
      }
    });
  }
  static get properties() {
    return {
      checkItOut: {
        type: String,
        attribute: "check-it-out",
      },
      /**
       * End point for posting should it change in the future.
       */
      endPoint: {
        type: String,
        attribute: "end-point",
      },
      /**
       * Data object as a JSON string for the POST data in page.
       */
      dataString: {
        type: String,
        attribute: "data-string",
      },
      /**
       * Data object to post to code pen
       */
      data: {
        type: Object,
      },
    };
  }
  /**
   * Return string from data object so it can be posted correctly.
   */
  _getDataString(data) {
    return JSON.stringify(data).replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
}
globalThis.customElements.define(CodePenButton.tag, CodePenButton);
export { CodePenButton };
