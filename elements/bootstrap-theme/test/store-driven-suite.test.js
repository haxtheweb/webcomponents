import { fixture, expect, html } from '@open-wc/testing'
import { LitElement, html as litHtml } from 'lit'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { DesignSystemManager } from '@haxtheweb/d-d-d/lib/DesignSystemManager.js'
import { adoptBootstrapStylesheet } from '../lib/BootstrapStylesheetManager.js'
import { registerBootstrapStyleGuideAuthoring } from '../lib/BootstrapStyleGuideAuthoring.js'
import { BootstrapUserStylesMenuMixin } from '../lib/BootstrapUserStylesMenuMixin.js'
import '../bootstrap-theme.js'

// direct lib imports so istanbul sees every lib file (invisible-lib rule)
import '../lib/BootstrapBreadcrumb.js'
import '../lib/BootstrapFooter.js'
import '../lib/BootstrapSearch.js'
import '../lib/BootstrapDesignSystemStyles.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// file level store fixture + restore (stub/restore singleton pattern)
const savedManifest = store.manifest
const savedActiveId = store.activeId
const savedDarkMode = store.darkMode
const savedHaxStore = globalThis.HaxStore

// controlled HaxStore stub so integration context reads are predictable
const defaultFakeHaxStore = {
  editMode: false,
  elementList: {},
  isInlineElement: () => false,
  designSystemHAXProperties: (props) => props,
}
globalThis.HaxStore = { requestAvailability: () => defaultFakeHaxStore }

store.darkMode = false
store.manifest = {
  title: 'Store Site',
  metadata: { author: { image: 'assets/author.png' } },
  items: [
    {
      id: 'home',
      title: 'Home page',
      slug: 'home',
      location: 'index.html',
      metadata: {},
    },
    {
      id: 'parent-page',
      title: 'Parent page',
      slug: 'parent-page',
      parent: 'home',
      location: 'parent.html',
      metadata: {},
    },
    {
      id: 'child-page',
      title: 'Child page',
      slug: 'child-page',
      parent: 'parent-page',
      location: 'child.html',
      metadata: {},
    },
  ],
}

after(() => {
  store.manifest = savedManifest
  store.activeId = savedActiveId
  store.darkMode = savedDarkMode
  if (savedHaxStore === undefined) {
    delete globalThis.HaxStore
  } else {
    globalThis.HaxStore = savedHaxStore
  }
  ;[
    'haxcms-bootstrap-userPref-fontSize',
    'haxcms-bootstrap-userPref-fontFamily',
    'haxcms-bootstrap-userPref-colorTheme',
  ].forEach((k) => localStorage.removeItem(k))
})

describe('bootstrap-theme store-driven content', () => {
  let element
  beforeEach(async () => {
    store.activeId = 'child-page'
    element = await fixture(html`<bootstrap-theme></bootstrap-theme>`)
    await element.updateComplete
  })

  it('derives site title, image, page title and manifest index from the store', async () => {
    await wait(80)
    expect(element.__siteTitle).to.equal('Store Site')
    expect(element.__siteImage).to.equal('assets/author.png')
    expect(element.__pageTitle).to.equal('Child page')
    expect(element.activeManifestIndex).to.equal(2)
    // derived fields are plain properties; nudge a render to see them in DOM
    element.requestUpdate()
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('.site-title h4').textContent,
    ).to.equal('Store Site')
    expect(
      element.shadowRoot.querySelector('.site-img').getAttribute('src'),
    ).to.equal('assets/author.png')
    expect(
      element.shadowRoot.querySelector('.page-title').textContent,
    ).to.equal('Child page')
  })

  it('follows active page changes through the store', async () => {
    await wait(80)
    store.activeId = 'parent-page'
    await wait(80)
    expect(element.__pageTitle).to.equal('Parent page')
    expect(element.activeManifestIndex).to.equal(1)
    store.activeId = 'home'
    await wait(80)
    expect(element.__pageTitle).to.equal('Home page')
    expect(element.activeManifestIndex).to.equal(0)
  })
})

