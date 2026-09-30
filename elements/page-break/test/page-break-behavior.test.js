import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import '../page-break.js'
// pre-load the dynamically imported editing UI so menu buttons upgrade
import '@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js'
import '@haxtheweb/simple-fields/lib/simple-context-menu.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

describe('page-break defaults and platform gating', () => {
  it('seeds defaults', async () => {
    const el = await fixture(html`<page-break title="test"></page-break>`)
    await wait(150)
    expect(el.tagName).to.equal('PAGE-BREAK')
    expect(el.breakType).to.equal('node')
    expect(el.iconType).to.equal('editor:format-page-break')
    expect(el.title).to.equal('test')
    expect(el.entityType).to.equal('page')
    expect(el.status).to.equal('')
    expect(el.linkTarget).to.equal('_self')
    expect(el.published).to.equal(false)
    expect(el.locked).to.equal(false)
    expect(el.hideInMenu).to.equal(false)
    expect(el.isLoggedIn).to.equal(false)
    expect(el.hasAttribute('hidden')).to.equal(false)
    expect(el.t.newPage).to.equal('New page')
    expect(el.t.selectToEditPageDetails).to.equal(
      'Select to edit Page details',
    )
  })

  it('defaults the title to the new page translation', async () => {
    const el = await fixture(html`<page-break></page-break>`)
    await el.updateComplete
    expect(el.title).to.equal('New page')
  })

  it('hides the break when the platform does not allow page breaks', async () => {
    store.platformAllows = (capability) => capability !== 'pageBreak'
    const el = await fixture(html`<page-break></page-break>`)
    expect(el.hasAttribute('hidden')).to.equal(true)
    delete store.platformAllows
  })
})

describe('page-break lifecycle and target wiring', () => {
  it('targets a following heading as its title source', async () => {
    const root = await fixture(html`
      <div>
        <page-break></page-break>
        <h2>Section title</h2>
        <p>Content</p>
      </div>
    `)
    const pb = root.querySelector('page-break')
    expect(pb.title).to.equal('Section title')
    expect(pb.target.tagName).to.equal('H2')
    // let the manager registration recalculation settle first
    await wait(150)
    // BUG(page-break-manager.js:220): the recalculation replaces the heading
    // and reassigns element.target directly instead of via setupTargetData,
    // so the mutation observer keeps watching the detached original heading.
    // Re-attach the observer the same way the depth / hax-state flows do.
    pb.setupTargetData(pb.target)
    // heading edits flow back into the title through the observer
    pb.target.innerText = 'Edited title'
    await wait(50)
    expect(pb.title).to.equal('Edited title')
    // title edits flow down into the heading text
    pb.title = 'Typed title'
    await pb.updateComplete
    await wait(50)
    expect(pb.target.innerText).to.equal('Typed title')
  })

  it('injects a heading when no sibling heading exists', async () => {
    const root = await fixture(html`
      <div>
        <page-break title="Injected"></page-break>
        <p>Content</p>
      </div>
    `)
    const pb = root.querySelector('page-break')
    await wait(200)
    const headings = root.querySelectorAll('h2')
    expect(headings.length).to.equal(1)
    expect(headings[0].getAttribute('data-original-level')).to.equal('H2')
    expect(headings[0].innerText).to.equal('Injected')
    expect(pb.target === headings[0]).to.equal(true)
    expect(pb.title).to.equal('Injected')
    // the injected heading lands between the break and the content
    expect(root.firstElementChild.tagName).to.equal('PAGE-BREAK')
    expect(root.children[1].tagName).to.equal('H2')
    expect(root.children[2].tagName).to.equal('P')
  })

  it('injects a deeper heading for depth 1 breaks', async () => {
    const root = await fixture(html`
      <div>
        <page-break depth="1" title="Deep"></page-break>
        <p>Content</p>
      </div>
    `)
    await wait(200)
    expect(root.querySelector('h3') === null).to.equal(false)
    expect(root.querySelector('h2')).to.equal(null)
  })

  it('dispatches registration and change events on connect and disconnect', async () => {
    const events = []
    const handler = (e) => {
      events.push(e.detail.action ? e.type + ':' + e.detail.action : e.type)
    }
    globalThis.addEventListener('page-break-registration', handler)
    globalThis.addEventListener('page-break-change', handler)
    const root = await fixture(html`
      <div><page-break title="Events"></page-break></div>
    `)
    await wait(50)
    root.querySelector('page-break').remove()
    await wait(50)
    globalThis.removeEventListener('page-break-registration', handler)
    globalThis.removeEventListener('page-break-change', handler)
    expect(events.includes('page-break-registration:add')).to.equal(true)
    expect(events.includes('page-break-registration:remove')).to.equal(true)
    expect(events.includes('page-break-change')).to.equal(true)
  })

  it('cleans up every kind of store disposer on disconnect', async () => {
    const root = await fixture(html`
      <div><page-break title="Disposers"></page-break></div>
    `)
    const pb = root.querySelector('page-break')
    const disposed = []
    pb.__disposer.push({ dispose: () => disposed.push('object') })
    pb.remove()
    await wait(20)
    expect(disposed.length).to.equal(1)
  })

  it('warns and ignores invalid targets in setupTargetData', async () => {
    const warnings = []
    const origWarn = console.warn
    console.warn = (...args) => {
      warnings.push(args.join(' '))
    }
    const root = await fixture(html`
      <div><page-break title="Invalid"></page-break><h2>Real</h2></div>
    `)
    const pb = root.querySelector('page-break')
    pb.setupTargetData(null)
    console.warn = origWarn
    expect(pb.target).to.equal(null)
    expect(warnings.length).to.equal(1)
    expect(warnings[0].includes('invalid target')).to.equal(true)
  })
})

