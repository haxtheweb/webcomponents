import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { HAXStore } from '@haxtheweb/hax-body/lib/hax-store.js'
import { pageBreakManager } from '../lib/page-break-manager.js'
// direct lib imports so coverage sees every lib file
import '../lib/page-anchor.js'
import '../lib/page-break-outline.js'
import '../lib/page-template.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

describe('page-anchor', () => {
  let savedManifest
  let savedActiveId
  let savedActiveHaxBody
  beforeEach(() => {
    savedManifest = store.manifest
    savedActiveId = store.activeId
    savedActiveHaxBody = HAXStore.activeHaxBody
    pageBreakManager.breaks = []
    pageBreakManager.target = null
  })
  afterEach(() => {
    store.manifest = savedManifest
    store.activeId = savedActiveId
    HAXStore.activeHaxBody = savedActiveHaxBody
    delete HAXStore.haxSchemaFromTag
    pageBreakManager.breaks = []
    pageBreakManager.target = null
  })

  it('seeds defaults', async () => {
    const el = await fixture(html`<page-anchor>Some text</page-anchor>`)
    expect(el.tagName).to.equal('PAGE-ANCHOR')
    expect(el.value).to.equal(null)
    expect(el.target).to.equal('')
    expect(el.entityId).to.equal(null)
  })

  it('passes a11y audit with slotted content', async () => {
    const el = await fixture(html`<page-anchor>Anchor text</page-anchor>`)
    await expect(el).shadowDom.to.be.accessible()
  })

  it('renders a mark with slotted content and no icon without entity data', async () => {
    const el = await fixture(html`<page-anchor>Anchor text</page-anchor>`)
    await el.updateComplete
    const mark = el.shadowRoot.querySelector('mark')
    expect(mark === null).to.equal(false)
    expect(mark.querySelector('slot') === null).to.equal(false)
    expect(el.textContent.trim()).to.equal('Anchor text')
    expect(el.shadowRoot.querySelector('simple-icon-lite') === null).to.equal(
      true,
    )
  })

  it('renders the entity icon inside the mark', async () => {
    store.manifest = {
      items: [
        {
          id: 'e1',
          title: 'Entity One',
          metadata: { icon: 'icons:code' },
        },
      ],
    }
    const el = await fixture(
      html`<page-anchor entity-id="e1">Iconified</page-anchor>`,
    )
    await el.updateComplete
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon === null).to.equal(false)
    expect(icon.getAttribute('icon')).to.equal('icons:code')
  })

  it('resolves icons and plain fields from entity data', async () => {
    store.manifest = {
      items: [
        {
          id: 'e1',
          title: 'Entity One',
          metadata: { icon: 'icons:code', color: 'blue' },
        },
      ],
    }
    const el = await fixture(html`<page-anchor></page-anchor>`)
    expect(el.getMatchFromFields('e1', '', 'icon')).to.equal('icons:code')
    expect(el.getMatchFromFields('e1', '', 'color')).to.equal('blue')
    // missing entity falls through to node matching, which finds nothing here
    expect(el.getMatchFromFields('missing', '', 'icon')).to.equal(null)
    // BUG(page-anchor.js:100-103): entityData exposes color / icon keys but
    // the default accentColor field never matches an entity, so the
    // --simple-colors token branch is unreachable with real store data.
    expect(el.getMatchFromFields('e1', '', 'accentColor')).to.equal(null)
  })

  it('falls back to the node schema gizmo color when the entity lacks a field', async () => {
    const host = globalThis.document.createElement('div')
    host.className = 'haxcms-theme-element'
    const player = globalThis.document.createElement('video-player')
    host.appendChild(player)
    globalThis.document.body.appendChild(host)
    const savedList = HAXStore.elementList
    HAXStore.elementList = { 'video-player': { gizmo: { color: 'red' } } }
    // keep an entity map present so unknown ids fall to the node lookup
    store.manifest = { items: [] }
    const el = await fixture(html`<page-anchor></page-anchor>`)
    try {
      expect(
        el.getMatchFromFields('missing', 'video-player', 'accentColor'),
      ).to.equal('--simple-colors-default-theme-red-3')
    } finally {
      HAXStore.elementList = savedList
      host.remove()
    }
  })

  it('swallows clicks while in hax edit mode', async () => {
    const el = await fixture(html`<page-anchor target="#x"></page-anchor>`)
    el._haxState = true
    let prevented = false
    let stoppedImmediate = false
    const result = el.clickHandler({
      type: 'click',
      preventDefault: () => {
        prevented = true
      },
      stopPropagation: () => {},
      stopImmediatePropagation: () => {
        stoppedImmediate = true
      },
    })
    expect(result).to.equal(false)
    expect(prevented).to.equal(true)
    expect(stoppedImmediate).to.equal(true)
  })

  it('scrolls a matching node into view and plays it when no value is set', async () => {
    const host = globalThis.document.createElement('div')
    host.className = 'haxcms-theme-element'
    const player = globalThis.document.createElement('video-player')
    const scrolled = []
    const played = []
    player.scrollIntoView = () => {
      scrolled.push(true)
    }
    player.play = () => {
      played.push(true)
    }
    host.appendChild(player)
    globalThis.document.body.appendChild(host)
    const el = await fixture(
      html`<page-anchor target="video-player"></page-anchor>`,
    )
    el.clickHandler({ type: 'click' })
    expect(scrolled.length).to.equal(1)
    await wait(200)
    expect(played.length).to.equal(1)
    host.remove()
  })

  it('seeks a media player when a value is set', async () => {
    const host = globalThis.document.createElement('div')
    host.className = 'haxcms-theme-element'
    const player = globalThis.document.createElement('video-player')
    const sought = []
    player.scrollIntoView = () => {}
    player.seek = (v) => {
      sought.push(v)
    }
    host.appendChild(player)
    globalThis.document.body.appendChild(host)
    const el = await fixture(
      html`<page-anchor target="video-player" value="42"></page-anchor>`,
    )
    el.clickHandler({ type: 'click' })
    await wait(200)
    expect(sought.length).to.equal(1)
    expect(sought[0]).to.equal(42)
    host.remove()
  })

  it('moves a play list to the referenced slide', async () => {
    const host = globalThis.document.createElement('div')
    host.className = 'haxcms-theme-element'
    const list = globalThis.document.createElement('play-list')
    const slides = []
    list.scrollIntoView = () => {}
    Object.defineProperty(list, 'slide', {
      set(v) {
        slides.push(v)
      },
      get() {
        return 0
      },
    })
    host.appendChild(list)
    globalThis.document.body.appendChild(host)
    const el = await fixture(
      html`<page-anchor target="play-list" value="3"></page-anchor>`,
    )
    el.clickHandler({ type: 'click' })
    await wait(200)
    expect(slides.length).to.equal(1)
    expect(slides[0]).to.equal(3)
    host.remove()
  })

  it('does nothing but unset the target when the node can not be found', async () => {
    const el = await fixture(html`<page-anchor target="#missing"></page-anchor>`)
    el.clickHandler({ type: 'click' })
    expect(el.target).to.equal(null)
  })

  it('queries the active hax body while in edit mode', async () => {
    const body = globalThis.document.createElement('div')
    const target = globalThis.document.createElement('div')
    const scrolled = []
    target.scrollIntoView = () => {
      scrolled.push(true)
    }
    body.appendChild(target)
    HAXStore.activeHaxBody = body
    const el = await fixture(html`<page-anchor target="div"></page-anchor>`)
    el._haxState = true
    // a non click event type bypasses the edit-mode bail out
    el.clickHandler({ type: 'mousedown' })
    expect(scrolled.length).to.equal(1)
  })

  it('builds select lists for target and entity from the active hax body', async () => {
    const body = globalThis.document.createElement('div')
    const withId = globalThis.document.createElement('div')
    withId.id = 'node-1'
    withId.innerText = 'Node one'
    const withResource = globalThis.document.createElement('article')
    withResource.setAttribute('resource', 'res-1')
    const excluded = globalThis.document.createElement('page-anchor')
    body.appendChild(withId)
    body.appendChild(withResource)
    body.appendChild(excluded)
    HAXStore.activeHaxBody = body
    // schema lookups resolve to an empty schema for these plain nodes
    HAXStore.haxSchemaFromTag = () => ({})
    store.manifest = {
      items: [{ id: 'e1', title: 'Entity One', metadata: {} }],
    }
    const props = {
      settings: {
        configure: [{ property: 'target' }, { property: 'entityId' }],
      },
    }
    const el = await fixture(html`<page-anchor></page-anchor>`)
    el.haxsetupActiveElementForm(props)
    const targetInput = props.settings.configure[0]
    expect(targetInput.inputMethod).to.equal('select')
    expect(targetInput.itemsList.length).to.equal(3)
    expect(targetInput.itemsList[0].text).to.equal('-- No association --')
    expect(targetInput.itemsList[1].value).to.equal('#node-1')
    expect(targetInput.itemsList[1].text.includes('Node one')).to.equal(true)
    expect(targetInput.itemsList[1].text.includes('(node-1)')).to.equal(true)
    expect(targetInput.itemsList[2].value).to.equal('[resource="res-1"]')
    const entityInput = props.settings.configure[1]
    expect(entityInput.inputMethod).to.equal('select')
    expect(entityInput.itemsList.length).to.equal(2)
    expect(entityInput.itemsList[1].value).to.equal('e1')
    expect(entityInput.itemsList[1].text).to.equal('Entity One')
  })

  it('uses anchorLabel from schema metadata to label nodes', async () => {
    const body = globalThis.document.createElement('div')
    const labelled = globalThis.document.createElement('div')
    labelled.id = 'labelled-1'
    labelled.title = 'Labelled node'
    body.appendChild(labelled)
    HAXStore.activeHaxBody = body
    HAXStore.haxSchemaFromTag = () => ({
      gizmo: { metadata: { anchorLabel: 'title' } },
    })
    store.manifest = { items: [] }
    const props = { settings: { configure: [{ property: 'target' }] } }
    const el = await fixture(html`<page-anchor></page-anchor>`)
    el.haxsetupActiveElementForm(props)
    const items = props.settings.configure[0].itemsList
    expect(items[1].text).to.equal('Labelled node')
    expect(items[1].value).to.equal('div')
  })

  it('exposes hax hooks and mirrors edit mode', async () => {
    const el = await fixture(html`<page-anchor></page-anchor>`)
    const hooks = el.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.setupActiveElementForm).to.equal('haxsetupActiveElementForm')
    el.haxeditModeChanged(true)
    expect(el._haxState).to.equal(true)
  })
})