describe('bootstrap-breadcrumb store-driven trail', () => {
  let bc
  beforeEach(async () => {
    store.activeId = 'child-page'
    bc = await fixture(html`<bootstrap-breadcrumb></bootstrap-breadcrumb>`)
    await bc.updateComplete
  })

  it('takes its home item from the first manifest item', async () => {
    await wait(80)
    expect(bc.homeItem.id).to.equal('home')
    expect(bc.homeItem.title).to.equal('Home page')
  })

  it('builds the crumb trail from the active item up through parents', async () => {
    await wait(80)
    expect(bc.items.length).to.equal(3)
    expect(bc.items[0].id).to.equal('home')
    expect(bc.items[1].id).to.equal('parent-page')
    expect(bc.items[2].id).to.equal('child-page')
    bc.requestUpdate()
    await bc.updateComplete
    const lis = bc.shadowRoot.querySelectorAll(
      'ol.breadcrumb li.breadcrumb-item',
    )
    // home li plus the three crumbs
    expect(lis.length).to.equal(4)
    const last = lis[lis.length - 1]
    expect(last.classList.contains('active')).to.equal(true)
    expect(last.querySelector('span').textContent).to.equal('Child page')
    // BUG(bootstrap-theme/lib/BootstrapBreadcrumb.js:233): the
    // ${isLast ? 'aria-current="page"' : ''} string interpolation in
    // attribute-name position renders nothing in Lit 3, so the current crumb
    // never announces itself to assistive tech. Flip this assertion when the
    // source is fixed.
    expect(last.getAttribute('aria-current') === null).to.equal(true)
    const parentLink = lis[2].querySelector('a')
    expect(parentLink.getAttribute('aria-label')).to.equal(
      'Navigate to Parent page',
    )
    expect(parentLink.getAttribute('href')).to.equal('parent-page')
    const homeLink = lis[0].querySelector('a')
    expect(homeLink.getAttribute('aria-label')).to.equal(
      'Navigate to home page',
    )
    // the home icon is decorative with a visually hidden label
    expect(lis[0].querySelector('span.visually-hidden').textContent).to.equal(
      'Home',
    )
  })

  it('getParentById resolves items and returns null without a manifest', () => {
    expect(bc.getParentById('child-page').id).to.equal('child-page')
    const saved = store.manifest
    store.manifest = null
    expect(bc.getParentById('child-page') === null).to.equal(true)
    store.manifest = saved
  })

  it('addParentToItems stops when the parent id cannot be resolved', () => {
    bc.items = []
    bc.addParentToItems({ id: 'x', title: 'X', parent: 'does-not-exist' })
    expect(bc.items.length).to.equal(0)
  })

  it('addParentToItems walks the whole ancestor chain', () => {
    bc.items = []
    bc.addParentToItems(store.manifest.items[2])
    expect(bc.items.length).to.equal(2)
    expect(bc.items[0].id).to.equal('home')
    expect(bc.items[1].id).to.equal('parent-page')
  })
})

describe('bootstrap-footer store-driven pagination', () => {
  const makeFooter = async () => {
    const footer = await fixture(html`<bootstrap-footer></bootstrap-footer>`)
    await footer.updateComplete
    return footer
  }

  it('renders prev/next links around the active page', async () => {
    store.activeId = 'parent-page'
    const footer = await makeFooter()
    await wait(80)
    expect(footer._backwardItem.id).to.equal('home')
    expect(footer._forwardItem.id).to.equal('child-page')
    footer.requestUpdate()
    await footer.updateComplete
    const back = footer.shadowRoot.querySelector('a.backward')
    expect(back.getAttribute('aria-label')).to.equal(
      'Go to previous page: Home page',
    )
    expect(back.getAttribute('href')).to.equal('home')
    const fwd = footer.shadowRoot.querySelector('a.forward')
    expect(fwd.getAttribute('aria-label')).to.equal(
      'Go to next page: Child page',
    )
  })

  it('hides the backward link on the first page', async () => {
    store.activeId = 'home'
    const footer = await makeFooter()
    await wait(80)
    footer.requestUpdate()
    await footer.updateComplete
    expect(footer.shadowRoot.querySelector('a.backward') === null).to.equal(
      true,
    )
    expect(footer._forwardItem.id).to.equal('parent-page')
  })

  it('hides the forward link on the last page', async () => {
    store.activeId = 'child-page'
    const footer = await makeFooter()
    await wait(80)
    footer.requestUpdate()
    await footer.updateComplete
    expect(footer.shadowRoot.querySelector('a.forward') === null).to.equal(
      true,
    )
    expect(footer._backwardItem.id).to.equal('parent-page')
  })

  // BUG(bootstrap-theme/lib/BootstrapFooter.js:164-179): _backwardItem and
  // _forwardItem are only ever assigned when the neighbor exists and are
  // never cleared otherwise, so navigating to a boundary page on a live
  // footer keeps the previous page's neighbor link rendered.
  it('keeps a stale backward link when moving to the first page', async () => {
    store.activeId = 'parent-page'
    const footer = await makeFooter()
    await wait(80)
    store.activeId = 'home'
    await wait(80)
    footer.requestUpdate()
    await footer.updateComplete
    expect(footer._backwardItem.id).to.equal('home')
    expect(footer.shadowRoot.querySelector('a.backward') === null).to.equal(
      false,
    )
    // the forward link also stays stale after moving to the last page
    store.activeId = 'child-page'
    await wait(80)
    footer.requestUpdate()
    await footer.updateComplete
    expect(footer._forwardItem.id).to.equal('parent-page')
  })
})

