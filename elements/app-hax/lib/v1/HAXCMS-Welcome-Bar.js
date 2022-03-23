// dependencies / things imported
import { LitElement, html, css } from 'lit';

// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class HAXCMSWelcomeBar extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return 'haxcms-welcome-bar';
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  // updated(changedProperties) {
  //   changedProperties.forEach((oldValue, propName) => {

  //   });
  // }

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
        font: sans-serif;
      }

      .welcomeBox {
        text-align: center;
        /* margin: 15vh auto; */
        margin: 0;
        font-size: 60px;
      }

      .welcome {
        -webkit-text-stroke: 1px var(--accent-color);
        -webkit-text-fill-color: white;
      }

      .bracket {
        font-size: 100px;
        vertical-align: middle;
        -webkit-text-fill-color: black;
      }
    `;
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div class="welcomeBox">
        <p class="welcome">
          <span class="bracket">&#60;</span><slot></slot
          ><span class="bracket">&#62;</span>
        </p>
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
