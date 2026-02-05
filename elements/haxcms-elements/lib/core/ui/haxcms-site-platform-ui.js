import { html, css } from 'lit'
import { autorun, toJS } from 'mobx'
import { DDD } from '@haxtheweb/d-d-d/d-d-d.js'
import { HAXStore } from '@haxtheweb/hax-body/lib/hax-store.js'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { HAXCMSI18NMixin } from '../utils/HAXCMSI18NMixin.js'
import '@haxtheweb/simple-icon/lib/simple-icon-button-lite.js'

// Required HTML primitives that must exist for baseline text authoring.
// These are always enabled in the UI and are NOT written to platformConfig.allowedBlocks.
const REQUIRED_TEXT_PRIMITIVES = [
  'h1',
  'h2',
  'h3',
  'p',
  'strong',
  'em',
  'ul',
  'ol',
  'strike',
]
const REQUIRED_TEXT_PRIMITIVES_SET = new Set(REQUIRED_TEXT_PRIMITIVES)

const DEFAULT_SUPPORTED_FEATURES = [
  'addPage',
  'deletePage',
  'outlineDesigner',
  'styleGuide',
  'insights',
  'manifest',
  'addBlock',
  'contentMap',
  'viewSource',
  'onlineSearch',
  'pageBreak',
]

const FEATURE_DEFS = [
  {
    key: 'addPage',
    label: 'Add pages',
    group: 'CMS',
  },
  {
    key: 'deletePage',
    label: 'Delete pages',
    group: 'CMS',
  },
  {
    key: 'outlineDesigner',
    label: 'Outline designer',
    group: 'CMS',
  },
  {
    key: 'styleGuide',
    label: 'Style guide',
    group: 'CMS',
  },
  {
    key: 'insights',
    label: 'Insights',
    group: 'CMS',
  },
  {
    key: 'manifest',
    label: 'Site settings',
    group: 'CMS',
  },
  {
    key: 'pageBreak',
    label: 'Page break UI',
    group: 'CMS',
  },
  {
    key: 'addBlock',
    label: 'Add blocks',
    group: 'Editor',
  },
  {
    key: 'contentMap',
    label: 'Page structure (content map)',
    group: 'Editor',
  },
  {
    key: 'viewSource',
    label: 'View source',
    group: 'Editor',
  },
  {
    key: 'onlineSearch',
    label: 'Online search',
    group: 'Editor',
  },
]

/**
 * `haxcms-site-platform-ui`
 * UI for selecting platformConfig settings and exporting a skeleton
 */
