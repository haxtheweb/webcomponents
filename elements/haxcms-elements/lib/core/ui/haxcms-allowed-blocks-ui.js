import { html, css } from 'lit'
import { autorun, toJS } from 'mobx'
import { DDD } from '@haxtheweb/d-d-d/d-d-d.js'
import { HAXStore } from '@haxtheweb/hax-body/lib/hax-store.js'
import { HAXCMSI18NMixin } from '../utils/HAXCMSI18NMixin.js'
import '@haxtheweb/simple-icon/lib/simple-icon-button-lite.js'
import '@haxtheweb/simple-icon/lib/simple-icon-lite.js'

/**
 * `haxcms-allowed-blocks-ui`
 * UI for selecting blocks in platform settings
 */
class HAXCMSAllowedBlocksUI extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return 'haxcms-allowed-blocks-ui'
  }

  static get properties() {
    return {
      haxBlocks: { type: Array },
      allowedBlocks: { type: Object },
      blockFilter: { type: String, attribute: 'block-filter' },
      busy: { type: Boolean, reflect: true },
    }
  }

  constructor() {
    super()
    this.haxBlocks = []
    this.allowedBlocks = new Set()
    this.blockFilter = ''
    this.busy = false
    this.__disposer = []

    this.t = this.t || {}
    this.t = {
      ...this.t,
      title: 'Blocks',
      filterBlocks: 'Filter blocks',
      requiredTextNote:
        'Some text tags are required and always enabled (shown disabled).',
      selectAll: 'Select all',
      deselectAll: 'Deselect all',
      save: 'Save',
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
          min-height: min(60vh, var(--haxcms-admin-panel-height));
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

        h2 {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
        }

        h4 {
          margin: 0;
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
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

        details {
          max-width: 100%;
        }

        fieldset {
          border: 0;
          padding: 0;
          margin: 0;
        }

        .check-grid {
          flex: 7;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--ddd-spacing-3);
        }

        label.check {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          line-height: 1.3;
        }

        label.check input {
          margin-top: 2px;
        }

        .controls-container {
          display: flex;
        }

        .controls {
          flex: 1;
          display: inline-flex;
          gap: var(--ddd-spacing-2);
          align-items: center;
          flex-direction: column;
        }

        .controls simple-icon-button-lite {
          --simple-icon-height: var(--ddd-icon-4xs);
          --simple-icon-width: var(--ddd-icon-4xs);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.2)
          );
        }

        input[type='text'] {
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

        .blocks-list {
          max-height: 40vh;
          overflow: auto;
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-3);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.2)
          );
        }

        .block-category {
          padding: var(--ddd-spacing-3) 0;
          border-top: var(--ddd-border-xs);
        }

        .block-category:first-of-type {
          border-top: 0;
          padding-top: 0;
        }

        .block-category-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-2);
        }

        .blocks-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-3);
        }

        .block-search {
          flex: 7;
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

        .note {
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-xs);
          opacity: 0.9;
        }
      `,
    ]
  }

  connectedCallback() {
    super.connectedCallback()

    autorun((reaction) => {
      const platformConfig = toJS(HAXStore.platformConfig)
      if (platformConfig && platformConfig.allowedBlocks) {
        const allowedBlocks = platformConfig.allowedBlocks
        if (allowedBlocks instanceof Set) {
          this.allowedBlocks = new Set(Array.from(allowedBlocks))
        } else if (Array.isArray(allowedBlocks)) {
          this.allowedBlocks = new Set(allowedBlocks)
        }
      } else {
        this.allowedBlocks = new Set()
      }

      const currentGizmos = toJS(HAXStore.gizmoList)
      const gizmos = Array.isArray(currentGizmos) ? currentGizmos : []
      this.haxBlocks = gizmos.filter(
        (item) =>
          !(
            item.meta &&
            (item.meta.inlineOnly || item.meta.hidden || item.meta.requiresParent)
          ),
      )
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
    const blocks = Array.isArray(this.haxBlocks) ? this.haxBlocks : []
    const toggleableTotal = blocks.filter((b) => !b.gizmoList).length
    const toggleableSelected = blocks.filter(
      (b) => HAXStore.requiredPrimitives.has(b.tag) || this.allowedBlocks.has(b.tag),
    ).length
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          <h2>${this.t.title}</h2>
          <div class="section">
            <div class="blocks-meta">
              <div class="block-search">
                <label for="blockFilter">${this.t.filterBlocks}: </label>
                <input
                  id="blockFilter"
                  type="text"
                  .value=${this.blockFilter}
                  @input=${this._blockFilterChanged}
                />
              </div>
              <div class="controls">
                <simple-icon-button-lite
                  icon="icons:select-all"
                  label="${this.t.selectAll}"
                  title="${this.t.selectAll}"
                  data-category="all-blocks"
                  @click="${this._selectAll}"
                  >Select All</simple-icon-button-lite
                >
                <simple-icon-button-lite
                  icon="icons:select-all"
                  label="${this.t.deselectAll}"
                  title="${this.t.deselectAll}"
                  data-category="all-blocks"
                  @click="${this._deselectAll}"
                  >Deselect All</simple-icon-button-lite
                >
              </div>
            </div>

            <div class="note">
              ${toggleableSelected} selected / ${toggleableTotal} available
              ${HAXStore.requiredPrimitives.size
                ? html`<span> • ${this.t.requiredTextNote}</span>`
                : ''}
            </div>

            <div class="blocks-list">
              ${this._groupBlocksByCategory(blocks).map(
                (group) => html`
                  <details class="block-category">
                    <summary class="block-category-title">
                      <h4>${group.category}</h4>
                    </summary>
                    <div class="controls-container">
                      <fieldset class="check-grid ${group.category.toLowerCase()}-container">
                        ${group.blocks.map((item) => this._renderBlockCheckbox(item))}
                      </fieldset>
                      <div class="controls">
                        <simple-icon-button-lite
                          icon="icons:select-all"
                          label="${this.t.selectAll}"
                          title="${this.t.selectAll}"
                          data-category=${group.category.toLowerCase()}
                          @click="${this._selectAll}"
                          >Select All</simple-icon-button-lite
                        >
                        <simple-icon-button-lite
                          icon="icons:select-all"
                          label="${this.t.deselectAll}"
                          title="${this.t.deselectAll}"
                          data-category=${group.category.toLowerCase()}
                          @click="${this._deselectAll}"
                          >Deselect All</simple-icon-button-lite
                        >
                      </div>
                    </div>
                  </details>
                `,
              )}
            </div>
          </div>
        </div>
        <div class="actions">
          <button class="action" @click="${this._saveAllowedBlocks}">
            ${this.t.save}
          </button>
        </div>
      </div>
    `
  }

  _renderBlockCheckbox(item) {
    const isDisabled = HAXStore.requiredPrimitives.has(item.tag) ? true : false
    return html`
      <label class="check">
        <input
          type="checkbox"
          data-tag="${item.tag}"
          .checked=${!item.platformRestricted}
          ?disabled=${isDisabled}
          @change=${this._checkboxChanged}
        />
        <simple-icon-lite icon="${item.icon}"></simple-icon-lite>
        <span>${item.title}</span>
      </label>
    `
  }

  _checkboxChanged(e) {
    const input = e.currentTarget
    if (!input || input.type !== 'checkbox') return
    const tag = input.dataset.tag
    if (!tag) return

    // Required primitives are locked on; ignore toggles.
    if (HAXStore.requiredPrimitives.has(tag)) return

    if (e.target.checked) {
      this.allowedBlocks.add(tag)
    } else {
      this.allowedBlocks.delete(tag)
    }
    this.requestUpdate()
  }

  _blockFilterChanged(e) {
    this.blockFilter = e && e.target ? e.target.value : ''
  }

  _selectAll(e) {
    const category = e && e.target ? e.target.getAttribute('data-category') : null
    switch (category) {
      case 'all-blocks': {
        const blocks = Array.isArray(this.haxBlocks) ? this.haxBlocks : []
        this.allowedBlocks = new Set(
          blocks
            .filter((item) => !HAXStore.requiredPrimitives.has(item.tag))
            .map((item) => item.tag),
        )
        const container = this.shadowRoot.querySelector('.blocks-list')
        const checkboxes = container.querySelectorAll('input[type="checkbox"]')
        checkboxes.forEach((item) => {
          item.checked = true
        })
        break
      }
      // Any sub-category of blocks (i.e., Writing, Instructional, etc.)
      default: {
        const container = this.shadowRoot.querySelector(`.${category}-container`)
        const checkboxes = container.querySelectorAll('input[type="checkbox"]')
        checkboxes.forEach((item) => {
          if (HAXStore.requiredPrimitives.has(item.dataset.tag)) return

          this.allowedBlocks.add(item.dataset.tag)
          item.checked = true
        })
        this.requestUpdate()
        break
      }
    }
  }

  _deselectAll(e) {
    const category = e && e.target ? e.target.getAttribute('data-category') : null
    switch (category) {
      case 'all-blocks': {
        this.allowedBlocks = new Set([])
        const container = this.shadowRoot.querySelector('.blocks-list')
        const checkboxes = container.querySelectorAll('input[type="checkbox"]')
        checkboxes.forEach((item) => {
          if (HAXStore.requiredPrimitives.has(item.dataset.tag)) return
          item.checked = false
        })
        break
      }
      // Any sub-category of blocks (i.e., Writing, Instructional, etc.)
      default: {
        const container = this.shadowRoot.querySelector(`.${category}-container`)
        const checkboxes = container.querySelectorAll('input[type="checkbox"]')
        checkboxes.forEach((item) => {
          if (HAXStore.requiredPrimitives.has(item.dataset.tag)) return

          this.allowedBlocks.delete(item.dataset.tag)
          item.checked = false
        })
        this.requestUpdate()
        break
      }
    }
  }

  _compareCategories(a, b) {
    const categoryA = a || 'Other'
    const categoryB = b || 'Other'

    // Writing / Text first, Other last, then alphabetical
    const first = ['Writing', 'Text']
    const last = ['Other']

    if (first.includes(categoryA) && !first.includes(categoryB)) return -1
    if (!first.includes(categoryA) && first.includes(categoryB)) return 1

    if (last.includes(categoryA) && !last.includes(categoryB)) return 1
    if (!last.includes(categoryA) && last.includes(categoryB)) return -1

    if (first.includes(categoryA) && first.includes(categoryB)) {
      return first.indexOf(categoryA) - first.indexOf(categoryB)
    }

    if (categoryA < categoryB) return -1
    if (categoryA > categoryB) return 1
    return 0
  }

  _groupBlocksByCategory(items) {
    const filter = this.blockFilter ? this.blockFilter.toLowerCase().trim() : ''
    const groupMap = {}
    items.forEach((item) => {
      if (filter) {
        const title = item && item.title ? item.title.toLowerCase() : ''
        const tag = item && item.tag ? item.tag.toLowerCase() : ''
        if (!title.includes(filter) && !tag.includes(filter)) {
          return
        }
      }
      const required = HAXStore.requiredPrimitives.has(item.tag)
      let category = 'Other'
      if (Array.isArray(item.tags) && item.tags.length > 0) {
        category = item.tags[0]
      }
      // Ensure required text primitives show up in Writing group even if missing tags
      if (required && category === 'Other') {
        category = 'Text'
      }

      if (!groupMap[category]) {
        groupMap[category] = []
      }
      groupMap[category].push(item)
    })

    const categories = Object.keys(groupMap)
    categories.sort((a, b) => this._compareCategories(a, b))

    return categories.map((category) => ({
      category,
      blocks: groupMap[category],
    }))
  }

  _allowedBlocksForSave() {
    return Array.from(this.allowedBlocks || [])
      .filter((tag) => !HAXStore.requiredPrimitives.has(tag))
      .sort()
  }

  async _saveAllowedBlocks() {
    try {
      this.busy = true
      this.dispatchEvent(
        new CustomEvent('haxcms-save-allowed-blocks', {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            allowedBlocks: this._allowedBlocksForSave(),
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
      console.error('Saving blocks failed:', error)
      HAXStore.toast(
        `Saving blocks failed: ${error.message}`,
        5000,
        {},
        'fit-bottom',
      )
    }

    this.busy = false
  }
}

globalThis.customElements.define(HAXCMSAllowedBlocksUI.tag, HAXCMSAllowedBlocksUI)
export { HAXCMSAllowedBlocksUI }
