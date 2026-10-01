import { fixture, expect, html } from '@open-wc/testing'
import '../page-contents-menu.js'
// pre-load the dynamically imported mobile UI so imports resolve from cache
import '@haxtheweb/simple-popover/simple-popover.js'
import '@haxtheweb/simple-tooltip/simple-tooltip.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const contentHTML = html`
  <div id="content">
    <page-contents-menu relationship="parent"></page-contents-menu>
    <h1>This is a menu position to a heading</h1>
    <p>Stuff and things</p>
    <h2>Something else</h2>
    <p>Stuff and things</p>
    <h2 id="whatever">Something 2</h2>
    <p>Stuff and things</p>
    <h3 id="cool">Something deeper</h3>
    <p>Stuff and things</p>
    <h2>Something else 2</h2>
  </div>
`

describe('page-contents-menu rendering', () => {
  it('seeds defaults', async () => {
    const el = await fixture(html`<page-contents-menu></page-contents-menu>`)
    expect(el.tagName).to.equal('PAGE-CONTENTS-MENU')
    expect(el.items).to.deep.equal([])
    expect(el.isEmpty).to.equal(true)
    expect(el.hideIfEmpty).to.equal(false)
    expect(el.mobile).to.equal(false)
    expect(el.hideSettings).to.equal(true)
    expect(el.label).to.equal('Contents')
    expect(el.position).to.equal('left')
    expect(el.relationship).to.equal(null)
    expect(el.contentContainer).to.equal(null)
    expect(el.scrollPolling).to.equal(200)
    expect(el.hierarchyTags).to.deep.equal([
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ])
  })

  it('renders a desktop menu from the parent content container', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(150)
    expect(el.isEmpty).to.equal(false)
    expect(el.items.length).to.equal(5)
    const links = el.shadowRoot.querySelectorAll('a.link')
    expect(links.length).to.equal(5)
    // label renders in the header on desktop
    expect(el.shadowRoot.querySelector('.label').textContent).to.equal(
      'Contents',
    )
    // section semantics wrap the menu
    const section = el.shadowRoot.querySelector('section.wrapper')
    expect(section.getAttribute('role')).to.equal('navigation')
    expect(section.getAttribute('typeof')).to.equal('oer:TableOfContents')
    expect(section.getAttribute('aria-label')).to.equal('Contents')
    // indent classes follow heading depth
    expect(
      el.shadowRoot.querySelector('a[href$="#whatever"]').className.includes(
        'indent-2',
      ),
    ).to.equal(true)
    expect(
      el.shadowRoot.querySelector('a[href$="#cool"]').className.includes(
        'indent-3',
      ),
    ).to.equal(true)
    // every item carries oer schema wiring
    const metas = el.shadowRoot.querySelectorAll(
      'meta[property="oer:forComponent"]',
    )
    expect(metas.length).to.equal(5)
    // no popover on desktop
    expect(el.shadowRoot.querySelector('simple-popover')).to.equal(null)
    // titles come from heading text
    expect(el.items[0].title).to.equal('This is a menu position to a heading')
    // links are absolute with the current path
    expect(el.items[0].link).to.equal(
      globalThis.document.location.pathname + '#' + el.items[0].id,
    )
  })

  it('reflects is-empty and hide-if-empty to hide the menu', async () => {
    const el = await fixture(html`<page-contents-menu></page-contents-menu>`)
    el.isEmpty = true
    el.hideIfEmpty = true
    await el.updateComplete
    expect(el.hasAttribute('is-empty')).to.equal(true)
    expect(el.hasAttribute('hide-if-empty')).to.equal(true)
    expect(globalThis.getComputedStyle(el).display).to.equal('none')
  })

  it('renders supplied link items with active state and aria-current', async () => {
    const el = await fixture(html`<page-contents-menu></page-contents-menu>`)
    el.items = [
      {
        title: 'External doc',
        link: '/docs/page',
        indent: 2,
        active: 'active',
        id: null,
      },
      {
        title: 'Second doc',
        link: '/docs/second',
        indent: 4,
        active: '',
        id: null,
      },
    ]
    await el.updateComplete
    const links = el.shadowRoot.querySelectorAll('a.link')
    expect(links.length).to.equal(2)
    expect(links[0].getAttribute('href')).to.equal('/docs/page')
    expect(links[0].getAttribute('title')).to.equal('External doc')
    expect(links[0].getAttribute('aria-current')).to.equal('true')
    expect(links[0].className.includes('active')).to.equal(true)
    expect(links[0].className.includes('indent-2')).to.equal(true)
    // inactive items drop the aria-current attribute entirely
    expect(links[1].hasAttribute('aria-current')).to.equal(false)
    expect(links[1].className.includes('indent-4')).to.equal(true)
    // meta content prefers id but falls back to link
    const metas = el.shadowRoot.querySelectorAll(
      'meta[property="oer:forComponent"]',
    )
    expect(metas[0].getAttribute('content')).to.equal('/docs/page')
  })

  it('renders id based items with hash links', async () => {
    const el = await fixture(html`<page-contents-menu></page-contents-menu>`)
    el.items = [
      { title: 'Section one', id: 'section-one', indent: 1, active: '' },
    ]
    await el.updateComplete
    const link = el.shadowRoot.querySelector('a.link')
    expect(link.getAttribute('href')).to.equal('#section-one')
    expect(link.getAttribute('role')).to.equal('link')
    expect(link.getAttribute('data-index')).to.equal('0')
    expect(link.textContent).to.equal('Section one')
    expect(
      el.shadowRoot
        .querySelector('meta[property="oer:forComponent"]')
        .getAttribute('content'),
    ).to.equal('section-one')
  })

  it('passes a11y audit on the desktop menu', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(150)
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('page-contents-menu container wiring', () => {
  it('wires relationship parent, next and previous containers', async () => {
    const root = await fixture(html`
      <div>
        <h2 id="prev-heading">Previous</h2>
        <page-contents-menu relationship="next"></page-contents-menu>
        <h2 id="next-heading">Next</h2>
        <page-contents-menu relationship="previous"></page-contents-menu>
      </div>
    `)
    const menus = root.querySelectorAll('page-contents-menu')
    // firstUpdated resolves on the next tick, relationships resolve then
    await wait(50)
    const nextMenu = menus[0]
    expect(nextMenu.contentContainer === root.querySelector('#next-heading')).to.equal(true)
    const prevMenu = menus[1]
    expect(prevMenu.contentContainer === root.querySelector('#next-heading')).to.equal(true)
    // an unknown relationship leaves the container unset
    const el = await fixture(html`
      <div>
        <page-contents-menu relationship="other"></page-contents-menu>
        <h2>Heading</h2>
      </div>
    `)
    expect(el.querySelector('page-contents-menu').contentContainer).to.equal(
      null,
    )
  })

  it('marks the menu empty when the container has no hierarchy', async () => {
    const root = await fixture(html`
      <div>
        <page-contents-menu relationship="parent"></page-contents-menu>
        <p>Only paragraphs</p>
        <div>and divs</div>
      </div>
    `)
    const el = root.querySelector('page-contents-menu')
    await wait(100)
    expect(el.isEmpty).to.equal(true)
    expect(el.items.length).to.equal(0)
  })

  it('bails from updateMenu without a content container', async () => {
    const el = await fixture(html`<page-contents-menu></page-contents-menu>`)
    el.isEmpty = false
    el.updateMenu()
    expect(el.isEmpty).to.equal(true)
    expect(el.items).to.deep.equal([])
  })

  it('falls back to title, mediaTitle and configured fallback text', async () => {
    const root = await fixture(html`
      <div>
        <page-contents-menu relationship="parent"></page-contents-menu>
        <h2 title="From title attribute"></h2>
        <h3></h3>
        <h4></h4>
      </div>
    `)
    const el = root.querySelector('page-contents-menu')
    const headings = root.querySelectorAll('h2, h3, h4')
    headings[1].mediaTitle = 'From mediaTitle property'
    el.fallbackText = { h4: 'From fallbackText' }
    await wait(100)
    expect(el.items.length).to.equal(3)
    expect(el.items[0].title).to.equal('From title attribute')
    expect(el.items[1].title).to.equal('From mediaTitle property')
    expect(el.items[2].title).to.equal('From fallbackText')
  })

  it('builds ids from the resource attribute when missing', async () => {
    const root = await fixture(html`
      <div>
        <page-contents-menu relationship="parent"></page-contents-menu>
        <h2 resource="video-1*">Titled</h2>
      </div>
    `)
    const el = root.querySelector('page-contents-menu')
    await wait(100)
    expect(el.items.length).to.equal(1)
    expect(root.querySelector('h2').id).to.equal('h2video1')
    expect(el.items[0].id).to.equal('h2video1')
  })

  it('generates sequential ids for id-less headings', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(150)
    expect(el.items.length).to.equal(5)
    // first heading has no id so one is generated from tag + child index
    expect(el.items[0].id.startsWith('h1')).to.equal(true)
    expect(el.items[0].id).to.not.equal(null)
    expect(el.items[3].id).to.equal('cool')
  })
})

describe('page-contents-menu scroll interactions', () => {
  it('marks the first visible item active and others inactive', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(150)
    // items changed fires scrollFinished; patch geometry so only item 1 counts
    const headings = []
    el.items.forEach((item) => {
      headings.push(item.item)
      item.item.getBoundingClientRect = () => ({ top: 9999 })
    })
    headings[1].getBoundingClientRect = () => ({ top: 50 })
    headings[2].getBoundingClientRect = () => ({ top: 1000 })
    el.scrollFinished()
    await el.updateComplete
    expect(el.items[1].active).to.equal('active')
    expect(el.items[0].active).to.equal('')
    expect(el.items[2].active).to.equal('')
    // the active link reflects in the dom
    expect(
      el.shadowRoot.querySelector('a.active') === null,
    ).to.equal(false)
  })

  it('falls back to the first item when everything is below the fold', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(150)
    el.items.forEach((item) => {
      item.item.getBoundingClientRect = () => ({ top: 9999 })
    })
    el.scrollFinished()
    await el.updateComplete
    expect(el.items[0].active).to.equal('active')
  })

  it('falls back to the last item when everything is above the fold', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(150)
    el.items.forEach((item) => {
      item.item.getBoundingClientRect = () => ({ top: -9999 })
    })
    el.scrollFinished()
    await el.updateComplete
    expect(el.items[el.items.length - 1].active).to.equal('active')
    expect(el.items[0].active).to.equal('')
  })

  it('logs and skips items that can not be resolved', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(150)
    const logs = []
    const origLog = console.log
    console.log = (...args) => {
      logs.push(args.join(' '))
    }
    // invalid selector ids blow up inside the try / catch guards
    el.items = [
      { id: '##bad', title: 'Bad', active: '', item: {} },
      { id: '##worse', title: 'Worse', active: '', item: {} },
    ]
    el.scrollFinished()
    console.log = origLog
    await el.updateComplete
    // two lookups fail in the loop and the first item lookup fails again
    expect(logs.length).to.equal(3)
    expect(el.items[0].active).to.equal('')
  })

  it('debounces scroll events into a scroll finished pass', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(150)
    el.items.forEach((item) => {
      item.item.getBoundingClientRect = () => ({ top: -9999 })
    })
    globalThis.dispatchEvent(new Event('scroll'))
    await wait(300)
    expect(el.items[el.items.length - 1].active).to.equal('active')
  })

  it('jumps to the referenced object on link click', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(150)
    const calls = []
    el.items[0].item.scrollIntoView = (...args) => {
      calls.push(args)
    }
    // open the menu so the click can close it again
    el.hideSettings = false
    const link = el.shadowRoot.querySelector('a[data-index="0"]')
    link.click()
    expect(calls.length).to.equal(1)
    expect(calls[0][0].behavior).to.equal('smooth')
    expect(calls[0][0].block).to.equal('start')
    expect(calls[0][0].inline).to.equal('start')
    // state is kept in history and the menu closes
    expect(el.hideSettings).to.equal(true)
  })

  it('uses the plain scrollIntoView on Safari', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(150)
    globalThis.safari = {}
    const calls = []
    el.items[0].item.scrollIntoView = (...args) => {
      calls.push(args)
    }
    el.shadowRoot.querySelector('a[data-index="0"]').click()
    delete globalThis.safari
    expect(calls.length).to.equal(1)
    expect(calls[0].length).to.equal(0)
  })

  it('ignores clicks when the item can not be resolved', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(150)
    const calls = []
    el.items[0].item.scrollIntoView = () => {
      calls.push('nope')
    }
    // capture the link, then empty the items so the guard fails
    const link = el.shadowRoot.querySelector('a[data-index="0"]')
    expect(link === null).to.equal(false)
    el.items = []
    await el.updateComplete
    link.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    )
    expect(calls.length).to.equal(0)
  })
})

describe('page-contents-menu keyboard and mobile menu', () => {
  it('toggles the mobile menu from click and keyboard', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    el.mobile = true
    await el.updateComplete
    await wait(150)
    expect(el.hideSettings).to.equal(true)
    el.toggleSettings({})
    expect(el.hideSettings).to.equal(false)
    el.toggleSettings({})
    expect(el.hideSettings).to.equal(true)
    // enter and space also toggle
    el.keyToggle({ key: 'Enter' })
    expect(el.hideSettings).to.equal(false)
    el.keyToggle({ key: ' ' })
    expect(el.hideSettings).to.equal(true)
    el.keyToggle({ key: 'Spacebar' })
    expect(el.hideSettings).to.equal(false)
    // other keys do nothing
    el.keyToggle({ key: 'Escape' })
    expect(el.hideSettings).to.equal(false)
    // key scroll only responds to Enter, dispatched on the rendered link
    const calls = []
    el.items[0].item.scrollIntoView = (...args) => {
      calls.push(args)
    }
    const link = el.shadowRoot.querySelector('a[data-index="0"]')
    link.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }),
    )
    expect(calls.length).to.equal(1)
    link.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true, composed: true }),
    )
    expect(calls.length).to.equal(1)
    // desktop menus ignore toggling (the Enter scroll above re-closed the
    // menu, so reset before checking the no-op)
    el.mobile = false
    await el.updateComplete
    el.hideSettings = false
    el.toggleSettings({})
    expect(el.hideSettings).to.equal(false)
  })

  it('wires the popover target while mobile and clears it after', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    el.mobile = true
    await el.updateComplete
    await wait(150)
    const target = el.shadowRoot.querySelector('#popovertarget')
    expect(target.hasAttribute('tabindex')).to.equal(true)
    expect(target.getAttribute('tabindex')).to.equal('0')
    const popover = el.shadowRoot.querySelector('simple-popover')
    expect(popover === null).to.equal(false)
    expect(popover.target === target).to.equal(true)
    // leaving mobile clears the tabindex hook
    el.mobile = false
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#popovertarget').hasAttribute('tabindex')).to.equal(
      false,
    )
  })

  it('runs the delayed menu refresh from firstUpdated', async () => {
    const root = await fixture(contentHTML)
    const el = root.querySelector('page-contents-menu')
    await wait(1700)
    expect(el.items.length).to.equal(5)
    expect(el.isEmpty).to.equal(false)
  })
})