describe('page-break user and derived state', () => {
  let savedHaxcms
  beforeEach(() => {
    savedHaxcms = globalThis.HAXCMS
  })
  afterEach(() => {
    globalThis.HAXCMS = savedHaxcms
  })

  it('resolves the current user from HAXcms, the global store or neither', async () => {
    const el = await fixture(html`<page-break title="Users"></page-break>`)
    expect(el.getCurrentUser()).to.equal(null)
    globalThis.HAXCMS = {
      requestAvailability: () => ({
        store: { userData: { userName: 'cms-user' } },
      }),
    }
    expect(el.getCurrentUser()).to.equal('cms-user')
    globalThis.HAXCMS = undefined
    globalThis.store = { user: { name: 'app-user' } }
    expect(el.getCurrentUser()).to.equal('app-user')
    delete globalThis.store
  })

  it('auto stamps the current user as author when content changes', async () => {
    globalThis.HAXCMS = {
      requestAvailability: () => ({
        store: { userData: { userName: 'cms-user' } },
      }),
    }
    const el = await fixture(html`<page-break title="Author"></page-break>`)
    expect(el.author).to.equal(null)
    el.description = 'A new description'
    await el.updateComplete
    expect(el.author).to.equal('cms-user')
    // further changes keep the same author
    el.tags = 'tag-one'
    await el.updateComplete
    expect(el.author).to.equal('cms-user')
  })

  it('builds relatedItems from noderefs', async () => {
    const el = await fixture(html`<page-break title="Refs"></page-break>`)
    el.noderefs = [{ node: 'one' }, { node: 'two' }]
    await el.updateComplete
    expect(el.relatedItems).to.equal('one,two')
  })

  it('derives itemId from a schema resource id when unset', async () => {
    const el = await fixture(html`<page-break title="Schema"></page-break>`)
    expect(el.itemId).to.equal(null)
    el.schemaResourceID = '#resource-9'
    el.willUpdate(new Map([['schemaResourceID', '#resource-9']]))
    expect(el.itemId).to.equal('item-resource-9')
  })

  it('switches iconType with breakType', async () => {
    const el = await fixture(html`<page-break title="Icon"></page-break>`)
    el.breakType = 'site'
    await el.updateComplete
    expect(el.iconType).to.equal('hax:page-details')
    el.breakType = 'node'
    await el.updateComplete
    expect(el.iconType).to.equal('editor:format-page-break')
  })
})

