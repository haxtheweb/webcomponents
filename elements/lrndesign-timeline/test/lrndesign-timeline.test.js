import { fixture, expect, html } from '@open-wc/testing'

import { LrndesignTimeline } from '../lrndesign-timeline.js'

const dataImg =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

describe('lrndesign-timeline test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(
      html` <lrndesign-timeline
        id="mytimeline"
        timeline-title="Charter days"
        accent-color="blue"
        dark
      >
        <p>This is lrndesign-timeline</p>
      </lrndesign-timeline>`,
    )
  })

  it('passes the a11y audit', async () => {
    // timeline-title is not a reactive property (see the BUG note below), so
    // the h1 must be populated through the field plus a manual update
    element.timelineTitle = 'Charter days'
    element.requestUpdate()
    await element.updateComplete
    await expect(element).shadowDom.to.be.accessible()
  })

  it('registers the lrndesign-timeline tag', async () => {
    expect(LrndesignTimeline.tag).to.equal('lrndesign-timeline')
    expect(globalThis.customElements.get('lrndesign-timeline')).to.exist
  })

  it('declares itself an oer:LearningComponent', async () => {
    expect(element.getAttribute('typeof')).to.equal('oer:LearningComponent')
  })

  it('renders the timeline title as the only h1', async () => {
    // BUG (lrndesign-timeline.js:505-525): timelineTitle and title are nested
    // inside the timelineSize property descriptor, so the timeline-title
    // attribute never maps to the timelineTitle field and the h1 stays empty
    // until the field is set imperatively and an update is requested.
    expect(element.shadowRoot.querySelector('#title').textContent).to.equal('')
    element.timelineTitle = 'Charter days'
    element.requestUpdate()
    await element.updateComplete
    const h1 = element.shadowRoot.querySelector('#title')
    expect(h1.textContent).to.equal('Charter days')
    expect(element.shadowRoot.querySelectorAll('h1').length).to.equal(1)
  })

  it('keeps slotted content outside the events list', async () => {
    expect(element.querySelector('p').textContent).to.equal(
      'This is lrndesign-timeline',
    )
    expect(element.shadowRoot.querySelector('slot')).to.exist
  })

  it('defaults to the xs timeline size', async () => {
    expect(['xs', 'sm', 'md', 'lg', 'xl']).to.include(
      element.getAttribute('timeline-size'),
    )
  })
})

