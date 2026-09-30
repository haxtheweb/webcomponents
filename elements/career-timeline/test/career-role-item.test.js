import { html, fixture, expect } from '@open-wc/testing'
import { CareerRoleItem } from '../lib/career-role-item.js'

describe('CareerRoleItem test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <career-role-item
        title="Senior Widget Wrangler"
        start-date="2015-04-15"
        end-date="2020-06-15"
      >
        <p>Wrangled widgets</p>
      </career-role-item>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })

  it('registers the career-role-item tag', async () => {
    expect(CareerRoleItem.tag).to.equal('career-role-item')
    expect(globalThis.customElements.get('career-role-item')).to.exist
  })

  it('renders the title and slot content', async () => {
    const h4 = element.shadowRoot.querySelector('h4')
    expect(h4.textContent).to.equal('Senior Widget Wrangler')
    expect(element.shadowRoot.querySelector('.circle')).to.exist
    expect(element.querySelector('p').textContent).to.equal(
      'Wrangled widgets',
    )
  })

  it('seeds an empty slot with placeholder content', async () => {
    const el = await fixture(html`
      <career-role-item title="Blank"></career-role-item>
    `)
    const placeholder = el.querySelector('p')
    expect(placeholder).to.exist
    expect(placeholder.textContent).to.equal('Describe your role here...')
  })

  it('defaults title, dates and skills from the constructor', async () => {
    const el = await fixture(html`
      <career-role-item></career-role-item>
    `)
    expect(el.title).to.equal('Role Title')
    expect(el.skills).to.deep.equal([])
    // defaults to today, stored as ISO
    expect(el.startDate).to.equal(new Date(el.startDate).toISOString())
    expect(el.endDate).to.equal(new Date(el.endDate).toISOString())
  })

  it('formats ongoing roles as Present', async () => {
    const el = await fixture(html`
      <career-role-item
        title="Current"
        start-date="2015-04-15"
      ></career-role-item>
    `)
    await el.updateComplete
    const content = el.shadowRoot.querySelector('.role-content')
    expect(content.textContent).to.contain('Apr 2015 - Present')
  })

  it('formats explicit date ranges with a timespan', async () => {
    const content = element.shadowRoot.querySelector('.role-content')
    await element.updateComplete
    expect(content.textContent).to.contain('Apr 2015 - Jun 2020')
    expect(content.textContent).to.contain('5 yrs 2 mos')
  })

  it('normalizes loose start dates to ISO', async () => {
    element.startDate = '2016-07-04'
    await element.updateComplete
    await element.updateComplete
    expect(element.startDate).to.equal('2016-07-04T00:00:00.000Z')
  })

  it('strips wrapped quotes while normalizing dates', async () => {
    element.startDate = '"2017-01-05"'
    await element.updateComplete
    await element.updateComplete
    expect(element.startDate).to.equal('2017-01-05T00:00:00.000Z')
    element.endDate = "'2018-02-06'"
    await element.updateComplete
    await element.updateComplete
    expect(element.endDate).to.equal('2018-02-06T00:00:00.000Z')
  })

  it('resets unparseable dates to today', async () => {
    element.startDate = 'not a date'
    await element.updateComplete
    await element.updateComplete
    expect(element.startDate).to.equal(new Date(element.startDate).toISOString())
    element.endDate = 'also not a date'
    await element.updateComplete
    await element.updateComplete
    expect(element.endDate).to.equal(new Date(element.endDate).toISOString())
  })

  it('dispatches start-date-changed with the role node', async () => {
    let captured = null
    element.addEventListener('start-date-changed', (e) => {
      captured = e
    })
    element.startDate = '2015-04-01T00:00:00.000Z'
    await element.updateComplete
    expect(captured).to.exist
    expect(captured.detail.node === element).to.be.true
    expect(captured.bubbles).to.be.true
    expect(captured.composed).to.be.true
  })

  it('normalizeDate handles every input shape', async () => {
    expect(element._normalizeDate(undefined)).to.equal('')
    expect(element._normalizeDate(null)).to.equal('')
    expect(element._normalizeDate('')).to.equal('')
    expect(element._normalizeDate('   ')).to.equal('')
    expect(element._normalizeDate('junk')).to.equal('')
    expect(element._normalizeDate(new Date('nope'))).to.equal('')
    expect(element._normalizeDate(new Date('2020-05-05'))).to.equal(
      '2020-05-05T00:00:00.000Z',
    )
    expect(element._normalizeDate(' 2020-05-05 ')).to.equal(
      '2020-05-05T00:00:00.000Z',
    )
    expect(element._normalizeDate('&quot;2020-05-05&quot;')).to.equal(
      '2020-05-05T00:00:00.000Z',
    )
  })

  it('stripWrappedQuotes removes every wrapping quote flavor', async () => {
    expect(element._stripWrappedQuotes('&quot;abc&quot;')).to.equal('abc')
    expect(element._stripWrappedQuotes('"abc"')).to.equal('abc')
    expect(element._stripWrappedQuotes("'abc'")).to.equal('abc')
    expect(element._stripWrappedQuotes('abc')).to.equal('abc')
    expect(element._stripWrappedQuotes('""""')).to.equal('')
  })

  it('formatDate is empty until a start date can be parsed', async () => {
    // set a raw invalid value and format synchronously before the
    // updated hook resets it
    element.startDate = 'zzz'
    expect(element._formatDate()).to.equal('')
  })

  it('formatDate borrows months across the year boundary', async () => {
    const el = await fixture(html`
      <career-role-item
        title="Borrow"
        start-date="2019-11-15"
        end-date="2020-02-15"
      ></career-role-item>
    `)
    await el.updateComplete
    expect(el._formatDate()).to.contain('0 yr 3 mos')
  })

  it('renders the skills list and truncates past five skills', async () => {
    const el = await fixture(html`
      <career-role-item title="Skills" start-date="2020-01-01">
        <p>Things</p>
      </career-role-item>
    `)
    // no skills renders nothing
    expect(el._formatSkills()).to.not.exist
    el.skills = [{ name: 'a' }, { name: 'b' }]
    await el.updateComplete
    let content = el.shadowRoot.querySelector('.role-content')
    expect(content.textContent).to.contain('Skills:')
    expect(content.textContent).to.contain('a · b')
    el.skills = [
      { name: 'a' },
      { name: 'b' },
      { name: 'c' },
      { name: 'd' },
      { name: 'e' },
      { name: 'f' },
    ]
    await el.updateComplete
    content = el.shadowRoot.querySelector('.role-content')
    expect(content.textContent).to.contain('a · b · c · d · e and +1 more')
  })

  it('reports inline haxProperties for the editor', async () => {
    const props = CareerRoleItem.haxProperties
    expect(props.designSystem).to.be.false
    expect(props.canEditSource).to.be.true
    expect(props.gizmo.title).to.equal('Career Role')
    expect(props.settings.configure[0].property).to.equal('title')
    expect(props.settings.configure[1].inputMethod).to.equal('datepicker')
    expect(props.settings.configure[3].property).to.equal('skills')
    expect(props.settings.configure[3].properties[0].property).to.equal('name')
  })
})