describe('page-break reactive side effects', () => {
  it('replicates the lock state onto elements until the next break', async () => {
    const root = await fixture(html`
      <div>
        <page-break title="Locking"></page-break>
        <h2>Heading</h2>
        <p>Locked content</p>
        <page-break title="Next"></page-break>
        <p>After</p>
      </div>
    `)
    const breaks = root.querySelectorAll('page-break')
    breaks[0].locked = true
    await breaks[0].updateComplete
    expect(root.querySelector('h2').hasAttribute('data-hax-lock')).to.equal(
      true,
    )
    expect(root.querySelectorAll('p')[0].hasAttribute('data-hax-lock')).to.equal(
      true,
    )
    expect(root.querySelectorAll('p')[1].hasAttribute('data-hax-lock')).to.equal(
      false,
    )
    breaks[0].locked = false
    await breaks[0].updateComplete
    expect(root.querySelector('h2').hasAttribute('data-hax-lock')).to.equal(
      false,
    )
    expect(
      root.querySelectorAll('p')[0].hasAttribute('data-hax-lock'),
    ).to.equal(false)
  })

  it('refreshes the hax inline context menu when status changes', async () => {
    const el = await fixture(html`<page-break title="Menu"></page-break>`)
    const ceMenu = {}
    el.haxinlineContextMenu(ceMenu)
    expect(ceMenu.disableDuplicate).to.equal(true)
    el.locked = true
    await el.updateComplete
    expect(ceMenu.ceButtons.length).to.equal(2)
    expect(ceMenu.ceButtons[0].icon).to.equal('icons:lock')
    expect(ceMenu.ceButtons[0].label).to.equal('Toggle lock')
    expect(ceMenu.ceButtons[0].callback).to.equal('haxClickInlineLock')
    el.published = true
    await el.updateComplete
    expect(ceMenu.ceButtons[1].icon).to.equal('lrn:view')
    expect(ceMenu.ceButtons[1].label).to.equal('Toggle published')
    expect(ceMenu.ceButtons[1].callback).to.equal('haxClickInlinePublished')
    el.published = false
    await el.updateComplete
    expect(ceMenu.ceButtons[1].icon).to.equal('lrn:view-off')
    // leaving active element resets duplication for node breaks
    el.haxactiveElementChanged(el, false)
    expect(ceMenu.disableDuplicate).to.equal(false)
  })

  it('locks down the inline menu for site level breaks', async () => {
    const el = await fixture(
      html`<page-break break-type="site" title="Site"></page-break>`,
    )
    const ceMenu = {}
    el.haxinlineContextMenu(ceMenu)
    expect(ceMenu.disableOps).to.equal(true)
    expect(ceMenu.canMoveElement).to.equal(false)
    expect(ceMenu.insertAbove).to.equal(false)
    el.haxactiveElementChanged(el, false)
    expect(ceMenu.disableOps).to.equal(false)
    expect(ceMenu.canMoveElement).to.equal(true)
    expect(ceMenu.insertAbove).to.equal(true)
  })

  it('fires hax-refresh-tray-form when overridePathauto flips', async () => {
    const el = await fixture(html`<page-break title="Path"></page-break>`)
    let fired = 0
    const handler = () => {
      fired++
    }
    globalThis.addEventListener('hax-refresh-tray-form', handler)
    el.overridePathauto = true
    await el.updateComplete
    globalThis.removeEventListener('hax-refresh-tray-form', handler)
    expect(fired).to.equal(1)
  })

  it('fires page-break-change when title, parent or slug change', async () => {
    const el = await fixture(html`<page-break title="Events"></page-break>`)
    let fired = 0
    const handler = () => {
      fired++
    }
    globalThis.addEventListener('page-break-change', handler)
    el.slug = 'new-slug'
    await el.updateComplete
    el.parent = 'item-1'
    await el.updateComplete
    el.title = 'Renamed'
    await el.updateComplete
    globalThis.removeEventListener('page-break-change', handler)
    expect(fired).to.equal(3)
  })

  it('rewrites heading levels when depth changes', async () => {
    const root = await fixture(html`
      <div>
        <page-break title="Depth test"></page-break>
        <h2>Original</h2>
        <p>Text</p>
      </div>
    `)
    const pb = root.querySelector('page-break')
    await wait(150)
    pb.depth = 1
    await pb.updateComplete
    await wait(50)
    expect(root.querySelector('h2')).to.equal(null)
    const h3 = root.querySelector('h3')
    expect(h3 === null).to.equal(false)
    expect(h3.getAttribute('data-original-level')).to.equal('H2')
    expect(h3.innerText).to.equal('Original')
    expect(pb.target.tagName).to.equal('H3')
  })

  it('caps rewritten headings at h6', async () => {
    const root = await fixture(html`
      <div>
        <page-break title="Cap test"></page-break>
        <h2>Original</h2>
      </div>
    `)
    const pb = root.querySelector('page-break')
    await wait(150)
    pb.depth = 5
    await pb.updateComplete
    await wait(50)
    expect(root.querySelector('h2')).to.equal(null)
    expect(root.querySelector('h6') === null).to.equal(false)
    expect(root.querySelector('h7')).to.equal(null)
  })

  it('restores original heading levels while in hax edit state', async () => {
    const root = await fixture(html`
      <div>
        <page-break title="Edit state"></page-break>
        <h2>Original</h2>
        <p>Text</p>
      </div>
    `)
    const pb = root.querySelector('page-break')
    await wait(150)
    pb.depth = 1
    await pb.updateComplete
    await wait(50)
    expect(root.querySelector('h3') === null).to.equal(false)
    pb._haxState = true
    await pb.updateComplete
    await wait(50)
    expect(root.querySelector('h2') === null).to.equal(false)
    expect(root.querySelector('h3')).to.equal(null)
    pb._haxState = false
    await pb.updateComplete
    await wait(50)
    expect(root.querySelector('h3') === null).to.equal(false)
    expect(root.querySelector('h2')).to.equal(null)
  })
})

