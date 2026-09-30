import { fixture, expect, html } from '@open-wc/testing'
import '../lib/simple-popover-manager.js'

const aTimeout = (ms) => new Promise((r) => setTimeout(r, ms))

describe('SimplePopoverManager singleton', () => {
  let manager
  let origOpened, origContext, origOrientation, origPosition, origIgnore

  beforeEach(async () => {
    manager = globalThis.SimplePopoverManager.requestAvailability()
    // wait for firstUpdated to set popoverEl
    await manager.updateComplete
    await aTimeout(10)
    // save state
    origOpened = manager.opened
    origContext = manager.context
    origOrientation = manager.orientation
    origPosition = manager.position
    origIgnore = manager.__ignore
    // reset state
    manager.opened = false
    manager.context = null
    manager.orientation = 'tb'
    manager.position = 'bottom'
    manager.__ignore = false
  })

  afterEach(async () => {
    // restore state
    if (manager) {
      manager.opened = false
      manager.context = null
      manager.orientation = origOrientation
      manager.position = origPosition
      manager.__ignore = origIgnore
      await aTimeout(10)
    }
  })

  it('requestAvailability returns the same singleton instance', () => {
    const a = globalThis.SimplePopoverManager.requestAvailability()
    const b = globalThis.SimplePopoverManager.requestAvailability()
    expect(a).to.equal(b)
    expect(globalThis.SimplePopoverManager.instance).to.equal(a)
  })

  it('singleton is in the document body', () => {
    expect(manager.parentNode).to.equal(globalThis.document.body)
  })

  it('constructor sets default property values', () => {
    expect(manager.popoverEl).to.exist
    expect(manager.opened).to.equal(false)
    expect(manager.context).to.equal(null)
    expect(manager.orientation).to.equal('tb')
    expect(manager.position).to.equal('bottom')
    expect(manager.__ignore).to.equal(false)
  })

  it('firstUpdated caches popoverEl from shadowRoot', async () => {
    const popover = manager.shadowRoot.querySelector('simple-popover')
    expect(popover).to.exist
    expect(manager.popoverEl).to.equal(popover)
  })

  it('setPopover with tb orientation and top-half target sets position=bottom', async () => {
    const target = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(target)
    target.getBoundingClientRect = () => ({ x: 0, y: 0, width: 50, height: 50 })
    const ctx = { name: 'ctx1' }
    manager.setPopover(ctx, target, true, 'tb')
    await aTimeout(10)
    expect(manager.position).to.equal('bottom')
    expect(manager.orientation).to.equal('tb')
    expect(manager.opened).to.equal(true)
    expect(manager.context).to.equal(ctx)
    globalThis.document.body.removeChild(target)
  })

  it('setPopover with tb orientation and bottom-half target sets position=top', async () => {
    const target = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(target)
    target.getBoundingClientRect = () => ({
      x: 0,
      y: globalThis.innerHeight + 100,
      width: 50,
      height: 50,
    })
    manager.setPopover({}, target, null, 'tb')
    await aTimeout(10)
    expect(manager.position).to.equal('top')
    // opened should not change when null
    globalThis.document.body.removeChild(target)
  })

  it('setPopover with lr orientation and left-half target sets position=right', async () => {
    const target = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(target)
    target.getBoundingClientRect = () => ({ x: 0, y: 0, width: 50, height: 50 })
    manager.setPopover({}, target, null, 'lr')
    await aTimeout(10)
    expect(manager.position).to.equal('right')
    expect(manager.orientation).to.equal('lr')
    globalThis.document.body.removeChild(target)
  })

  it('setPopover with lr orientation and right-half target sets position=left', async () => {
    const target = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(target)
    target.getBoundingClientRect = () => ({
      x: globalThis.innerWidth + 100,
      y: 0,
      width: 50,
      height: 50,
    })
    manager.setPopover({}, target, null, 'lr')
    await aTimeout(10)
    expect(manager.position).to.equal('left')
    globalThis.document.body.removeChild(target)
  })

  it('setPopover with opened=null does not change opened state', async () => {
    const target = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(target)
    target.getBoundingClientRect = () => ({ x: 0, y: 0, width: 50, height: 50 })
    manager.opened = true
    manager.setPopover({}, target, null, 'tb')
    await aTimeout(10)
    expect(manager.opened).to.equal(true)
    globalThis.document.body.removeChild(target)
  })

  it('setPopover with opened=false closes the popover', async () => {
    const target = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(target)
    target.getBoundingClientRect = () => ({ x: 0, y: 0, width: 50, height: 50 })
    manager.opened = true
    manager.setPopover({}, target, false, 'tb')
    await aTimeout(10)
    expect(manager.opened).to.equal(false)
    globalThis.document.body.removeChild(target)
  })

  it('setPopover sets mode attribute on manager', async () => {
    const target = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(target)
    target.getBoundingClientRect = () => ({ x: 0, y: 0, width: 50, height: 50 })
    manager.setPopover({}, target, null, 'tb', 'edit-mode')
    await aTimeout(10)
    expect(manager.getAttribute('mode')).to.equal('edit-mode')
    globalThis.document.body.removeChild(target)
  })

  it('setPopover with same target does not reset target or context', async () => {
    const target = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(target)
    target.getBoundingClientRect = () => ({ x: 0, y: 0, width: 50, height: 50 })
    const ctx = { name: 'same' }
    manager.setPopover(ctx, target, true, 'tb')
    await aTimeout(10)
    const firstContext = manager.context
    // call again with same target
    manager.setPopover({ name: 'different' }, target, true, 'tb')
    await aTimeout(10)
    // context should not change because target was the same
    expect(manager.context).to.equal(firstContext)
    globalThis.document.body.removeChild(target)
  })

  it('setPopover calls managerReset on previous context when context changes', async () => {
    const target1 = globalThis.document.createElement('div')
    const target2 = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(target1)
    globalThis.document.body.appendChild(target2)
    target1.getBoundingClientRect = () => ({ x: 0, y: 0, width: 50, height: 50 })
    target2.getBoundingClientRect = () => ({ x: 0, y: 0, width: 50, height: 50 })

    let resetCalled = false
    const ctx1 = {
      managerReset: () => {
        resetCalled = true
      },
    }
    const ctx2 = { name: 'ctx2' }
    manager.setPopover(ctx1, target1, true, 'tb')
    await aTimeout(10)
    // now switch to different context with different target
    manager.setPopover(ctx2, target2, true, 'tb')
    await aTimeout(10)
    expect(resetCalled).to.be.true
    expect(manager.__ignore).to.be.true
    globalThis.document.body.removeChild(target1)
    globalThis.document.body.removeChild(target2)
  })

  it('setPopover with __ignore=true schedules updatePosition and clears flag', async () => {
    manager.__ignore = true
    let updateCalled = false
    const origUpdate = manager.popoverEl.updatePosition
    manager.popoverEl.updatePosition = () => {
      updateCalled = true
    }
    manager.setPopover({}, {}, null, 'tb')
    expect(manager.__ignore).to.equal(false)
    // updatePosition is called after 100ms timeout
    await aTimeout(120)
    expect(updateCalled).to.equal(true)
    manager.popoverEl.updatePosition = origUpdate
  })

  it('updated schedules updatePosition when opened changes', async () => {
    let updateCalled = false
    const origUpdate = manager.popoverEl.updatePosition
    manager.popoverEl.updatePosition = () => {
      updateCalled = true
    }
    manager.opened = true
    await aTimeout(10)
    expect(updateCalled).to.equal(true)
    manager.popoverEl.updatePosition = origUpdate
  })

  it('updated schedules updatePosition when position changes', async () => {
    let updateCalled = false
    const origUpdate = manager.popoverEl.updatePosition
    manager.popoverEl.updatePosition = () => {
      updateCalled = true
    }
    manager.position = 'top'
    await aTimeout(10)
    expect(updateCalled).to.equal(true)
    manager.popoverEl.updatePosition = origUpdate
  })

  it('updated schedules updatePosition when orientation changes', async () => {
    let updateCalled = false
    const origUpdate = manager.popoverEl.updatePosition
    manager.popoverEl.updatePosition = () => {
      updateCalled = true
    }
    manager.orientation = 'lr'
    await aTimeout(10)
    expect(updateCalled).to.equal(true)
    manager.popoverEl.updatePosition = origUpdate
  })

  it('render produces a simple-popover with heading/body/nav slots', async () => {
    const popover = manager.shadowRoot.querySelector('simple-popover')
    expect(popover).to.exist
    const heading = manager.shadowRoot.querySelector('.heading slot')
    const body = manager.shadowRoot.querySelector('.body slot')
    const nav = manager.shadowRoot.querySelector('.nav slot')
    expect(heading).to.exist
    expect(heading.name).to.equal('heading')
    expect(body).to.exist
    expect(body.name).to.equal('body')
    expect(nav).to.exist
    expect(nav.name).to.equal('nav')
  })

  it('simple-popover has hidden attribute when not opened', async () => {
    manager.opened = false
    await aTimeout(10)
    const popover = manager.shadowRoot.querySelector('simple-popover')
    expect(popover.hasAttribute('hidden')).to.be.true
  })

  it('simple-popover does not have hidden attribute when opened', async () => {
    manager.opened = true
    await aTimeout(10)
    const popover = manager.shadowRoot.querySelector('simple-popover')
    expect(popover.hasAttribute('hidden')).to.be.false
  })
})
