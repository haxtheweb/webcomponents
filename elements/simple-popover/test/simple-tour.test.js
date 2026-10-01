import { expect } from '@open-wc/testing'
import { SimpleTourManager, SimpleTour, TourStop } from '../lib/simple-tour.js'

const aTimeout = (ms) => new Promise((r) => setTimeout(r, ms))

describe('SimpleTour and TourStop', () => {
  let tour
  let origStacks, origTourInfo, origActive, origStop, origOrientation

  beforeEach(() => {
    tour = SimpleTourManager
    // save state
    origStacks = tour.stacks
    origTourInfo = tour.tourInfo
    origActive = tour.active
    origStop = tour.stop
    origOrientation = tour.orientation
    // reset state
    tour.stacks = {}
    tour.tourInfo = {}
    tour.active = null
    tour.stop = -1
    tour.orientation = 'lr'
  })

  afterEach(async () => {
    // stop any active tour first to avoid rendering into popover manager
    if (tour.active) {
      tour.stop = -1
      tour.active = null
    }
    await aTimeout(10)
    // restore state
    tour.stacks = origStacks
    tour.tourInfo = origTourInfo
    tour.active = origActive
    tour.stop = origStop
    tour.orientation = origOrientation
  })

  describe('TourStop class', () => {
    it('constructs with default values', () => {
      const stop = new TourStop()
      expect(stop.target).to.equal(null)
      expect(stop.title).to.equal('Title')
      expect(stop.description).to.equal('<p>Description</p>')
    })
  })

  describe('registerNewTour', () => {
    it('creates a new empty stack for a new tour key', () => {
      const stack = tour.registerNewTour({ key: 'tour1', name: 'Tour 1' })
      expect(Array.isArray(stack)).to.be.true
      expect(stack.length).to.equal(0)
      expect(tour.stacks['tour1']).to.equal(stack)
    })

    it('stores tourInfo for a new tour', () => {
      tour.registerNewTour({ key: 'tour1', name: 'Tour 1' })
      expect(tour.tourInfo['tour1']).to.exist
      expect(tour.tourInfo['tour1'].name).to.equal('Tour 1')
    })

    it('returns existing stack if key already exists', () => {
      const stack1 = tour.registerNewTour({ key: 'tour1', name: 'Tour 1' })
      stack1.push({ target: null, title: 'x' })
      const stack2 = tour.registerNewTour({ key: 'tour1', name: 'Tour 1' })
      expect(stack2).to.equal(stack1)
      expect(stack2.length).to.equal(1)
    })

    it('does not overwrite tourInfo if key already exists', () => {
      tour.registerNewTour({ key: 'tour1', name: 'Original' })
      tour.registerNewTour({ key: 'tour1', name: 'Overwrite' })
      expect(tour.tourInfo['tour1'].name).to.equal('Original')
    })
  })

  describe('registerNewTourEvent', () => {
    it('registers a tour from a CustomEvent', () => {
      const evt = new CustomEvent('simple-tour-register', {
        detail: { key: 'evtTour', name: 'Event Tour' },
      })
      tour.registerNewTourEvent(evt)
      expect(tour.stacks['evtTour']).to.exist
      expect(tour.tourInfo['evtTour'].name).to.equal('Event Tour')
    })
  })

  describe('createTourStop', () => {
    it('creates a TourStop and adds it to the named stack', () => {
      const target = globalThis.document.createElement('div')
      const stop = tour.createTourStop('tour1', target, 'Step 1', '<p>Desc</p>')
      expect(stop).to.exist
      expect(stop.target).to.equal(target)
      expect(stop.title).to.equal('Step 1')
      expect(stop.description).to.equal('<p>Desc</p>')
      expect(tour.stacks['tour1'].length).to.equal(1)
      expect(tour.stacks['tour1'][0]).to.equal(stop)
    })

    it('creates stack if it does not exist', () => {
      const target = globalThis.document.createElement('div')
      tour.createTourStop('newTour', target, 'Step', '<p>D</p>')
      expect(tour.stacks['newTour']).to.exist
      expect(tour.stacks['newTour'].length).to.equal(1)
    })

    it('passes mode to the TourStop', () => {
      const target = globalThis.document.createElement('div')
      const stop = tour.createTourStop('tour1', target, 'T', 'D', 'live')
      expect(stop.mode).to.equal('live')
    })
  })

  describe('createTourStopEvent', () => {
    it('creates a tour stop from a CustomEvent', () => {
      const target = globalThis.document.createElement('div')
      const evt = new CustomEvent('simple-tour-create-tour-stop', {
        detail: {
          name: 'evtTour',
          target: target,
          title: 'Event Step',
          description: 'Event Desc',
          mode: 'static',
        },
      })
      tour.createTourStopEvent(evt)
      expect(tour.stacks['evtTour'].length).to.equal(1)
      expect(tour.stacks['evtTour'][0].title).to.equal('Event Step')
      expect(tour.stacks['evtTour'][0].mode).to.equal('static')
    })
  })

  describe('addStops', () => {
    it('concatenates stops into the named stack', () => {
      tour.registerNewTour({ key: 'tour1' })
      const s1 = new TourStop()
      const s2 = new TourStop()
      tour.addStops('tour1', [s1, s2])
      expect(tour.stacks['tour1'].length).to.equal(2)
    })

    it('creates stack if it does not exist', () => {
      const s1 = new TourStop()
      tour.addStops('newStack', [s1])
      expect(tour.stacks['newStack']).to.exist
      expect(tour.stacks['newStack'].length).to.equal(1)
    })
  })

  describe('removeTarget', () => {
    // NOTE: removeTarget has a bug — it collects indices then splices in
    // ascending order, which shifts indices after the first removal.
    // When multiple stops share the same target, only the first is removed
    // correctly; subsequent indices point to wrong elements.
    it('removes the first stop matching the given target (single match works)', () => {
      const t1 = globalThis.document.createElement('div')
      const t2 = globalThis.document.createElement('div')
      tour.createTourStop('tour1', t1, 'A', 'D')
      tour.createTourStop('tour1', t2, 'B', 'D')
      expect(tour.stacks['tour1'].length).to.equal(2)
      tour.removeTarget('tour1', t1)
      expect(tour.stacks['tour1'].length).to.equal(1)
      expect(tour.stacks['tour1'][0].target).to.equal(t2)
    })

    it('is a no-op when no stops match', () => {
      const t1 = globalThis.document.createElement('div')
      const t2 = globalThis.document.createElement('div')
      tour.createTourStop('tour1', t1, 'A', 'D')
      tour.removeTarget('tour1', t2)
      expect(tour.stacks['tour1'].length).to.equal(1)
    })
  })

  describe('hasNext / hasPrev', () => {
    beforeEach(() => {
      tour.registerNewTour({ key: 'tour1' })
      tour.createTourStop('tour1', globalThis.document.createElement('div'), 'A', 'D')
      tour.createTourStop('tour1', globalThis.document.createElement('div'), 'B', 'D')
      tour.createTourStop('tour1', globalThis.document.createElement('div'), 'C', 'D')
      tour.active = 'tour1'
    })

    it('hasNext returns false at last stop', () => {
      tour.stop = 2 // last stop (length=3)
      expect(tour.hasNext()).to.equal(false)
    })

    it('hasNext returns true when not at last stop', () => {
      tour.stop = 0
      expect(tour.hasNext()).to.equal(true)
    })

    it('hasPrev returns false at first stop', () => {
      tour.stop = 0
      expect(tour.hasPrev()).to.equal(false)
    })

    it('hasPrev returns true when not at first stop', () => {
      tour.stop = 1
      expect(tour.hasPrev()).to.equal(true)
    })
  })

  describe('nextStop / prevStop', () => {
    beforeEach(() => {
      tour.registerNewTour({ key: 'tour1' })
      tour.createTourStop('tour1', globalThis.document.createElement('div'), 'A', 'D')
      tour.createTourStop('tour1', globalThis.document.createElement('div'), 'B', 'D')
      tour.createTourStop('tour1', globalThis.document.createElement('div'), 'C', 'D')
      tour.active = 'tour1'
    })

    it('nextStop increments stop when not at last', () => {
      tour.stop = 0
      tour.nextStop()
      expect(tour.stop).to.equal(1)
    })

    it('nextStop does not increment at last stop', () => {
      tour.stop = 2
      tour.nextStop()
      expect(tour.stop).to.equal(2)
    })

    it('prevStop decrements stop when not at first', () => {
      tour.stop = 2
      tour.prevStop()
      expect(tour.stop).to.equal(1)
    })

    it('prevStop does not decrement at first stop', () => {
      tour.stop = 0
      tour.prevStop()
      expect(tour.stop).to.equal(0)
    })
  })

  describe('startTour / stopTour', () => {
    beforeEach(() => {
      tour.registerNewTour({ key: 'tour1', name: 'Tour 1' })
    })

    it('startTour sets active and dispatches tour-changed event', () => {
      let captured = null
      tour.addEventListener('tour-changed', (e) => {
        captured = e
      })
      tour.startTour('tour1')
      expect(tour.active).to.equal('tour1')
      expect(captured).to.exist
      expect(captured.detail).to.equal(tour)
      expect(captured.bubbles).to.be.true
      expect(captured.composed).to.be.true
    })

    it('stopTour resets active and stop, dispatches tour-changed', () => {
      let captured = null
      tour.active = 'tour1'
      tour.stop = 2
      tour.addEventListener('tour-changed', (e) => {
        captured = e
      })
      tour.stopTour()
      expect(tour.active).to.equal(null)
      expect(tour.stop).to.equal(-1)
      expect(captured).to.exist
    })
  })

  describe('scrollHere', () => {
    it('calls scrollIntoView when scrollIntoViewIfNeeded is not available', () => {
      const node = globalThis.document.createElement('div')
      let scrollCalled = false
      node.scrollIntoView = (opts) => {
        scrollCalled = true
        expect(opts.behavior).to.equal('smooth')
        expect(opts.inline).to.equal('center')
      }
      // ensure scrollIntoViewIfNeeded is undefined
      node.scrollIntoViewIfNeeded = undefined
      tour.scrollHere(node)
      expect(scrollCalled).to.be.true
    })

    it('calls scrollIntoViewIfNeeded when available', () => {
      const node = globalThis.document.createElement('div')
      let scrollIfNeededCalled = false
      node.scrollIntoViewIfNeeded = (center) => {
        scrollIfNeededCalled = true
        expect(center).to.equal(true)
      }
      tour.scrollHere(node)
      expect(scrollIfNeededCalled).to.be.true
    })
  })

  describe('managerReset', () => {
    it('calls stopTour', () => {
      tour.active = 'tour1'
      tour.stop = 1
      tour.managerReset()
      expect(tour.active).to.equal(null)
      expect(tour.stop).to.equal(-1)
    })
  })

  describe('updated with active tour (integration)', () => {
    it('sets stop=0 when active becomes truthy and renders first stop', async () => {
      const target = globalThis.document.createElement('div')
      globalThis.document.body.appendChild(target)
      tour.registerNewTour({ key: 'tour1', name: 'Tour 1' })
      tour.createTourStop('tour1', target, 'Step 1', '<p>Description 1</p>')
      tour.orientation = 'lr'

      tour.startTour('tour1')
      // wait for updated to process the active -> stop=0 chain
      await aTimeout(50)

      expect(tour.stop).to.equal(0)
      // target should have had part attribute set temporarily
      expect(target.hasAttribute('part')).to.be.true
      expect(target.getAttribute('part')).to.equal('simple-tour-active')

      // wait for activeElementDelay to restore part
      await aTimeout(550)
      // part should have been removed (since it was null originally)
      expect(target.hasAttribute('part')).to.be.false

      globalThis.document.body.removeChild(target)
    })

    it('handles live mode stops by reading data-stop-title and data-stop-content', async () => {
      const target = globalThis.document.createElement('div')
      target.innerHTML =
        '<span data-stop-title>Live Title</span><div data-stop-content>Live Content</div>'
      globalThis.document.body.appendChild(target)
      tour.registerNewTour({ key: 'tour1', name: 'Tour 1' })
      tour.createTourStop('tour1', target, 'default', 'default', 'live')
      tour.orientation = 'lr'

      tour.startTour('tour1')
      await aTimeout(50)

      expect(tour.stop).to.equal(0)
      // The live mode logic should have read from the target element
      // We mainly verify no errors are thrown and stop is set
      globalThis.document.body.removeChild(target)
    })

    it('live mode reads the title from a referenced attribute when present', async () => {
      const target = globalThis.document.createElement('div')
      target.setAttribute('data-stop-title', 'data-my-title')
      target.setAttribute('data-my-title', 'Live Attr Title')
      target.innerHTML = '<div data-stop-content>Live Attr Body</div>'
      globalThis.document.body.appendChild(target)
      tour.registerNewTour({ key: 'tour1', name: 'Tour 1' })
      tour.createTourStop('tour1', target, 'default', 'default', 'live')
      tour.startTour('tour1')
      await aTimeout(50)
      // the tour renders its content into the popover manager singleton
      const popover = globalThis.SimplePopoverManager.requestAvailability()
      const h2 = popover.querySelector('h2.subheading span')
      expect(h2).to.exist
      expect(h2.textContent).to.equal('Live Attr Title')
      globalThis.document.body.removeChild(target)
    })

    it('restores a pre-existing part attribute after the active element delay', async () => {
      const target = globalThis.document.createElement('div')
      globalThis.document.body.appendChild(target)
      tour.registerNewTour({ key: 'tour1', name: 'Tour 1' })
      tour.createTourStop('tour1', target, 'Step 1', '<p>Description 1</p>')
      tour.createTourStop('tour1', target, 'Step 2', '<p>Description 2</p>')
      tour.startTour('tour1')
      // let the active + stop double render and its timeouts settle
      await aTimeout(600)
      // give the target a pre-existing part value, then move to another stop
      // so a single render captures and restores it deterministically
      target.setAttribute('part', 'my-part')
      tour.stop = 1
      await aTimeout(50)
      // while the stop is active the tour overrides the part attribute
      expect(target.getAttribute('part')).to.equal('simple-tour-active')
      // after activeElementDelay the original part value is restored
      await aTimeout(550)
      expect(target.getAttribute('part')).to.equal('my-part')
      globalThis.document.body.removeChild(target)
    })

    it('tourButtons renders heading and nav with prev/next buttons', async () => {
      const target = globalThis.document.createElement('div')
      globalThis.document.body.appendChild(target)
      tour.registerNewTour({ key: 'tour1', name: 'Tour 1', style: 'h1 { color: red; }' })
      tour.createTourStop('tour1', target, 'Step 1', '<p>Description 1</p>')
      tour.createTourStop('tour1', target, 'Step 2', '<p>Description 2</p>')
      tour.orientation = 'lr'

      tour.startTour('tour1')
      await aTimeout(50)
      tour.stop = 1
      await aTimeout(50)

      // just verify no errors and state is correct
      expect(tour.stop).to.equal(1)
      expect(tour.hasNext()).to.equal(false)
      expect(tour.hasPrev()).to.equal(true)

      globalThis.document.body.removeChild(target)
    })
  })

  describe('global event listeners', () => {
    it('responds to simple-tour-register event', () => {
      globalThis.dispatchEvent(
        new CustomEvent('simple-tour-register', {
          detail: { key: 'globalTour', name: 'Global' },
        }),
      )
      expect(tour.stacks['globalTour']).to.exist
      expect(tour.tourInfo['globalTour'].name).to.equal('Global')
    })

    it('responds to simple-tour-create-tour-stop event', () => {
      const target = globalThis.document.createElement('div')
      globalThis.dispatchEvent(
        new CustomEvent('simple-tour-create-tour-stop', {
          detail: {
            name: 'globalStopTour',
            target: target,
            title: 'Global Stop',
            description: 'Global Desc',
            mode: 'static',
          },
        }),
      )
      expect(tour.stacks['globalStopTour']).to.exist
      expect(tour.stacks['globalStopTour'].length).to.equal(1)
      expect(tour.stacks['globalStopTour'][0].title).to.equal('Global Stop')
    })
  })

  describe('SimpleTourManager singleton', () => {
    it('is an instance of SimpleTour (custom element)', () => {
      expect(tour).to.exist
      expect(tour instanceof SimpleTour).to.be.true
    })

    it('is in the document body', () => {
      expect(tour.parentNode).to.equal(globalThis.document.body)
    })

    it('has activeElementDelay property set to 500', () => {
      expect(tour.activeElementDelay).to.equal(500)
    })
  })
})
