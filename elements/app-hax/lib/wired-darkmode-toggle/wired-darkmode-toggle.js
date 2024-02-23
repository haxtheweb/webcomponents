import {
  rectangle,
  hachureEllipseFill,
  ellipse,
  svgNode,
} from "wired-elements/lib/wired-lib.js";
import { WiredToggle } from "wired-elements/lib/wired-toggle.js";
import { html, css, unsafeCSS } from "lit";
// need to highjack in order to alter the scale so we can fit our icon
// for states
const sun = new URL("./images/sun.svg", import.meta.url).href;
const moon = new URL("./images/moon.svg", import.meta.url).href;

export class WiredDarkmodeToggle extends WiredToggle {
  constructor() {
    super();
    this.checked = false;
    this.label = "Dark mode";
  }

  // eslint-disable-next-line class-methods-use-this
  canvasSize() {
    return [100, 48];
  }

  static get tag() {
    return "wired-darkmode-toggle";
  }

  draw(svg, size) {
    const rect = rectangle(svg, 0, 0, size[0], 48, this.seed);
    rect.classList.add("toggle-bar");
    this.knob = svgNode("g");
    this.knob.classList.add("knob");
    svg.appendChild(this.knob);
    const knobFill = hachureEllipseFill(26, 26, 40, 40, this.seed);
    knobFill.classList.add("knobfill");
    this.knob.appendChild(knobFill);
    ellipse(this.knob, 26, 26, 40, 40, this.seed);
  }

  static get properties() {
    return {
      checked: {
        type: Boolean,
        reflect: true,
      },
      disabled: {
        type: Boolean,
        reflect: true,
      },
      label: {
        type: String,
      },
    };
  }

  render() {
    return html`
      <div style="position: relative;">
        <svg id="svg"></svg>
        <label for="input">${this.label}</label>
        <input
          id="input"
          type="checkbox"
          .checked="${this.checked}"
          ?disabled="${this.disabled}"
          @change="${this.onChange}"
        />
      </div>
    `;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          opacity: 1;
          display: inline-flex;
          vertical-align: top;
        }
        :host div {
          background-image: url("${unsafeCSS(sun)}");
          background-repeat: no-repeat;
          --wired-toggle-off-color: var(--simple-colors-fixed-theme-amber-7);
          --wired-toggle-on-color: var(
            --simple-colors-fixed-theme-light-blue-9
          );
          background-position-x: 50px;
          width: 100px;
          display: inline-flex;
        }
        :host([checked]) div {
          background-image: url("${unsafeCSS(moon)}");
          background-position: left;
        }
        input {
          width: 100px;
          height: 48px;
          padding: 0;
          margin: 0;
        }
        label {
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          height: 1px;
          overflow: hidden;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }
      `,
    ];
  }
}
customElements.define(WiredDarkmodeToggle.tag, WiredDarkmodeToggle);
