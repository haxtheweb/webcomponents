import { fixture, expect, html } from '@open-wc/testing'
import sinon from 'sinon'

import '../user-action.js'
import { UserAction } from '../user-action.js'
import { UABroker } from '../lib/UserActionBroker.js'

// Behavioral coverage for user-action: track modes (visibility via
// IntersectionObserver, arbitrary DOM events), every/eventname/demo
// attributes, teardown on disconnect, hax hooks, and the UABroker.
describe('user-action behaviors', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('user-action')).to.exist
  })

  it('sets up an IntersectionObserver for visibility tracking by default', async () => {
    const el = await fixture(html`<user-action></user-action>`)
    expect(el.track).to.equal('visibility')
    expect(el.observer).to.be.instanceOf(IntersectionObserver)
    expect(el.__trackedEventName).to.equal(null)
  })

  it('tears down the observer on disconnect and re-arms on connect', async () => {
    const container = globalThis.document.createElement('div')
    container.innerHTML = '<user-action></user-action>'
    globalThis.document.body.appendChild(container)
    const el = container.querySelector('user-action')
    expect(el.observer).to.exist
    container.removeChild(el)
    expect(el.observer).to.equal(null)
    expect(el.__ready).to.equal(false)
    // re-connecting the element itself re-arms tracking
    container.appendChild(el)
    expect(el.observer).to.exist
    expect(el.__ready).to.equal(true)
    container.remove()
  })

  it('fires a user-engagement event when intersection crosses visiblelimit', async () => {
    const el = await fixture(html`<user-action></user-action>`)
    const events = []
    const handler = (e) => events.push(e)
    globalThis.document.addEventListener('user-engagement', handler)
    // above the 0.5 default visiblelimit
    el.handleIntersectionCallback([{ intersectionRatio: 0.75 }])
    expect(events.length).to.equal(1)
    expect(events[0].detail.eventType).to.equal('visibility')
    expect(events[0].detail.detail).to.equal('visible')
    // below the visiblelimit: nothing fires
    el.handleIntersectionCallback([{ intersectionRatio: 0.25 }])
    expect(events.length).to.equal(1)
    globalThis.document.removeEventListener('user-engagement', handler)
  })

  it('does not fire the visibility event while disconnected', async () => {
    const el = await fixture(html`<user-action></user-action>`)
    el.disconnectedCallback()
    const events = []
    const handler = (e) => events.push(e)
    globalThis.document.addEventListener('user-engagement', handler)
    el.handleIntersectionCallback([{ intersectionRatio: 1.0 }])
    expect(events.length).to.equal(0)
    globalThis.document.removeEventListener('user-engagement', handler)
    el.connectedCallback()
  })

  it('tracks arbitrary DOM events via the track attribute', async () => {
    const el = await fixture(
      html`<user-action track="click" eventname="xapi-click"></user-action>`,
    )
    expect(el.track).to.equal('click')
    expect(el.__trackedEventName).to.equal('click')
    const events = []
    const handler = (e) => events.push(e)
    globalThis.document.addEventListener('xapi-click', handler)
    const evt = new MouseEvent('click', { bubbles: true })
    el.dispatchEvent(evt)
    expect(events.length).to.equal(1)
    expect(events[0].detail.eventType).to.equal('click')
    // issues#3102 #25 FIXED: DOM-event tracking now fires the same
    // { detail: <payload>, eventType } shape visibility tracking uses,
    // carrying the raw event as the payload
    expect(events[0].detail.detail instanceof globalThis.MouseEvent).to.equal(
      true,
    )
    // issues#3102 #53 FIXED: the incoming event is no longer mutated with
    // an eventType property
    expect(evt.eventType).to.equal(undefined)
    globalThis.document.removeEventListener('xapi-click', handler)
  })

  it('only fires once unless every is set', async () => {
    const el = await fixture(html`<user-action track="click"></user-action>`)
    const events = []
    const handler = (e) => events.push(e)
    globalThis.document.addEventListener('user-engagement', handler)
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(events.length).to.equal(1)
    // every attribute re-enables firing on every event
    el.setAttribute('every', 'true')
    expect(el.every).to.equal('true')
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(events.length).to.equal(2)
    globalThis.document.removeEventListener('user-engagement', handler)
  })

  it('removes the previous listener when track changes', async () => {
    const el = await fixture(html`<user-action track="click"></user-action>`)
    const events = []
    const handler = (e) => events.push(e)
    globalThis.document.addEventListener('user-engagement', handler)
    el.setAttribute('track', 'keypress')
    expect(el.track).to.equal('keypress')
    // the click listener was removed
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(events.length).to.equal(0)
    // the keypress listener is active
    el.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true }))
    expect(events.length).to.equal(1)
    expect(events[0].detail.eventType).to.equal('keypress')
    globalThis.document.removeEventListener('user-engagement', handler)
  })

  it('clears tracking via _setTracking(null)', async () => {
    const el = await fixture(html`<user-action track="click"></user-action>`)
    expect(el.__trackedEventName).to.equal('click')
    el._setTracking(null)
    expect(el.__trackedEventName).to.equal(null)
    const events = []
    const handler = (e) => events.push(e)
    globalThis.document.addEventListener('user-engagement', handler)
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(events.length).to.equal(0)
    globalThis.document.removeEventListener('user-engagement', handler)
  })

  it('warns and does not fire for an invalid track value', async () => {
    const warnSpy = sinon.spy(console, 'warn')
    const el = await fixture(
      html`<user-action track="bogus"></user-action>`,
    )
    // issues#3102 #53 FIXED: _setTracking validates the track string before
    // installing listeners, so the typo is caught at install time (the warn
    // already fired) and no listener/observer is armed
    expect(el.__trackedEventName).to.equal(null)
    expect(el.observer).to.equal(null)
    expect(warnSpy.calledWith('bogus was not valid')).to.equal(true)
    const events = []
    const handler = (e) => events.push(e)
    globalThis.document.addEventListener('user-engagement', handler)
    el.dispatchEvent(new CustomEvent('bogus', { bubbles: true }))
    expect(events.length).to.equal(0)
    expect(warnSpy.calledWith('bogus was not valid')).to.equal(true)
    globalThis.document.removeEventListener('user-engagement', handler)
    warnSpy.restore()
  })

  it('userActionEvent warns on direct invocation with an invalid track', async () => {
    const warnSpy = sinon.spy(console, 'warn')
    const el = await fixture(html`<user-action></user-action>`)
    // issues#3102 #53: listeners are no longer installed for invalid track
    // strings, but the fire-time guard still warns if userActionEvent is
    // invoked directly with an invalid track set on the instance
    el.track = 'bogus'
    el.userActionEvent({ detail: 'x' })
    expect(warnSpy.calledWith('bogus was not valid')).to.equal(true)
    warnSpy.restore()
  })

  it('uses a custom eventname attribute for the fired event', async () => {
    const el = await fixture(
      html`<user-action
        track="click"
        eventname="engagement-2"
        every="true"
      ></user-action>`,
    )
    const events = []
    const handler = (e) => events.push(e)
    globalThis.document.addEventListener('engagement-2', handler)
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(events.length).to.equal(1)
    // eventname attribute can change after connection
    el.setAttribute('eventname', 'engagement-3')
    expect(el.eventname).to.equal('engagement-3')
    globalThis.document.removeEventListener('engagement-2', handler)
    globalThis.document.addEventListener('engagement-3', handler)
    el.setAttribute('track', 'keypress')
    el.dispatchEvent(new KeyboardEvent('keypress', { bubbles: true }))
    expect(events.length).to.equal(2)
    expect(events[1].type).to.equal('engagement-3')
    globalThis.document.removeEventListener('engagement-3', handler)
  })

  it('boolean demo attribute activates demo output', async () => {
    const el = await fixture(
      html`<user-action track="click" demo></user-action>`,
    )
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    // issues#3102 #24 FIXED: the demo getter uses hasAttribute, so a bare
    // boolean demo attribute (value "") activates demo output.
    expect(el.demo).to.equal(true)
    const pre = el.querySelector('pre')
    expect(pre).to.exist
    expect(pre.textContent).to.contain('"eventType": "click"')
    // an explicit non-empty value still activates demo output too
    el.setAttribute('demo', 'true')
    el.setAttribute('every', 'true')
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(el.querySelector('pre')).to.exist
    expect(el.querySelector('pre').textContent).to.contain(
      '"eventType": "click"',
    )
  })

  it('exposes the every and demo setters', async () => {
    const el = await fixture(html`<user-action></user-action>`)
    el.every = 'true'
    expect(el.getAttribute('every')).to.equal('true')
    expect(el.every).to.equal('true')
    el.demo = true
    expect(el.getAttribute('demo')).to.equal('true')
    // issues#3102 #24: the demo getter is boolean (hasAttribute) now
    expect(el.demo).to.equal(true)
    // the demo setter is symmetric: a falsy value removes the attribute
    el.demo = false
    expect(el.hasAttribute('demo')).to.equal(false)
    expect(el.demo).to.equal(false)
  })

  it('haxProperties points at the lib schema file', () => {
    expect(UserAction.haxProperties).to.contain(
      'lib/user-action.haxProperties.json',
    )
  })

  it('haxHooks registers the three hook callbacks', () => {
    const el = globalThis.document.createElement('user-action')
    const hooks = el.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
    expect(hooks.gizmoRegistration).to.equal('haxgizmoRegistration')
  })

  it('haxgizmoRegistration dispatches an i18n registration event', async () => {
    const el = await fixture(html`<user-action></user-action>`)
    const registrations = []
    const handler = (e) => registrations.push(e.detail)
    globalThis.addEventListener('i18n-manager-register-element', handler)
    el.haxgizmoRegistration({})
    expect(registrations.length).to.equal(1)
    expect(registrations[0].namespace).to.equal('user-action.haxProperties')
    expect(registrations[0].localesPath).to.contain('locales')
    globalThis.removeEventListener('i18n-manager-register-element', handler)
  })

  it('haxactiveElementChanged and haxeditModeChanged gate firing', async () => {
    const el = await fixture(html`<user-action track="click"></user-action>`)
    const events = []
    const handler = (e) => events.push(e)
    globalThis.document.addEventListener('user-engagement', handler)
    // active element in hax: suppresses tracking
    el.haxactiveElementChanged(el, true)
    expect(el._haxstate).to.equal(true)
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(events.length).to.equal(0)
    // leaving edit mode re-enables tracking
    el.haxeditModeChanged(false)
    expect(el._haxstate).to.equal(false)
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(events.length).to.equal(1)
    // a falsy activeElementChanged does not flip the state
    el.haxactiveElementChanged(el, true)
    el.haxactiveElementChanged(el, false)
    expect(el._haxstate).to.equal(true)
    globalThis.document.removeEventListener('user-engagement', handler)
  })

  it('UABroker.valid accepts known tracks and rejects others', () => {
    const known = [
      'click',
      'hover',
      'mousedown',
      'mouseup',
      'visibility',
      'keypress',
      'keydown',
      'keyup',
      'focusin',
      'focusout',
    ]
    for (const k of known) {
      expect(UABroker.valid(k)).to.equal(true, `expected ${k} to be valid`)
    }
    expect(UABroker.valid('bogus')).to.equal(false)
    expect(UABroker.valid('')).to.equal(false)
  })

  it('UABroker.fire dispatches a composed bubbling event with detail', async () => {
    const el = await fixture(html`<user-action></user-action>`)
    const events = []
    const handler = (e) => events.push(e)
    globalThis.document.addEventListener('broker-event', handler)
    const details = { detail: 'hello' }
    UABroker.fire('broker-event', 'hover', details, el, false)
    expect(events.length).to.equal(1)
    expect(events[0].detail.detail).to.equal('hello')
    expect(events[0].detail.eventType).to.equal('hover')
    // issues#3102 #53 FIXED: the caller's details object is copied into a
    // normalized detail, not mutated with eventType
    expect(details.eventType).to.equal(undefined)
    expect(events[0].bubbles).to.equal(true)
    expect(events[0].composed).to.equal(true)
    expect(events[0].cancelable).to.equal(true)
    // demo mode writes the details as a pre block on the context
    UABroker.fire('broker-event', 'hover', { detail: 'demo' }, el, true)
    expect(el.querySelector('pre').textContent).to.contain('"detail": "demo"')
    globalThis.document.removeEventListener('broker-event', handler)
  })
})
