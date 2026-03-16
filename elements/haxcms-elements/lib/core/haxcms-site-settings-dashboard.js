import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

class HAXCMSSiteSettingsDashboard extends DDD {
  static get tag() {
    return "haxcms-site-settings-dashboard";
  }

  static get properties() {
    return {
      allowStyleGuide: { type: Boolean, attribute: "allow-style-guide" },
      allowInsights: { type: Boolean, attribute: "allow-insights" },
    };
  }

  constructor() {
    super();
    this.allowStyleGuide = false;
    this.allowInsights = false;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          padding: var(--ddd-spacing-6);
        }
        .dashboard {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--ddd-spacing-4);
          justify-items: center;
        }
        @media (max-width: 1000px) {
          .dashboard {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (max-width: 760px) {
          .dashboard {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 520px) {
          .dashboard {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
        .dashboard-title {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-medium);
        }
        .dashboard-item {
          color: light-dark(black, white);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-2);
          height: 125px;
          width: 125px;
        }
        .dashboard-item:focus-within {
          outline: var(--ddd-border-sm) solid var(--ddd-theme-default-slateGray);
          outline-offset: 2px;
        }
        .dashboard-action {
          --simple-icon-button-border-radius: var(--ddd-radius-md);
          --simple-icon-button-border: var(--ddd-border-sm) solid
            var(--ddd-theme-default-slateGray);
          --simple-icon-button-focus-border: var(--ddd-border-sm) solid
            var(--ddd-theme-default-slateGray);
          --simple-icon-button-padding: 0;
          --simple-icon-width: 48px;
          --simple-icon-height: 48px;
          --simple-icon-button-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --simple-icon-button-focus-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          width: 96px;
          min-width: 96px;
          height: 96px;
          min-height: 96px;
        }
        .dashboard-action::part(button) {
          border: var(--simple-icon-button-focus-border);
          background-color: var(--simple-icon-button-focus-background-color);
          opacity: var(--simple-icon-button-focus-opacity, 0.8);
        }
        :host([dark]) .dashboard-action,
        :host-context(body.dark-mode) .dashboard-action {
          --simple-icon-button-border: var(--ddd-border-sm) solid
            var(--ddd-theme-default-white);
          --simple-icon-button-focus-border: var(--ddd-border-sm) solid
            var(--ddd-theme-default-white);
        }
        .dashboard-action-label {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.2;
          text-align: center;
          max-width: 96px;
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

  render() {
    return html`
      <div class="dashboard">
        <div class="dashboard-item">
          <simple-icon-button-lite
            class="dashboard-action"
            icon="hax:site-map"
            label="Outline"
            @click="${() => this._actionTap("outline")}"
          ></simple-icon-button-lite>
          <div class="dashboard-action-label">Outline</div>
        </div>
        <div class="dashboard-item">
          <simple-icon-button-lite
            class="dashboard-action"
            icon="lrn:palette"
            label="Theme"
            @click="${() => this._actionTap("theme-settings")}"
          ></simple-icon-button-lite>
          <div class="dashboard-action-label">Theme</div>
        </div>
        <div class="dashboard-item">
          <simple-icon-button-lite
            class="dashboard-action"
            icon="hax:add-brick"
            label="Blocks"
            @click="${() => this._actionTap("blocks")}"
          ></simple-icon-button-lite>
          <div class="dashboard-action-label">Blocks</div>
        </div>
        <div class="dashboard-item">
          <simple-icon-button-lite
            class="dashboard-action"
            icon="hax:page-edit"
            label="Editor"
            @click="${() => this._actionTap("editor")}"
          ></simple-icon-button-lite>
          <div class="dashboard-action-label">Editor</div>
        </div>
        <div class="dashboard-item">
          <simple-icon-button-lite
            class="dashboard-action"
            icon="hax:home-edit"
            label="Platform"
            @click="${() => this._actionTap("platform")}"
          ></simple-icon-button-lite>
          <div class="dashboard-action-label">Platform</div>
        </div>
        <div class="dashboard-item">
          <simple-icon-button-lite
            class="dashboard-action"
            icon="icons:search"
            label="SEO"
            @click="${() => this._actionTap("seo-settings")}"
          ></simple-icon-button-lite>
          <div class="dashboard-action-label">SEO</div>
        </div>
        <div class="dashboard-item" ?hidden="${!this.allowStyleGuide}">
          <simple-icon-button-lite
            class="dashboard-action"
            icon="lrn:palette"
            label="Styles"
            @click="${() => this._actionTap("style-guide")}"
          ></simple-icon-button-lite>
          <div class="dashboard-action-label">Style Guide</div>
        </div>
        <div class="dashboard-item" ?hidden="${!this.allowInsights}">
          <simple-icon-button-lite
            class="dashboard-action"
            icon="hax:clipboard-pulse"
            label="Insights"
            @click="${() => this._actionTap("insights")}"
          ></simple-icon-button-lite>
          <div class="dashboard-action-label">Insights</div>
        </div>
        <div class="dashboard-item">
          <simple-icon-button-lite
            class="dashboard-action"
            icon="settings"
            label="Settings"
            @click="${() => this._actionTap("site-settings")}"
          ></simple-icon-button-lite>
          <div class="dashboard-action-label">Site Settings</div>
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