describe('bootstrap-search events', () => {
  let bs
  beforeEach(async () => {
    bs = await fixture(html`<bootstrap-search></bootstrap-search>`)
    await bs.updateComplete
  })

  it('input updates searchText and fires search-changed', () => {
    let detail = null
    bs.addEventListener('search-changed', (e) => {
      detail = e.detail
    })
    const input = bs.shadowRoot.querySelector('#bootstrap-search-input')
    input.value = 'hello world'
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    expect(bs.searchText).to.equal('hello world')
    expect(detail.searchText).to.equal('hello world')
  })

  it('Escape clears the input and fires search-changed with empty text', () => {
    let detail = null
    bs.addEventListener('search-changed', (e) => {
      detail = e.detail
    })
    const input = bs.shadowRoot.querySelector('#bootstrap-search-input')
    input.value = 'to clear'
    input.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
      }),
    )
    expect(bs.searchText).to.equal('')
    expect(detail.searchText).to.equal('')
    expect(input.value).to.equal('')
  })

  it('submit is prevented so the form never navigates', () => {
    let prevented = false
    bs.handleSubmit({ preventDefault: () => (prevented = true) })
    expect(prevented).to.equal(true)
  })

  it('renders a labelled search form', () => {
    expect(
      bs.shadowRoot.querySelector('form[role="search"]') === null,
    ).to.equal(false)
    const label = bs.shadowRoot.querySelector(
      'label[for="bootstrap-search-input"]',
    )
    expect(label.textContent.trim()).to.equal('Search site content')
    const input = bs.shadowRoot.querySelector('#bootstrap-search-input')
    expect(input.getAttribute('aria-label')).to.equal('Search site content')
    expect(input.getAttribute('aria-describedby')).to.equal(
      'search-instructions',
    )
    expect(
      bs.shadowRoot.querySelector('#search-instructions') === null,
    ).to.equal(false)
  })
})

