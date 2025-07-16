import { LitElement, html, css, unsafeCSS } from "lit";
export class JourneyMenu extends LitElement {
  static get tag() {
    return "journey-menu";
  }

  static get properties() {
    return {
      items: { type: Array },
      activeID: { type: String },
    };
  }
  static get styles() {
    return css`
      nav {
        position: fixed;
        top: 35px;
        bottom: 0;
        left: 0;
        width: 308px;
        text-align: left;
        overflow-y: auto;
        padding: var(--ddd-spacing-4);
        background: var(--ddd-theme-default-gradient-footer);
        background-size: cover;
        background-position: center;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
      }

      li a {
        display: block;
        text-decoration: none;
        color: white;
        font-size: var(--ddd-font-size-s);
        margin: 20px 0;
        cursor: pointer;
      }

      li a:hover,
      li a:focus {
        text-decoration: underline;
      }

      li a.active {
        font-weight: bold;
        color: yellow;
      }
    `;
  }

  render() {
    let menuItems = [];

    if (Array.isArray(this.items)) {
      menuItems = this.items;
    }

    return html`
      <nav>
        <ul>
          ${menuItems.map(
            (item) => html`
              <li>
                <a
                  href="${item.slug}"
                  class="${item.id === this.activeID ? "active" : ""}"
                >
                  ${item.title}
                </a>
              </li>
            `,
          )}
        </ul>
      </nav>
    `;
  }
}
customElements.define(JourneyMenu.tag, JourneyMenu);
