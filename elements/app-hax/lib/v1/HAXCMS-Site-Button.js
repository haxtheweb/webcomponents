/* eslint-disable no-console */
// dependencies / things imported
import { html, css } from 'lit';
import '@lrnwebcomponents/simple-icon/lib/simple-icons.js';
import '@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js';
import { SimpleColors } from '@lrnwebcomponents/simple-colors/simple-colors.js';
import 'wired-elements/lib/wired-button.js';

// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class HAXCMSSiteButton extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return 'haxcms-site-button';
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.label = null;
    this.value = null;
    this.disabled = false;
    this.elevation = '3';
    this.addEventListener('keydown', this._handleKeydown);
    this.addEventListener('click', this._handleClick);
    this.addEventListener('focus', this._handleFocus);
    this.addEventListener('blur', this._handleBlur);
    this.addEventListener('mouseover', this._handleMouseover);
    this.addEventListener('mouseout', this._handleMouseout);
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      label: { type: String },
      value: { type: String },
      disabled: { type: Boolean, reflect: true },
      elevation: { type: Number },
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
        --hax-accent-color: '#42596b';
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-family: 'Press Start 2P', cursive;
        width: fit-content;
      }
      .haxButton {
        background-color: white;
        color: black;
        font-size: var(--haxcms-site-button-font-size, 26px);
      }
      .dialogBox {
        color: #0f460f;
      }
      span {
        width: var(--haxcms-site-button-width, auto);
        min-width: var(--haxcms-site-button-min-width, auto);
        height: var(--haxcms-site-button-height, auto);
        display: inline-flex;
      }
    `;
  }

  // TODO: Use .js events to manage statefulness (hover, focus, click)
  // Try making hover into elevation scales

  // EVENT HANDLING
  _handleKeydown(e) {
    if (e.key === 'Escape') {
      console.log('escape');
      this.blur();
    }

    if (e.key === 'Spacebar') {
      console.log('space');
    }
  }

  _handleFocus() {
    console.log('focus');
    this.shadowRoot.querySelector('.haxButton').style.color = '#42596b';
  }

  _handleBlur() {
    console.log('blur');
    // this.shadowRoot.querySelector('.haxButton').blur();
    this.shadowRoot.querySelector('.haxButton').style.color = 'black';
  }

  _handleMouseover() {
    console.log('mouseover');
    this.elevation = '5';
  }

  _handleMouseout() {
    console.log('mouseout');
    this.elevation = '3';
  }

  buttonAlert() {
    console.log(`button PRESS + ${this.disabled}`);
    if (!this.disabled) {
      // alert('hey');
      this.shadowRoot.querySelector('.haxButton').blur();
    }
  }

  // HTML - specific to Lit
  render() {
    return html`
      <wired-button
        elevation=${this.elevation}
        ?disabled=${this.disabled}
        class="haxButton"
        @click="${this.buttonAlert}"
        ><span>${this.label}</span></wired-button
      >
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