describe('BootstrapUserStylesMenuMixin behavior', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`<bootstrap-theme></bootstrap-theme>`)
    await element.updateComplete
  })

  it('wires the popover to its trigger on first update', () => {
    const menu = element.shadowRoot.querySelector('#haxcmsuserstylesmenu')
    const trigger = element.shadowRoot.querySelector(
      '#haxcmsuserstylesmenupopover',
    )
    expect(menu.target === trigger).to.equal(true)
    expect(element.hideUserStylesMenu).to.equal(true)
  })

  it('toggleUserStylesMenu flips menu visibility', () => {
    element.toggleUserStylesMenu()
    expect(element.hideUserStylesMenu).to.equal(false)
    element.toggleUserStylesMenu()
    expect(element.hideUserStylesMenu).to.equal(true)
  })

  it('entering edit mode closes the menu', async () => {
    element.hideUserStylesMenu = false
    element.editMode = true
    await element.updateComplete
    expect(element.hideUserStylesMenu).to.equal(true)
  })

  it('font size buttons move the scale and persist it', () => {
    element.fontSize = 2
    element.UserStylesSizeDown()
    expect(element.fontSize).to.equal(1)
    expect(
      localStorage.getItem('haxcms-bootstrap-userPref-fontSize'),
    ).to.equal('1')
    element.UserStylesSizeUp()
    expect(element.fontSize).to.equal(2)
    element.fontSize = 0
    element.UserStylesSizeDown()
    expect(element.fontSize).to.equal(0)
    element.fontSize = 4
    element.UserStylesSizeUp()
    expect(element.fontSize).to.equal(4)
  })

  it('font family buttons persist the selection', () => {
    element.UserStylesFontFamilyChange({
      composedPath: () => [
        { tagName: 'BUTTON', getAttribute: () => '1' },
      ],
    })
    expect(element.fontFamily).to.equal(1)
    expect(
      localStorage.getItem('haxcms-bootstrap-userPref-fontFamily'),
    ).to.equal('1')
    element.fontFamily = 0
    element.UserStylesFontFamilyChange({
      composedPath: () => [globalThis.document.body],
    })
    expect(element.fontFamily).to.equal(0)
  })

  it('theme color buttons persist the selection', () => {
    element.UserStylesColorThemeChange({
      composedPath: () => [
        { tagName: 'BUTTON', getAttribute: () => '2' },
      ],
    })
    expect(element.colorTheme).to.equal(2)
    expect(
      localStorage.getItem('haxcms-bootstrap-userPref-colorTheme'),
    ).to.equal('2')
    // no button in the path is a no-op
    element.UserStylesColorThemeChange({ composedPath: () => [] })
    expect(element.colorTheme).to.equal(2)
  })

  it('outside clicks close an open user styles menu', () => {
    const menu = element.shadowRoot.querySelector('#haxcmsuserstylesmenu')
    element.hideUserStylesMenu = false
    element.checkUserStylesMenuOpen({
      composedPath: () => [globalThis.document.body, element],
    })
    expect(element.hideUserStylesMenu).to.equal(true)
    // clicks inside the menu keep it open
    element.hideUserStylesMenu = false
    element.checkUserStylesMenuOpen({ composedPath: () => [menu, element] })
    expect(element.hideUserStylesMenu).to.equal(false)
    // clicks on any button keep it open
    element.checkUserStylesMenuOpen({
      composedPath: () => [{ tagName: 'BUTTON' }],
    })
    expect(element.hideUserStylesMenu).to.equal(false)
    // clicks on the trigger itself keep it open
    element.checkUserStylesMenuOpen({
      composedPath: () => [element.toggleUserStylesMenuTarget, element],
    })
    expect(element.hideUserStylesMenu).to.equal(false)
  })

  it('store dark mode switches the theme to dark and back', async () => {
    localStorage.removeItem('haxcms-bootstrap-userPref-colorTheme')
    store.darkMode = true
    await wait(80)
    expect(element.colorTheme).to.equal(1)
    store.darkMode = false
    await wait(80)
    expect(element.colorTheme).to.equal(0)
  })

  it('an explicit light preference resets a dark scheme to light', async () => {
    localStorage.setItem('haxcms-bootstrap-userPref-colorTheme', '1')
    // the autorun only re-fires on an actual darkMode change
    store.darkMode = true
    await wait(80)
    store.darkMode = false
    await wait(80)
    expect(element.colorTheme).to.equal(0)
    localStorage.removeItem('haxcms-bootstrap-userPref-colorTheme')
  })

  it('without a stored preference the local value is used as-is', async () => {
    localStorage.removeItem('haxcms-bootstrap-userPref-colorTheme')
    store.darkMode = true
    await wait(80)
    store.darkMode = false
    await wait(80)
    expect(element.colorTheme).to.equal(0)
  })

  it('falls back to a direct stylesheet path when no vendor resolver exists', () => {
    localStorage.removeItem('haxcms-bootstrap-userPref-fontSize')
    localStorage.removeItem('haxcms-bootstrap-userPref-fontFamily')
    localStorage.removeItem('haxcms-bootstrap-userPref-colorTheme')
    class PlainUserStylesHost extends BootstrapUserStylesMenuMixin(
      LitElement,
    ) {
      static get tag() {
        return 'plain-user-styles-host'
      }
      render() {
        return litHtml`<div>plain</div>`
      }
    }
    globalThis.customElements.define(
      PlainUserStylesHost.tag,
      PlainUserStylesHost,
    )
    const el = new PlainUserStylesHost()
    expect(el._bootstrapPath.includes('bootstrap.min.css')).to.equal(true)
    expect(el.fontSize).to.equal(1)
    expect(el.fontFamily).to.equal(0)
    expect(el.colorTheme).to.equal(0)
  })
})

