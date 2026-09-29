import { expect, fixture, html } from '@open-wc/testing'
import { LitElement } from 'lit'
import { HaxLayoutBehaviors } from '../lib/HAXLayouts.js'

// a host element that mirrors the grid-plate layout contract the mixin
// expects: [data-layout-order]/[data-layout-slotname] column containers,
// a drag-enabled tag target, and named slots
class TestLayoutEl extends HaxLayoutBehaviors(LitElement) {
  static get tag() {
    return 'test-layout-el'
  }
  static get properties() {
    return {
      ...super.properties,
      layout: { type: String, reflect: true },
      responsiveSize: { type: String, attribute: 'responsive-size' },
      layouts: { type: Object },
      disableResponsive: { type: Boolean, attribute: 'disable-responsive' },
      __columnWidths: { type: Object },
    }
  }
  constructor() {
    super()
    this.layout = '1-1'
    this.responsiveSize = 'sm'
    this.layouts = {}
    this.disableResponsive = false
    this.resizeCalled = 0
    this.widthsCalls = 0
  }
  _getColumnWidths() {
    this.widthsCalls += 1
    return { c1: '100%', c2: '100%' }
  }
  resize() {
    this.resizeCalled += 1
  }
  render() {
    return html`
      <div
        class="column"
        slot="col-1"
        data-layout-order="1"
        data-layout-slotname="col-1"
      >
        <drag-enabled id="drag1"></drag-enabled>
        <slot name="col-1"></slot>
      </div>
      <div
        class="column"
        slot="col-2"
        data-layout-order="2"
        data-layout-slotname="col-2"
      >
        <slot name="col-2"></slot>
      </div>
    `
  }
}
customElements.define(TestLayoutEl.tag, TestLayoutEl)

