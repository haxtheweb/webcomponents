import { html, css } from 'lit'
import { autorun, toJS } from 'mobx'
import { DDD } from '@haxtheweb/d-d-d/d-d-d.js'
import { HAXStore } from '@haxtheweb/hax-body/lib/hax-store.js'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { HAXCMSI18NMixin } from '../utils/HAXCMSI18NMixin.js'
import '@haxtheweb/simple-icon/lib/simple-icon-button-lite.js'
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import '@haxtheweb/hax-body/lib/hax-text-editor-toolbar.js'

const FEATURE_DEFS = [
  {
    key: 'addPage',
    label: 'Add pages',
    icon: 'hax:add-page',
    group: 'CMS',
  },
  {
    key: 'deletePage',
    label: 'Delete pages',
    icon: 'icons:delete',
    group: 'CMS',
  },
  {
    key: 'outlineDesigner',
    label: 'Outline designer',
    icon: 'hax:site-map',
    group: 'CMS',
  },
  {
    key: 'styleGuide',
    label: 'Style guide',
    icon: 'lrn:palette',
    group: 'CMS',
  },
  {
    key: 'insights',
    label: 'Insights',
    icon: 'hax:clipboard-pulse',
    group: 'CMS',
  },
  {
    key: 'manifest',
    label: 'Site settings',
    icon: 'hax:home-edit',
    group: 'CMS',
  },
  {
    key: 'pageBreak',
    label: 'Edit Page Details',
    icon: 'hax:page-edit',
    group: 'CMS',
  },
  {
    key: 'addBlock',
    label: 'Add blocks',
    icon: 'hax:add-brick',
    group: 'HAX',
  },
  {
    key: 'contentMap',
    label: 'Page structure (content map)',
    icon: 'hax:newspaper',
    group: 'HAX',
  },
  {
    key: 'viewSource',
    label: 'View source',
    icon: 'hax:html-code',
    group: 'HAX',
  },
  {
    key: 'onlineSearch',
    label: 'Online search',
    icon: 'hax:add-page',
    group: 'HAX',
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
      haxBlocks: { type: Object },
      allowedBlocks: { type: Object },
      blockFilter: { type: String, attribute: 'block-filter' },
      busy: { type: Boolean, reflect: true },
      pageCount: { type: Number, attribute: 'page-count' },
      platformConfig: { type: Object },
    }
  }

  constructor() {
    super()
    this.audience = 'expert'
    this.audienceOptions = [
      { value: 'novice', label: 'Novice' },
      { value: 'expert', label: 'Expert' },
    ];
    this.features = {};
    this.haxBlocks = {};
    this.allowedBlocks = new Set()
    this.blockFilter = ''
    this.busy = false
    this.pageCount = 0
    this.platformConfig = {};

    this.__disposer = []

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
          display: flex;
          flex-direction: column;
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
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }

        .audience-content {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
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

        .block-search {
          flex: 7;
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

        details {
          min-width: 100%;
          box-sizing: border-box;
        }

        summary .section-title {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
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
      this.features = toJS(HAXStore.platformConfig.features);
      
      const currentGizmos = toJS(HAXStore.gizmoList)
      this.haxBlocks = currentGizmos.filter(item => 
        !(item.meta && (item.meta.inlineOnly || item.meta.hidden || item.meta.requiresParent))
      );
      console.log(this.haxBlocks)
      this.__disposer.push(reaction)
    })

    // this.__haxRegisterPropertiesHandler = () => {
    //   this._refreshBlocksList()
    // }
    // globalThis.addEventListener(
    //   'hax-register-properties',
    //   this.__haxRegisterPropertiesHandler,
    // )

    // // Delay initial block list until HAXStore has had a chance to register
    // setTimeout(() => {
    //   this._refreshBlocksList()
    // }, 0)
  }

  disconnectedCallback() {
    while (this.__disposer.length) {
      const d = this.__disposer.pop()
      if (d && typeof d.dispose === 'function') {
        d.dispose()
      }
    }
    // if (this.__haxRegisterPropertiesHandler) {
    //   globalThis.removeEventListener(
    //     'hax-register-properties',
    //     this.__haxRegisterPropertiesHandler,
    //   )
    // }
    super.disconnectedCallback()
  }

  render() {
    const cmsFeatures = FEATURE_DEFS.filter((f) => f.group === 'CMS')
    const editorFeatures = FEATURE_DEFS.filter((f) => f.group === 'HAX')

    const toggleableTotal = this.haxBlocks
      ? this.haxBlocks.filter((b) => !b.gizmoList).length
      : 0
    const toggleableSelected = this.haxBlocks
      ? this.haxBlocks.filter((b) => HAXStore.requiredPrimitives.has(b.tag) || this.allowedBlocks.has(b.tag)).length
      : 0

    let toolbarImgPath = new URL(`./assets/${this.audience.toLowerCase()}.png`, import.meta.url).href
    return html`
      <h2>${this.t.title}</h2>

      <div class="row">
        <div class="section">
          <!-- <div class="audience"> -->
            <div class="audience-content">
            <div class="audience-selector">
            <label for="audience">${this.t.experienceLevel}</label>
            <select id="audience" @change="${this._audienceChanged}">
              ${this.audienceOptions.map(
                (opt) => html`<option value="${opt.value}" ?selected=${
                  this.audience === opt.value}>
                  ${opt.label}
                </option>`,
              )}
            </select>
            </div>
            <img class="toolbar-img" src=${toolbarImgPath}>
            </div>
            ${this.pageCount > 20
              ? html`<div class="note">${this.t.largeSiteWarning}</div>`
              : ''}
          <!-- </div> -->
            </div>

        <details class="section" open>
          <summary class="section-title">
            <h3>${this.t.cmsFeatures}</h3>
          </summary>
          <div class="controls-container">
            <fieldset class="check-grid cms-container">
              ${cmsFeatures.map((f) => this._renderFeatureCheckbox(f))}
            </fieldset>
            <div class="controls">
              <simple-icon-button-lite
                icon="icons:select-all"
                label="${this.t.selectAll}"
                title="${this.t.selectAll}"
                data-category="cms"
                @click="${this._selectAll}"
              >Select All</simple-icon-button-lite>
              <simple-icon-button-lite
                icon="icons:select-all"
                label="${this.t.deselectAll}"
                title="${this.t.deselectAll}"
                data-category="cms"
                @click="${this._deselectAll}"
              >Deselect All</simple-icon-button-lite>
            </div>
          </div>
        </details>

        <details class="section">
          <summary class="section-title">
            <h3>${this.t.editorFeatures}</h3>
          </summary>
          <div class="controls-container">
            <fieldset class="check-grid hax-container">
              ${editorFeatures.map((f) => this._renderFeatureCheckbox(f))}
            </fieldset>
            <div class="controls">
              <simple-icon-button-lite
                icon="icons:select-all"
                label="${this.t.selectAll}"
                title="${this.t.selectAll}"
                data-category="hax"
                @click="${this._selectAll}"
              >Select All</simple-icon-button-lite>
              <simple-icon-button-lite
                icon="icons:select-all"
                label="${this.t.deselectAll}"
                title="${this.t.deselectAll}"
                data-category="hax"
                @click="${this._deselectAll}"
              >Deselect All</simple-icon-button-lite>
            </div>
          </div>
        </details>

        <details class="section">
          <summary class="section-title">
            <h3>${this.t.blocks}</h3>
            </summary>

          <div class="blocks-meta">
            <div class="block-search">
              <label for="blockFilter">Filter: </label>
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
              >Select All</simple-icon-button-lite>
              <simple-icon-button-lite
                icon="icons:select-all"
                label="${this.t.deselectAll}"
                title="${this.t.deselectAll}"
                data-category="all-blocks"
                @click="${this._deselectAll}"
              >Deselect All</simple-icon-button-lite>
            </div>
          </div>

          <div class="note">
            ${toggleableSelected} selected / ${toggleableTotal} available
            ${HAXStore.requiredPrimitives.size
              ? html`<span> • ${this.t.requiredTextNote}</span>`
              : ''}
          </div>

          <div class="blocks-list">
            ${this._groupBlocksByCategory(this.haxBlocks).map(
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
                      >Select All</simple-icon-button-lite>
                      <simple-icon-button-lite
                        icon="icons:select-all"
                        label="${this.t.deselectAll}"
                        title="${this.t.deselectAll}"
                        data-category=${group.category.toLowerCase()}
                        @click="${this._deselectAll}"
                      >Deselect All</simple-icon-button-lite>
                    </div>
                  </div>
                </details>
              `,
            )}
          </div>
          </details>
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

  _renderFeatureCheckbox(item) {
    const checked = store.platformAllows(item.key) 
    return html`
      <label class="check">
        <input
          type="checkbox"
          data-key="${item.key}"
          .checked=${checked}
          @change=${this._checkboxChanged}
        /> <simple-icon-lite icon=${item.icon}></simple-icon-lite>
        <span>${item.label}</span>
      </label>
    `
  }

  _renderBlockCheckbox(item) {
    const isDisabled = HAXStore.requiredPrimitives.has(item.tag) ? true : false;
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

  _audienceChanged(e) {
    const value = e && e.target ? e.target.value : 'expert'
    this.audience = value
  }

  _checkboxChanged(e){
    const input = e.currentTarget;
    if (!input || input.type !== 'checkbox') return;
    const { key, tag } = input.dataset;

    if(key){
      this.features = {
        ...this.features,
        [key]: e.target.checked,
      }
console.log(this.features)
      return;
    }
    
    if(tag) {
      // Required primitives are locked on; ignore toggles.
      if (HAXStore.requiredPrimitives.has(tag)) return;

      if (e.target.checked) {
        this.allowedBlocks.add(tag)
      } else {
        this.allowedBlocks.delete(tag)
      }
      this.requestUpdate();
      console.log(this.allowedBlocks)
      return;
    }
  }

  _blockFilterChanged(e) {
    this.blockFilter = e && e.target ? e.target.value : ''
  }

  _selectAll(e){
    const category = e && e.target ? e.target.getAttribute('data-category') : null
    switch(category){
      case "cms": {
        const tmpFeatures = { ...this.features }
        FEATURE_DEFS.filter((feat) => feat.group === "CMS").forEach((feat) => {
          tmpFeatures[feat.key] = true
        })
        this.features = tmpFeatures
        console.log(this.features)
        const container = this.shadowRoot.querySelector(`.${category}-container`);
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((item) => {
          item.checked = true;
        });
        break;
      }
      case "hax": {
        const tmpFeatures = { ...this.features }
        FEATURE_DEFS.filter((feat) => feat.group === "HAX").forEach((feat) => {
          tmpFeatures[feat.key] = true
        })
        this.features = tmpFeatures
        console.log(this.features)
        const container = this.shadowRoot.querySelector(`.${category}-container`);
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((item) => {
          item.checked = true;
        });
        break;
      }
      case "all-blocks": {
        this.allowedBlocks = new Set(this.haxBlocks.filter(item => !HAXStore.requiredPrimitives.has(item.tag)).map(item => item.tag));
        const container = this.shadowRoot.querySelector(`.blocks-list`);
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((item) => {
          item.checked = true;
        });
        break;
      }
      // Any sub-category of blocks (i.e., Writing, Instructional, etc.)
      default: {
        const container = this.shadowRoot.querySelector(`.${category}-container`);
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((item) => {
          if(HAXStore.requiredPrimitives.has(item.dataset.tag)) return;

          this.allowedBlocks.add(item.dataset.tag);
          item.checked = true;
        });
        this.requestUpdate();
        break;
      }
    }
  }

  _deselectAll(e){
    const category = e && e.target ? e.target.getAttribute('data-category') : null
    switch(category){
      case "cms": {
        const tmpFeatures = { ...this.features }
        FEATURE_DEFS.filter((feat) => feat.group === "CMS").forEach((feat) => {
          tmpFeatures[feat.key] = false
        })
        this.features = tmpFeatures
        console.log(this.features)
        const container = this.shadowRoot.querySelector(`.${category}-container`);
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((item) => {
          item.checked = false;
        });
        break;
      }
      case "hax": {
        const tmpFeatures = { ...this.features }
        FEATURE_DEFS.filter((feat) => feat.group === "HAX").forEach((feat) => {
          tmpFeatures[feat.key] = false
        })
        this.features = tmpFeatures
        console.log(this.features)
        const container = this.shadowRoot.querySelector(`.${category}-container`);
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((item) => {
          item.checked = false;
        });
        break;
      }
      case "all-blocks": {
        this.allowedBlocks = new Set([]);
        const container = this.shadowRoot.querySelector(`.blocks-list`);
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((item) => {
          if(HAXStore.requiredPrimitives.has(item.dataset.tag)) return;
          item.checked = false;
        });
        break;
      }
      // Any sub-category of blocks (i.e., Writing, Instructional, etc.)
      default: {
        const container = this.shadowRoot.querySelector(`.${category}-container`);
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((item) => {
          if(HAXStore.requiredPrimitives.has(item.dataset.tag)) return;

          this.allowedBlocks.delete(item.dataset.tag);
          item.checked = false;
        });
        this.requestUpdate();
        break;
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
    const groupMap = {}
    items.forEach((item) => {
      const required = HAXStore.requiredPrimitives.has(item.tag);
      let category = "Other"
      if(Array.isArray(item.tags) && item.tags.length > 0){
        category = item.tags[0]
      }
      // Ensure required text primitives show up in Writing group even if missing tags
      if (required && category === "Other"){
        category = "Writing"
      }

      if (!groupMap[category]) {
        groupMap[category] = []
      }
      groupMap[category].push(item)
    });

    const categories = Object.keys(groupMap)
    categories.sort((a, b) => this._compareCategories(a, b))
    
    return categories.map((category) => ({
      category,
      blocks: groupMap[category],
    }))
  }

  _platformConfigForExport() {
    const allowedBlocks = Array.from(this.allowedBlocks || []).filter(
      (tag) => !HAXStore.requiredPrimitives.has(tag),
    )

    return {
      audience: this.audience,
      features: this.features,
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