describe('BootstrapStyleGuideAuthoring registration', () => {
  const makeStore = (extra) =>
    Object.assign(
      {
        elementList: {},
        isInlineElement: () => false,
        designSystemHAXProperties: (props) => props,
      },
      extra,
    )
  const install = (st) => {
    globalThis.HaxStore = { requestAvailability: () => st }
  }

  it('wraps designSystemHAXProperties and injects bootstrap sections', () => {
    const st = makeStore({
      elementList: { 'media-image': { settings: { configure: [] } } },
    })
    install(st)
    registerBootstrapStyleGuideAuthoring({ manager: { active: 'bootstrap' } })
    expect(st.__bootstrapStyleGuideAuthoringApplied).to.equal(true)
    const out = st.designSystemHAXProperties(
      { settings: { configure: [] } },
      'media-image',
    )
    const collapse = out.settings.configure.find(
      (s) => s.property === 'bootstrap-styles',
    )
    expect(collapse === undefined).to.equal(false)
    expect(collapse.inputMethod).to.equal('collapse')
    expect(collapse.title).to.equal('Bootstrap styles')
    expect(collapse.properties.map((s) => s.title).join(',')).to.equal(
      'Layout,Spacing,Surface,Typography,Box appearance',
    )
    // the float field is only offered for media-image / img
    const layout = collapse.properties.find((s) => s.title === 'Layout')
    expect(
      layout.properties.map((p) => p.attribute).includes(
        'data-float-position',
      ),
    ).to.equal(true)
  })

  it('hides layout and spacing for inline-only gizmos', () => {
    const st = makeStore({ isInlineElement: () => true })
    install(st)
    registerBootstrapStyleGuideAuthoring({ manager: { active: 'bootstrap' } })
    const out = st.designSystemHAXProperties(
      { gizmo: { meta: { inlineOnly: true } } },
      'some-tag',
    )
    const collapse = out.settings.configure.find(
      (s) => s.property === 'bootstrap-styles',
    )
    const titles = collapse.properties.map((s) => s.title)
    expect(titles.includes('Layout')).to.equal(false)
    expect(titles.includes('Spacing')).to.equal(false)
    expect(titles.includes('Surface')).to.equal(true)
  })

  it('designSystem false opts the element out entirely', () => {
    const st = makeStore({})
    install(st)
    registerBootstrapStyleGuideAuthoring({ manager: { active: 'bootstrap' } })
    const out = st.designSystemHAXProperties({ designSystem: false }, 'tag')
    expect(
      out.settings.configure.find((s) => s.property === 'bootstrap-styles') ===
        undefined,
    ).to.equal(true)
  })

  it('hideDefaultSettings drops layout and spacing but keeps the rest', () => {
    const st = makeStore({})
    install(st)
    registerBootstrapStyleGuideAuthoring({ manager: { active: 'bootstrap' } })
    const out = st.designSystemHAXProperties(
      { hideDefaultSettings: true },
      'tag',
    )
    const collapse = out.settings.configure.find(
      (s) => s.property === 'bootstrap-styles',
    )
    const titles = collapse.properties.map((s) => s.title)
    expect(titles.join(',')).to.equal('Surface,Typography,Box appearance')
  })

  it('skips sections when bootstrap is not the active system', () => {
    const st = makeStore({})
    install(st)
    registerBootstrapStyleGuideAuthoring({
      manager: { active: 'other-system' },
    })
    const out = st.designSystemHAXProperties(
      { settings: { configure: [{ property: 'other' }] } },
      'tag',
    )
    expect(out.settings.configure.length).to.equal(1)
    expect(
      out.settings.configure.find((s) => s.property === 'bootstrap-styles') ===
        undefined,
    ).to.equal(true)
  })

  it('recognizes activeSystem.name as bootstrap', () => {
    const st = makeStore({})
    install(st)
    registerBootstrapStyleGuideAuthoring({
      manager: { activeSystem: { name: 'bootstrap' } },
    })
    const out = st.designSystemHAXProperties({}, 'tag')
    expect(
      out.settings.configure.find((s) => s.property === 'bootstrap-styles') ===
        undefined,
    ).to.equal(false)
  })

  // BUG(bootstrap-theme/lib/BootstrapStyleGuideAuthoring.js:296): with no
  // payload.manager the code passes the globalThis.DesignSystemManager
  // HOLDER object into applyBootstrapAuthoring, so isBootstrapActiveSystem
  // sees neither .active nor .activeSystem on it and every bootstrap section
  // is skipped. The holder's singleton (via requestAvailability()) does have
  // active === 'bootstrap'. Documenting current behavior below.
  it('no-manager fallback skips sections (holder passed, not singleton)', () => {
    const st = makeStore({})
    install(st)
    registerBootstrapStyleGuideAuthoring({})
    const out = st.designSystemHAXProperties({}, 'tag')
    expect(
      out.settings.configure.find((s) => s.property === 'bootstrap-styles') ===
        undefined,
    ).to.equal(true)
  })

  it('null props pass straight through the wrapper', () => {
    const st = makeStore({})
    install(st)
    registerBootstrapStyleGuideAuthoring({ manager: { active: 'bootstrap' } })
    expect(st.designSystemHAXProperties(null, 'tag') === null).to.equal(true)
  })

  it('refreshes the element list when the active system changes', () => {
    const st = makeStore({
      elementList: { 'media-image': { settings: { configure: [] } } },
    })
    install(st)
    registerBootstrapStyleGuideAuthoring({ manager: { active: 'bootstrap' } })
    const collapse = () =>
      st.elementList['media-image'].settings.configure.filter(
        (s) => s.property === 'bootstrap-styles',
      )
    expect(collapse().length).to.equal(1)
    globalThis.dispatchEvent(new Event('design-system-active-changed'))
    expect(collapse().length).to.equal(1)
  })

  it('hax-store-ready applies to a store that arrives later', () => {
    const stA = makeStore({})
    install(stA)
    registerBootstrapStyleGuideAuthoring({ manager: { active: 'bootstrap' } })
    const stB = makeStore({})
    install(stB)
    globalThis.dispatchEvent(new Event('hax-store-ready'))
    expect(stB.__bootstrapStyleGuideAuthoringApplied).to.equal(true)
    const out = stB.designSystemHAXProperties({}, 'tag')
    expect(
      out.settings.configure.find((s) => s.property === 'bootstrap-styles') ===
        undefined,
    ).to.equal(false)
    // a second explicit registration is a no-op for the same store
    registerBootstrapStyleGuideAuthoring({
      manager: { active: 'bootstrap' },
    })
    expect(stB.designSystemHAXProperties === undefined).to.equal(false)
  })
})