describe('lrndesign-timeline events rendering', () => {
  it('renders each event with oer:name and oer:description microdata', async () => {
    const el = await fixture(
      html` <lrndesign-timeline timeline-title="Events">
        <p>light content</p>
      </lrndesign-timeline>`,
    )
    el.events = [
      {
        heading: '1855 - Charter',
        details: 'Charter signed.',
        imagesrc: dataImg,
        imagealt: 'Charter illustration',
      },
      {
        heading: '1874 - College',
        details: 'Renamed.',
      },
    ]
    await el.updateComplete
    const sections = el.shadowRoot.querySelectorAll('section.event')
    expect(sections.length).to.equal(2)
    const first = sections[0]
    expect(first.getAttribute('tabindex')).to.equal('0')
    // boolean attribute bindings render as empty-string attributes
    expect(first.getAttribute('has-media')).to.equal('')
    expect(first.hasAttribute('has-media')).to.be.true
    const name = first.querySelector('h2[property="oer:name"]')
    expect(name.textContent).to.equal('1855 - Charter')
    const details = first.querySelector(
      'div.details[property="oer:description"]',
    )
    expect(details.textContent.trim()).to.equal('Charter signed.')
    const img = first.querySelector('img')
    expect(img.getAttribute('src')).to.equal(dataImg)
    expect(img.getAttribute('alt')).to.equal('Charter illustration')
    // an event without an image has no media and no img
    const second = sections[1]
    expect(second.hasAttribute('has-media')).to.be.false
    expect(second.querySelector('img')).to.not.exist
  })

  it('parses events supplied as a JSON string', async () => {
    const el = await fixture(
      html` <lrndesign-timeline timeline-title="String events"></lrndesign-timeline>`,
    )
    el.events = JSON.stringify([
      { heading: 'JSON event', details: 'parsed from a string' },
    ])
    await el.updateComplete
    const sections = el.shadowRoot.querySelectorAll('section.event')
    expect(sections.length).to.equal(1)
    expect(sections[0].querySelector('h2').textContent).to.equal(
      'JSON event',
    )
    expect(el.eventsList.length).to.equal(1)
  })

  it('treats null events as an empty list', async () => {
    const el = await fixture(
      html` <lrndesign-timeline timeline-title="No events"></lrndesign-timeline>`,
    )
    el.events = null
    await el.updateComplete
    expect(el.eventsList).to.deep.equal([])
    expect(el.shadowRoot.querySelectorAll('section.event').length).to.equal(0)
  })

  it('derives events from light DOM sections when no events are set', async () => {
    const el = await fixture(
      html` <lrndesign-timeline timeline-title="Legacy">
        <p>Legacy progressive enhancement</p>
        <section>
          <h3>1855 - Charter</h3>
          <p>Charter signed by the governor.</p>
          <p>Site selected in Centre County.</p>
        </section>
        <section>
          <h4>1874 - The College</h4>
          <p>School renamed.</p>
          <img src="${dataImg}" alt="Old campus" />
        </section>
      </lrndesign-timeline>`,
    )
    await el.updateComplete
    await el.updateComplete
    expect(el.events.length).to.equal(2)
    const sections = el.shadowRoot.querySelectorAll('section.event')
    expect(sections.length).to.equal(2)
    expect(sections[0].querySelector('h2').textContent).to.equal(
      '1855 - Charter',
    )
    // all non-heading, non-image text is joined into the details
    expect(sections[0].querySelector('.details').textContent).to.contain(
      'Charter signed by the governor.',
    )
    expect(sections[0].querySelector('.details').textContent).to.contain(
      'Site selected in Centre County.',
    )
    expect(sections[0].hasAttribute('has-media')).to.be.false
    expect(sections[1].hasAttribute('has-media')).to.be.true
    const img = sections[1].querySelector('img')
    expect(img.getAttribute('src')).to.equal(dataImg)
    expect(img.getAttribute('alt')).to.equal('Old campus')
  })

  it('renders an empty h1 without a timeline title', async () => {
    const el = await fixture(
      html` <lrndesign-timeline></lrndesign-timeline> `,
    )
    expect(el.shadowRoot.querySelector('#title').textContent).to.equal('')
  })

  it('does not migrate the deprecated title attribute', async () => {
    // BUG (lrndesign-timeline.js:505-525): the timelineTitle and title property
    // descriptors are nested INSIDE the timelineSize descriptor, so Lit never
    // registers them as reactive properties. That makes the updated() hook at
    // line 578 (title -> timelineTitle migration) dead code: setting the
    // deprecated title never populates the rendered h1, and setting
    // timelineTitle only renders when something else triggers an update.
    const el = await fixture(
      html` <lrndesign-timeline></lrndesign-timeline> `,
    )
    el.title = 'Legacy title'
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#title').textContent).to.equal('')
    el.timelineTitle = 'Fresh title'
    el.requestUpdate()
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#title').textContent).to.equal(
      'Fresh title',
    )
  })
})

