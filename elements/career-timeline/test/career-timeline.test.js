import { html, fixture, expect } from '@open-wc/testing'
import { CareerTimeline } from '../career-timeline.js'

const logoSrc =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

describe('CareerTimeline test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <career-timeline title="title"></career-timeline>
    `)
  })

  it('basic will it blend', async () => {
    expect(element).to.exist
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })

  it('registers the career-timeline tag', async () => {
    expect(CareerTimeline.tag).to.equal('career-timeline')
    expect(globalThis.customElements.get('career-timeline')).to.exist
  })

  it('declares itself an oer:LearningComponent with oer:name microdata', async () => {
    expect(element.getAttribute('typeof')).to.equal('oer:LearningComponent')
    const meta = element.shadowRoot.querySelector(
      'meta[property="oer:name"]',
    )
    expect(meta).to.exist
    expect(meta.getAttribute('content')).to.equal('title')
  })

  it('renders slotted content inside the wrapper', async () => {
    const el = await fixture(html`
      <career-timeline title="with content">
        <p>Timeline body</p>
      </career-timeline>
    `)
    const wrapper = el.shadowRoot.querySelector('.wrapper')
    expect(wrapper).to.exist
    expect(el.querySelector('p').textContent).to.equal('Timeline body')
  })

  it('exposes an external haxProperties schema file', async () => {
    const url = CareerTimeline.haxProperties
    expect(typeof url).to.equal('string')
    expect(url).to.contain('career-timeline.haxProperties.json')
  })

  it('sorts organizations by earliest role date when a role changes', async () => {
    const el = await fixture(html`
      <career-timeline title="sorted">
        <career-org-item id="ct-orgA" organization="Old Co" source="${logoSrc}">
          <career-role-item
            title="Founder"
            start-date="2015-04-01"
            end-date="2016-04-01"
          ></career-role-item>
        </career-org-item>
        <career-org-item id="ct-orgB" organization="New Co" source="${logoSrc}">
          <career-role-item title="Engineer" start-date="2020-01-01">
            <p>Shipped things</p>
          </career-role-item>
        </career-org-item>
      </career-timeline>
    `)
    const orgA = el.querySelector('#ct-orgA')
    const role = orgA.querySelector('career-role-item')
    await role.updateComplete
    // before the change the DOM order matches the authored order
    let ids = Array.from(el.querySelectorAll('career-org-item')).map((o) =>
      o.getAttribute('id'),
    )
    expect(ids).to.deep.equal(['ct-orgA', 'ct-orgB'])
    // an already-normalized start date dispatches start-date-changed
    role.startDate = '2015-04-01T00:00:00.000Z'
    await role.updateComplete
    await role.updateComplete
    ids = Array.from(el.querySelectorAll('career-org-item')).map((o) =>
      o.getAttribute('id'),
    )
    // newest first, descending by earliest role date
    expect(ids).to.deep.equal(['ct-orgB', 'ct-orgA'])
  })

  it('prepends a hydrated organization from the inline context menu', async () => {
    element._addItemHandler()
    const added = element.querySelector('career-org-item')
    expect(added).to.exist
    // keep the logo local so no network is hit
    added.source = logoSrc
    await added.updateComplete
    expect(added.getAttribute('data-hax-layout')).to.equal('true')
    expect(added.getAttribute('data-hax-ray')).to.equal('career-org-item')
    // prepended, so it is the first organization in the timeline
    const first = Array.from(element.querySelectorAll('career-org-item'))[0]
    expect(first.getAttribute('data-hax-ray')).to.equal('career-org-item')
  })

  it('wires the inline context menu for hax', async () => {
    expect(element.haxHooks().inlineContextMenu).to.equal(
      'haxinlineContextMenu',
    )
    const ceMenu = {}
    element.haxinlineContextMenu(ceMenu)
    expect(ceMenu.ceButtons.length).to.equal(1)
    expect(ceMenu.ceButtons[0].icon).to.equal('icons:add')
    expect(ceMenu.ceButtons[0].callback).to.equal('_addItemHandler')
    expect(ceMenu.ceButtons[0].label).to.equal('Add organization to timeline')
  })
})
