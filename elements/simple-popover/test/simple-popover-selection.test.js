import { fixture, expect, html } from '@open-wc/testing'
import '../lib/simple-popover-selection.js'

const aTimeout = (ms) => new Promise((r) => setTimeout(r, ms))

describe('SimplePopoverSelection', () => {
  let element
  let manager
  let origOpened, origContext, origOrientation, origPosition, origIgnore

  beforeEach(async () => {
    manager = globalThis.SimplePopoverManager.requestAvailability()
    await manager.updateComplete
    await aTimeout(10)
    origOpened = manager.opened
    origContext = manager.context
    origOrientation = manager.orientation
    origPosition = manager.position
    origIgnore = manager.__ignore
    manager.opened = false
    manager.context = null
    manager.orientation = 'tb'
    manager.position = 'bottom'
    manager.__ignore = false
  })

  afterEach(async () => {
    if (manager) {
      manager.opened = false
      manager.context = null
      manager.orientation = origOrientation
      manager.position = origPosition
      manager.__ignore = origIgnore
      await aTimeout(10)
    }
  })

  it('constructs with default property values', async () => {
    element = await fixture(html`<simple-popover-selection></simple-popover-selection>`)
    expect(element.opened).to.equal(false)
    expect(element.disabled).to.equal(false)
    expect(element.event).to.equal('click')
  })

  it('reflects opened and disabled attributes', async () => {
    element = await fixture(
      html`<simple-popover-selection opened disabled><button slot="button">B</button></simple-popover-selection>`,
    )
    expect(element.hasAttribute('opened')).to.be.true
    expect(element.hasAttribute('disabled')).to.be.true
  })

  it('render contains a slot named "button"', async () => {
    element = await fixture(html`<simple-popover-selection></simple-popover-selection>`)
    const slot = element.shadowRoot.querySelector('slot[name="button"]')
    expect(slot).to.exist
  })

  it('_addActivationListeners adds click listener for click event', async () => {
    element = await fixture(
      html`<simple-popover-selection><button slot="button">B</button></simple-popover-selection>`,
    )
    // firstUpdated already added a click listener; _addActivationListeners
    // adds another. Either way, a click should toggle opened.
    element._addActivationListeners('click')
    element.dispatchEvent(new Event('click'))
    expect(element.opened).to.be.true
  })

  it('_addActivationListeners adds hover listeners for hover event', async () => {
    element = await fixture(
      html`<simple-popover-selection><button slot="button">B</button></simple-popover-selection>`,
    )
    element._addActivationListeners('hover')
    element.dispatchEvent(new Event('mouseenter'))
    await aTimeout(10)
    expect(element.opened).to.be.true
  })

  it('_removeActivationListeners removes click listener', async () => {
    element = await fixture(
      html`<simple-popover-selection></simple-popover-selection>`,
    )
    // Remove the click listener that firstUpdated added
    element._removeActivationListeners('click')
    element.dispatchEvent(new Event('click'))
    expect(element.opened).to.equal(false)
  })

  it('_removeActivationListeners removes hover listeners', async () => {
    element = await fixture(
      html`<simple-popover-selection></simple-popover-selection>`,
    )
    element._addActivationListeners('hover')
    element._removeActivationListeners('hover')
    element.dispatchEvent(new Event('mouseenter'))
    await aTimeout(10)
    expect(element.opened).to.equal(false)
  })

  it('openedToggle toggles opened when not disabled', async () => {
    element = await fixture(
      html`<simple-popover-selection><button slot="button">B</button></simple-popover-selection>`,
    )
    element.openedToggle()
    expect(element.opened).to.be.true
    element.openedToggle()
    expect(element.opened).to.be.false
  })

  it('openedToggle does nothing when disabled', async () => {
    element = await fixture(
      html`<simple-popover-selection disabled><button slot="button">B</button></simple-popover-selection>`,
    )
    element.openedToggle()
    expect(element.opened).to.equal(false)
  })

  it('managerReset sets opened to false', async () => {
    element = await fixture(
      html`<simple-popover-selection opened><button slot="button">B</button></simple-popover-selection>`,
    )
    await aTimeout(10)
    element.managerReset()
    expect(element.opened).to.equal(false)
  })

  it('openPopover sets opened to true after timeout when not disabled', async () => {
    element = await fixture(
      html`<simple-popover-selection><button slot="button">B</button></simple-popover-selection>`,
    )
    element.openPopover()
    await aTimeout(10)
    expect(element.opened).to.equal(true)
  })

  it('openPopover does nothing when disabled', async () => {
    element = await fixture(
      html`<simple-popover-selection disabled><button slot="button">B</button></simple-popover-selection>`,
    )
    element.openPopover()
    await aTimeout(10)
    expect(element.opened).to.equal(false)
  })

  it('closePopover sets opened to false after timeout', async () => {
    element = await fixture(
      html`<simple-popover-selection opened><button slot="button">B</button></simple-popover-selection>`,
    )
    await aTimeout(10)
    element.closePopover()
    await aTimeout(10)
    expect(element.opened).to.equal(false)
  })

  it('itemSelect dispatches simple-popover-selection-changed and closes', async () => {
    element = await fixture(html`
      <simple-popover-selection opened>
        <button slot="button">Btn</button>
        <div slot="options">
          <button id="opt1">Option 1</button>
        </div>
      </simple-popover-selection>
    `)
    await aTimeout(10)
    let captured = null
    element.addEventListener('simple-popover-selection-changed', (e) => {
      captured = e
    })
    const fakeTarget = globalThis.document.createElement('button')
    fakeTarget.textContent = 'clicked'
    element.itemSelect({ target: fakeTarget })
    expect(captured).to.exist
    expect(captured.detail).to.equal(fakeTarget)
    expect(captured.bubbles).to.be.true
    expect(element.opened).to.equal(false)
  })

  it('openedChanged(true) renders slotted options into the popover manager', async () => {
    element = await fixture(html`
      <simple-popover-selection>
        <button slot="button">Btn</button>
        <div slot="options">
          <button id="optA">Option A</button>
          <button id="optB">Option B</button>
        </div>
      </simple-popover-selection>
    `)
    await aTimeout(10)
    // call openedChanged directly
    element.openedChanged(true)
    await aTimeout(10)
    // the popover manager should have content rendered
    const managerContent = manager.querySelector('[slot="body"]')
    expect(managerContent).to.exist
    // clean up
    element.opened = false
    await aTimeout(10)
  })

  it('openedChanged(false) removes popover item listeners', async () => {
    element = await fixture(html`
      <simple-popover-selection>
        <button slot="button">Btn</button>
        <div slot="options">
          <button>Option</button>
        </div>
      </simple-popover-selection>
    `)
    await aTimeout(10)
    // First open to add listeners
    element.openedChanged(true)
    await aTimeout(10)
    expect(element.__popoverItemListeners.length).to.be.greaterThan(0)
    // Then close to remove listeners
    element.openedChanged(false)
    expect(element.__popoverItemListeners.length).to.equal(0)
  })

  it('openedChanged handles nested SLOT in single option area', async () => {
    element = await fixture(html`
      <simple-popover-selection>
        <button slot="button">Btn</button>
        <div slot="options">
          <slot></slot>
        </div>
      </simple-popover-selection>
    `)
    await aTimeout(10)
    // The slot-in-options case should be handled by assignedNodes
    element.openedChanged(true)
    await aTimeout(10)
    const managerContent = manager.querySelector('[slot="body"]')
    expect(managerContent).to.exist
    element.opened = false
    await aTimeout(10)
  })

  it('openedChanged(true) injects slot="style" content when present', async () => {
    element = await fixture(html`
      <simple-popover-selection>
        <button slot="button">Btn</button>
        <div slot="options">
          <button>Option</button>
        </div>
        <template slot="style">
          .custom { color: red; }
        </template>
      </simple-popover-selection>
    `)
    await aTimeout(10)
    element.openedChanged(true)
    await aTimeout(10)
    const styleEl = manager.querySelector('[slot="body"] style')
    // The style should have been rendered into the manager
    // (template content is cloned and rendered via unsafeHTML)
    expect(styleEl !== null || manager.querySelector('style') !== null).to.be.true
    element.opened = false
    await aTimeout(10)
  })

  it('focuses the option marked data-simple-popover-selection-active after open', async () => {
    element = await fixture(html`
      <simple-popover-selection>
        <button slot="button">Btn</button>
        <div slot="options">
          <button>Option A</button>
          <button data-simple-popover-selection-active>Option B</button>
        </div>
      </simple-popover-selection>
    `)
    await aTimeout(10)
    element.openedChanged(true)
    await aTimeout(10)
    // the cloned option carrying the active marker should receive focus
    expect(globalThis.document.activeElement.tagName).to.equal('BUTTON')
    expect(
      globalThis.document.activeElement.hasAttribute(
        'data-simple-popover-selection-active',
      ),
    ).to.be.true
    element.opened = false
    await aTimeout(10)
  })

  it('disconnectedCallback removes activation and popover item listeners', async () => {
    element = await fixture(
      html`<simple-popover-selection><button slot="button">B</button></simple-popover-selection>`,
    )
    await aTimeout(10)
    // Verify listeners were added
    expect(element.__popoverItemListeners).to.exist
    // Remove from DOM
    element.parentNode.removeChild(element)
    // After disconnect, listeners should be cleaned up
    // We can verify by checking that the element does not respond to clicks
    let toggled = false
    element.openedToggle = () => {
      toggled = true
    }
    element.dispatchEvent(new Event('click'))
    expect(toggled).to.be.false
  })

  it('firstUpdated adds activation listeners', async () => {
    element = await fixture(html`
      <simple-popover-selection>
        <button slot="button">Btn</button>
      </simple-popover-selection>
    `)
    await aTimeout(10)
    // Click should toggle opened (listener added in firstUpdated)
    element.click()
    expect(element.opened).to.be.true
  })

  it('updated dispatches opened-changed event when opened changes', async () => {
    element = await fixture(
      html`<simple-popover-selection><button slot="button">B</button></simple-popover-selection>`,
    )
    await element.updateComplete
    let captured = null
    element.addEventListener('opened-changed', (e) => {
      captured = e
    })
    element.opened = true
    await element.updateComplete
    await aTimeout(10)
    expect(captured).to.exist
    expect(captured.detail).to.equal(element)
  })

  it('updated re-adds activation listeners when event property changes', async () => {
    element = await fixture(
      html`<simple-popover-selection><button slot="button">B</button></simple-popover-selection>`,
    )
    await element.updateComplete
    // Initially click-based — click should toggle opened
    element.click()
    await element.updateComplete
    expect(element.opened).to.be.true

    // Reset opened
    element.opened = false
    await element.updateComplete

    // Change to hover
    element.event = 'hover'
    await element.updateComplete
    await aTimeout(10)

    // Click should no longer toggle (old listener removed)
    element.click()
    await aTimeout(10)
    expect(element.opened).to.equal(false)

    // mouseenter should trigger openPopover
    element.dispatchEvent(new Event('mouseenter'))
    await aTimeout(10)
    expect(element.opened).to.be.true
  })
})
