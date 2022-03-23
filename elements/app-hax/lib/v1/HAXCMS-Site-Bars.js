// dependencies / things imported
import { html, css } from 'lit';
import '@lrnwebcomponents/simple-icon/lib/simple-icons.js';
import '@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js';
import { SimpleColors } from '@lrnwebcomponents/simple-colors/simple-colors.js';
import { animate } from '@lit-labs/motion';

// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class HAXCMSSiteBars extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return 'haxcms-site-bar';
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.icon = 'add';
    this.opened = false;
    this.inprogress = false;
    this.iconLink = 'https://www.psu.edu';
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      opened: { type: Boolean, reflect: true },
      icon: { type: String, reflect: true },
      inprogress: { type: Boolean, reflect: true },
      iconLink: { type: String, reflect: true },
    };
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        propName === 'opened' &&
        this[propName] === false &&
        oldValue !== undefined
      ) {
        this.style.animationName = `fadegradientclosed`;
      }
      if (propName === 'opened' && this[propName] === true) {
        this.style.animationName = `fadegradientopen`;
      }
    });
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          --main-banner-width: 500px;
          --main-banner-height: 90px;
          --band-banner-height: 180px;
          display: inline-block;
          background-image: linear-gradient(
            var(--simple-colors-default-theme-accent-10) 80%,
            var(--simple-colors-default-theme-accent-6)
          );
          color: var(--simple-colors-default-theme-accent-1);
        }

        :host([opened]) {
          background-image: linear-gradient(
            var(--simple-colors-default-theme-accent-10),
            var(--simple-colors-default-theme-accent-6)
          );
        }
        #mainCard {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          width: var(--main-banner-width);
          height: var(--main-banner-height);
        }

        #band {
          display: flex;
          flex-direction: column;
          transition: height 3s;
          height: 0px;
          width: var(--main-banner-width);
          overflow: hidden;
        }

        :host([opened]) #band {
          display: flex;
          flex-direction: column;
          width: var(--main-banner-width);
          height: var(--band-banner-height);
        }

        button {
          background-color: transparent;
          border: none;
        }
        simple-icon-lite {
          color: black;
          pointer-events: none;
        }
        a {
          flex: 1;
        }
        #labels {
          flex: 6;
        }
        #plus {
          --simple-icon-width: 49px;
          --simple-icon-height: 49px;
          color: var(--simple-colors-default-theme-accent-1);
        }
        #dots {
          --simple-icon-width: 49px;
          --simple-icon-height: 49px;
          color: var(--simple-colors-default-theme-accent-1);
        }
      `,
    ];
  }

  __clickButton() {
    this.opened = !this.opened;
  }

  _toggleDetails(e) {
    console.log(`${this} , ${e}`);
    console.log('clicked');
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div id="mainCard">
        <a href="${this.iconLink}">
          <simple-icon-lite icon=${this.icon} id="plus"></simple-icon-lite
        ></a>
        <div id="labels">
          <slot name="heading"></slot>
          <slot name="subHeading"></slot>
        </div>
        <button @click=${this.__clickButton}>
          <simple-icon-lite icon="more-vert" id="dots"></simple-icon-lite>
        </button>
      </div>
      <div id="band" ${animate()}>
        <slot name="band"></slot>
      </div>
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
