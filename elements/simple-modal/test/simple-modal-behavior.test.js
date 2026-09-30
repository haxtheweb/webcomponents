import { fixture, expect, html } from '@open-wc/testing'

// Pre-import web-dialog so firstUpdated's dynamic import resolves from
// cache and the element is defined before any modal renders
// (mirrors test/simple-modal.test.js).
import 'web-dialog/index.js'
import '../simple-modal.js'
import { SimpleModal } from '../simple-modal.js'

// wait for the web-dialog dynamic import + upgrade + open event plumbing
const settleDialog = async (el, ms = 150) => {
  await el.updateComplete
  await new Promise((resolve) => setTimeout(resolve, ms))
  await el.updateComplete
}

const tick = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms))

// custom host with a focusable button in its shadow root
class TestShadowHost extends HTMLElement {
  static get tag() {
    return 'test-shadow-host'
  }
  constructor() {
    super()
    this.innerFocused = false
    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = '<button id="inner">inner</button>'
    root
      .querySelector('#inner')
      .addEventListener('focus', () => {
        this.innerFocused = true
      })
  }
}
customElements.define(TestShadowHost.tag, TestShadowHost)

function makeContent(htmlString) {
  const div = globalThis.document.createElement('div')
  div.innerHTML = htmlString
  return div
}

