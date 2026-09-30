import { html, fixture, expect } from '@open-wc/testing'
import { CareerOrgItem } from '../lib/career-org-item.js'

const logoSrc =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

describe('CareerOrgItem test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <career-org-item
        organization="The Pennsylvania State University"
        location="University Park, PA"
        source="${logoSrc}"
      >
        <career-role-item
          title="Developer"
          start-date="2015-04-15"
          end-date="2020-06-15"
        >
          <p>Built things</p>
        </career-role-item>
      </career-org-item>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })

  it('registers the career-org-item tag', async () => {
    expect(CareerOrgItem.tag).to.equal('career-org-item')
    expect(globalThis.customElements.get('career-org-item')).to.exist
  })

  it('renders the organization, logo, location and timespan', async () => {
    const img = element.shadowRoot.querySelector('#logo')
    expect(img.getAttribute('src')).to.equal(logoSrc)
    expect(img.getAttribute('alt')).to.equal('')
    const h3 = element.shadowRoot.querySelector('h3')
    expect(h3.textContent).to.equal('The Pennsylvania State University')
    const org = element.shadowRoot.querySelector('.org')
    expect(org.textContent).to.contain('University Park, PA')
    // 2015-04-15 to 2020-06-15 spans 5 years 2 months
    expect(org.textContent).to.contain('5 yrs 2 mos')
  })

  it('falls back to 0 yr 0 mo without any roles', async () => {
    const el = await fixture(html`
      <career-org-item organization="Empty Co" source="${logoSrc}">
      </career-org-item>
    `)
    await el.updateComplete
    const org = el.shadowRoot.querySelector('.org')
    expect(org.textContent).to.contain('0 yr 0 mo')
    // Math.min/Math.max over empty arrays give Infinity/-Infinity
    expect(Number.isFinite(el.earliestDate)).to.be.false
    expect(Number.isFinite(el.latestDate)).to.be.false
  })

  it('computes earliest and latest dates across roles', async () => {
    const el = await fixture(html`
      <career-org-item organization="Multi Co" source="${logoSrc}">
        <career-role-item
          title="First"
          start-date="2019-03-01"
          end-date="2021-06-15"
        ></career-role-item>
        <career-role-item
          title="Second"
          start-date="2017-08-01"
          end-date="2020-01-15"
        ></career-role-item>
      </career-org-item>
    `)
    await el.updateComplete
    expect(el.earliestDate).to.equal(new Date('2017-08-01').getTime())
    expect(el.latestDate).to.equal(new Date('2021-06-15').getTime())
  })

  it('renders the timespan with month borrowing', async () => {
    const el = await fixture(html`
      <career-org-item organization="Borrow Co" source="${logoSrc}">
        <career-role-item
          title="Late year"
          start-date="2019-11-15"
          end-date="2020-02-15"
        ></career-role-item>
      </career-org-item>
    `)
    await el.updateComplete
    // Nov to Feb crosses the year boundary: 0 yr 3 mos
    expect(el._formatDate()).to.equal('0 yr 3 mos')
  })

  it('renders a one year one month timespan in singular grammar', async () => {
    const el = await fixture(html`
      <career-org-item organization="Singular Co" source="${logoSrc}">
        <career-role-item
          title="Short"
          start-date="2020-01-15"
          end-date="2021-02-15"
        ></career-role-item>
      </career-org-item>
    `)
    await el.updateComplete
    expect(el._formatDate()).to.equal('1 yr 1 mo')
  })

  it('sorts roles newest first when a role start date changes', async () => {
    const el = await fixture(html`
      <career-org-item organization="Sort Co" source="${logoSrc}">
        <career-role-item
          id="org-role-old"
          title="Old role"
          start-date="2015-01-01"
          end-date="2016-01-01"
        ></career-role-item>
        <career-role-item
          id="org-role-new"
          title="New role"
          start-date="2018-01-01"
        ></career-role-item>
      </career-org-item>
    `)
    const oldRole = el.querySelector('#org-role-old')
    await oldRole.updateComplete
    let titles = Array.from(el.querySelectorAll('career-role-item')).map((r) =>
      r.getAttribute('title'),
    )
    expect(titles).to.deep.equal(['Old role', 'New role'])
    // move the old role back before the new role's start date; an
    // already-normalized start date dispatches the sorting event
    oldRole.startDate = '2013-01-01T00:00:00.000Z'
    await oldRole.updateComplete
    await oldRole.updateComplete
    titles = Array.from(el.querySelectorAll('career-role-item')).map((r) =>
      r.getAttribute('title'),
    )
    expect(titles).to.deep.equal(['New role', 'Old role'])
  })

  it('prepends a hydrated role from the inline context menu', async () => {
    element._addItemHandler()
    const added = element.querySelector('career-role-item')
    expect(added).to.exist
    expect(added.getAttribute('data-hax-layout')).to.equal('true')
    expect(added.getAttribute('data-hax-ray')).to.equal('career-role-item')
    const first = Array.from(
      element.querySelectorAll('career-role-item'),
    ).filter((r) => r.hasAttribute('data-hax-ray'))[0]
    expect(first.getAttribute('data-hax-ray')).to.equal('career-role-item')
  })

  it('wires the inline context menu for hax', async () => {
    expect(element.haxHooks().inlineContextMenu).to.equal(
      'haxinlineContextMenu',
    )
    const ceMenu = {}
    element.haxinlineContextMenu(ceMenu)
    expect(ceMenu.ceButtons[0].label).to.equal('Add role under organization')
    expect(ceMenu.ceButtons[0].icon).to.equal('icons:add')
    expect(ceMenu.ceButtons[0].callback).to.equal('_addItemHandler')
  })

  it('reports inline haxProperties for the editor', async () => {
    const props = CareerOrgItem.haxProperties
    expect(props.designSystem).to.be.false
    expect(props.gizmo.title).to.equal('Career Item')
    expect(props.settings.configure[0].property).to.equal('organization')
    expect(props.settings.configure[2].property).to.equal('source')
  })
})