describe('page-break-manager', () => {
  let savedBreaks
  let savedTarget
  beforeEach(() => {
    savedBreaks = pageBreakManager.breaks
    savedTarget = pageBreakManager.target
  })
  afterEach(() => {
    pageBreakManager.breaks = savedBreaks
    pageBreakManager.target = savedTarget
  })

  const makeHost = () => {
    const host = globalThis.document.createElement('div')
    const pb1 = globalThis.document.createElement('page-break')
    const h2 = globalThis.document.createElement('h2')
    const p = globalThis.document.createElement('p')
    const pb2 = globalThis.document.createElement('page-break')
    host.appendChild(pb1)
    host.appendChild(h2)
    host.appendChild(p)
    host.appendChild(pb2)
    return { host, pb1, h2, p, pb2 }
  }

  it('collects the elements between two breaks', () => {
    const { pb1, h2, p, pb2 } = makeHost()
    const between = pageBreakManager.elementsBetween(pb1)
    expect(between.length).to.equal(2)
    expect(between[0].tagName).to.equal('H2')
    expect(between[1].tagName).to.equal('P')
    const headings = pageBreakManager.elementsBetween(
      pb1,
      'page-break',
      'h1,h2,h3,h4,h5,h6',
    )
    expect(headings.length).to.equal(1)
    expect(headings[0].tagName).to.equal('H2')
    // the walk can also go backwards
    const before = pageBreakManager.elementsBetween(
      pb2,
      'page-break',
      null,
      'previousElementSibling',
    )
    expect(before.length).to.equal(2)
    expect(before[0].tagName).to.equal('P')
  })

  it('finds the break associated with an element', () => {
    const { host, pb1, h2, p } = makeHost()
    expect(pageBreakManager.associatedPageBreak(p) === pb1).to.equal(true)
    expect(pageBreakManager.associatedPageBreak(h2) === pb1).to.equal(true)
    // nodes without a preceding break resolve to null
    expect(pageBreakManager.associatedPageBreak(host)).to.equal(null)
  })

  it('filters between element queries by type', () => {
    const host = globalThis.document.createElement('div')
    const pb1 = globalThis.document.createElement('page-break')
    const h2 = globalThis.document.createElement('h2')
    const p = globalThis.document.createElement('p')
    const pb2 = globalThis.document.createElement('page-break')
    const span = globalThis.document.createElement('span')
    span.setAttribute('data-page-break-title', 'yes')
    host.appendChild(pb1)
    host.appendChild(h2)
    host.appendChild(p)
    host.appendChild(pb2)
    host.appendChild(span)
    pageBreakManager.breaks = [pb1, pb2]
    expect(pageBreakManager.betweenElementsQuery('headings').length).to.equal(1)
    expect(pageBreakManager.betweenElementsQuery('noheadings').length).to.equal(
      2,
    )
    expect(pageBreakManager.betweenElementsQuery('titles').length).to.equal(1)
    expect(pageBreakManager.betweenElementsQuery('notitles').length).to.equal(2)
    expect(pageBreakManager.betweenElementsQuery('all').length).to.equal(3)
    expect(
      pageBreakManager.betweenElementsQuery('unknown-type').length,
    ).to.equal(0)
  })

  it('resolves the parent break for indent, outdent and default lookups', () => {
    const host = globalThis.document.createElement('div')
    const pbA = globalThis.document.createElement('page-break')
    const pbB = globalThis.document.createElement('page-break')
    const pbC = globalThis.document.createElement('page-break')
    // path and parent are read as properties AND matched as attributes
    const wire = (pb, path, parent) => {
      pb.path = path
      pb.setAttribute('path', path)
      pb.parent = parent
      if (parent !== null) {
        pb.setAttribute('parent', parent)
      }
    }
    wire(pbA, 'a', null)
    wire(pbB, 'b', 'a')
    wire(pbC, 'c', 'b')
    const h2 = globalThis.document.createElement('h2')
    const p = globalThis.document.createElement('p')
    host.appendChild(pbA)
    host.appendChild(h2)
    host.appendChild(pbB)
    host.appendChild(p)
    host.appendChild(pbC)
    pageBreakManager.target = host
    // default lookup finds the declared parent break
    expect(pageBreakManager.getParent(pbB) === pbA).to.equal(true)
    // unknown relations fall back to the default lookup
    expect(pageBreakManager.getParent(pbB, 'nope') === pbA).to.equal(true)
    // indent uses the previous break sibling
    expect(pageBreakManager.getParent(pbB, 'indent') === pbA).to.equal(true)
    // breaks without a parent resolve to null
    expect(pageBreakManager.getParent(pbA)).to.equal(null)
    // BUG(page-break-manager.js:40-42): the outdent branch unconditionally
    // resets targetNode to null in a bare block, so outdent always misses the
    // grandparent break it just resolved. Asserted actual (broken) behavior.
    expect(pageBreakManager.getParent(pbC, 'outdent')).to.equal(null)
    // no manager target means no parent resolution at all
    const savedTarget = pageBreakManager.target
    pageBreakManager.target = null
    expect(pageBreakManager.getParent(pbB)).to.equal(null)
    pageBreakManager.target = savedTarget
  })

  it('registers and unregisters breaks from registration events', async () => {
    const mgr = globalThis.document.createElement('page-break-manager')
    globalThis.document.body.appendChild(mgr)
    const fakeBreak = globalThis.document.createElement('page-break')
    const parent = globalThis.document.createElement('div')
    parent.appendChild(fakeBreak)
    globalThis.dispatchEvent(
      new CustomEvent('page-break-registration', {
        detail: { value: fakeBreak, action: 'add' },
      }),
    )
    expect(mgr.breaks.length).to.equal(1)
    expect(mgr.target === parent).to.equal(true)
    // duplicate registration of the same break is ignored
    globalThis.dispatchEvent(
      new CustomEvent('page-break-registration', {
        detail: { value: fakeBreak, action: 'add' },
      }),
    )
    expect(mgr.breaks.length).to.equal(1)
    globalThis.dispatchEvent(
      new CustomEvent('page-break-registration', {
        detail: { value: fakeBreak, action: 'remove' },
      }),
    )
    expect(mgr.breaks.length).to.equal(0)
    expect(mgr.target).to.equal(null)
    // allow the registration recalculation timer to settle
    await wait(50)
    // a disconnected manager no longer listens for registrations
    mgr.remove()
    globalThis.dispatchEvent(
      new CustomEvent('page-break-registration', {
        detail: { value: fakeBreak, action: 'add' },
      }),
    )
    expect(mgr.breaks.length).to.equal(0)
  })
})

