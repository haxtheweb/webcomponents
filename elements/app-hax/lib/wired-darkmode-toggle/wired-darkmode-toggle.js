import {
  rectangle,
  hachureEllipseFill,
  ellipse,
  svgNode,
} from 'wired-elements/lib/wired-lib.js';
import { WiredToggle } from 'wired-elements/lib/wired-toggle.js';
import { css, unsafeCSS } from 'lit';
// need to highjack in order to alter the scale so we can fit our icon
// for states
const sun = new URL('./images/sun.svg', import.meta.url).href;
const moon = new URL('./images/moon.svg', import.meta.url).href;

export class WiredDarkmodeToggle extends WiredToggle {
  constructor() {
    super();
    this.checked = false;
  }

  // eslint-disable-next-line class-methods-use-this
  canvasSize() {
    return [100, 60];
  }

  static get tag() {
    return 'wired-darkmode-toggle';
  }

  draw(svg, size) {
    const rect = rectangle(svg, 0, 8, size[0], 40, this.seed);
    rect.classList.add('toggle-bar');
    this.knob = svgNode('g');
    this.knob.classList.add('knob');
    svg.appendChild(this.knob);
    const knobFill = hachureEllipseFill(26, 26, 40, 40, this.seed);
    knobFill.classList.add('knobfill');
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
    };
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          opacity: 1;
          display: inline-flex;
          margin-top: -4px;
        }
        :host div {
          background-image: url('${unsafeCSS(sun)}');
          background-repeat: no-repeat;
          --wired-toggle-off-color: #66edff;
          --wired-toggle-on-color: #006b7a;
          background-position-x: 50px;
          width: 100px;
          display: inline-flex;
        }
        :host([checked]) div {
          background-image: url('${unsafeCSS(moon)}');
          background-position: left;
        }
        input {
          width: 100px;
          height: 60px;
          padding: 0;
          margin: 0;
        }
      `,
    ];
  }
}
customElements.define(WiredDarkmodeToggle.tag, WiredDarkmodeToggle);