describe('bootstrap design system integration', () => {
  it('registers bootstrap with the design system manager', () => {
    expect(DesignSystemManager.systems.bootstrap === undefined).to.equal(false)
    expect(DesignSystemManager.active).to.equal('bootstrap')
    const system = DesignSystemManager.systems.bootstrap
    expect(system.integrations.hax.exportName).to.equal(
      'registerBootstrapStyleGuideAuthoring',
    )
  })

  it('shouldLoad requires edit mode and authentication', () => {
    const shouldLoad = DesignSystemManager.systems.bootstrap.integrations.hax
      .shouldLoad
    expect(shouldLoad({ editMode: true })).to.equal(true)
    expect(shouldLoad({ editMode: false })).to.equal(false)
    expect(shouldLoad({ editMode: true, isAuthenticated: false })).to.equal(
      false,
    )
    expect(shouldLoad({})).to.equal(false)
  })

  it('loads the hax integration through the manager exactly once', async () => {
    const st = makeFreshStore()
    const saved = globalThis.HaxStore
    globalThis.HaxStore = { requestAvailability: () => st }
    await DesignSystemManager.loadSystemIntegration('bootstrap', 'hax', {
      editMode: true,
      isAuthenticated: true,
    })
    expect(st.__bootstrapStyleGuideAuthoringApplied).to.equal(true)
    // the integration is cached; a fresh store is left untouched
    const st2 = makeFreshStore()
    globalThis.HaxStore = { requestAvailability: () => st2 }
    await DesignSystemManager.loadSystemIntegration('bootstrap', 'hax', {
      editMode: true,
      isAuthenticated: true,
    })
    expect(st2.__bootstrapStyleGuideAuthoringApplied).to.equal(undefined)
    // edit mode off means the loader bails before the importer
    const st3 = makeFreshStore()
    globalThis.HaxStore = { requestAvailability: () => st3 }
    await DesignSystemManager.loadSystemIntegration('bootstrap', 'hax', {})
    expect(st3.__bootstrapStyleGuideAuthoringApplied).to.equal(undefined)
    globalThis.HaxStore = saved
  })
})