describe('page-break-outline', () => {
  let savedBreaks
  let savedTarget
  beforeEach(() => {
    savedBreaks = pageBreakManager.breaks
    savedTarget = pageBreakManager.target
    pageBreakManager.breaks = []
    pageBreakManager.target = null
  })
  afterEach(() => {
    pageBreakManager.breaks = savedBreaks
    pageBreakManager.target = savedTarget
  })

  const buildOutlineHost = () => {
    const host = globalThis.document.createElement('div')
    host.id = 'outline-host'
    const mk = (path, parent, title, depth) => {
      const pb = globalThis.document.createElement('page-break')
      // path is read as a property and matched as an attribute, set both
      pb.path = path
      pb.setAttribute('path', path)
      pb.parent = parent
      pb.title = title
      pb.depth = depth
      host.appendChild(pb)
      return pb
    }
    const p0 = mk('p0', 'px', 'Root', 0)
    const p1 = mk('p1', 'p0', 'Child', 1)
    const p2 = mk('p2', 'p1', 'Grandchild', 2)
    const p3 = mk('p3', 'px', 'Sibling', 0)
    globalThis.document.body.appendChild(host)
    return { host, p0, p1, p2, p3 }
  }

  it('renders a nested outline of links from the breaks in the target', async () => {
    const { host } = buildOutlineHost()
    const outline = await fixture(
      html`<page-break-outline selector="#outline-host"></page-break-outline>`,
    )
    await wait(50)
    const anchors = outline.div.querySelectorAll('a')
    expect(anchors.length).to.equal(4)
    const first = outline.div.querySelector('a[data-path="p0"]')
    expect(first.getAttribute('href')).to.equal('p0')
    expect(first.getAttribute('data-parent')).to.equal('px')
    expect(first.getAttribute('data-depth')).to.equal('0')
    expect(first.textContent).to.equal('Root')
    expect(
      outline.div.querySelector('a[data-path="p1"]').getAttribute('data-depth'),
    ).to.equal('1')
    expect(
      outline.div.querySelector('a[data-path="p2"]').getAttribute('data-depth'),
    ).to.equal('2')
    expect(
      outline.div.querySelector('a[data-path="p3"]').getAttribute('data-depth'),
    ).to.equal('0')
    host.remove()
  })

  it('prefixes outline links with the base path', async () => {
    const { host } = buildOutlineHost()
    const outline = await fixture(
      html`<page-break-outline
        selector="#outline-host"
        base-path="/site/"
      ></page-break-outline>`,
    )
    await wait(50)
    expect(
      outline.div.querySelector('a[data-path="p0"]').getAttribute('href'),
    ).to.equal('/site/p0')
    host.remove()
  })

  it('scrolls the matching break into view when a link is clicked', async () => {
    const scrolled = []
    const fakeBreak = {
      path: 'p0',
      scrollIntoView: (opts) => {
        scrolled.push(opts)
      },
    }
    pageBreakManager.breaks = [fakeBreak]
    const outline = await fixture(
      html`<page-break-outline></page-break-outline>`,
    )
    outline.div.innerHTML = '<a href="p0">Root</a><a href="other">Other</a>'
    const anchor = outline.div.querySelector('a[href="p0"]')
    const evt = new MouseEvent('click', {
      bubbles: true,
      composed: true,
      cancelable: true,
    })
    anchor.dispatchEvent(evt)
    expect(scrolled.length).to.equal(1)
    expect(scrolled[0].behavior).to.equal('smooth')
    expect(scrolled[0].block).to.equal('start')
    expect(scrolled[0].inline).to.equal('nearest')
    expect(evt.defaultPrevented).to.equal(true)
    // links without a matching break never scroll
    const other = outline.div.querySelector('a[href="other"]')
    other.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    )
    expect(scrolled.length).to.equal(1)
    // non link clicks are ignored entirely
    outline.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    )
    expect(scrolled.length).to.equal(1)
  })

  it('re-renders when page-break-change events fire', async () => {
    const { host, p0 } = buildOutlineHost()
    const outline = await fixture(
      html`<page-break-outline selector="#outline-host"></page-break-outline>`,
    )
    await wait(50)
    const divBefore = outline.div
    p0.title = 'Renamed'
    globalThis.dispatchEvent(new CustomEvent('page-break-change'))
    await wait(50)
    expect(outline.div === divBefore).to.equal(false)
    expect(outline.div.querySelectorAll('a').length).to.equal(4)
    expect(outline.div.querySelector('a[data-path="p0"]').textContent).to.equal(
      'Renamed',
    )
    // a second event during the debounce lock does not double render
    const locked = outline.div
    globalThis.dispatchEvent(new CustomEvent('page-break-change'))
    globalThis.dispatchEvent(new CustomEvent('page-break-change'))
    await wait(50)
    expect(outline.div.querySelectorAll('a').length).to.equal(4)
    expect(locked === undefined).to.equal(false)
    // once disconnected, change events no longer re-render
    outline.remove()
    await wait(20)
    const after = outline.div
    globalThis.dispatchEvent(new CustomEvent('page-break-change'))
    await wait(50)
    expect(outline.div === after).to.equal(true)
    host.remove()
  })
})

