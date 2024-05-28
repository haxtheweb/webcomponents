import { LitElement, html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
/**
`lrndesign-sidenote`
A basic side note

* @demo demo/index.html
*/
class LrndesignSidenote extends SimpleColors {
  static get properties() {
    return {
      ...super.properties,
      label: { type: String },
      icon: { type: String },
    };
  }

  /**
   * Attached to the DOM, now fire.
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  constructor() {
    super();
    this.label = "";
    this.icon = "";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        #container {
          display: block;
          background-color: var(
            --simple-colors-default-theme-accent-1,
            #ffffff
          );
          padding: var(--lrndesign-sidenote-container-padding, 16px);
          margin-left: var(--lrndesign-sidenote-container-margin-left, 0px);
          color: var(--simple-colors-default-theme-accent-12, #000);
        }

        #header {
          display: flex;
          align-items: center;
        }

        #icon {
          margin-right: 8px;
        }

        #label {
          font-size: 20.8px;
          margin: 12.8px 0;
          flex: 1 1 auto;
        }
      `,
    ];
  }

  render() {
    return html`
      <div id="container">
        <div id="header">
          <simple-icon id="icon" icon=${this.icon}></simple-icon>
          <div id="label">${this.label}</div>
        </div>
        <slot></slot>
      </div>
    `;
  }
  static get tag() {
    return "lrndesign-sidenote";
  }
}
customElements.define("lrndesign-sidenote", LrndesignSidenote);
export { LrndesignSidenote };