// direct lib import so istanbul sees lib/HAXLayouts.js statements
describe('HaxLayoutBehaviors', () => {
  it('has static haxProperties for grid editing', () => {
    expect(TestLayoutEl.haxProperties.type).to.equal('grid')
    expect(TestLayoutEl.haxProperties.contentEditable).to.equal(true)
  })

  it('ships host styles for the layout ray', () => {
    expect(Array.isArray(TestLayoutEl.styles)).to.equal(true)
    expect(TestLayoutEl.styles.length > 0).to.equal(true)
  })

  it('seeds constructor defaults', () => {
    const bare = new TestLayoutEl()
    expect(bare.ready).to.equal(false)
    expect(bare.haxLayoutContainer).to.equal(true)
    expect(bare.observer).to.equal(null)
    expect(typeof bare.__layoutEventHandlers.drop).to.equal('function')
    expect(typeof bare.__layoutEventHandlers.dragenter).to.equal('function')
    expect(typeof bare.__layoutEventHandlers.dragleave).to.equal('function')
    expect(typeof bare.__layoutEventHandlers.slotchange).to.equal('function')
  })

  it('reflects hax-layout-container and becomes ready after first update', async () => {
    const el = await fixture(html`<test-layout-el></test-layout-el>`)
    expect(el.hasAttribute('hax-layout-container')).to.equal(true)
    await new Promise((r) => setTimeout(r, 200))
    expect(el.ready).to.equal(true)
    expect(el.hasAttribute('ready')).to.equal(true)
  })

  it('returns an empty slot list before it has a shadow root', () => {
    const bare = new TestLayoutEl()
    expect(JSON.stringify(bare.validElementSlots())).to.equal('[]')
    // event wiring is a no-op without a shadow root
    let threw = false
    try {
      bare.__addLayoutEvents()
      bare.__removeLayoutEvents()
    } catch (e) {
      threw = true
    }
    expect(threw).to.equal(false)
  })

  it('lists valid slots from the shadow layout containers', async () => {
    const el = await fixture(html`<test-layout-el></test-layout-el>`)
    expect(JSON.stringify(el.validElementSlots())).to.equal(
      JSON.stringify(['col-1', 'col-2']),
    )
    const ok = globalThis.document.createElement('div')
    ok.setAttribute('slot', 'col-2')
    expect(el.validateElementSlot(ok)).to.equal(true)
    const bad = globalThis.document.createElement('div')
    bad.setAttribute('slot', 'col-9')
    expect(el.validateElementSlot(bad)).to.equal(false)
  })

  it('reads a slot order from the mapped container', async () => {
    const el = await fixture(html`<test-layout-el></test-layout-el>`)
    const item = globalThis.document.createElement('div')
    item.setAttribute('slot', 'col-2')
    expect(el._getSlotOrder(item)).to.equal(2)
  })

  // BUG: lib/HAXLayouts.js:347 — canMoveSlot reads `this.this._getSlotOrder`
  // which is undefined, so every call throws a TypeError. Documents the
  // current behavior for the fix swarm; flip this once the typo is fixed.
  it('canMoveSlot currently throws due to a this.this typo', async () => {
    const el = await fixture(html`<test-layout-el></test-layout-el>`)
    const item = globalThis.document.createElement('div')
    item.setAttribute('slot', 'col-1')
    let error = null
    try {
      el.canMoveSlot(item, true)
    } catch (e) {
      error = e
    }
    expect(error instanceof TypeError).to.equal(true)
  })

  // BUG: lib/HAXLayouts.js:366 — moveSlot has the same `this.this` typo.
  it('moveSlot currently throws due to a this.this typo', async () => {
    const el = await fixture(html`<test-layout-el></test-layout-el>`)
    const item = globalThis.document.createElement('div')
    item.setAttribute('slot', 'col-1')
    let error = null
    try {
      el.moveSlot(item, true)
    } catch (e) {
      error = e
    }
    expect(error instanceof TypeError).to.equal(true)
  })

  it('activates events and observer via data-hax-ray and cleans up on removal', async () => {
    const el = await fixture(html`<test-layout-el></test-layout-el>`)
    el.setAttribute('data-hax-ray', 'on')
    await el.updateComplete
    expect(el.observer === null).to.equal(false)
    // a dropped in node without a slot gets the first valid slot applied
    const stray = globalThis.document.createElement('span')
    stray.textContent = 'stray'
    el.appendChild(stray)
    await new Promise((r) => setTimeout(r, 50))
    expect(stray.getAttribute('slot')).to.equal('col-1')
    // a node that already has a valid slot is left alone
    const placed = globalThis.document.createElement('span')
    placed.setAttribute('slot', 'col-2')
    el.appendChild(placed)
    await new Promise((r) => setTimeout(r, 50))
    expect(placed.getAttribute('slot')).to.equal('col-2')
    // turning the ray off disconnects the observer
    el.removeAttribute('data-hax-ray')
    await el.updateComplete
    expect(el.observer).to.equal(null)
  })

  it('disconnects events and observer when the element is removed', async () => {
    const el = await fixture(html`<test-layout-el></test-layout-el>`)
    el.setAttribute('data-hax-ray', 'on')
    await el.updateComplete
    expect(el.observer === null).to.equal(false)
    el.remove()
    expect(el.observer).to.equal(null)
  })

  it('toggles hax-hovered on dragenter and dragleave', async () => {
    const el = await fixture(html`<test-layout-el></test-layout-el>`)
    el.setAttribute('data-hax-ray', 'on')
    await el.updateComplete
    const dragEl = el.shadowRoot.querySelector('drag-enabled')
    dragEl.dispatchEvent(new Event('dragenter'))
    expect(dragEl.classList.contains('hax-hovered')).to.equal(true)
    dragEl.dispatchEvent(new Event('dragleave'))
    expect(dragEl.classList.contains('hax-hovered')).to.equal(false)
  })

  it('drop clears hax-hovered flags in light and shadow dom', async () => {
    const el = await fixture(
      html`<test-layout-el>
        <span slot="col-1" class="hax-hovered">x</span>
      </test-layout-el>`,
    )
    el.setAttribute('data-hax-ray', 'on')
    await el.updateComplete
    const dragEl = el.shadowRoot.querySelector('drag-enabled')
    dragEl.classList.add('hax-hovered')
    el.dispatchEvent(new Event('drop'))
    expect(el.querySelector('span').classList.contains('hax-hovered')).to.equal(
      false,
    )
    expect(dragEl.classList.contains('hax-hovered')).to.equal(false)
  })

  it('tracks has-nodes on slot containers via slotchange', async () => {
    const el = await fixture(
      html`<test-layout-el>
        <span slot="col-1">content</span>
      </test-layout-el>`,
    )
    el.setAttribute('data-hax-ray', 'on')
    await el.updateComplete
    const slot = el.shadowRoot.querySelector('slot[name="col-1"]')
    slot.dispatchEvent(new Event('slotchange'))
    expect(slot.parentNode.classList.contains('has-nodes')).to.equal(true)
    // emptying the slot removes the marker
    el.querySelector('span').remove()
    slot.dispatchEvent(new Event('slotchange'))
    expect(slot.parentNode.classList.contains('has-nodes')).to.equal(false)
  })

  // BUG: lib/HAXLayouts.js:395-401 — __sortChildren builds its children
  // list with a reduce that never accumulates (it returns acc and ignores
  // the element), so children is always [] and no sorting ever happens.
  // Documents current behavior for the fix swarm.
  it('__sortChildren never reorders because its reduce never accumulates', async () => {
    const el = await fixture(html`<test-layout-el></test-layout-el>`)
    const a = globalThis.document.createElement('div')
    a.setAttribute('slot', 'col-2')
    const b = globalThis.document.createElement('div')
    b.setAttribute('slot', 'col-1')
    el.appendChild(a)
    el.appendChild(b)
    await el.__sortChildren()
    expect(el.children[0].getAttribute('slot')).to.equal('col-2')
    expect(el.children[1].getAttribute('slot')).to.equal('col-1')
  })

  it('recalculates column widths and resizes when layout inputs change', async () => {
    const el = await fixture(html`<test-layout-el></test-layout-el>`)
    const before = el.widthsCalls
    el.layout = '1-2'
    await el.updateComplete
    await new Promise((r) => setTimeout(r, 50))
    expect(el.widthsCalls > before).to.equal(true)
    expect(el.__columnWidths.c1).to.equal('100%')
    expect(el.resizeCalled > 0).to.equal(true)
    // responsive size changes take the same path
    const widthsNow = el.widthsCalls
    el.responsiveSize = 'md'
    await el.updateComplete
    await new Promise((r) => setTimeout(r, 50))
    expect(el.widthsCalls > widthsNow).to.equal(true)
  })

  it('fires disable-responsive-changed when disableResponsive flips', async () => {
    const el = await fixture(html`<test-layout-el></test-layout-el>`)
    let detail = 'unset'
    el.addEventListener('disable-responsive-changed', (e) => {
      detail = e.detail
    })
    el.disableResponsive = true
    await el.updateComplete
    expect(detail).to.equal(true)
  })
})
