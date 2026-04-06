import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

class HAXCMSSiteSettingsDashboard extends DDD {
  static get tag() {
    return "haxcms-site-settings-dashboard";
  }

  static get properties() {
    return {
      allowStyleGuide: { type: Boolean, attribute: "allow-style-guide" },
      allowReports: { type: Boolean, attribute: "allow-reports" },
    };
  }

  constructor() {
    super();
    this.allowStyleGuide = false;
    this.allowReports = false;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          padding: var(--ddd-spacing-6);
        }
        .dashboard-shell {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
        }
        .primary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--ddd-spacing-4);
        }
        .advanced-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: var(--ddd-spacing-3);
        }
        @media (max-width: 1200px) {
          .advanced-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 1000px) {
          .primary-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 760px) {
          .primary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .advanced-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 520px) {
          .primary-grid,
          .advanced-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
        .advanced-heading {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-4);
          margin: 12px 0px;
        }
        .advanced-title {
          margin: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
          white-space: nowrap;
        }
        .advanced-rule {
          border-top: 6px solid light-dark(black, white);
          height: 0;
          flex: 1;
        }
        .dashboard-item {
          display: block;
        }
        .dashboard-action {
          width: 100%;
          border-radius: var(--ddd-radius-sm);
          border: 2px solid light-dark(black, white);
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-black)
          );
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-xs);
          line-height: 1.2;
          cursor: pointer;
          padding: var(--ddd-spacing-3);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }
        .dashboard-action:hover,
        .dashboard-action:focus-visible {
          border-color: var(--ddd-theme-default-skyBlue);
          box-shadow: var(--ddd-boxShadow-sm);
          transform: translateY(-2px);
          outline: none;
          color: var(--ddd-theme-default-skyBlue);
        }
        .dashboard-action:disabled {
          cursor: not-allowed;
          opacity: 0.55;
          transform: none;
          box-shadow: none;
        }
        .dashboard-action:disabled:hover,
        .dashboard-action:disabled:focus-visible {
          border-color: var(--ddd-theme-default-limestoneGray);
          box-shadow: none;
          transform: none;
        }
        .dashboard-action.primary {
          min-height: 160px;
          font-size: var(--ddd-font-size-s);
        }
        .dashboard-action.advanced {
          min-height: 112px;
        }
        .dashboard-action simple-icon-lite {
          --simple-icon-color: currentColor;
        }
        .dashboard-action.primary simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-l, 56px);
          --simple-icon-height: var(--ddd-icon-l, 56px);
        }
        .dashboard-action.advanced simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-xs, 44px);
          --simple-icon-height: var(--ddd-icon-xs, 44px);
        }
      `,
    ];
  }

  _actionTap(action) {
    this.dispatchEvent(
      new CustomEvent("haxcms-site-settings-dashboard-action", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { action },
      }),
    );
  }
  _renderActionButton(item, size = "advanced") {
    if (item.hidden) {
      return "";
    }
    return html`
      <div class="dashboard-item">
        <button
          type="button"
          class="dashboard-action ${size}"
          aria-label="${item.label}"
          ?disabled="${item.disabled}"
          @click="${() => this._actionTap(item.action)}"
        >
          <simple-icon-lite icon="${item.icon}" aria-hidden="true"></simple-icon-lite>
          <span>${item.label}</span>
        </button>
      </div>
    `;
  }

  render() {
    const primaryActions = [
      {
        action: "content-admin",
        icon: "editor:insert-drive-file",
        label: "Content",
      },
      { action: "outline", icon: "hax:site-map", label: "Structure" },
      { action: "theme-settings", icon: "lrn:palette", label: "Appearance" },
      { action: "site-settings", icon: "settings", label: "Site Details" },
    ];
    const advancedActions = [
      { action: "blocks", icon: "hax:blocks", label: "Blocks" },
      { action: "editor", icon: "hax:page-edit", label: "Editor" },
      { action: "platform", icon: "hax:add-item", label: "Features" },
      { action: "seo-settings", icon: "icons:search", label: "SEO" },
      {
        action: "reports",
        icon: "hax:graph",
        label: "Reports",
        disabled: !this.allowReports,
      },
      { action: "files-admin", icon: "icons:folder", label: "Files" },
    ];
    return html`
      <div class="dashboard-shell">
        <div class="primary-grid">
          ${primaryActions.map((item) => this._renderActionButton(item, "primary"))}
        </div>
        <div class="advanced-heading">
          <h3 class="advanced-title">Advanced</h3>
          <div class="advanced-rule"></div>
        </div>
        <div class="advanced-grid">
          ${advancedActions.map((item) =>
            this._renderActionButton(item, "advanced"),
          )}
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSSiteSettingsDashboard.tag,
  HAXCMSSiteSettingsDashboard,
);

export { HAXCMSSiteSettingsDashboard };