class HAXCMSSitePlatformUI extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return 'haxcms-site-platform-ui'
  }

  static get properties() {
    return {
      audience: { type: String },
      features: { type: Object },
      allowedBlocks: { type: Object },
      blocks: { type: Array },
      blockFilter: { type: String, attribute: 'block-filter' },
      busy: { type: Boolean, reflect: true },
      pageCount: { type: Number, attribute: 'page-count' },
    }
  }

  constructor() {
    super()
    this.audience = 'expert'
    this.features = this._defaultFeatures()
    this.allowedBlocks = new Set()
    this.blocks = []
    this.blockFilter = ''
    this.busy = false
    this.pageCount = 0

    this.__disposer = []
    this.__blocksInitialized = false
    this.__presetAllowedBlocks = null

    this.t = this.t || {}
    this.t = {
      ...this.t,
      title: 'Skeleton platform settings',
      experienceLevel: 'Experience level',
      cmsFeatures: 'CMS features',
      editorFeatures: 'Editor features',
      blocks: 'Allowed blocks',
      filterBlocks: 'Filter blocks',
      requiredTextNote:
        'Some text tags are required and always enabled (shown disabled).',
      selectAll: 'Select all',
      deselectAll: 'Deselect all',
      download: 'Download skeleton',
      cancel: 'Cancel',
      generating: 'Generating skeleton…',
      generated: 'Skeleton downloaded',
      largeSiteWarning:
        'This site has many pages. Skeleton generation may take a while.',
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
          display: block;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary);
          min-width: 70vw;
          padding: var(--ddd-spacing-4);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-nittanyNavy)
          );
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

        .row {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--ddd-spacing-6);
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
          margin-bottom: var(--ddd-spacing-3);
        }

        .section-title h3 {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
        }

        fieldset {
          border: 0;
          padding: 0;
          margin: 0;
        }

        .check-grid {
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

        .controls {
          display: inline-flex;
          gap: var(--ddd-spacing-2);
          align-items: center;
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

        select,
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

        .audience {
          display: grid;
          gap: var(--ddd-spacing-2);
          max-width: 420px;
        }

        .audience label {
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-xs);
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

        .block-category-note {
          margin: 0 0 var(--ddd-spacing-3) 0;
          font-size: var(--ddd-font-size-3xs);
          opacity: 0.9;
        }

        .blocks-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-3);
        }

        .actions {
          position: sticky;
          bottom: 0;
          display: flex;
          justify-content: flex-end;
          gap: var(--ddd-spacing-3);
          padding-top: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-4);
          background: linear-gradient(
            to top,
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-nittanyNavy)
            ) 60%,
            transparent
          );
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

        button.action.secondary {
          background-color: var(--ddd-theme-default-discoveryCoral);
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
      const manifest = toJS(store.manifest)
      if (manifest && manifest.items) {
        this.pageCount = manifest.items.length
      }
      this.__disposer.push(reaction)
    })

    autorun((reaction) => {
      this._initFromManifestPlatform()
      this.__disposer.push(reaction)
    })

    this.__haxRegisterPropertiesHandler = () => {
      this._refreshBlocksList()
    }
    globalThis.addEventListener(
      'hax-register-properties',
      this.__haxRegisterPropertiesHandler,
    )

    // Delay initial block list until HAXStore has had a chance to register
    setTimeout(() => {
      this._refreshBlocksList()
    }, 0)
  }

  disconnectedCallback() {
    while (this.__disposer.length) {
      const d = this.__disposer.pop()
      if (d && typeof d.dispose === 'function') {
        d.dispose()
      }
    }
    if (this.__haxRegisterPropertiesHandler) {
      globalThis.removeEventListener(
        'hax-register-properties',
        this.__haxRegisterPropertiesHandler,
      )
    }
    super.disconnectedCallback()
  }

  render() {
    const cmsFeatures = FEATURE_DEFS.filter((f) => f.group === 'CMS')
    const editorFeatures = FEATURE_DEFS.filter((f) => f.group === 'Editor')

    const blocks = this._filteredBlocks()
    const grouped = this._groupBlocksByCategory(blocks)

    const toggleableTotal = this.blocks
      ? this.blocks.filter((b) => !b.locked).length
      : 0
    const toggleableSelected = this.blocks
      ? this.blocks.filter((b) => !b.locked && this.allowedBlocks.has(b.tag)).length
      : 0

    return html`
      <h2>${this.t.title}</h2>

      <div class="row">
        <div class="section">
          <div class="audience">
            <label for="audience">${this.t.experienceLevel}</label>
            <select id="audience" @change="${this._audienceChanged}">
              ${this._audienceOptions().map(
                (opt) => html`<option value="${opt.value}" ?selected=${
                  this.audience === opt.value
                }>
                  ${opt.label}
                </option>`,
              )}
            </select>
            ${this.pageCount > 20
              ? html`<div class="note">${this.t.largeSiteWarning}</div>`
              : ''}
          </div>
        </div>

        <div class="section">
          <div class="section-title">
            <h3>${this.t.cmsFeatures}</h3>
            <div class="controls">
              <simple-icon-button-lite
                icon="icons:select-all"
                label="${this.t.selectAll}"
                title="${this.t.selectAll}"
                @click="${this._selectAllCmsFeatures}"
              ></simple-icon-button-lite>
              <simple-icon-button-lite
                icon="icons:select-all"
                label="${this.t.deselectAll}"
                title="${this.t.deselectAll}"
                @click="${this._deselectAllCmsFeatures}"
              ></simple-icon-button-lite>
            </div>
          </div>
          <fieldset class="check-grid">
            ${cmsFeatures.map((f) => this._renderFeatureCheckbox(f))}
          </fieldset>
        </div>

        <div class="section">
          <div class="section-title">
            <h3>${this.t.editorFeatures}</h3>
            <div class="controls">
              <simple-icon-button-lite
                icon="icons:select-all"
                label="${this.t.selectAll}"
                title="${this.t.selectAll}"
                @click="${this._selectAllEditorFeatures}"
              ></simple-icon-button-lite>
              <simple-icon-button-lite
                icon="icons:select-all"
                label="${this.t.deselectAll}"
                title="${this.t.deselectAll}"
                @click="${this._deselectAllEditorFeatures}"
              ></simple-icon-button-lite>
            </div>
          </div>
          <fieldset class="check-grid">
            ${editorFeatures.map((f) => this._renderFeatureCheckbox(f))}
          </fieldset>
        </div>

        <div class="section">
          <div class="section-title">
            <h3>${this.t.blocks}</h3>
            <div class="controls">
              <simple-icon-button-lite
                icon="icons:select-all"
                label="${this.t.selectAll}"
                title="${this.t.selectAll}"
                @click="${this._selectAllBlocks}"
              ></simple-icon-button-lite>
              <simple-icon-button-lite
                icon="icons:select-all"
                label="${this.t.deselectAll}"
                title="${this.t.deselectAll}"
                @click="${this._deselectAllBlocks}"
              ></simple-icon-button-lite>
            </div>
          </div>

          <div class="blocks-meta">
            <label for="blockFilter">${this.t.filterBlocks}</label>
            <input
              id="blockFilter"
              type="text"
              .value=${this.blockFilter}
              @input=${this._blockFilterChanged}
            />
          </div>

          <div class="note">
            ${toggleableSelected} selected / ${toggleableTotal} available
            ${REQUIRED_TEXT_PRIMITIVES.length
              ? html`<span> • ${this.t.requiredTextNote}</span>`
              : ''}
          </div>

          <div class="blocks-list">
            ${grouped.map(
              (group) => html`
                <div class="block-category" data-category="${group.category}">
                  <div class="block-category-title">
                    <h4>${group.category}</h4>
                    <div class="controls">
                      <simple-icon-button-lite
                        icon="icons:select-all"
                        label="${this.t.selectAll}"
                        title="${this.t.selectAll}"
                        data-category="${group.category}"
                        @click="${this._selectAllBlocksInCategory}"
                      ></simple-icon-button-lite>
                      <simple-icon-button-lite
                        icon="icons:select-all"
                        label="${this.t.deselectAll}"
                        title="${this.t.deselectAll}"
                        data-category="${group.category}"
                        @click="${this._deselectAllBlocksInCategory}"
                      ></simple-icon-button-lite>
                    </div>
                  </div>
                  <fieldset class="check-grid">
                    ${group.blocks.map((b) => this._renderBlockCheckbox(b))}
                  </fieldset>
                </div>
              `,
            )}
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="action secondary" @click="${this._cancel}">
          ${this.t.cancel}
        </button>
        <button class="action" @click="${this._download}">
          ${this.busy ? this.t.generating : this.t.download}
        </button>
      </div>
    `
  }

  _renderFeatureCheckbox(featureDef) {
    const checked = this.features && this.features[featureDef.key] !== false
    return html`
      <label class="check">
        <input
          type="checkbox"
          data-key="${featureDef.key}"
          .checked=${checked}
          @change=${this._featureChanged}
        />
        <span>${featureDef.label}</span>
      </label>
    `
  }

  _renderBlockCheckbox(blockDef) {
    const checked =
      blockDef.locked || (this.allowedBlocks && this.allowedBlocks.has(blockDef.tag))
        ? true
        : false
    return html`
      <label class="check">
        <input
          type="checkbox"
          data-tag="${blockDef.tag}"
          .checked=${checked}
          ?disabled=${blockDef.locked}
          @change=${this._blockChanged}
        />
        <span>${blockDef.title}</span>
      </label>
    `
  }

  _audienceOptions() {
    // Keep this open-ended, but start with novice/expert as requested
    return [
      { value: 'novice', label: 'Novice' },
      { value: 'expert', label: 'Expert' },
    ]
  }

  _defaultFeatures() {
    const features = {}
    DEFAULT_SUPPORTED_FEATURES.forEach((key) => {
      features[key] = true
    })
    return features
  }

  _initFromManifestPlatform() {
    const manifest = store.manifest
    const platform =
      manifest && manifest.metadata && manifest.metadata.platform
        ? manifest.metadata.platform
        : null

    // Don’t clobber user changes once blocks have initialized
    if (this.__initializedFromManifest) {
      return
    }

    // Always default to "expert" when nothing is declared
    let audience = 'expert'
    if (platform && platform.audience) {
      audience = platform.audience
    }

    const nextFeatures = this._defaultFeatures()

    // New-style platform.features
    if (platform && platform.features && typeof platform.features === 'object') {
      Object.keys(platform.features).forEach((key) => {
        if (typeof platform.features[key] === 'boolean') {
          nextFeatures[key] = platform.features[key]
        }
      })
    } else if (platform && typeof platform === 'object') {
      // Legacy: direct flags on platform object
      DEFAULT_SUPPORTED_FEATURES.forEach((key) => {
        if (typeof platform[key] === 'boolean') {
          nextFeatures[key] = platform[key]
        }
      })
      // Legacy delete -> deletePage mapping
      if (typeof platform.delete === 'boolean') {
        nextFeatures.deletePage = platform.delete
      }
      // Legacy blocks list might exist but we map below
    }

    // Allowed blocks – support both allowedBlocks and legacy blocks
    let presetBlocks = null
    if (platform && Array.isArray(platform.allowedBlocks)) {
      presetBlocks = platform.allowedBlocks
    } else if (platform && Array.isArray(platform.blocks)) {
      presetBlocks = platform.blocks
    }

    this.audience = audience
    this.features = nextFeatures
    this.__presetAllowedBlocks =
      presetBlocks && Array.isArray(presetBlocks)
        ? new Set(presetBlocks)
        : null

    // mark initialized; we’ll still populate allowedBlocks once we have a block list
    this.__initializedFromManifest = true
  }

  _refreshBlocksList() {
    const elementList = HAXStore && HAXStore.elementList ? HAXStore.elementList : null
    if (!elementList || typeof elementList !== 'object') {
      return
    }

    const blocks = []
    Object.keys(elementList).forEach((tag) => {
      const def = elementList[tag]
      if (!def || typeof def !== 'object') {
        return
      }
      let title = tag
      let category = 'Other'
      let tags = []
      const locked = REQUIRED_TEXT_PRIMITIVES_SET.has(tag)
      if (def.gizmo && typeof def.gizmo === 'object') {
        if (def.gizmo.title) {
          title = def.gizmo.title
        }
        if (Array.isArray(def.gizmo.tags) && def.gizmo.tags.length > 0) {
          tags = def.gizmo.tags
          category = def.gizmo.tags[0] || category
        }
      }
      // Ensure required text primitives show up in Writing group even if missing tags
      if (locked && category === 'Other') {
        category = 'Writing'
      }
      blocks.push({ tag, title, category, tags, locked })
    })

    // Keep stable grouping order aligned with HAX block panel: Writing first, Other last
    blocks.sort((a, b) => {
      const catA = a.category || 'Other'
      const catB = b.category || 'Other'
      const c = this._compareCategories(catA, catB)
      if (c !== 0) return c

      // Locked text primitives should appear first (in the requested order)
      if (a.locked && b.locked) {
        return (
          REQUIRED_TEXT_PRIMITIVES.indexOf(a.tag) -
          REQUIRED_TEXT_PRIMITIVES.indexOf(b.tag)
        )
      }
      if (a.locked) return -1
      if (b.locked) return 1

      if (a.title < b.title) return -1
      if (a.title > b.title) return 1
      return 0
    })

    this.blocks = blocks

    if (!this.__blocksInitialized) {
      // Default to all allowed blocks unless there was an explicit list
      if (this.__presetAllowedBlocks && this.__presetAllowedBlocks.size > 0) {
        const next = new Set()
        this.blocks.forEach((b) => {
          if (this.__presetAllowedBlocks.has(b.tag)) {
            next.add(b.tag)
          }
        })
        this.allowedBlocks = next
      } else {
        this.allowedBlocks = new Set(this.blocks.map((b) => b.tag))
      }
      this.__blocksInitialized = true
    }
  }

  _filteredBlocks() {
    if (!this.blocks || !this.blocks.length) {
      return []
    }
    const filter = (this.blockFilter || '').trim().toLowerCase()
    if (filter === '') {
      return this.blocks
    }

    // Always keep required primitives visible (even if filter doesn't match)
    const locked = this.blocks.filter((b) => b.locked)
    const matches = this.blocks.filter((b) => {
      const tag = b.tag.toLowerCase()
      const title = (b.title || '').toLowerCase()
      return tag.includes(filter) || title.includes(filter)
    })

    const seen = new Set()
    const res = []
    locked.forEach((b) => {
      seen.add(b.tag)
      res.push(b)
    })
    matches.forEach((b) => {
      if (!seen.has(b.tag)) {
        seen.add(b.tag)
        res.push(b)
      }
    })

    return res
  }

  _audienceChanged(e) {
    const value = e && e.target ? e.target.value : 'expert'
    this.audience = value
  }

  _featureChanged(e) {
    const key = e && e.target ? e.target.getAttribute('data-key') : null
    if (!key) return
    const checked = e.target.checked
    this.features = {
      ...this.features,
      [key]: checked,
    }
  }

  _blockChanged(e) {
    const tag = e && e.target ? e.target.getAttribute('data-tag') : null
    if (!tag) return

    // Required primitives are locked on; ignore toggles.
    if (REQUIRED_TEXT_PRIMITIVES_SET.has(tag)) {
      return
    }

    const checked = e.target.checked
    const next = new Set(this.allowedBlocks)
    if (checked) {
      next.add(tag)
    } else {
      next.delete(tag)
    }
    this.allowedBlocks = next
  }

  _blockFilterChanged(e) {
    this.blockFilter = e && e.target ? e.target.value : ''
  }

  _selectAllCmsFeatures() {
    const next = { ...this.features }
    FEATURE_DEFS.filter((f) => f.group === 'CMS').forEach((f) => {
      next[f.key] = true
    })
    this.features = next
  }

  _deselectAllCmsFeatures() {
    const next = { ...this.features }
    FEATURE_DEFS.filter((f) => f.group === 'CMS').forEach((f) => {
      next[f.key] = false
    })
    this.features = next
  }

  _selectAllEditorFeatures() {
    const next = { ...this.features }
    FEATURE_DEFS.filter((f) => f.group === 'Editor').forEach((f) => {
      next[f.key] = true
    })
    this.features = next
  }

  _deselectAllEditorFeatures() {
    const next = { ...this.features }
    FEATURE_DEFS.filter((f) => f.group === 'Editor').forEach((f) => {
      next[f.key] = false
    })
    this.features = next
  }

  _selectAllBlocks() {
    this.allowedBlocks = new Set(this.blocks.map((b) => b.tag))
  }

  _deselectAllBlocks() {
    const next = new Set()
    this.blocks.forEach((b) => {
      if (b.locked) {
        next.add(b.tag)
      }
    })
    this.allowedBlocks = next
  }

  _selectAllBlocksInCategory(e) {
    const category = e && e.currentTarget ? e.currentTarget.dataset.category : null
    if (!category) return

    const next = new Set(this.allowedBlocks)
    this.blocks.forEach((b) => {
      if (b.category === category && !b.locked) {
        next.add(b.tag)
      }
    })
    this.allowedBlocks = next
  }

  _deselectAllBlocksInCategory(e) {
    const category = e && e.currentTarget ? e.currentTarget.dataset.category : null
    if (!category) return

    const next = new Set(this.allowedBlocks)
    this.blocks.forEach((b) => {
      if (b.category === category && !b.locked) {
        next.delete(b.tag)
      }
    })
    this.allowedBlocks = next
  }

  _compareCategories(a, b) {
    const catA = a || 'Other'
    const catB = b || 'Other'

    // Writing / Text first, Other last, then alphabetical
    const first = ['Writing', 'Text']
    const last = ['Other']

    if (first.includes(catA) && !first.includes(catB)) return -1
    if (!first.includes(catA) && first.includes(catB)) return 1

    if (last.includes(catA) && !last.includes(catB)) return 1
    if (!last.includes(catA) && last.includes(catB)) return -1

    if (first.includes(catA) && first.includes(catB)) {
      return first.indexOf(catA) - first.indexOf(catB)
    }

    if (catA < catB) return -1
    if (catA > catB) return 1
    return 0
  }

  _groupBlocksByCategory(blocks) {
    const groupMap = {}
    ;(blocks || []).forEach((b) => {
      const cat = b.category || 'Other'
      if (!groupMap[cat]) {
        groupMap[cat] = []
      }
      groupMap[cat].push(b)
    })

    const cats = Object.keys(groupMap)
    cats.sort((a, b) => this._compareCategories(a, b))

    return cats.map((category) => ({
      category,
      blocks: groupMap[category],
    }))
  }

  _platformConfigForExport() {
    const features = {}
    DEFAULT_SUPPORTED_FEATURES.forEach((key) => {
      features[key] = this.features && this.features[key] !== false
    })

    const allowedBlocks = Array.from(this.allowedBlocks || []).filter(
      (tag) => !REQUIRED_TEXT_PRIMITIVES_SET.has(tag),
    )

    return {
      audience: this.audience || 'expert',
      features,
      allowedBlocks: allowedBlocks.sort(),
    }
  }

  async _download() {
    try {
      this.busy = true
      // Load generator on demand
      const { SiteSkeletonGenerator } = await import(
        '../utils/site-skeleton-generator.js'
      )

      const skeleton = await SiteSkeletonGenerator.generateFromCurrentSite(true)

      const platformConfig = this._platformConfigForExport()
      if (!skeleton._skeleton) {
        skeleton._skeleton = {}
      }
      if (!skeleton._skeleton.originalMetadata) {
        skeleton._skeleton.originalMetadata = {}
      }
      skeleton._skeleton.originalMetadata.platform = platformConfig

      // Ensure settings exist as well (some consumers key off site.settings)
      if (!skeleton._skeleton.originalSettings) {
        skeleton._skeleton.originalSettings = {}
      }

      SiteSkeletonGenerator.downloadSkeleton(skeleton)

      HAXStore.toast(this.t.generated, 3000, {}, 'fit-bottom')

      // close modal
      this.dispatchEvent(
        new CustomEvent('simple-modal-hide', {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: false,
        }),
      )
    } catch (error) {
      console.error('Skeleton export failed:', error)
      HAXStore.toast(
        `Skeleton export failed: ${error.message}`,
        5000,
        {},
        'fit-bottom',
      )
    }

    this.busy = false
  }

  _cancel() {
    this.dispatchEvent(
      new CustomEvent('simple-modal-hide', {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: false,
      }),
    )
  }
}

globalThis.customElements.define(HAXCMSSitePlatformUI.tag, HAXCMSSitePlatformUI)
export { HAXCMSSitePlatformUI }