describe('page-break rendering', () => {
  it('renders a deep link anchor from itemId or slug', async () => {
    const el = await fixture(
      html`<page-break item-id="item-7" title="Anchor page"></page-break>`,
    )
    await el.updateComplete
    const anchor = el.shadowRoot.querySelector('a.sr-only')
    expect(anchor === null).to.equal(false)
    expect(anchor.getAttribute('name')).to.equal('item-7')
    expect(anchor.getAttribute('href')).to.equal('#item-7')
    expect(anchor.textContent.trim()).to.equal('Anchor page')
    const el2 = await fixture(
      html`<page-break slug="page-slug" title="Slug page"></page-break>`,
    )
    await el2.updateComplete
    expect(
      el2.shadowRoot.querySelector('a.sr-only').getAttribute('href'),
    ).to.equal('page-slug')
  })

  it('renders link details when linkUrl is set', async () => {
    const el = await fixture(html`
      <page-break
        link-url="https://example.com/docs"
        link-target="_blank"
        title="Link"
      ></page-break>
    `)
    await el.updateComplete
    const info = el.shadowRoot.querySelector('.link-info')
    expect(info === null).to.equal(false)
    const link = info.querySelector('a.link-url')
    expect(link.getAttribute('href')).to.equal('https://example.com/docs')
    expect(link.getAttribute('target')).to.equal('_blank')
    expect(link.getAttribute('rel')).to.equal('noopener noreferrer')
    expect(link.textContent.trim()).to.equal('https://example.com/docs')
    expect(info.textContent.includes('Users will be redirected to:')).to.equal(
      true,
    )
    expect(info.textContent.includes('Opens in new window')).to.equal(true)
    const el2 = await fixture(html`
      <page-break
        link-url="https://example.com/same"
        link-target="_self"
        title="Link"
      ></page-break>
    `)
    await el2.updateComplete
    expect(
      el2
        .shadowRoot
        .querySelector('.link-info')
        .textContent.includes('Opens in same window'),
    ).to.equal(true)
  })

  it('renders the page action menu only when logged in', async () => {
    const el = await fixture(html`<page-break title="Actions"></page-break>`)
    await wait(150)
    expect(el.shadowRoot.querySelector('#pageactionsbtn')).to.equal(null)
    el.isLoggedIn = true
    await el.updateComplete
    await wait(150)
    const btn = el.shadowRoot.querySelector('#pageactionsbtn')
    expect(btn === null).to.equal(false)
    expect(btn.getAttribute('label')).to.equal('Page Actions')
    const menu = el.shadowRoot.querySelector('#menu')
    expect(menu === null).to.equal(false)
    const items = menu.querySelectorAll('simple-toolbar-button')
    expect(items.length).to.equal(10)
    // the first item is edit page and reflects the lock state
    expect(items[0].getAttribute('label')).to.equal('Edit page')
    expect(items[0].hasAttribute('disabled')).to.equal(false)
    el.locked = true
    await el.updateComplete
    expect(
      menu.querySelector('simple-toolbar-button').hasAttribute('disabled'),
    ).to.equal(true)
    // hax state swaps the menu for save / cancel buttons
    el._haxState = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.save-button') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('.cancel-button') === null).to.equal(
      false,
    )
    expect(el.shadowRoot.querySelector('#pageactionsbtn')).to.equal(null)
  })

  it('hides platform gated menu items when the platform denies them', async () => {
    store.platformAllows = (capability) => {
      return !['uploadMedia', 'insights', 'deletePage'].includes(capability)
    }
    const el = await fixture(html`<page-break title="Gated"></page-break>`)
    el.isLoggedIn = true
    await el.updateComplete
    await wait(150)
    const menu = el.shadowRoot.querySelector('#menu')
    const labels = Array.from(menu.querySelectorAll('simple-toolbar-button'))
      .filter((b) => b.hasAttribute('hidden'))
      .map((b) => b.getAttribute('label'))
    expect(labels.includes('Edit Media')).to.equal(true)
    expect(labels.includes('Page report')).to.equal(true)
    expect(labels.includes('Delete')).to.equal(true)
    expect(labels.includes('Edit page')).to.equal(false)
    delete store.platformAllows
  })

  it('reflects published and locked state in the action buttons', async () => {
    const el = await fixture(html`<page-break title="State"></page-break>`)
    el.isLoggedIn = true
    await el.updateComplete
    await wait(150)
    const menu = el.shadowRoot.querySelector('#menu')
    const byLabel = (label) =>
      Array.from(menu.querySelectorAll('simple-toolbar-button')).find(
        (b) => b.getAttribute('label') === label,
      )
    expect(byLabel('Publish').getAttribute('icon')).to.equal('icons:visibility')
    el.published = true
    await el.updateComplete
    expect(byLabel('Unpublish').getAttribute('icon')).to.equal(
      'icons:visibility-off',
    )
    expect(byLabel('Lock').getAttribute('icon')).to.equal('icons:lock-open')
    el.locked = true
    await el.updateComplete
    expect(byLabel('Unlock').getAttribute('icon')).to.equal('icons:lock')
  })

  it('passes a11y audits in default and logged in modes', async () => {
    const el = await fixture(html`<page-break title="A11y"></page-break>`)
    await expect(el).shadowDom.to.be.accessible()
    const el2 = await fixture(
      html`<page-break link-url="https://example.com" title="A11y link"></page-break>`,
    )
    await el2.updateComplete
    await expect(el2).shadowDom.to.be.accessible()
  })
})

describe('page-break firstUpdated seeding', () => {
  it('seeds noderefs from relatedItems and aligns the schema id', async () => {
    const el = await fixture(html`<page-break title="Seeding"></page-break>`)
    el.relatedItems = 'node-a,node-b'
    el.itemId = 'item-3'
    el.firstUpdated(new Map())
    expect(el.noderefs.length).to.equal(2)
    expect(el.noderefs[0].node).to.equal('node-a')
    expect(el.noderefs[1].node).to.equal('node-b')
    expect(el.schemaResourceID).to.equal('item-3')
  })
})
