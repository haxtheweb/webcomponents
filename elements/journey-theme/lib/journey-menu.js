import { LitElement, html, css } from "lit";
export class JourneyMenu extends LitElement {
  static get tag() {
    return "journey-menu";
  }

  static get properties() {
    return {
      items: { type: Array },
      activeId: { type: String },
      open: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.open = false;
  }

  toggleOpen() {
    this.open = !this.open;
  }

  closeNav() {
    this.open = false;
  }

  _navKeydown(e) {
    if (e.key === "Escape" && this.open) {
      this.closeNav();
      const toggle = this.shadowRoot.querySelector(".menu-toggle");
      if (toggle) {
        toggle.focus();
      }
    }
  }
  static get styles() {
    return css`
      :host {
        --text-primary: light-dark(
          var(--ddd-palette-text-color-5, var(--ddd-theme-default-nittanyNavy)),
          var(--ddd-palette-text-color-1, var(--ddd-theme-default-white))
        );
        --accent-color: var(--ddd-palette-color-7, var(--ddd-theme-default-keystoneYellow));
        --nav-bg: light-dark(
          var(--ddd-palette-color-2, var(--ddd-theme-default-gradient-footer)),
          linear-gradient(
            var(--ddd-palette-color-1, var(--ddd-theme-default-potentialMidnight)) 0%,
            var(--ddd-palette-color-4, var(--ddd-theme-default-coalyGray)) 65%,
            var(--ddd-palette-color-4, var(--ddd-theme-default-coalyGray)) 100%
          )
        );
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
        border-right-color: light-dark(
          var(--ddd-palette-color-5, var(--ddd-theme-default-limestoneLight)),
          var(--ddd-palette-color-6, var(--ddd-theme-default-potentialMidnight))
        );
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
        color: var(--text-primary);
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

      li a:hover,
      li a:focus {
        color: var(--accent-color);
        background-color: color-mix(in srgb, var(--accent-color) 16%, transparent);
        text-decoration: underline;
        outline: none;
      }

      li a:focus {
        border-color: var(--accent-color);
        box-shadow: 0 0 0 2px
          color-mix(in srgb, var(--accent-color) 40%, transparent);
      }

      li a.active {
        font-weight: var(--ddd-font-weight-bold);
        color: var(--accent-color);
        background-color: color-mix(in srgb, var(--accent-color) 22%, transparent);
        border-left: var(--ddd-spacing-1) solid var(--accent-color);
      }
      
      /* Mobile menu toggle / close buttons (hidden on desktop) */
      .menu-toggle,
      .menu-close {
        display: none;
      }

      .menu-toggle:focus-visible,
      .menu-close:focus-visible {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
      }

      /* Responsive design for smaller screens */
      @media (max-width: 768px) {
        .menu-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: var(--ddd-spacing-2);
          left: var(--ddd-spacing-2);
          z-index: 3;
          width: 44px;
          height: 44px;
          padding: 0;
          cursor: pointer;
          color: var(--ddd-theme-default-coalyGray);
          background-color: var(--accent-color);
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-xs);
        }

        .menu-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: var(--ddd-spacing-2);
          right: var(--ddd-spacing-2);
          width: 44px;
          height: 44px;
          padding: 0;
          cursor: pointer;
          color: var(--text-primary);
          background: transparent;
          border: 0;
        }

        nav {
          transform: translateX(-100%);
          transition: transform var(--ddd-duration-rapid, 0.3s) ease;
          padding-top: 60px;
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
      <button
        class="menu-toggle"
        type="button"
        aria-label="Toggle navigation menu"
        aria-expanded="${this.open ? "true" : "false"}"
        aria-controls="journeymenu-nav"
        @click="${this.toggleOpen}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18M3 12h18M3 18h18"></path>
        </svg>
      </button>
      <nav
        id="journeymenu-nav"
        class="${this.open ? "open" : ""}"
        aria-label="Page navigation"
        @keydown="${this._navKeydown}"
      >
        <button
          class="menu-close"
          type="button"
          aria-label="Close navigation menu"
          @click="${this.closeNav}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18"></path>
          </svg>
        </button>
        <ul>
          ${menuItems.map(
            (item) => html`
              <li>
                <a
                  href="${item.slug}"
                  class="${item.id === this.activeId ? "active" : ""}"
                  @click="${this.closeNav}"
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
