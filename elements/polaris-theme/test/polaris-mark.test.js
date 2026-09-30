import { fixture, expect, html } from '@open-wc/testing'
import { PolarisMark } from '../lib/polaris-mark.js'

// direct lib import so coverage sees lib/polaris-mark.js statements
describe('polaris-mark', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`<polaris-mark></polaris-mark>`)
    await element.updateComplete
  })

  it('registers as a custom element', () => {
    expect(customElements.get('polaris-mark')).to.exist
    expect(PolarisMark.tag).to.equal('polaris-mark')
  })

  it('has default property values', () => {
    expect(element.type).to.equal('default')
    expect(element.name).to.equal(null)
    expect(element.name2).to.equal(null)
    expect(element.name3).to.equal(null)
    expect(element.url).to.equal('https://psu.edu/')
    expect(element.vert).to.equal(false)
    expect(element._haxstate).to.equal(false)
    expect(element.svgwidth).to.equal(600)
    expect(element.svgheight).to.equal(180)
    expect(element.linex).to.equal(320)
    expect(element.name3x).to.equal(340)
  })

  it('renders the default mark with fallback naming', () => {
    const a = element.shadowRoot.querySelector('#logo-wrap a')
    expect(a === null).to.equal(false)
    expect(a.getAttribute('href')).to.equal('https://psu.edu/')
    expect(a.getAttribute('target')).to.equal('_blank')
    expect(a.getAttribute('rel')).to.equal('noopener')
    expect(a.getAttribute('aria-label')).to.equal('Penn State — visit psu.edu')
    // svg title falls back to Penn State when no name is set
    expect(element.shadowRoot.querySelector('svg title').textContent.trim()).to.equal(
      'Penn State',
    )
    // default type renders the default svg with the navy name fill
    expect(
      element.shadowRoot.querySelector('svg #name-line1').getAttribute('fill'),
    ).to.equal('#1e407c')
    // no name2 / name3 lines by default
    expect(element.shadowRoot.querySelector('#name-line2') === null).to.equal(true)
    expect(element.shadowRoot.querySelector('#name-line3') === null).to.equal(true)
    expect(element.shadowRoot.querySelector('#stroke-line') === null).to.equal(true)
  })

  it('drives the svg viewBox from svgwidth / svgheight', async () => {
    element.svgwidth = 640
    element.svgheight = 200
    await element.updateComplete
    expect(element.shadowRoot.querySelector('svg').getAttribute('viewBox')).to.equal(
      '0 0 640 200',
    )
  })

  it('renders name, name2 and the vertical name3 layout by default', async () => {
    element.name = 'Eberly'
    element.name2 = 'College of'
    element.name3 = 'Science'
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('#name-line1').textContent.trim(),
    ).to.equal('Eberly')
    expect(
      element.shadowRoot.querySelector('#name-line2').textContent.trim(),
    ).to.equal('College of')
    expect(
      element.shadowRoot.querySelector('#name-line3').textContent.trim(),
    ).to.equal('Science')
    // non-vert name3 renders the vertical stroke line at linex
    expect(element.shadowRoot.querySelector('#stroke-line') === null).to.equal(
      false,
    )
    expect(
      element.shadowRoot.querySelector('#stroke-line').getAttribute('x1'),
    ).to.equal('320')
    expect(
      element.shadowRoot.querySelector('#name-line3').getAttribute('x'),
    ).to.equal('340')
    // linex / name3x feed the svg coordinates
    element.linex = 200
    element.name3x = 240
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('#stroke-line').getAttribute('x1'),
    ).to.equal('200')
    expect(
      element.shadowRoot.querySelector('#name-line3').getAttribute('x'),
    ).to.equal('240')
  })

  it('renders the horizontal name3 layout when vert is set', async () => {
    element.name = 'Penn State'
    element.name3 = 'Teaching and research'
    element.vert = true
    await element.updateComplete
    expect(element.shadowRoot.querySelector('#stroke-line') === null).to.equal(
      true,
    )
    expect(
      element.shadowRoot.querySelector('#name-line3').getAttribute('x'),
    ).to.equal('94')
    expect(
      element.shadowRoot.querySelector('#name-line3').getAttribute('y'),
    ).to.equal('160')
    // the vert divider is a horizontal line from x=94
    const line = element.shadowRoot.querySelector('svg line')
    expect(line.getAttribute('x1')).to.equal('94')
    expect(line.getAttribute('y1')).to.equal('120')
  })

  it('renders the dark variant for type dark', async () => {
    element.type = 'dark'
    element.name = 'Invent'
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('svg #name-line1').getAttribute('fill'),
    ).to.equal('#000000')
    expect(
      element.shadowRoot.querySelector('#name-line1').textContent.trim(),
    ).to.equal('Invent')
  })

  it('renders the default svg with the white name fill for other types', async () => {
    element.type = 'light'
    element.name = 'Something'
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('svg #name-line1').getAttribute('fill'),
    ).to.equal('#ffffff')
  })

  it('blocks the whole-card link while hax state is active', () => {
    const evt = new Event('click', {
      cancelable: true,
      bubbles: true,
      composed: true,
    })
    element._haxstate = true
    element._clickPrevent(evt)
    expect(evt.defaultPrevented).to.equal(true)
    const evt2 = new Event('click', {
      cancelable: true,
      bubbles: true,
      composed: true,
    })
    element._haxstate = false
    element._clickPrevent(evt2)
    expect(evt2.defaultPrevented).to.equal(false)
  })

  it('exposes the hax hooks contract', () => {
    expect(element.haxHooks()).to.deep.equal({
      editModeChanged: 'haxeditModeChanged',
      activeElementChanged: 'haxactiveElementChanged',
    })
  })

  it('haxeditModeChanged toggles the hax state flag', () => {
    element.haxeditModeChanged(true)
    expect(element._haxstate).to.equal(true)
    element.haxeditModeChanged(false)
    expect(element._haxstate).to.equal(false)
  })

  it('haxactiveElementChanged only activates on a truthy value', () => {
    element.haxactiveElementChanged(null, false)
    expect(element._haxstate).to.equal(false)
    element.haxactiveElementChanged(null, true)
    expect(element._haxstate).to.equal(true)
    element.haxactiveElementChanged(null, false)
    expect(element._haxstate).to.equal(true)
  })

  it('references its haxProperties schema by file URL', () => {
    expect(PolarisMark.haxProperties.endsWith('polaris-mark.haxProperties.json')).to.equal(true)
  })

  it('passes the a11y audit with content', async () => {
    const populated = await fixture(
      html`<polaris-mark
        name="Eberly"
        name2="College of"
        name3="Science"
      ></polaris-mark>`,
    )
    await populated.updateComplete
    await expect(populated).shadowDom.to.be.accessible({
      ignoredRules: ['color-contrast'],
    })
  })
})
