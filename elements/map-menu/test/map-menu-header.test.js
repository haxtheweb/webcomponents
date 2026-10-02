import { fixture, expect, html } from '@open-wc/testing'
import '../lib/map-menu-header.js'

// direct lib import so istanbul sees lib/map-menu-header.js statements
describe('map-menu-header', () => {
  it('seeds defaults', async () => {
    const el = await fixture(html`<map-menu-header></map-menu-header>`)
    expect(el.editControls).to.equal(false)
    expect(el.isFlex).to.equal(false)
    expect(el.iconLabel).to.equal(null)
    expect(el.icon).to.equal(null)
    expect(el.url).to.equal('')
    expect(el.status).to.equal('')
    expect(el.opened).to.equal(false)
    expect(el.active).to.equal(false)
    expect(el.published).to.equal(true)
    expect(el.hideInMenu).to.equal(false)
    expect(el.hovered).to.equal(false)
    expect(el.locked).to.equal(false)
    expect(el.itemtitle).to.equal('')
    expect(el.t.pageIsUnpublished).to.equal('Page is unpublished')
  })

  it('renders the header link, button and title', async () => {
    const el = await fixture(
      html`<map-menu-header
        itemtitle="Header One"
        url="/header-one"
      ></map-menu-header>`,
    )
    await el.updateComplete
    const link = el.shadowRoot.querySelector('a')
    expect(link === null).to.equal(false)
    expect(link.getAttribute('href')).to.equal('/header-one')
    expect(link.getAttribute('title')).to.equal('Header One')
    expect(el.shadowRoot.querySelector('.title').textContent).to.equal(
      'Header One',
    )
    expect(el.shadowRoot.querySelector('button') === null).to.equal(false)
  })

  it('marks unpublished headers and their icon', async () => {
    const el = await fixture(
      html`<map-menu-header
        itemtitle="Draft"
        url="/draft"
        .published=${false}
      ></map-menu-header>`,
    )
    await el.updateComplete
    const icon = el.shadowRoot.querySelector('#unpublished')
    expect(icon === null).to.equal(false)
    expect(icon.getAttribute('title')).to.equal('Page is unpublished')
    const live = await fixture(
      html`<map-menu-header itemtitle="Live" url="/live"></map-menu-header>`,
    )
    await live.updateComplete
    expect(live.shadowRoot.querySelector('#unpublished')).to.equal(null)
  })

  it('renders icons, tooltips and edit operations when configured', async () => {
    const el = await fixture(
      html`<map-menu-header
        itemtitle="With Icon"
        url="/icon"
        icon="icons:code"
        icon-label="document"
      ></map-menu-header>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#icon') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('simple-tooltip') === null).to.equal(
      false,
    )
    // without an icon there is nothing but the title
    const plain = await fixture(
      html`<map-menu-header itemtitle="Plain" url="/plain"></map-menu-header>`,
    )
    await plain.updateComplete
    expect(plain.shadowRoot.querySelector('#icon')).to.equal(null)
    // edit operations need both editControls and active state
    const editing = await fixture(
      html`<map-menu-header
        itemtitle="Editing"
        url="/editing"
        edit-controls
        .active=${true}
      ></map-menu-header>`,
    )
    await editing.updateComplete
    expect(editing.shadowRoot.querySelector('.ops') === null).to.equal(false)
    const inactive = await fixture(
      html`<map-menu-header
        itemtitle="Inactive"
        url="/inactive"
        edit-controls
      ></map-menu-header>`,
    )
    await inactive.updateComplete
    expect(inactive.shadowRoot.querySelector('.ops')).to.equal(null)
  })

  it('derives the collapse icon and aria when opened changes', async () => {
    const el = await fixture(
      html`<map-menu-header itemtitle="T" url="/t"></map-menu-header>`,
    )
    await el.updateComplete
    el.opened = true
    await el.updateComplete
    expect(el.__collapseIcon).to.equal('icons:expand-more')
    expect(el.__collapseAria).to.equal('collapse menu')
    el.opened = false
    await el.updateComplete
    expect(el.__collapseIcon).to.equal('icons:chevron-right')
    expect(el.__collapseAria).to.equal('expand menu')
    // _openedChanged mirrors the same mapping directly
    el._openedChanged(true)
    expect(el.__collapseIcon).to.equal('icons:expand-more')
    el._openedChanged(false)
    expect(el.__collapseIcon).to.equal('icons:chevron-right')
  })

  it('asks to expand when it becomes the selected item', async () => {
    const el = await fixture(
      html`<map-menu-header itemtitle="Pick" url="/pick"></map-menu-header>`,
    )
    const events = []
    el.addEventListener('toggle-header', () => events.push('toggle-header'))
    el.addEventListener('active-item', () => events.push('active-item'))
    el.id = 'target'
    el.selected = 'target'
    await el.updateComplete
    await new Promise((r) => setTimeout(r, 20))
    expect(events.includes('toggle-header')).to.equal(true)
    expect(events.includes('active-item')).to.equal(true)
    // an already expanded parent does not ask again
    const expanded = await fixture(
      html`<map-menu-header itemtitle="Open" url="/open"></map-menu-header>`,
    )
    const toggles = []
    expanded.addEventListener('toggle-header', () => toggles.push(1))
    expanded.parentNode.expanded = true
    expanded.id = 'open'
    expanded.selected = 'open'
    await expanded.updateComplete
    await new Promise((r) => setTimeout(r, 20))
    expect(toggles.length).to.equal(0)
    // a non matching selection stays quiet
    const quiet = await fixture(
      html`<map-menu-header itemtitle="Quiet" url="/quiet"></map-menu-header>`,
    )
    let any = 0
    quiet.addEventListener('toggle-header', () => {
      any += 1
    })
    quiet.id = 'a'
    quiet.selected = 'b'
    await quiet.updateComplete
    await new Promise((r) => setTimeout(r, 20))
    expect(any).to.equal(0)
  })

  it('does not auto-open when id and selected are both empty', async () => {
    const el = await fixture(
      html`<map-menu-header itemtitle="Empty" url="/empty"></map-menu-header>`,
    )
    const events = []
    el.addEventListener('toggle-header', () => events.push('toggle-header'))
    el.addEventListener('active-item', () => events.push('active-item'))
    // empty id + empty selected must not count as a match (they used to,
    // which auto-opened submenus via toggle-header on first paint)
    el.selected = ''
    el.id = 'x'
    await el.updateComplete
    el.id = ''
    await el.updateComplete
    await new Promise((r) => setTimeout(r, 20))
    expect(events.length).to.equal(0)
  })

  it('toggles on click and enter key once listeners bind', async () => {
    const el = await fixture(
      html`<map-menu-header itemtitle="Tap" url="/tap"></map-menu-header>`,
    )
    // click/keydown listeners bind on a timeout
    await new Promise((r) => setTimeout(r, 20))
    const toggles = []
    el.addEventListener('toggle-header', () => toggles.push(1))
    el.dispatchEvent(new Event('click'))
    expect(toggles.length).to.equal(1)
    // the expanded parent swallows the toggle request
    el.parentNode.expanded = true
    el.dispatchEvent(new Event('click'))
    expect(toggles.length).to.equal(1)
    // enter triggers the same path, other keys do not
    el.parentNode.expanded = false
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(toggles.length).to.equal(2)
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(toggles.length).to.equal(2)
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<map-menu-header
        itemtitle="Accessible"
        url="/a11y"
      ></map-menu-header>`,
    )
    await el.updateComplete
    await expect(el).shadowDom.to.be.accessible()
  })
})