const makeFreshStore = () => ({
  elementList: {},
  isInlineElement: () => false,
  designSystemHAXProperties: (props) => props,
})

describe('bootstrap-theme vendor script loading', () => {
  it('wires jquery and bootstrap bridge events', async () => {
    const el = await fixture(html`<bootstrap-theme></bootstrap-theme>`)
    await el.updateComplete
    globalThis.dispatchEvent(new CustomEvent('es-bridge-jquery-loaded'))
    expect(el._jquery).to.equal(true)
    globalThis.dispatchEvent(new CustomEvent('es-bridge-bootstrap-loaded'))
    expect(el._bootstrap).to.equal(true)
  })
})

describe('BootstrapStylesheetManager', () => {
  const makeHost = () => {
    const el = globalThis.document.createElement('div')
    el.attachShadow({ mode: 'open' })
    return el
  }
  let savedFetch
  beforeEach(() => {
    savedFetch = globalThis.fetch
  })
  afterEach(() => {
    globalThis.fetch = savedFetch
  })

  it('ignores hosts without a shadow root or without a path', () => {
    let threw = false
    try {
      adoptBootstrapStylesheet(null, '/fake.css')
      adoptBootstrapStylesheet({ shadowRoot: null }, '/fake.css')
      const host = makeHost()
      adoptBootstrapStylesheet(host, '')
    } catch (e) {
      threw = true
    }
    expect(threw).to.equal(false)
  })

  it('falls back to a link when the stylesheet fetch fails', async () => {
    let calls = 0
    globalThis.fetch = (path) => {
      calls++
      return Promise.resolve({ ok: false })
    }
    const hostA = makeHost()
    adoptBootstrapStylesheet(hostA, '/fallback-one.css')
    await wait(30)
    expect(calls).to.equal(1)
    // the failed build is cached so a second host gets the link fallback
    const hostB = makeHost()
    adoptBootstrapStylesheet(hostB, '/fallback-one.css')
    expect(
      hostB.shadowRoot.querySelector(
        'link[data-bootstrap-css="fallback"]',
      ) === null,
    ).to.equal(false)
    expect(calls).to.equal(1)
    // adopting twice does not duplicate the fallback link
    adoptBootstrapStylesheet(hostB, '/fallback-one.css')
    expect(
      hostB.shadowRoot.querySelectorAll(
        'link[data-bootstrap-css="fallback"]',
      ).length,
    ).to.equal(1)
  })

  it('shares one constructable sheet across shadow roots', async () => {
    let calls = 0
    globalThis.fetch = (path) => {
      calls++
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve('a { color: red }'),
      })
    }
    const hostA = makeHost()
    adoptBootstrapStylesheet(hostA, '/shared-sheet.css')
    await wait(30)
    expect(hostA.shadowRoot.adoptedStyleSheets.length).to.equal(1)
    const sheet = hostA.shadowRoot.adoptedStyleSheets[0]
    const hostB = makeHost()
    adoptBootstrapStylesheet(hostB, '/shared-sheet.css')
    expect(hostB.shadowRoot.adoptedStyleSheets[0] === sheet).to.equal(true)
    expect(calls).to.equal(1)
    // re-adopting on the same host does not duplicate the sheet
    adoptBootstrapStylesheet(hostA, '/shared-sheet.css')
    expect(hostA.shadowRoot.adoptedStyleSheets.length).to.equal(1)
  })

  it('treats a throwing fetch as a failure and uses the link fallback', async () => {
    globalThis.fetch = () => Promise.reject(new Error('no network'))
    const host = makeHost()
    adoptBootstrapStylesheet(host, '/throwing.css')
    await wait(30)
    adoptBootstrapStylesheet(host, '/throwing.css')
    expect(
      host.shadowRoot.querySelector(
        'link[data-bootstrap-css="fallback"]',
      ) === null,
    ).to.equal(false)
  })
})
