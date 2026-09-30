import { fixture, expect, html } from '@open-wc/testing'
import '../map-menu.js'

const sampleData = () => [
  { id: 'p1', title: 'Parent One', slug: '/parent-one' },
  { id: 'c1', title: 'Child One', slug: '/child-one', parent: 'p1' },
  { id: 'c2', title: 'Child Two', slug: '/child-two', parent: 'p1' },
  { id: 'p2', title: 'Parent Two', slug: '/parent-two' },
]

// items nested inside closed submenus have no height, so pick a visible one
const visibleItem = (el) =>
  [...el.shadowRoot.querySelectorAll('map-menu-item')].filter(
    (i) => i.offsetHeight > 0,
  )[0]

describe('map-menu data and selection', () => {
  it('seeds defaults', async () => {
    const el = await fixture(html`<map-menu></map-menu>`)
    expect(el.title).to.equal('Content outline')
    expect(el.data).to.equal(null)
    expect(JSON.stringify(el.items)).to.equal('[]')
    expect(el.editControls).to.equal(false)
    expect(el.isFlex).to.equal(false)
    expect(el.isHorizontal).to.equal(false)
    expect(el.maxDepth).to.equal(5)
    expect(el.disabled).to.equal(false)
    expect(el.autoScroll).to.equal(false)
    expect(el.activeIndicator).to.equal(false)
  })

  it('builds a nested item tree from linear data', async () => {
    const el = await fixture(html`<map-menu .data=${sampleData()}></map-menu>`)
    await el.updateComplete
    expect(el.items.length).to.equal(2)
    expect(el.items[0].id).to.equal('p1')
    expect(el.items[0].children.map((c) => c.id).join(',')).to.equal('c1,c2')
    expect(el.items[0].children[0].children.length).to.equal(0)
    expect(el.items[1].id).to.equal('p2')
    expect(el.items[1].children.length).to.equal(0)
  })

  it('renders submenus and leaf items from the data tree', async () => {
    const el = await fixture(html`<map-menu .data=${sampleData()}></map-menu>`)
    await el.updateComplete
    await new Promise((r) => setTimeout(r, 50))
    const submenus = el.shadowRoot.querySelectorAll('map-menu-submenu')
    const items = el.shadowRoot.querySelectorAll('map-menu-item')
    // only p1 has children so it renders the single submenu
    expect(submenus.length).to.equal(1)
    expect(submenus[0].getAttribute('itemtitle')).to.equal('Parent One')
    expect(submenus[0].getAttribute('url')).to.equal('/parent-one')
    // the nested c1/c2 leaves and the top level p2 leaf
    expect(items.length).to.equal(3)
    expect(items[0].getAttribute('itemtitle')).to.equal('Child One')
    expect(items[0].getAttribute('url')).to.equal('/child-one')
    expect(items[2].getAttribute('itemtitle')).to.equal('Parent Two')
  })

  it('null data does not rebuild items', async () => {
    const el = await fixture(html`<map-menu></map-menu>`)
    el.data = null
    await el.updateComplete
    expect(JSON.stringify(el.items)).to.equal('[]')
  })

  it('converts a JSON Outline Schema manifest into the item tree', async () => {
    const events = []
    const listeners = ['manifest-changed', 'data-changed', 'items-changed']
    const el = await fixture(html`<map-menu></map-menu>`)
    listeners.forEach((name) =>
      el.addEventListener(name, () => events.push(name)),
    )
    el.manifest = { items: sampleData() }
    await el.updateComplete
    await el.updateComplete
    await new Promise((r) => setTimeout(r, 50))
    expect(JSON.stringify(el.data === el.manifest.items)).to.equal('true')
    expect(el.items.length).to.equal(2)
    expect(el.items[0].children.length).to.equal(2)
    // the changed-event list covers manifest/items/selected (data feeds items)
    expect(events.includes('manifest-changed')).to.equal(true)
    expect(events.includes('items-changed')).to.equal(true)
    // items without a children array never render as submenus
    expect(el.shadowRoot.querySelectorAll('map-menu-submenu').length).to
      .equal(1)
  })

  // documented limitation: the data pipeline understands the linear
  // parent-id shape of JSON Outline Schema manifests. Items that carry a
  // children array instead of parent references are not re-nested and
  // render as flat top level leaves.
  it('manifest items with children arrays instead of parent ids render flat', async () => {
    const el = await fixture(html`<map-menu></map-menu>`)
    el.manifest = {
      items: [
        {
          id: 'top',
          title: 'Top',
          slug: '/top',
          children: [
            { id: 'sub', title: 'Sub', slug: '/sub', children: [] },
          ],
        },
      ],
    }
    await el.updateComplete
    await el.updateComplete
    await new Promise((r) => setTimeout(r, 50))
    // no parent ids -> everything lands at the top level as flat leaves
    expect(el.items.length).to.equal(1)
    expect(el.items[0].children.length).to.equal(0)
    expect(el.shadowRoot.querySelectorAll('map-menu-submenu').length).to
      .equal(0)
    expect(el.shadowRoot.querySelectorAll('map-menu-item').length).to.equal(
      1,
    )
  })

  it('notifies selected changes', async () => {
    const el = await fixture(html`<map-menu></map-menu>`)
    let detail = 'unset'
    el.addEventListener('selected-changed', (e) => {
      detail = e.detail.value
    })
    el.selected = 'p1'
    await el.updateComplete
    expect(detail).to.equal('p1')
  })

  it('__hasChildren reflects child presence', async () => {
    const el = await fixture(html`<map-menu></map-menu>`)
    expect(el.__hasChildren({ children: [1] })).to.equal(true)
    expect(el.__hasChildren({ children: [] })).to.equal(false)
  })

  it('link-clicked selects the item and fires selected', async () => {
    const el = await fixture(html`<map-menu .data=${sampleData()}></map-menu>`)
    await el.updateComplete
    let selected = 'unset'
    el.addEventListener('selected', (e) => {
      selected = e.detail
    })
    const leaf = el.shadowRoot.querySelector('map-menu-item')
    leaf._click()
    expect(el.selected).to.equal('c1')
    expect(selected).to.equal('c1')
  })

  it('active-item updates the active attribute and aria-current', async () => {
    const el = await fixture(html`<map-menu .data=${sampleData()}></map-menu>`)
    await el.updateComplete
    const first = el.shadowRoot.querySelector('map-menu-item')
    first.dispatchEvent(
      new CustomEvent('active-item', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: first,
      }),
    )
    await el.updateComplete
    expect(el.activeItem === first).to.equal(true)
    expect(first.hasAttribute('active')).to.equal(true)
    expect(first.getAttribute('aria-current')).to.equal('page')
    // switching the active item clears the old marker
    const second = el.shadowRoot.querySelectorAll('map-menu-item')[1]
    second.dispatchEvent(
      new CustomEvent('active-item', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: second,
      }),
    )
    await el.updateComplete
    expect(first.hasAttribute('active')).to.equal(false)
    expect(first.hasAttribute('aria-current')).to.equal(false)
    expect(second.hasAttribute('active')).to.equal(true)
  })

  it('refreshActiveChildren marks an inner link as the current page', async () => {
    const el = await fixture(html`<map-menu></map-menu>`)
    const withLink = globalThis.document.createElement('div')
    const link = globalThis.document.createElement('a')
    withLink.appendChild(link)
    el.refreshActiveChildren(withLink, null)
    expect(link.getAttribute('aria-current')).to.equal('page')
    expect(withLink.hasAttribute('active')).to.equal(true)
    // an element without a link gets the attribute itself
    const bare = globalThis.document.createElement('div')
    el.refreshActiveChildren(bare, null)
    expect(bare.getAttribute('aria-current')).to.equal('page')
    // old values are cleaned up, including their inner links; the new
    // active item keeps its own aria-current
    el.refreshActiveChildren(bare, withLink)
    expect(link.hasAttribute('aria-current')).to.equal(false)
    expect(withLink.hasAttribute('active')).to.equal(false)
    expect(bare.getAttribute('aria-current')).to.equal('page')
  })

  it('moves the active indicator onto the active item', async () => {
    const el = await fixture(
      html`<map-menu
        .data=${sampleData()}
        active-indicator
        .autoScroll=${false}
      ></map-menu>`,
    )
    await el.updateComplete
    const first = visibleItem(el)
    first.dispatchEvent(
      new CustomEvent('active-item', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: first,
      }),
    )
    await el.updateComplete
    await new Promise((r) => setTimeout(r, 300))
    const indicator = el.shadowRoot.querySelector('#activeindicator')
    const style = indicator.getAttribute('style')
    expect(style.includes('height:')).to.equal(true)
    expect(style.includes('height:0px')).to.equal(false)
  })

  it('hidden-check collapses the indicator when the active item is hidden', async () => {
    const el = await fixture(html`<map-menu .data=${sampleData()}></map-menu>`)
    await el.updateComplete
    const first = visibleItem(el)
    first.dispatchEvent(
      new CustomEvent('active-item', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: first,
      }),
    )
    await el.updateComplete
    first.dispatchEvent(
      new CustomEvent('map-meu-item-hidden-check', {
        bubbles: true,
        composed: true,
        detail: { action: 'closed', hiddenChild: true },
      }),
    )
    await new Promise((r) => setTimeout(r, 300))
    const indicator = el.shadowRoot.querySelector('#activeindicator')
    expect(indicator.getAttribute('style').includes('height:0px')).to.equal(
      true,
    )
    // a non-hidden check restores a measurable height
    first.dispatchEvent(
      new CustomEvent('map-meu-item-hidden-check', {
        bubbles: true,
        composed: true,
        detail: { action: 'opened', hiddenChild: false },
      }),
    )
    await new Promise((r) => setTimeout(r, 300))
    expect(
      indicator.getAttribute('style').includes('height:0px'),
    ).to.equal(false)
  })

  it('toggle-updated asks the active item to check its hidden state', async () => {
    const el = await fixture(html`<map-menu .data=${sampleData()}></map-menu>`)
    await el.updateComplete
    const first = el.shadowRoot.querySelector('map-menu-item')
    el.activeItem = first
    let captured = null
    first.addEventListener('map-menu-item-hidden-check', (e) => {
      captured = e.detail
    })
    const submenu = el.shadowRoot.querySelector('map-menu-submenu')
    submenu.dispatchEvent(
      new CustomEvent('toggle-updated', {
        bubbles: true,
        composed: true,
        detail: { opened: true },
      }),
    )
    expect(captured === null).to.equal(false)
    expect(captured.action).to.equal('opened')
    expect(captured.target === submenu).to.equal(true)
    // without an active item the toggle is ignored
    const fresh = await fixture(html`<map-menu .data=${sampleData()}></map-menu>`)
    await fresh.updateComplete
    fresh.shadowRoot
      .querySelector('map-menu-submenu')
      .dispatchEvent(
        new CustomEvent('toggle-updated', {
          bubbles: true,
          composed: true,
          detail: { opened: false },
        }),
      )
    expect(fresh.activeItem).to.equal(undefined)
  })

  it('autoScroll triggers the scroll handler for the active item', async () => {
    const el = await fixture(
      html`<map-menu .data=${sampleData()} auto-scroll></map-menu>`,
    )
    await el.updateComplete
    const calls = []
    el.__scrollHandler = (target, options) => calls.push({ target, options })
    const first = visibleItem(el)
    first.dispatchEvent(
      new CustomEvent('active-item', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: first,
      }),
    )
    await el.updateComplete
    expect(calls.length).to.equal(1)
    expect(calls[0].target === first).to.equal(true)
    expect(calls[0].options.duration).to.equal(50)
    expect(calls[0].options.scrollElement === el).to.equal(true)
  })

  it('__scrollHandler animates the scroll element toward the target', async () => {
    const el = await fixture(html`<map-menu></map-menu>`)
    const fakeTarget = {
      getBoundingClientRect: () => ({ top: 400, bottom: 440 }),
    }
    const makeScroll = () => ({
      getBoundingClientRect: () => ({ top: 0, bottom: 600 }),
      scrollTop: 0,
    })
    const center = makeScroll()
    el.__scrollHandler(fakeTarget, {
      duration: 40,
      scrollElement: center,
      align: 'center',
    })
    const bottom = makeScroll()
    el.__scrollHandler(fakeTarget, {
      duration: 40,
      scrollElement: bottom,
      align: 'bottom',
    })
    const top = makeScroll()
    el.__scrollHandler(fakeTarget, {
      duration: 40,
      scrollElement: top,
    })
    await new Promise((r) => setTimeout(r, 200))
    expect(center.scrollTop !== 0).to.equal(true)
    expect(bottom.scrollTop !== 0).to.equal(true)
    expect(top.scrollTop !== 0).to.equal(true)
  })

  it('computes scroll parents and viewport visibility', async () => {
    const el = await fixture(html`<map-menu></map-menu>`)
    expect(el.__getScrollParent(null)).to.equal(null)
    const scrollable = {
      scrollHeight: 200,
      clientHeight: 100,
      offsetTop: 0,
      offsetHeight: 100,
      parentNode: null,
    }
    expect(el.__getScrollParent(scrollable) === scrollable).to.equal(true)
    const parent = {
      scrollHeight: 300,
      clientHeight: 100,
      offsetTop: 0,
      offsetHeight: 100,
      parentNode: null,
    }
    const child = {
      scrollHeight: 10,
      clientHeight: 100,
      offsetTop: 10,
      offsetHeight: 40,
      parentNode: parent,
    }
    expect(el.__getScrollParent(child) === parent).to.equal(true)
    expect(el.__isInViewport(child)).to.equal(true)
    const offscreen = {
      scrollHeight: 10,
      clientHeight: 100,
      offsetTop: 200,
      offsetHeight: 40,
      parentNode: parent,
    }
    expect(el.__isInViewport(offscreen)).to.equal(false)
    const orphan = {
      scrollHeight: 10,
      clientHeight: 100,
      offsetTop: 0,
      offsetHeight: 40,
      parentNode: null,
    }
    expect(el.__isInViewport(orphan)).to.equal(false)
  })

  it('walks parents to find hidden submenu ancestors', async () => {
    const el = await fixture(html`<map-menu></map-menu>`)
    // a node whose parent submenu is closed counts as hidden
    const inClosed = {
      tagName: 'DIV',
      parentNode: {
        tagName: 'MAP-MENU-SUBMENU',
        opened: false,
        parentNode: { tagName: 'MAP-MENU' },
      },
    }
    expect(el.__parentsHidden(inClosed)).to.equal(true)
    // an open parent submenu keeps walking to the menu root
    const inOpen = {
      tagName: 'DIV',
      parentNode: {
        tagName: 'MAP-MENU-SUBMENU',
        opened: true,
        parentNode: { tagName: 'MAP-MENU' },
      },
    }
    expect(el.__parentsHidden(inOpen)).to.equal(false)
    const bare = { tagName: 'DIV', parentNode: null }
    expect(el.__parentsHidden(bare)).to.equal(null)
    // deeper nesting still finds the closed submenu
    const deep = {
      tagName: 'DIV',
      parentNode: {
        tagName: 'DIV',
        parentNode: {
          tagName: 'MAP-MENU-SUBMENU',
          opened: false,
          parentNode: { tagName: 'MAP-MENU' },
        },
      },
    }
    expect(el.__parentsHidden(deep)).to.equal(true)
  })

  it('opened-changed closes unhovered top submenus in horizontal mode', async () => {
    const el = await fixture(
      html`<map-menu .data=${sampleData()} is-horizontal></map-menu>`,
    )
    await el.updateComplete
    await new Promise((r) => setTimeout(r, 50))
    const submenu = el.shadowRoot.querySelector('map-menu-submenu')
    submenu.opened = true
    submenu.hovered = false
    await el.updateComplete
    submenu.dispatchEvent(
      new CustomEvent('opened-changed', {
        bubbles: true,
        composed: true,
        detail: true,
      }),
    )
    // an unhovered submenu gets force closed
    expect(submenu.opened).to.equal(false)
    // a hovered submenu keeps its open state
    submenu.hovered = true
    submenu.opened = true
    await el.updateComplete
    submenu.dispatchEvent(
      new CustomEvent('opened-changed', {
        bubbles: true,
        composed: true,
        detail: true,
      }),
    )
    expect(submenu.opened).to.equal(true)
    // vertical menus do not force close
    const vertical = await fixture(
      html`<map-menu .data=${sampleData()}></map-menu>`,
    )
    await vertical.updateComplete
    await new Promise((r) => setTimeout(r, 50))
    const vSub = vertical.shadowRoot.querySelector('map-menu-submenu')
    vSub.opened = true
    await vertical.updateComplete
    vSub.dispatchEvent(
      new CustomEvent('opened-changed', {
        bubbles: true,
        composed: true,
        detail: true,
      }),
    )
    expect(vSub.opened).to.equal(true)
  })
})
