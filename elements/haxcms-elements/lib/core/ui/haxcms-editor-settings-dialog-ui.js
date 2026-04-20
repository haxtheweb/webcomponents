import { html, css } from 'lit'
import { autorun, toJS } from 'mobx'
import { DDD } from '@haxtheweb/d-d-d/d-d-d.js'
import { HAXStore } from '@haxtheweb/hax-body/lib/hax-store.js'
import { HAXCMSI18NMixin } from '../utils/HAXCMSI18NMixin.js'

/**
 * `haxcms-editor-settings-dialog-ui`
 * UI for editor mode settings
 */
class HAXCMSEditorSettingsDialogUI extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return 'haxcms-editor-settings-dialog-ui'
  }

  static get properties() {
    return {
      audience: { type: String },
      busy: { type: Boolean, reflect: true },
    }
  }

  constructor() {
    super()
    this.audience = 'expert'
    this.busy = false
    this.__disposer = []
    this.audienceOptions = [
      { value: 'novice', label: 'Novice' },
      { value: 'expert', label: 'Expert' },
    ]

    this.t = this.t || {}
    this.t = {
      ...this.t,
      title: 'Editor settings',
      experienceLevel: 'Experience level',
      save: 'Save',
      saving: 'Saving…',
    }

    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    })
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 85vh) -
              var(--simple-modal-titlebar-height, 80px) - var(--ddd-spacing-8, 32px)
          );
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary);
          min-width: 70vw;
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

        .section {
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-md);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.15)
          );
          padding: var(--ddd-spacing-4);
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
      `,
    ]
  }

  connectedCallback() {
    super.connectedCallback()
    autorun((reaction) => {
      const platformConfig = toJS(HAXStore.platformConfig)
      if (
        platformConfig &&
        platformConfig.audience &&
        (platformConfig.audience === 'novice' ||
          platformConfig.audience === 'expert')
      ) {
        this.audience = platformConfig.audience
      } else {
        this.audience = 'expert'
      }
      this.__disposer.push(reaction)
    })
  }

  disconnectedCallback() {
    while (this.__disposer.length) {
      const d = this.__disposer.pop()
      if (d && typeof d.dispose === 'function') {
        d.dispose()
      }
    }
    super.disconnectedCallback()
  }

  render() {
    const toolbarImgPath = new URL(
      `./assets/${this.audience.toLowerCase()}.png`,
      import.meta.url,
    ).href
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          <h2>${this.t.title}</h2>
          <div class="section">
            <div class="audience-selector">
              <label for="audience">${this.t.experienceLevel}</label>
              <select id="audience" .value="${this.audience}" @change="${this._audienceChanged}">
                ${this.audienceOptions.map(
                  (opt) => html`
                    <option value="${opt.value}" ?selected="${this.audience === opt.value}">
                      ${opt.label}
                    </option>
                  `,
                )}
              </select>
            </div>
            <img
              class="toolbar-preview"
              src="${toolbarImgPath}"
              alt="${this.audience} editing toolbar preview"
            />
          </div>
        </div>
        <div class="actions">
          <button class="action" @click="${this._saveEditorSettings}">
            ${this.busy ? this.t.saving : this.t.save}
          </button>
        </div>
      </div>
    `
  }

  _audienceChanged(e) {
    const value = e && e.target ? e.target.value : 'expert'
    if (value === 'novice' || value === 'expert') {
      this.audience = value
    } else {
      this.audience = 'expert'
    }
  }

  _saveEditorSettings() {
    try {
      this.busy = true
      this.dispatchEvent(
        new CustomEvent('haxcms-save-editor-settings', {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            audience: this.audience,
          },
        }),
      )
      this.dispatchEvent(
        new CustomEvent('simple-modal-hide', {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: false,
        }),
      )
    } catch (error) {
      console.error('Saving editor settings failed:', error)
      HAXStore.toast(
        `Saving editor settings failed: ${error.message}`,
        5000,
        {},
        'fit-bottom',
      )
    }
    this.busy = false
  }
}

globalThis.customElements.define(
  HAXCMSEditorSettingsDialogUI.tag,
  HAXCMSEditorSettingsDialogUI,
)
export { HAXCMSEditorSettingsDialogUI }
