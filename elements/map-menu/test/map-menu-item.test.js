import { fixture, expect, html } from '@open-wc/testing'
import '../lib/map-menu-item.js'

// direct lib import so istanbul sees lib/map-menu-item.js statements
describe('map-menu-item', () => {
  it('seeds defaults', async () => {
    const el = await fixture(html`<map-menu-item></map-menu-item>`)
    expect(el.editControls).to.equal(false)
    expect(el.isNested).to.equal(false)
    expect(el.icon).to.equal(null)
    expect(el.iconLabel).to.equal(null)
    expect(el.itemtitle).to.equal('')
    expect(el.url).to.equal('')
    expect(el.active).to.equal(false)
    expect(el.hovered).to.equal(false)
    expect(el.hideInMenu).to.equal(false)
    expect(el.published).to.equal(false)
    expect(el.locked).to.equal(false)
    expect(el.status).to.equal('')
    expect(el.t.pageIsUnpublished).to.equal('Page is unpublished')
  })

  it('renders a link, button, title and placeholder icon', async () => {
    const el = await fixture(
      html`<map-menu-item
        itemtitle="Item One"
        url="/item-one"
      ></map-menu-item>`,
    )
    await el.updateComplete
    const link = el.shadowRoot.querySelector('a')
    expect(link === null).to.equal(false)
    expect(link.getAttribute('href')).to.equal('/item-one')
    expect(link.getAttribute('title')).to.equal('Item One')
    expect(el.shadowRoot.querySelector('button') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('.title').textContent).to.equal(
      'Item One',
    )
    expect(el.shadowRoot.querySelector('.no-icon') === null).to.equal(false)
  })

  it('flags unpublished items and shows their icon', async () => {
    const el = await fixture(
      html`<map-menu-item
        itemtitle="Draft"
        url="/draft"
        published
      ></map-menu-item>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#unpublished')).to.equal(null)
    // unpublished (default) shows the visibility-off marker
    const draft = await fixture(
      html`<map-menu-item itemtitle="Draft" url="/draft"></map-menu-item>`,
    )
    await draft.updateComplete
    const icon = draft.shadowRoot.querySelector('#unpublished')
    expect(icon === null).to.equal(false)
    expect(icon.getAttribute('title')).to.equal('Page is unpublished')
  })

  it('renders icons, tooltips and edit operations when configured', async () => {
    const el = await fixture(
      html`<map-menu-item
        itemtitle="With Icon"
        url="/icon"
        published
        icon="icons:code"
        icon-label="document"
      ></map-menu-item>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#icon') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('simple-tooltip') === null).to.equal(
      false,
    )
    expect(el.shadowRoot.querySelector('.no-icon')).to.equal(null)
    // edit operations only render when active and editControls are on
    const editing = await fixture(
      html`<map-menu-item
        itemtitle="Editing"
        url="/editing"
        published
        edit-controls
        .active=${true}
      ></map-menu-item>`,
    )
    await editing.updateComplete
    expect(editing.shadowRoot.querySelector('.ops') === null).to.equal(false)
    expect(
      editing.shadowRoot.querySelector('.ops haxcms-page-operations') === null,
    ).to.equal(false)
    const noOps = await fixture(
      html`<map-menu-item itemtitle="No Ops" url="/no-ops"></map-menu-item>`,
    )
    await noOps.updateComplete
    expect(noOps.shadowRoot.querySelector('.ops')).to.equal(null)
  })

  it('tracks hover and focus state', async () => {
    const el = await fixture(html`<map-menu-item></map-menu-item>`)
    // listeners bind on a timeout so let it settle first
    await new Promise((r) => setTimeout(r, 50))
    el.dispatchEvent(new Event('mouseover'))
    expect(el.hovered).to.equal(true)
    await el.updateComplete
    expect(el.hasAttribute('hovered')).to.equal(true)
    el.dispatchEvent(new Event('mouseleave'))
    expect(el.hovered).to.equal(false)
    el.dispatchEvent(new Event('focusin'))
    expect(el.hovered).to.equal(true)
    el.dispatchEvent(new Event('focusout'))
    expect(el.hovered).to.equal(false)
  })

  it('announces itself as active when selected matches its id', async () => {
    const el = await fixture(
      html`<map-menu-item itemtitle="Pick Me" url="/pick"></map-menu-item>`,
    )
    let active = null
    el.addEventListener('active-item', (e) => {
      active = e.detail
    })
    el.id = 'target'
    el.selected = 'target'
    await el.updateComplete
    await new Promise((r) => setTimeout(r, 20))
    expect(active === el).to.equal(true)
    // a non matching selection stays quiet
    const other = await fixture(
      html`<map-menu-item itemtitle="Other" url="/other"></map-menu-item>`,
    )
    let quiet = 0
    other.addEventListener('active-item', () => {
      quiet += 1
    })
    other.id = 'a'
    other.selected = 'b'
    await other.updateComplete
    await new Promise((r) => setTimeout(r, 20))
    expect(quiet).to.equal(0)
  })

  it('fires link-clicked with its id on click', async () => {
    const el = await fixture(
      html`<map-menu-item itemtitle="Click" url="/click"></map-menu-item>`,
    )
    let detail = null
    el.addEventListener('link-clicked', (e) => {
      detail = e.detail
    })
    el.id = 'clickable'
    el._click()
    expect(detail.id).to.equal('clickable')
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<map-menu-item
        itemtitle="Accessible"
        url="/a11y"
        published
      ></map-menu-item>`,
    )
    await el.updateComplete
    await expect(el).shadowDom.to.be.accessible()
  })
})
