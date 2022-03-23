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
const sun = new URL('./assets/sun.svg', import.meta.url).href;
const moon = new URL('./assets/moon.svg', import.meta.url).href;
export class HAXWiredToggle extends WiredToggle {
  // eslint-disable-next-line class-methods-use-this
  canvasSize() {
    return [100, 60];
  }

  static get tag() {
    return 'hax-wired-toggle';
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
        :host div {
          background-image: url('${unsafeCSS(sun)}');
          background-repeat: no-repeat;
          background-position: right;
          background-size: 45%;
          --wired-toggle-off-color: #00e1ff;
          --wired-toggle-on-color: #060638;
        }
        :host([checked]) div {
          background-image: url('${unsafeCSS(moon)}');
          background-position: left;
        }
      `,
    ];
  }
}
