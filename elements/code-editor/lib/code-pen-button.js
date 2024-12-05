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
        <input
          type="image"
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-1/cp-arrow-right.svg"
          width="40"
          height="40"
          value="Open code pen in a new window"
          class="codepen-mover-button"
          part="button"
        />
      </form>
    `;
  }

  static get tag() {
    return "code-pen-button";
  }
  firstUpdated() {
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
customElements.define(CodePenButton.tag, CodePenButton);
export { CodePenButton };
