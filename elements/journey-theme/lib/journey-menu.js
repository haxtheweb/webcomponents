import { LitElement, html, css } from "lit";

class JourneyMenu extends LitElement {
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
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
        position: fixed;
        top: 0;
        bottom: 0;
        padding: var(--ddd-spacing-4);
        background-color: var(--ddd-primary-3);
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
        font-size: var(--ddd-font-size-m);
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