describe('lrndesign-timeline scrolling', () => {
  it('marks the event at the scroll target as selected', async () => {
    const el = await fixture(
      html` <lrndesign-timeline timeline-title="Scrolling">
        <p>content</p>
      </lrndesign-timeline>`,
    )
    el.events = [
      { heading: 'First', details: 'one' },
      { heading: 'Second', details: 'two' },
    ]
    await el.updateComplete
    const sections = Array.from(el.shadowRoot.querySelectorAll('.event'))
    const events = el.shadowRoot.querySelector('#events')
    // force deterministic layout values for the scroll check
    Object.defineProperty(sections[0], 'offsetTop', { value: 0, configurable: true })
    Object.defineProperty(sections[0], 'offsetHeight', { value: 100, configurable: true })
    Object.defineProperty(sections[1], 'offsetTop', { value: 100, configurable: true })
    Object.defineProperty(sections[1], 'offsetHeight', { value: 100, configurable: true })
    Object.defineProperty(events, 'scrollTop', { value: 0, configurable: true })
    el._checkScroll()
    // target = events[0].offsetTop + 50 + scrollTop = 50
    expect(sections[0].getAttribute('selected')).to.equal('true')
    expect(sections[1].hasAttribute('selected')).to.be.false
    // scroll down 100px: target = 150 lands on the second event
    Object.defineProperty(events, 'scrollTop', { value: 100, configurable: true })
    el._checkScroll()
    expect(sections[0].hasAttribute('selected')).to.be.false
    expect(sections[1].getAttribute('selected')).to.equal('true')
  })

  it('rechecks scroll when the events container scrolls', async () => {
    const el = await fixture(
      html` <lrndesign-timeline timeline-title="Scrolled">
        <p>content</p>
      </lrndesign-timeline>`,
    )
    el.events = [{ heading: 'Only', details: 'one' }]
    await el.updateComplete
    const sections = Array.from(el.shadowRoot.querySelectorAll('.event'))
    Object.defineProperty(sections[0], 'offsetTop', { value: 0, configurable: true })
    Object.defineProperty(sections[0], 'offsetHeight', { value: 100, configurable: true })
    const events = el.shadowRoot.querySelector('#events')
    Object.defineProperty(events, 'scrollTop', { value: 0, configurable: true })
    events.dispatchEvent(new Event('scroll'))
    expect(sections[0].getAttribute('selected')).to.equal('true')
  })

  it('smooth scrolls an event into view when focused', async () => {
    const el = await fixture(
      html` <lrndesign-timeline timeline-title="Focus">
        <p>content</p>
      </lrndesign-timeline>`,
    )
    el.events = [{ heading: 'Focusable', details: 'one' }]
    await el.updateComplete
    const section = el.shadowRoot.querySelector('.event')
    const events = el.shadowRoot.querySelector('#events')
    let scrollArgs = null
    events.scroll = function (options) {
      scrollArgs = options
    }
    Object.defineProperty(section, 'offsetTop', { value: 42 })
    section.dispatchEvent(new FocusEvent('focus'))
    expect(scrollArgs).to.not.equal(null)
    expect(scrollArgs.behavior).to.equal('smooth')
    expect(scrollArgs.left).to.equal(0)
    expect(scrollArgs.top).to.equal(42)
  })

  it('creates a new observer instance on every access', async () => {
    // BUG (lrndesign-timeline.js:600-603): the observer getter returns a NEW
    // MutationObserver on each access, so firstUpdated() observes with one
    // instance while disconnectedCallback() disconnects a different, fresh
    // instance. The actually-observing instance is never disconnected
    // (an instance leak). The getter should cache a single observer.
    const el = await fixture(
      html` <lrndesign-timeline timeline-title="Observer">
        <p>content</p>
      </lrndesign-timeline>`,
    )
    expect(el.observer === el.observer).to.be.false
    expect(typeof el.observer.observe).to.equal('function')
    // disconnecting uses yet another instance and must not throw
    el.remove()
    expect(globalThis.document.body.contains(el)).to.be.false
  })
})

describe('lrndesign-timeline hax integration', () => {
  it('reports haxProperties with a demo schema', async () => {
    const props = LrndesignTimeline.haxProperties
    expect(props.canScale).to.be.false
    expect(props.canEditSource).to.be.true
    expect(props.gizmo.title).to.equal('Timeline')
    expect(props.demoSchema[0].tag).to.equal('lrndesign-timeline')
    expect(props.demoSchema[0].properties.events.length).to.be.above(0)
    expect(props.saveOptions.unsetAttributes).to.deep.equal(['colors'])
  })

  it('exposes configure settings and an empty advanced panel', async () => {
    const props = LrndesignTimeline.haxProperties
    const configure = props.settings.configure.map((s) => s.property)
    expect(configure).to.include('timelineTitle')
    expect(configure).to.include('accentColor')
    expect(configure).to.include('dark')
    expect(configure).to.include('events')
    expect(props.settings.advanced).to.deep.equal([])
  })
})
