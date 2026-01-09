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
const sun = new URL("./images/sunIcon.png", import.meta.url).href;
const moon = new URL("./images/moonIcon.png", import.meta.url).href;

export class WiredDarkmodeToggle extends WiredToggle {
  constructor() {
    super();
    this.checked = false;
    this.label = "Dark mode";
    this.knobFill = svgNode("circle");
  }

  // eslint-disable-next-line class-methods-use-this
  canvasSize() {
    return [100, 48];
  }

  static get tag() {
    return "wired-darkmode-toggle";
  }

  draw(svg, size) {
    //const rect = rectangle(svg, 0, 0, size[0], 48, this.seed);
    //rect.classList.add("toggle-bar");
    this.knob = svgNode("g");
    this.knob.classList.add("knob");
    svg.appendChild(this.knob);

    this.knobFill.setAttribute("cx", 26);
    this.knobFill.setAttribute("cy", 26);
    this.knobFill.setAttribute("r", 20);
    this.knobFill.setAttribute(
      "style",
      "fill: var(--wired-toggle-off-color); transition: fill 0.3s ease-in-out;",
    );
    this.knobFill.classList.add("knobfill");
    this.knob.appendChild(this.knobFill);
    ellipse(this.knob, 26, 26, 40, 40, this.seed);
  }

  toggleMode(checked) {
    if (checked) {
      this.knobFill.setAttribute(
        "style",
        "fill: var(--wired-toggle-on-color);",
      );
    } else {
      this.knobFill.setAttribute(
        "style",
        "fill: var(--wired-toggle-off-color);",
      );
    }
  }

  onChange(event) {
    this.checked = event.target.checked;
    this.toggleMode(this.checked);
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
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
        <svg class="svg"></svg>
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
          background-position-x: 60px;
          background-position-y: 8px;
          width: 100px;
          display: inline-flex;
        }
        :host([checked]) div {
          background-image: url("${unsafeCSS(moon)}");
          background-position-x: 12px;
          background-position-y: 12px;
          background-size: 22px, 22px;
        }
        :host([disabled]) {
          opacity: 0.5;
          pointer-events: none;
          cursor: not-allowed;
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
        /*img {
          top: 8px;
          max-width: 20
          height: 35;
        }*/
      `,
    ];
  }
}
globalThis.customElements.define(WiredDarkmodeToggle.tag, WiredDarkmodeToggle);
