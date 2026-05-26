import { html, css } from "lit";
import { autorun, toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { HAXCMSI18NMixin } from "../utils/HAXCMSI18NMixin.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

/**
 * `haxcms-editor-settings-dialog-ui`
 * UI for editor mode settings
 */
class HAXCMSEditorSettingsDialogUI extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "haxcms-editor-settings-dialog-ui";
  }

  static get properties() {
    return {
      audience: { type: String },
      busy: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.audience = "expert";
    this.busy = false;
    this.__disposer = [];
    this.audienceOptions = [
      { value: "novice", label: "Novice" },
      { value: "expert", label: "Expert" },
    ];

    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Editor Settings",
      experienceLevel: "Experience Level",
      experienceLevelDescription:
        "Select the editor experience and preview the toolbar layout.",
      buttons: "Buttons",
      futureButtonConfiguration:
        "Custom editor button configuration is coming soon.",
      save: "Save",
      saving: "Saving…",
    };

    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary);
          min-width: 80vw;
          min-height: min(40vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          padding: var(--ddd-spacing-4);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          flex-shrink: 0;
        }

        :host([busy]) {
          pointer-events: none;
          opacity: 0.8;
        }

        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .panel-scroll {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding-right: var(--ddd-spacing-1);
        }

        h2 {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
        }
        .row {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-6);
        }
        details {
          max-width: 100%;
          min-width: 100%;
          box-sizing: border-box;
        }
        .section {
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-md);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.15)
          );
          padding: var(--ddd-spacing-4);
        }
        .section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: 0;
          cursor: pointer;
        }
        .section[open] .section-title {
          margin-bottom: var(--ddd-spacing-3);
        }
        .section-title:focus-visible {
          outline: var(--ddd-border-sm) solid var(--ddd-theme-default-skyBlue);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }
        .summary-leading {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .section-title simple-icon-lite {
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        .section-title h3 {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
        }

        .collapse-body {
          padding: 0;
        }

        .section-description {
          margin: 0 0 var(--ddd-spacing-3) 0;
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.35;
          opacity: 0.92;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }

        .audience-content {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: var(--ddd-spacing-4);
          align-items: flex-start;
        }

        .audience-selector {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          min-width: 220px;
        }

        .audience-selector label {
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-xs);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }

        select {
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-s);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.25)
          );
          color: inherit;
        }

        .toolbar-preview {
          max-width: 320px;
          width: 100%;
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          background: light-dark(
            var(--ddd-theme-default-athertonViolet),
            rgba(0, 0, 0, 0.2)
          );
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--ddd-spacing-3);
          padding-top: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          flex-shrink: 0;
          position: sticky;
          bottom: 0;
          z-index: 2;
        }

        button.action {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs);
          cursor: pointer;
          background-color: var(--ddd-theme-default-skyBlue);
          color: var(--ddd-theme-default-white);
        }

        button.action:focus,
        button.action:hover {
          outline: 2px solid var(--ddd-theme-default-keystoneYellow);
        }
        simple-fields {
          --simple-fields-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-fields-background-color: transparent;
          --simple-fields-select-option-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --simple-fields-select-option-selected-background-color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-fields-button-background-color: transparent;
        }
        @media screen and (max-width: 900px) {
          :host {
            min-width: 0;
            width: 100%;
            min-height: 0;
            height: auto;
            max-height: calc(
              100dvh - var(
                  --simple-modal-titlebar-mobile-height,
                  var(--simple-modal-titlebar-height, 80px)
                ) - var(--ddd-spacing-4, 16px)
            );
            overflow-y: auto;
            overflow-x: hidden;
            padding: var(--ddd-spacing-3);
          }
          .panel-shell {
            min-height: auto;
          }
          .panel-scroll {
            flex: 0 0 auto;
            min-height: auto;
            overflow: visible;
            padding-right: 0;
          }
          .section {
            padding: var(--ddd-spacing-3);
          }
          .audience-content {
            flex-direction: column;
            gap: var(--ddd-spacing-3);
          }
          .toolbar-preview {
            max-width: 100%;
          }
          .actions {
            position: sticky;
            bottom: 0;
            padding-bottom: calc(
              var(--ddd-spacing-3) + env(safe-area-inset-bottom, 0px)
            );
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.__disposer.push(
      autorun((reaction) => {
        const platformConfig = toJS(HAXStore.platformConfig);
        if (
          platformConfig &&
          platformConfig.audience &&
          (platformConfig.audience === "novice" ||
            platformConfig.audience === "expert")
        ) {
          this.audience = platformConfig.audience;
        } else {
          this.audience = "expert";
        }
      }),
    );
  }

  disconnectedCallback() {
    while (this.__disposer.length) {
      const d = this.__disposer.pop();
      if (d && typeof d.dispose === "function") {
        d.dispose();
      }
    }
    super.disconnectedCallback();
  }

  render() {
    const toolbarImgPath = new URL(
      `./assets/${this.audience.toLowerCase()}.png`,
      import.meta.url,
    ).href;
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          <h2>${this.t.title}</h2>
          <div class="row">
            <details class="section" open>
              <summary class="section-title">
                <span class="summary-leading">
                  <simple-icon-lite
                    icon="hax:page-edit"
                    aria-hidden="true"
                  ></simple-icon-lite>
                  <h3>${this.t.experienceLevel}</h3>
                </span>
              </summary>
              <div class="collapse-body">
                <p class="section-description">
                  ${this.t.experienceLevelDescription}
                </p>
                <div class="audience-content">
                  <div class="audience-selector">
                    <simple-fields
                      .fields="${this._audienceFields}"
                      .value="${{ audience: this.audience }}"
                      .schematizer="${HaxSchematizer}"
                      .elementizer="${HaxElementizer}"
                      @value-changed="${this._audienceChanged}"
                    ></simple-fields>
                  </div>
                  <img
                    class="toolbar-preview"
                    src="${toolbarImgPath}"
                    alt="${this.audience} editing toolbar preview"
                  />
                </div>
              </div>
            </details>
            <details class="section">
              <summary class="section-title">
                <span class="summary-leading">
                  <simple-icon-lite
                    icon="hax:add-brick"
                    aria-hidden="true"
                  ></simple-icon-lite>
                  <h3>${this.t.buttons}</h3>
                </span>
              </summary>
              <div class="collapse-body">
                <p class="section-description">
                  ${this.t.futureButtonConfiguration}
                </p>
              </div>
            </details>
          </div>
        </div>
        <div class="actions">
          <button class="action" @click="${this._saveEditorSettings}">
            ${this.busy ? this.t.saving : this.t.save}
          </button>
        </div>
      </div>
    `;
  }

  get _audienceFields() {
    return [
      {
        property: "audience",
        title: this.t.experienceLevel,
        inputMethod: "select",
        options: {
          novice: "Novice",
          expert: "Expert",
        },
      },
    ];
  }

  _audienceChanged(e) {
    const value =
      e && e.detail && e.detail.value && e.detail.value.audience
        ? e.detail.value.audience
        : "expert";
    if (value === "novice" || value === "expert") {
      this.audience = value;
    } else {
      this.audience = "expert";
    }
  }

  _saveEditorSettings() {
    try {
      this.busy = true;
      this.dispatchEvent(
        new CustomEvent("haxcms-save-editor-settings", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            audience: this.audience,
          },
        }),
      );
      this.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: false,
        }),
      );
    } catch (error) {
      console.error("Saving editor settings failed:", error);
      HAXStore.toast(
        `Saving editor settings failed: ${error.message}`,
        5000,
        {},
        "fit-bottom",
      );
    }
    this.busy = false;
  }
}

globalThis.customElements.define(
  HAXCMSEditorSettingsDialogUI.tag,
  HAXCMSEditorSettingsDialogUI,
);
export { HAXCMSEditorSettingsDialogUI };
