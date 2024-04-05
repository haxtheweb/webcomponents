import { LitElement, html, css } from "lit";

class ResponsiveIframe extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        #container {
          position: relative;
          padding-top: 60%;
          height: 0;
          width: 100%;
        }
        #container ::slotted(iframe) {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }
  static get haxProperties() {
    return {
      canScale: false,

      canEditSource: true,
      gizmo: {
        title: "Responsive iframe",
        description:
          "Make an iframe responsive and full width. Useful for Youtube video embeds.",
        icon: "icons:file-download",
        color: "blue",
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            slot: "",
            title: "iframe",
            description: "The html code of the iframe",
            inputMethod: "code-editor",
            icon: "editor:iframe",
          },
        ],
        advanced: [],
      },
    };
  }
  render() {
    return html`
      <div id="container">
        <slot></slot>
      </div>
    `;
  }
}
customElements.define("responsive-iframe", ResponsiveIframe);
