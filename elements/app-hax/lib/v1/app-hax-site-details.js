// dependencies / things imported
import { LitElement, html, css } from 'lit';

// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class AppHaxSiteDetails extends LitElement {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return 'app-hax-site-details';
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.need = 'all need to succeed';
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      need: { type: String, reflect: true },
    };
  }

  // CSS - specific to Lit
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
      }

      .btn-group button {
        background-color: #3c7ff7;
        border: 1px solid #3c7ff7;
        color: white;
        padding: 15px 30px;
        cursor: pointer;
        width: 25%;
        display: flex;
      }

      .btn-group:after {
        content: '';
        clear: both;
        display: table;
      }

      .btn-group button:not(:last-child) {
        border-right: none;
      }

      .btn-group button:hover {
        background-color: #02286d;
      }

      .flex-container > div {
        background-color: #f1f1f1;
        margin: 10px;
        flex-direction: 'row';
        justify-content: 'space-around';
        align-items: 'center';
        display: flex;
        border-width: 4px solid red;
      }
    `;
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div class="flex-container">
        <div class="btn-group">
          <button>created</button>
          <button>updated</button>
          <button>pages</button>
          <button>URL</button>
        </div>
      </div>

        <div class="flex-container">
          <div class="btn-group">
            <button>publish</button>
            <button>copy</button>
            <button>download</button>
            <button>delete</button>
          </div>
        </div>
      </div>
    `;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  /**
   * haxProperties integration via file reference
   */
}
customElements.define(AppHaxSiteDetails.tag, AppHaxSiteDetails);
