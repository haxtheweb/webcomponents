import { fixture, expect, html } from '@open-wc/testing'
import '../lib/map-menu-submenu.js'

// direct lib import so istanbul sees lib/map-menu-submenu.js statements
describe('map-menu-submenu', () => {
  it('seeds defaults and renders a collapse with a header', async () => {
    const el = await fixture(
      html`<map-menu-submenu
        id="sub-one"
        itemtitle="Sub One"
        url="/sub-one"
      ></map-menu-submenu>`,
    )
    await el.updateComplete
    expect(el.editControls).to.equal(false)
    expect(el.iconLabel).to.equal(null)
    expect(el.opened).to.equal(false)
    expect(el.collapsable).to.equal(true)
    expect(el.isFlex).to.equal(false)
    expect(el.isNested).to.equal(false)
    expect(el.isHorizontal).to.equal(false)
    expect(el.expandChildren).to.equal(false)
    expect(el.hovered).to.equal(false)
    expect(el.active).to.equal(false)
    expect(el.label).to.equal('')
    expect(el.status).to.equal('')
    expect(el.itemtitle).to.equal('Sub One')
    expect(el.locked).to.equal(false)
    expect(el.published).to.equal(true)
    expect(el.hideInMenu).to.equal(false)
    expect(el.icon).to.equal(null)
    const collapse = el.shadowRoot.querySelector('a11y-collapse')
    expect(collapse === null).to.equal(false)
    const header = el.shadowRoot.querySelector('map-menu-header')
    expect(header === null).to.equal(false)
    expect(header.getAttribute('itemtitle')).to.equal('Sub One')
    expect(header.getAttribute('url')).to.equal('/sub-one')
    expect(collapse.hasAttribute('expanded')).to.equal(false)
  })

  it('passes state through to the header', async () => {
    const el = await fixture(
      html`<map-menu-submenu
        id="stateful"
        itemtitle="Stateful"
        label="state"
        url="/state"
        icon="icons:code"
        icon-label="document"
        selected="state"
        status="modified"
        ?edit-controls=${true}
        ?is-flex=${true}
        .published=${false}
        ?hide-in-menu=${true}
        ?locked=${true}
        ?hovered=${true}
        ?opened=${true}
      ></map-menu-submenu>`,
    )
    await el.updateComplete
    const header = el.shadowRoot.querySelector('map-menu-header')
    expect(header.getAttribute('label')).to.equal('state')
    expect(header.getAttribute('icon')).to.equal('icons:code')
    expect(header.getAttribute('icon-label')).to.equal('document')
    expect(header.getAttribute('selected')).to.equal('state')
    expect(header.getAttribute('status')).to.equal('modified')
    expect(header.hasAttribute('edit-controls')).to.equal(true)
    expect(header.hasAttribute('is-flex')).to.equal(true)
    // BUG: lib/map-menu-header.js:224 — published defaults to true in the
    // constructor (with reflect: true) while map-menu-submenu drives it with
    // a boolean ATTRIBUTE binding (?published), which can only ADD the
    // attribute (true) and never resets the property to false. The header
    // then reflects its constructor default back onto the DOM, so even with
    // the submenu's published property set to false the header still
    // renders as published. Documents current behavior for the fix swarm.
    expect(header.hasAttribute('published')).to.equal(true)
    expect(header.published).to.equal(true)
    expect(el.published).to.equal(false)
    expect(header.hasAttribute('hide-in-menu')).to.equal(true)
    expect(header.hasAttribute('locked')).to.equal(true)
    expect(header.hasAttribute('hovered')).to.equal(true)
    expect(header.hasAttribute('opened')).to.equal(true)
    expect(
      el.shadowRoot.querySelector('a11y-collapse').hasAttribute('expanded'),
    ).to.equal(true)
  })

  it('tracks hover state', async () => {
    const el = await fixture(html`<map-menu-submenu id="hover"></map-menu-submenu>`)
    el.dispatchEvent(new Event('mouseover'))
    expect(el.hovered).to.equal(true)
    el.dispatchEvent(new Event('mouseleave'))
    expect(el.hovered).to.equal(false)
    el.dispatchEvent(new Event('focusin'))
    expect(el.hovered).to.equal(true)
    el.dispatchEvent(new Event('focusout'))
    expect(el.hovered).to.equal(false)
  })

  it('opens on hover in horizontal mode and closes on leave', async () => {
    const el = await fixture(
      html`<map-menu-submenu
        id="flyout"
        is-horizontal
        .itemtitle=${'Flyout'}
      ></map-menu-submenu>`,
    )
    await el.updateComplete
    expect(el.opened).to.equal(false)
    el.dispatchEvent(new Event('mouseover'))
    expect(el.opened).to.equal(true)
    el.dispatchEvent(new Event('mouseleave'))
    expect(el.opened).to.equal(false)
    // nested or vertical submenus do not fly out on hover
    const nested = await fixture(
      html`<map-menu-submenu
        id="nested-flyout"
        is-horizontal
        is-nested
        .itemtitle=${'Nested'}
      ></map-menu-submenu>`,
    )
    await nested.updateComplete
    nested.dispatchEvent(new Event('mouseover'))
    expect(nested.opened).to.equal(false)
    const vertical = await fixture(
      html`<map-menu-submenu id="vertical" .itemtitle=${'Vertical'}></map-menu-submenu>`,
    )
    await vertical.updateComplete
    vertical.dispatchEvent(new Event('mouseover'))
    expect(vertical.opened).to.equal(false)
    // focus does not open the flyout, only hover does
    const focused = await fixture(
      html`<map-menu-submenu
        id="focused"
        is-horizontal
        .itemtitle=${'Focused'}
      ></map-menu-submenu>`,
    )
    await focused.updateComplete
    focused.dispatchEvent(new Event('focusin'))
    expect(focused.opened).to.equal(false)
  })

  it('aligns the collapse state and notifies in horizontal mode', async () => {
    const el = await fixture(
      html`<map-menu-submenu
        id="aligned"
        is-horizontal
        .itemtitle=${'Aligned'}
      ></map-menu-submenu>`,
    )
    await el.updateComplete
    let notified = 0
    el.addEventListener('opened-changed', () => {
      notified += 1
    })
    const collapse = el.shadowRoot.querySelector('a11y-collapse')
    collapse.dispatchEvent(
      new CustomEvent('a11y-collapse-click', { detail: { expanded: true } }),
    )
    expect(el.opened).to.equal(true)
    expect(notified).to.equal(1)
    // vertical submenus align quietly
    const vertical = await fixture(
      html`<map-menu-submenu id="quiet" .itemtitle=${'Quiet'}></map-menu-submenu>`,
    )
    await vertical.updateComplete
    let quiet = 0
    vertical.addEventListener('opened-changed', () => {
      quiet += 1
    })
    vertical.shadowRoot
      .querySelector('a11y-collapse')
      .dispatchEvent(
        new CustomEvent('a11y-collapse-click', { detail: { expanded: true } }),
      )
    expect(vertical.opened).to.equal(true)
    expect(quiet).to.equal(0)
  })

  it('opens on the first header click only', async () => {
    const el = await fixture(
      html`<map-menu-submenu id="clicky" .itemtitle=${'Click'}></map-menu-submenu>`,
    )
    await el.updateComplete
    const header = el.shadowRoot.querySelector('map-menu-header')
    header.dispatchEvent(
      new CustomEvent('link-clicked', {
        bubbles: true,
        composed: true,
        detail: { id: 'x' },
      }),
    )
    expect(el.opened).to.equal(true)
    // already open: clicking the header keeps it open
    header.dispatchEvent(
      new CustomEvent('link-clicked', {
        bubbles: true,
        composed: true,
        detail: { id: 'x' },
      }),
    )
    expect(el.opened).to.equal(true)
  })

  it('toggle-header flips the open state and notifies', async () => {
    const el = await fixture(
      html`<map-menu-submenu id="toggly" .itemtitle=${'Toggle'}></map-menu-submenu>`,
    )
    await el.updateComplete
    let detail = null
    el.addEventListener('toggle-updated', (e) => {
      detail = e.detail
    })
    const header = el.shadowRoot.querySelector('map-menu-header')
    header.dispatchEvent(
      new CustomEvent('toggle-header', {
        bubbles: true,
        composed: true,
        detail: true,
      }),
    )
    expect(el.opened).to.equal(true)
    expect(detail.opened).to.equal(true)
    header.dispatchEvent(
      new CustomEvent('toggle-header', {
        bubbles: true,
        composed: true,
        detail: true,
      }),
    )
    expect(el.opened).to.equal(false)
    expect(detail.opened).to.equal(false)
  })

  it('escalates hidden checks with the hidden child flag', async () => {
    const el = await fixture(
      html`<map-menu-submenu id="hidden-flag" .itemtitle=${'Hidden'}></map-menu-submenu>`,
    )
    await el.updateComplete
    let escalated = null
    el.addEventListener('map-meu-item-hidden-check', (e) => {
      escalated = e.detail
    })
    el.dispatchEvent(
      new CustomEvent('map-menu-item-hidden-check', {
        bubbles: true,
        composed: true,
        detail: { hiddenChild: false },
      }),
    )
    // closed submenu escalates that its children are hidden
    expect(escalated === null).to.equal(false)
    expect(escalated.hiddenChild).to.equal(true)
    // an open submenu reports its children as visible
    el.opened = true
    await el.updateComplete
    el.dispatchEvent(
      new CustomEvent('map-menu-item-hidden-check', {
        bubbles: true,
        composed: true,
        detail: { hiddenChild: false },
      }),
    )
    expect(escalated.hiddenChild).to.equal(false)
    // an explicit hidden child flag is recomputed from the open state,
    // not preserved (the real chain only ever sends the flag unset)
    el.dispatchEvent(
      new CustomEvent('map-menu-item-hidden-check', {
        bubbles: true,
        composed: true,
        detail: { hiddenChild: true },
      }),
    )
    expect(escalated.hiddenChild).to.equal(false)
  })

  it('activates when its own header is the active item', async () => {
    const el = await fixture(
      html`<map-menu-submenu id="activator" .itemtitle=${'Active'}></map-menu-submenu>`,
    )
    await el.updateComplete
    const header = el.shadowRoot.querySelector('map-menu-header')
    header.dispatchEvent(
      new CustomEvent('active-item', {
        bubbles: true,
        composed: true,
        detail: header,
      }),
    )
    expect(el.active).to.equal(true)
    expect(el.opened).to.equal(true)
    // a foreign active item deactivates the submenu
    const foreign = globalThis.document.createElement('div')
    el.dispatchEvent(
      new CustomEvent('active-item', {
        bubbles: true,
        composed: true,
        detail: foreign,
      }),
    )
    expect(el.active).to.equal(false)
    // horizontal top-level submenus close when another item activates
    const horizontal = await fixture(
      html`<map-menu-submenu
        id="flyout-active"
        is-horizontal
        .itemtitle=${'Flyout Active'}
      ></map-menu-submenu>`,
    )
    await horizontal.updateComplete
    horizontal.opened = true
    await horizontal.updateComplete
    horizontal.dispatchEvent(
      new CustomEvent('active-item', {
        bubbles: true,
        composed: true,
        detail: foreign,
      }),
    )
    expect(horizontal.active).to.equal(false)
    expect(horizontal.opened).to.equal(false)
    // nested horizontal submenus open instead
    const nested = await fixture(
      html`<map-menu-submenu
        id="nested-active"
        is-horizontal
        is-nested
        .itemtitle=${'Nested Active'}
      ></map-menu-submenu>`,
    )
    await nested.updateComplete
    nested.dispatchEvent(
      new CustomEvent('active-item', {
        bubbles: true,
        composed: true,
        detail: foreign,
      }),
    )
    expect(nested.active).to.equal(false)
    expect(nested.opened).to.equal(true)
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<map-menu-submenu id="a11y" .itemtitle=${'Accessible'}></map-menu-submenu>`,
    )
    await el.updateComplete
    await expect(el).shadowDom.to.be.accessible()
  })
})
