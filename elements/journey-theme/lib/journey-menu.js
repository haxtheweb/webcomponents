import { LitElement, html, css, unsafeCSS } from "lit";
// const SB_bg = new URL("./assets/sidebar_bg.png", import.meta.url).href;

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
      :host {
        --text-primary: var(--ddd-theme-default-nittanyNavy); /* Navigation text - dark in light mode */
        --accent-color: light-dark(var(--ddd-theme-default-keystoneYellow), var(--ddd-theme-default-globalNeon));
        --nav-bg: light-dark(var(--ddd-theme-default-gradient-footer), linear-gradient(var(--ddd-theme-default-potentialMidnight) 0%, var(--ddd-theme-default-coalyGray) 65%, var(--ddd-theme-default-coalyGray) 100%));
      }
      
      nav {
        position: fixed;
        top: 35px;
        bottom: 0;
        left: 0;
        width: 250px;
        text-align: left;
        overflow-y: auto;
        padding: var(--ddd-spacing-4);
        background: var(--nav-bg);
        background-size: cover;
        background-position: center;
        border-right: var(--ddd-border-sm);
        border-right-color: light-dark(var(--ddd-theme-default-limestoneLight), var(--ddd-theme-default-potentialMidnight));
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--ddd-spacing-2);
      }

      li a {
        display: block;
        text-decoration: none;
        color: var(--ddd-theme-default-nittanyNavy); /* Black in light mode */
        font-size: var(--ddd-font-size-s);
        font-family: var(--ddd-font-primary);
        font-weight: var(--ddd-font-weight-medium);
        padding: var(--ddd-spacing-3) var(--ddd-spacing-2);
        margin: 0;
        cursor: pointer;
        transition: all var(--ddd-duration-rapid, 0.2s) ease;
        border-radius: var(--ddd-radius-xs);
        border: 2px solid transparent;
      }
      
      /* Dark mode - white text */
      @media (prefers-color-scheme: dark) {
        li a {
          color: var(--ddd-theme-default-white);
        }
      }
      
      body.dark-mode li a {
        color: var(--ddd-theme-default-white);
      }

      li a:hover,
      li a:focus {
        color: var(--accent-color);
        background-color: light-dark(rgba(255, 209, 0, 0.1), rgba(0, 169, 157, 0.15));
        text-decoration: underline;
        outline: none;
      }

      li a:focus {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 2px light-dark(rgba(255, 209, 0, 0.3), rgba(0, 169, 157, 0.4));
      }

      li a.active {
        font-weight: var(--ddd-font-weight-bold);
        color: var(--accent-color);
        background-color: light-dark(rgba(255, 209, 0, 0.15), rgba(0, 169, 157, 0.2));
        border-left: var(--ddd-spacing-1) solid var(--accent-color);
      }
      
      /* Responsive design for smaller screens */
      @media (max-width: 768px) {
        nav {
          transform: translateX(-100%);
          transition: transform var(--ddd-duration-rapid, 0.3s) ease;
        }
        
        nav.open {
          transform: translateX(0);
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        li a {
          transition: none;
        }
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        nav {
          border-right-width: var(--ddd-border-size-lg);
        }
        
        li a {
          border-width: 2px;
        }
        
        li a:focus {
          box-shadow: 0 0 0 4px currentColor;
        }
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
