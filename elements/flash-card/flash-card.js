import { html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./lib/flash-card-answer-box.js";
import "./lib/flash-card-prompt-img.js";

export class FlashCard extends SimpleColors {
  static get tag() {
    return "flash-card";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.imgKeyword = "";
    this.imgSource = "";
    this.back = false;
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      inverted: { type: Boolean },
      imgSource: { type: String, attribute: "img-source", reflect: true },
      imgKeyword: { type: String, attribute: "img-keyword" },
      back: { type: Boolean },
      status: { type: String, reflect: true },
    };
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          border: 1px solid var(--simple-colors-default-theme-accent-6);
          min-width: 320px;
          min-height: 155px;
          border-radius: 20px;
          padding: 20px;
          width: 5em;
          background-color: var(--simple-colors-default-theme-accent-2);
          box-shadow: 0 0 5px var(--simple-colors-default-theme-accent-7);
          margin: 10px;
        }
        p {
          color: var(--simple-colors-default-theme-accent-10);
        }
      `,
    ];
  }

  statusChanged(e) {
    this.status = e.detail;
    if (this.status === "correct") {
      import(
        "@lrnwebcomponents/multiple-choice/lib/confetti-container.js"
      ).then((module) => {
        setTimeout(() => {
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      });
    }
  }

  // HTML - specific to Lit
  render() {
    return html`
      <confetti-container id="confetti">
        ${!this.imgSource && !this.imgKeyword
          ? ``
          : html`
              <flash-card-image-prompt
                img-src="${this.imgSource}"
                img-keyword="${this.imgKeyword}"
                status="${this.status}"
              ></flash-card-image-prompt>
            `}
        <flash-card-answer-box
          ?back=${this.back}
          @flash-card-status-change="${this.statusChanged}"
        >
          <div slot="front">
            <slot slot="front" name="front"></slot>
          </div>
          <div slot="back">
            <slot slot="back" name="back"></slot>
          </div>
        </flash-card-answer-box>
      </confetti-container>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

customElements.define(FlashCard.tag, FlashCard);