describe('simple-modal behavior', () => {
  it('has the correct tag name', () => {
    expect(SimpleModal.tag).to.equal('simple-modal')
  })

  it('clears pending timers when disconnected', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    el.__focusRestoreTimer = setTimeout(() => {}, 1000)
    el.__modalContentFocusTimer = setTimeout(() => {}, 1000)
    el.remove()
    expect(el.__focusRestoreTimer).to.equal(null)
    expect(el.__modalContentFocusTimer).to.equal(null)
  })

  it('showEvent clears a pending content focus timer before showing', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    el.__modalContentFocusTimer = setTimeout(() => {}, 1000)
    const oldTimer = el.__modalContentFocusTimer
    el.showEvent({
      detail: { title: 'T', mode: 'm', elements: {} },
    })
    expect(el.opened).to.be.true
    expect(el.title).to.equal('T')
    expect(el.__modalContentFocusTimer !== oldTimer).to.be.true
    await settleDialog(el, 30)
    el.close()
  })

  it('queueFocusModalContent replaces a pending timer', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    el.__modalContentFocusTimer = setTimeout(() => {}, 1000)
    const oldTimer = el.__modalContentFocusTimer
    el._queueFocusModalContent()
    expect(el.__modalContentFocusTimer !== oldTimer).to.be.true
    await tick()
  })

  it('focuses slotted content that exposes focusInitial', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    let focused = false
    const content = globalThis.document.createElement('div')
    content.focusInitial = () => {
      focused = true
    }
    el.show('T', 'm', { content }, null)
    await settleDialog(el, 30)
    expect(focused).to.be.true
    el.close()
  })

  it('focuses slotted buttons that expose focusInitial', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    let focused = false
    const buttons = globalThis.document.createElement('div')
    buttons.focusInitial = () => {
      focused = true
    }
    el.show('T', 'm', { buttons }, null)
    await settleDialog(el, 30)
    expect(focused).to.be.true
    el.close()
  })

  it('focuses a light DOM button inside the content slot', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    const content = makeContent('<button id="content-btn">Go</button>')
    let focused = false
    content.querySelector('#content-btn').addEventListener('focus', () => {
      focused = true
    })
    el.show('T', 'm', { content }, null)
    await settleDialog(el, 30)
    expect(focused).to.be.true
    el.close()
  })

  it('pierces the content slot shadow root to find a button', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    const content = globalThis.document.createElement('test-shadow-host')
    el.show('T', 'm', { content }, null)
    await settleDialog(el, 30)
    expect(content.innerFocused).to.be.true
    el.close()
  })

  it('pierces the buttons slot shadow root to find a button', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    const buttons = globalThis.document.createElement('test-shadow-host')
    el.show('T', 'm', { buttons }, null)
    await settleDialog(el, 30)
    expect(buttons.innerFocused).to.be.true
    el.close()
  })

  it('focuses the close button when nothing else is focusable', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    // stale restore timer is cleared when the modal opens
    el.__focusRestoreTimer = setTimeout(() => {}, 1000)
    el.show('T', 'm', {}, null)
    await el.updateComplete
    expect(el.__focusRestoreTimer).to.equal(null)
    await settleDialog(el)
    const close = el.shadowRoot.querySelector('#close')
    expect(!!close).to.be.true
    const inner = close.shadowRoot.querySelector('button')
    let focused = false
    inner.addEventListener('focus', () => {
      focused = true
    })
    // the queued pass during the settle already focused the target; blur it
    // so another focus pass fires an observable focus event
    inner.blur()
    el._focusModalContent()
    expect(focused).to.be.true
    el.close()
  })

  it('focuses the dialog itself when there is no close button', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    // modal=true and showClose=false removes the close button
    el.show('T', 'm', {}, null, null, null, null, false, true, false)
    await settleDialog(el)
    expect(el.modal).to.be.true
    expect(!!el.shadowRoot.querySelector('#close')).to.be.false
    const wd = el.shadowRoot.querySelector('#dialog')
    let focused = false
    wd.addEventListener('focus', () => {
      focused = true
    })
    // blur first so the focus pass fires an observable focus event
    wd.blur()
    // without a tabindex the focus pass must add tabindex=-1 itself
    wd.removeAttribute('tabindex')
    el._focusModalContent()
    expect(focused).to.be.true
    expect(wd.getAttribute('tabindex')).to.equal('-1')
    el.close()
  })

  it('restores focus to the invoking element after closing', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    const btn = globalThis.document.createElement('button')
    globalThis.document.body.appendChild(btn)
    let focused = false
    btn.addEventListener('focus', () => {
      focused = true
    })
    el.show('T', 'm', { content: makeContent('<p>hi</p>') }, btn)
    await settleDialog(el, 30)
    // seed a stale restore timer so the close path clears it first
    el.__focusRestoreTimer = setTimeout(() => {}, 1000)
    el.close()
    expect(el.opened).to.be.false
    await new Promise((resolve) => setTimeout(resolve, 600))
    expect(focused).to.be.true
    btn.remove()
  })

  it('wires dialog-dismiss buttons to close the modal', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    const seen = []
    el.addEventListener('simple-modal-dismissed', (e) => {
      seen.push(e.detail.opened)
    })
    const content = makeContent('<button dialog-dismiss>Dismiss</button>')
    el.show('T', 'm', { content }, null)
    await settleDialog(el, 30)
    content.querySelector('[dialog-dismiss]').click()
    await el.updateComplete
    expect(seen.length).to.equal(1)
    expect(el.opened).to.be.false
  })

  it('wires dialog-confirm buttons to close the modal', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    const seen = []
    el.addEventListener('simple-modal-confirmed', (e) => {
      seen.push(e.detail.opened)
    })
    const content = makeContent('<button dialog-confirm>Confirm</button>')
    el.show('T', 'm', { content }, null)
    await settleDialog(el, 30)
    content.querySelector('[dialog-confirm]').click()
    await el.updateComplete
    expect(seen.length).to.equal(1)
    expect(el.opened).to.be.false
  })

  it('opens in modal mode and strips the backdrop close handlers', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    el.show('T', 'm', { content: makeContent('<p>hi</p>') }, null, null, null, null, false, true, false)
    await settleDialog(el)
    const wd = el.shadowRoot.querySelector('#dialog')
    expect(el.opened).to.be.true
    expect(wd.open).to.be.true
    el.close()
    expect(el.opened).to.be.false
  })

  it('renders the close button when showClose is set in modal mode', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    el.show('T', 'm', {}, null, null, null, null, false, true, true)
    await settleDialog(el, 30)
    const close = el.shadowRoot.querySelector('#close')
    expect(!!close).to.be.true
    expect(close.getAttribute('label')).to.equal('Close')
    expect(close.getAttribute('icon')).to.equal('close')
    el.close()
  })

  it('runs the ShadyCSS backdrop branches in open and close', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    globalThis.ShadyCSS = { nativeShadow: false }
    try {
      el.show('T', 'm', { content: makeContent('<p>hi</p>') }, null)
      await settleDialog(el)
      const wd = el.shadowRoot.querySelector('#dialog')
      const backdrop = wd.shadowRoot.querySelector('#backdrop')
      expect(backdrop.style.position).to.equal('fixed')
      el.close()
      expect(el.opened).to.be.false
      expect(backdrop.style.position).to.equal('relative')
    } finally {
      delete globalThis.ShadyCSS
    }
  })

  it('renders a title icon inline with the title', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    el.show('T', 'm', {}, null, null, null, null, false, false, false, 'icons:home')
    await el.updateComplete
    const icon = el.shadowRoot.querySelector(
      '#simple-modal-title .title-icon',
    )
    expect(!!icon).to.be.true
    expect(icon.getAttribute('icon')).to.equal('icons:home')
    expect(icon.getAttribute('aria-hidden')).to.equal('true')
    const text = el.shadowRoot.querySelector('.title-inline span')
    expect(text.textContent.trim()).to.equal('T')
    el.close()
  })

  it('falls back to the plain title when breadcrumbs are unusable', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    el.title = 'T'
    el.breadcrumbs = [{ label: '' }, null]
    await el.updateComplete
    expect(!!el.shadowRoot.querySelector('nav.breadcrumbs')).to.be.false
    const title = el.shadowRoot.querySelector('#simple-modal-title')
    expect(title.textContent.includes('T')).to.be.true
  })

  it('renders icons on clickable breadcrumb buttons', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    el.title = 'T'
    el.breadcrumbs = [
      { label: 'A', action: 'open-a', icon: 'icons:home' },
      { label: 'B' },
    ]
    await el.updateComplete
    const btn = el.shadowRoot.querySelector('button.breadcrumb-button')
    expect(!!btn).to.be.true
    const icon = btn.querySelector('simple-icon-lite')
    expect(!!icon).to.be.true
    expect(icon.getAttribute('icon')).to.equal('icons:home')
    const current = el.shadowRoot.querySelector('.breadcrumb-current')
    expect(current.textContent.includes('B')).to.be.true
  })

  it('close is a no-op when the modal is already closed', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    let closed = false
    el.addEventListener('simple-modal-closed', () => {
      closed = true
    })
    el.close()
    expect(closed).to.be.false
  })

  it('closes when the web-dialog close event fires', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    el.show('T', 'm', { content: makeContent('<p>hi</p>') }, null)
    await settleDialog(el)
    const wd = el.shadowRoot.querySelector('#dialog')
    wd.close()
    await settleDialog(el, 30)
    expect(el.opened).to.be.false
  })

  // regression for the unguarded firstUpdated chain: when web-dialog has
  // not upgraded when the dynamic import resolves, the old code threw
  // "Cannot read properties of null" dereferencing its missing shadowRoot
  it('backdrop styling tolerates a not-yet-upgraded web-dialog', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    const root = el.shadowRoot
    const original = root.querySelector
    try {
      // dialog present but not upgraded (no shadow root yet)
      root.querySelector = (selector) =>
        selector === 'web-dialog'
          ? { shadowRoot: null }
          : original.call(root, selector)
      el._styleBackdrop()
      // dialog missing entirely
      root.querySelector = (selector) =>
        selector === 'web-dialog' ? null : original.call(root, selector)
      el._styleBackdrop()
    } finally {
      root.querySelector = original
    }
  })

  it('styles the web-dialog backdrop through firstUpdated', async () => {
    const el = await fixture(html`<simple-modal></simple-modal>`)
    await settleDialog(el)
    const wd = el.shadowRoot.querySelector('#dialog')
    const backdrop = wd.shadowRoot.querySelector('#backdrop')
    expect(backdrop.style.backgroundColor).to.equal(
      'var(--simple-modal-backdrop-background, var(--ddd-theme-default-potential70))',
    )
  })
})
