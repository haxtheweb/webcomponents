import { fixture, expect, html } from '@open-wc/testing'
import { A11yMenuButtonItem } from '../lib/a11y-menu-button-item.js'

// direct lib import so istanbul sees lib/a11y-menu-button-item.js statements
describe('a11y-menu-button-item', () => {
  it('defaults to the menuitem slot', async () => {
    const el = await fixture(
      html`<a11y-menu-button-item>Plain</a11y-menu-button-item>`,
    )
    expect(el.slot).to.equal('menuitem')
    expect(el.disabled).to.equal(undefined)
    expect(el.href).to.equal(undefined)
    expect(el.controls).to.equal(undefined)
  })

  it('renders as a button with controls and disabled state', async () => {
    const el = await fixture(
      html`<a11y-menu-button-item controls="target" disabled
        >Controlled</a11y-menu-button-item
      >`,
    )
    await el.updateComplete
    const button = el.shadowRoot.querySelector('button[role="menuitem"]')
    expect(button === null).to.equal(false)
    expect(button.getAttribute('aria-controls')).to.equal('target')
    expect(button.hasAttribute('disabled')).to.equal(true)
  })

  it('renders as a link with disabled flags', async () => {
    const el = await fixture(
      html`<a11y-menu-button-item href="/link" disabled
        >Disabled Link</a11y-menu-button-item
      >`,
    )
    await el.updateComplete
    const link = el.shadowRoot.querySelector('a[role="menuitem"]')
    expect(link === null).to.equal(false)
    expect(link.getAttribute('href')).to.equal('/link')
    expect(link.getAttribute('aria-disabled')).to.equal('true')
    expect(link.getAttribute('tabindex')).to.equal('-1')
    // whitespace-only hrefs render as buttons instead of links
    const blank = await fixture(
      html`<a11y-menu-button-item href=" ">Blank</a11y-menu-button-item>`,
    )
    await blank.updateComplete
    expect(blank.shadowRoot.querySelector('button[role="menuitem"]')).to.exist
    expect(blank.shadowRoot.querySelector('a[role="menuitem"]')).to.equal(null)
  })

  it('prevents clicks on disabled links only', async () => {
    const el = await fixture(
      html`<a11y-menu-button-item href="/x" disabled
        >Nope</a11y-menu-button-item
      >`,
    )
    let prevented = 0
    let stopped = 0
    const fake = {
      preventDefault() {
        prevented += 1
      },
      stopPropagation() {
        stopped += 1
      },
    }
    el._handleDisabledClick(fake)
    expect(prevented).to.equal(1)
    expect(stopped).to.equal(1)
    // enabled links keep their default navigation
    const live = await fixture(
      html`<a11y-menu-button-item href="/y">Yes</a11y-menu-button-item>`,
    )
    live._handleDisabledClick(fake)
    expect(prevented).to.equal(1)
    expect(stopped).to.equal(1)
  })

  it('focuses its inner menu item role element', async () => {
    const el = await fixture(
      html`<a11y-menu-button-item href="/f">Focusable</a11y-menu-button-item>`,
    )
    await el.updateComplete
    expect(el.menuItem === null).to.equal(false)
    el.focus()
    // focus inside a shadow root is reported on the host element
    expect(globalThis.document.activeElement === el).to.equal(true)
    // without a shadow root there is nothing to focus
    const bare = new A11yMenuButtonItem()
    expect(bare.menuItem).to.equal(undefined)
    let threw = false
    try {
      bare.focus()
    } catch (e) {
      threw = true
    }
    expect(threw).to.equal(false)
  })

  it('reflects the hidden attribute', async () => {
    const el = await fixture(
      html`<a11y-menu-button-item>Hideable</a11y-menu-button-item>`,
    )
    expect(el.hasAttribute('hidden')).to.equal(false)
    el.hidden = true
    await el.updateComplete
    expect(el.hasAttribute('hidden')).to.equal(true)
  })

  // BUG: lib/a11y-menu-button-item.js:223-237 — disconnectedCallback
  // dispatches remove-a11y-menu-button-item AFTER the element is already
  // detached, so the event can never bubble up to the parent; only the
  // add event from connectedCallback is ever observed by an ancestor.
  // Documents current behavior for the fix swarm.
  it('announces itself when added to the dom but not when removed', async () => {
    const events = []
    const listener = (e) => events.push({ type: e.type, detail: e.detail })
    const host = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(host)
    host.addEventListener('add-a11y-menu-button-item', listener)
    host.addEventListener('remove-a11y-menu-button-item', listener)
    const item = globalThis.document.createElement('a11y-menu-button-item')
    item.textContent = 'Dynamic'
    host.appendChild(item)
    await new Promise((r) => setTimeout(r, 20))
    item.remove()
    await new Promise((r) => setTimeout(r, 20))
    // only the add event arrives; the remove event dies with the detached node
    expect(events.length).to.equal(1)
    expect(events[0].type).to.equal('add-a11y-menu-button-item')
    expect(events[0].detail === item).to.equal(true)
    // a manually delivered remove event does reach the menu (see the
    // behaviors test for what the handler then does with it)
    const stillConnected = globalThis.document.createElement(
      'a11y-menu-button-item',
    )
    host.appendChild(stillConnected)
    let manual = null
    stillConnected.addEventListener(
      'remove-a11y-menu-button-item',
      (e) => {
        manual = e.detail
      },
    )
    stillConnected.dispatchEvent(
      new CustomEvent('remove-a11y-menu-button-item', {
        bubbles: true,
        composed: true,
        detail: stillConnected,
      }),
    )
    expect(manual === stillConnected).to.equal(true)
    host.remove()
  })
})
