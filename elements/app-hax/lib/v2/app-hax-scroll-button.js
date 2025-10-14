/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

export class AppHaxScrollButton extends LitElement {
  static get tag() {
    return "app-hax-scroll-button";
  }

  constructor() {
    super();
    this.label = "";
    this.targetId = "";
    this.isDarkMode = document.body.classList.contains("dark-mode");
    this.addEventListener('keydown', this._handleKeydown.bind(this));
  }

  static get properties() {
    return {
      label: { type: String },
      targetId: { type: String },
      isDarkMode: { type: Boolean, reflect: true },
    };
  }

  scrollToTarget() {
    if (this.targetId) {
      let targetElement = null;
      let appHax = this.closest("app-hax") || document.querySelector("app-hax");

      if (appHax) {
        let useCaseFilter = appHax.shadowRoot
          ? appHax.shadowRoot.querySelector("app-hax-use-case-filter")
          : appHax.querySelector("app-hax-use-case-filter");
        if (useCaseFilter) {
          targetElement = useCaseFilter.shadowRoot
            ? useCaseFilter.shadowRoot.getElementById(this.targetId)
            : useCaseFilter.querySelector(`#${this.targetId}`);
        }
      }
      if (!targetElement) {
        targetElement = document.getElementById(this.targetId);
      }
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        // Announce to screen readers
        this._announceNavigation();
      } else {
        console.warn(
          `Element with id '${this.targetId}' not found inside app-hax-use-case-filter.`,
        );
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this._darkModeObserver = new MutationObserver(() => {
      this.isDarkMode = document.body.classList.contains("dark-mode");
    });
    this._darkModeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._darkModeObserver) {
      this._darkModeObserver.disconnect();
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          background-image: url("/elements/app-hax/lib/assets/images/scroll-button-LM.png");
          background-size: cover;
          background-position: center;
          width: 300px;
          height: 50px;
          color: var(--app-hax-accent-color, var(--accent-color));
          align-items: center;
          justify-content: center;
          text-align: center;
          margin: 8px;
        }
        :host([isDarkMode]) {
          background-image: url("/elements/app-hax/lib/assets/images/scroll-button-DM.png");
        }
        div {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        
        div:hover,
        div:focus {
          outline: 2px solid var(--ddd-theme-default-keystoneYellow, #ffd100);
          outline-offset: 2px;
        }
        
        /* Screen reader only text */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        
        /* Live region for announcements */
        .live-region {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
        }
      `,
    ];
  }

  render() {
    return html`
      <div 
        @click="${this.scrollToTarget}" 
        tabindex="0" 
        role="button"
        aria-label="${this.label} - Navigate to section"
        aria-describedby="scroll-desc"
      >
        <h5 aria-hidden="true">${this.label}</h5>
        <div id="scroll-desc" class="sr-only">
          Click to scroll to the ${this.label} section
        </div>
      </div>
      <div 
        class="live-region" 
        aria-live="polite" 
        aria-atomic="true" 
        id="scroll-announcement"
      ></div>
    `;
  }
  
  /**
   * Handle keyboard navigation
   */
  _handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.scrollToTarget();
    }
  }
  
  /**
   * Announce navigation to screen readers
   */
  _announceNavigation() {
    const announcement = this.shadowRoot.querySelector('#scroll-announcement');
    if (announcement) {
      announcement.textContent = `Navigated to ${this.label} section`;
      // Clear announcement after delay
      setTimeout(() => {
        announcement.textContent = '';
      }, 1000);
    }
  }
}
customElements.define(AppHaxScrollButton.tag, AppHaxScrollButton);
