// dependencies / things imported
import { html, css } from 'lit';
import '@lrnwebcomponents/simple-icon/lib/simple-icons.js';
import '@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js';
import { SimpleColors } from '@lrnwebcomponents/simple-colors/simple-colors.js'; // import { WiredButton, WiredDialog } from 'wired-elements';
import 'wired-elements/lib/wired-button.js';
import 'wired-elements/lib/wired-dialog.js';
import './hax-wired-toggle.js';

// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class WiredElementsTest extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return 'wired-elements-test';
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.label = null;
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      label: { type: String },
    };
  }

  // Lit life-cycle; this fires the 1st time the element is rendered on the screen
  // this is a sign it is safe to make calls to this.shadowRoot
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }

  // HTMLElement life-cycle, element has been connected to the page / added or moved
  // this fires EVERY time the element is moved
  connectedCallback() {
    super.connectedCallback();
  }

  // HTMLElement life-cycle, element has been removed from the page OR moved
  // this fires every time the element moves
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  // CSS - specific to Lit
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-family: 'Press Start 2P', cursive;
      }
      .haxButton {
        background-color: white;
        color: black;
        font-size: 36px;
        border: 10px;
      }
      .dialogBox {
        color: #0f460f;
      }
    `;
  }

  openDialog() {
    console.log('click');
    this.shadowRoot.querySelector('wired-dialog').open = true;
  }

  closeDialog() {
    this.shadowRoot.querySelector('wired-dialog').open = false;
  }

  buttonAlert() {
    alert('hey');
    this.shadowRoot.querySelector('.haxButton').blur();
  }

  // HTML - specific to Lit
  render() {
    return html`
      <p>
        <wired-button
          elevation="3"
          @click="${this.buttonAlert}"
          class="haxButton"
          >${this.label}</wired-button
        >
      </p>
      <br />
      <p>
        <wired-button
          elevation="3"
          @click="${this.buttonAlert}"
          class="haxButton"
        >
          > Courses</wired-button
        >
      </p>
      <p>
        <wired-button id="openDialog" @click="${this.openDialog}"
          >Show dialog</wired-button
        >
      </p>
      <wired-dialog class="dialogBox">
        <p>WOOOOOOOOOOOOO</p>
        <div style="text-align: right; padding: 30px 16px 16px;">
          <wired-button id="closeDialog" @click="${this.closeDialog}"
            >Close dialog</wired-button
          >
        </div>
        <hax-wired-toggle checked></hax-wired-toggle>
      </wired-dialog>
    `;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`../lib/app.haxProperties.json`, import.meta.url).href;
  }
}