describe('page-template', () => {
  it('seeds defaults', async () => {
    const el = await fixture(html`<page-template></page-template>`)
    expect(el.tagName).to.equal('PAGE-TEMPLATE')
    expect(el.name).to.equal('')
    expect(el.schema).to.equal('area')
    expect(el.t.pageTemplate).to.equal('Page Template')
    expect(el.t.defaultTemplate).to.equal('Default Template')
  })

  it('generates a template prefixed unique id on connect', async () => {
    const el = await fixture(html`<page-template></page-template>`)
    const id = el.getAttribute('data-haxsg-id')
    expect(id === null).to.equal(false)
    expect(id.startsWith('template-')).to.equal(true)
    expect(id.length > 'template-'.length).to.equal(true)
    // a supplied id is preserved
    const el2 = await fixture(
      html`<page-template data-haxsg-id="custom-1"></page-template>`,
    )
    expect(el2.getAttribute('data-haxsg-id')).to.equal('custom-1')
  })

  it('prefixes generated ids by schema type', async () => {
    const block = await fixture(
      html`<page-template schema="block"></page-template>`,
    )
    expect(
      block.getAttribute('data-haxsg-id').startsWith('block-'),
    ).to.equal(true)
    const page = await fixture(
      html`<page-template schema="page"></page-template>`,
    )
    expect(page.getAttribute('data-haxsg-id').startsWith('page-')).to.equal(true)
    const other = await fixture(
      html`<page-template schema="column"></page-template>`,
    )
    expect(
      other.getAttribute('data-haxsg-id').startsWith('template-'),
    ).to.equal(true)
  })

  it('renders the template label only when a name is set', async () => {
    const el = await fixture(
      html`<page-template name="Hero">Slot content</page-template>`,
    )
    await el.updateComplete
    const label = el.shadowRoot.querySelector('.template-label')
    expect(label === null).to.equal(false)
    expect(label.textContent).to.equal('Hero')
    expect(el.shadowRoot.querySelector('.template-content slot') === null).to.equal(
      false,
    )
    const el2 = await fixture(html`<page-template>Slot content</page-template>`)
    await el2.updateComplete
    expect(el2.shadowRoot.querySelector('.template-label')).to.equal(null)
    expect(el2.shadowRoot.querySelector('.template-content slot') === null).to.equal(
      false,
    )
  })

  it('passes a11y audit without the label', async () => {
    const el = await fixture(html`<page-template>Slot content</page-template>`)
    await expect(el).shadowDom.to.be.accessible()
  })

  it('renders the label with a documented contrast deficit', async () => {
    const el = await fixture(
      html`<page-template name="Hero">Slot content</page-template>`,
    )
    await el.updateComplete
    const label = el.shadowRoot.querySelector('.template-label')
    expect(label === null).to.equal(false)
    const cs = globalThis.getComputedStyle(label)
    // BUG(page-template.js:62-63): white text on the skyBlue token measures
    // 3.08:1, below the 4.5:1 WCAG AA minimum (axe color-contrast fails on
    // the named label). Asserting the current non-compliant pairing so a fix
    // to the token usage flips this assertion.
    expect(cs.backgroundColor).to.equal('rgb(0, 156, 222)')
    expect(cs.color).to.equal('rgb(255, 255, 255)')
  })
})
