import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import { LrndesignImagemap } from '../lrndesign-imagemap.js'
// import the hotspot lib directly so its own file counts in coverage and so
// hotspot children are upgraded before the svg fetch handler runs
import { LrndesignImagemapHotspot } from '../lib/lrndesign-imagemap-hotspot.js'

const svgText =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
  '<title>Map title</title>' +
  '<desc>Map description</desc>' +
  '<circle id="spot-a" cx="20" cy="20" r="10"/>' +
  '<circle id="spot-b" cx="60" cy="60" r="10"/>' +
  '</svg>'

// data uri keeps the svg fetch fully offline
const svgDataUri = 'data:image/svg+xml,' + encodeURIComponent(svgText)

// reads an attribute by its exact stored name. getAttribute lowercases its
// query, so attributes written via setAttribute with camelCase names (see
// the aria bugs below) can only be read by scanning the attribute list.
const getStoredAttr = (el, name) => {
  for (let i = 0; i < el.attributes.length; i++) {
    if (el.attributes[i].name === name) return el.attributes[i].value
  }
  return null
}

// NOTE: the unlabeled (heading-slot branch) fixture is covered by the
// 'heading-slot branch' describe below. relative-heading used to rewrite
// its own innerHTML in updateContents(), which ejected this element's Lit
// ChildPart markers when the no-label slot branch rendered and threw
// unhandled "ChildPart has no parentNode" errors; updateContents() now
// replaces only the heading node (and leaves slotted content alone), so
// the slot branch is safe to exercise.
describe('lrndesign-imagemap', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <lrndesign-imagemap
        label="Test map"
        parent="heading-x"
        src="${svgDataUri}"
      >
        <div slot="desc"><p>A test map description.</p></div>
        <lrndesign-imagemap-hotspot
          hotspot-id="spot-a"
          label="Spot A"
          position="left"
        >
          First hotspot details.
        </lrndesign-imagemap-hotspot>
        <lrndesign-imagemap-hotspot hotspot-id="spot-b" label="Spot B">
          Second hotspot details.
        </lrndesign-imagemap-hotspot>
      </lrndesign-imagemap>
    `)
    await aTimeout(300)
  })

  it('is an instance of LrndesignImagemap', async () => {
    expect(element).to.be.instanceOf(LrndesignImagemap)
    expect(LrndesignImagemap.tag).to.equal('lrndesign-imagemap')
  })

  it('loads the svg from its source and slots it', async () => {
    const svg = element.querySelector('svg')
    expect(svg).to.exist
    expect(svg.getAttribute('slot')).to.equal('svg')
    // the svg is labelled by its title and desc info nodes through the
    // valid all-lowercase aria-labelledby / aria-describedby attributes
    expect(svg.getAttribute('aria-labelledby')).to.equal(
      svg.querySelector('title').getAttribute('id'),
    )
    expect(svg.getAttribute('aria-describedby')).to.equal(
      svg.querySelector('desc').getAttribute('id'),
    )
    // the old camelCase setAttribute names no longer exist in the DOM
    expect(getStoredAttr(svg, 'aria-labelledBy')).to.equal(null)
    expect(getStoredAttr(svg, 'aria-describedBy')).to.equal(null)
  })

  it('scrapes hotspot details from hotspot children', async () => {
    expect(element.hotspotDetails.length).to.equal(2)
    const first = element.hotspotDetails[0]
    const second = element.hotspotDetails[1]
    expect(first.id).to.equal('spot-a')
    expect(first.label).to.equal('Spot A')
    expect(first.position).to.equal('left')
    // unspecified positions fall back to bottom
    expect(second.position).to.equal('bottom')
    expect(first.print).to.be.instanceOf(LrndesignImagemapHotspot)
    // the interactive svg shapes are turned into named buttons that control
    // the figure; aria-label comes from the hotspot's own label
    expect(first.hotspot.getAttribute('role')).to.equal('button')
    expect(first.hotspot.getAttribute('aria-label')).to.equal('Spot A')
    expect(first.hotspot.getAttribute('aria-controls')).to.equal('figure')
    expect(getStoredAttr(first.hotspot, 'controls')).to.equal(null)
    expect(first.hotspot.classList.contains('hotspot')).to.equal(true)
    // details are cloned into slottable divs
    expect(first.details.getAttribute('slot')).to.equal('details')
    expect(first.details.textContent.trim()).to.equal('First hotspot details.')
  })

  it('renders label heading and description slots', async () => {
    const heading = element.shadowRoot.querySelector('#heading')
    expect(heading).to.exist
    expect(heading.querySelector('h1').textContent).to.equal('Test map')
    expect(element.shadowRoot.querySelector('#desc')).to.exist
    expect(element.shadowRoot.querySelector('slot[name="desc"]')).to.exist
    expect(element.shadowRoot.querySelector('slot[name="svg"]')).to.exist
    expect(element.shadowRoot.querySelector('#buttons')).to.exist
  })

  it('renders the popover for the active hotspot', async () => {
    let popover = element.shadowRoot.querySelector('simple-popover')
    // no active hotspot yet: popover is hidden and defaults to bottom
    expect(popover.hasAttribute('hidden')).to.equal(true)
    expect(popover.getAttribute('position')).to.equal('bottom')
    expect(popover.querySelector('h2').textContent).to.equal('')
    element.openHotspot(element.hotspotDetails[0])
    await element.updateComplete
    popover = element.shadowRoot.querySelector('simple-popover')
    expect(popover.hasAttribute('hidden')).to.equal(false)
    expect(popover.getAttribute('position')).to.equal('left')
    expect(popover.querySelector('h2').textContent).to.equal('Spot A')
  })

  it('selects a hotspot from a click on its svg shape', async () => {
    const shape = element.querySelector('#spot-a')
    shape.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await element.updateComplete
    expect(element.__activeHotspot.id).to.equal('spot-a')
    expect(shape.classList.contains('selected')).to.equal(true)
    expect(element.hotspotDetails[0].details.style.display).to.equal('block')
    expect(element.hotspotDetails[1].details.style.display).to.equal('none')
    expect(
      element.hotspotDetails[1].hotspot.classList.contains('selected'),
    ).to.equal(false)
  })

  it('deselects hotspots via resetHotspots', async () => {
    element.openHotspot(element.hotspotDetails[0])
    await element.updateComplete
    expect(
      element.hotspotDetails[0].hotspot.classList.contains('selected'),
    ).to.equal(true)
    element.resetHotspots()
    expect(
      element.hotspotDetails[0].hotspot.classList.contains('selected'),
    ).to.equal(false)
  })

  it('closeHotspot resets selection without throwing', async () => {
    element.openHotspot(element.hotspotDetails[0])
    await element.updateComplete
    // closeHotspot focuses the hotspot's svg shape instead of the plain
    // hotspot detail object and tolerates no active hotspot
    element.closeHotspot()
    element.closeHotspot()
    expect(
      element.hotspotDetails[0].hotspot.classList.contains('selected'),
    ).to.equal(false)
  })

  it('generates and reuses ids for info nodes', async () => {
    const svg = element.querySelector('svg')
    const titleId = element._getInfoNode(svg, 'title')
    expect(svg.querySelector('title').getAttribute('id')).to.equal(titleId)
    // calling again returns the same id instead of generating a new one
    expect(element._getInfoNode(svg, 'title')).to.equal(titleId)
    const descId = element._getInfoNode(svg, 'desc')
    expect(svg.querySelector('desc').getAttribute('id')).to.equal(descId)
  })

  it('creates missing info nodes inside the svg', async () => {
    const bareSvg = globalThis.document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    )
    const titleId = element._getInfoNode(bareSvg, 'title')
    expect(bareSvg.querySelector('title')).to.exist
    expect(bareSvg.querySelector('title').getAttribute('id')).to.equal(titleId)
    const descId = element._getInfoNode(bareSvg, 'desc')
    expect(bareSvg.querySelector('desc')).to.exist
    expect(bareSvg.querySelector('desc').getAttribute('id')).to.equal(descId)
  })

  it('seeds missing info nodes from the heading and desc', async () => {
    const bareSvg = globalThis.document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg',
    )
    element._getInfoNode(bareSvg, 'title')
    // the shadow heading supplies the new title's seeded content; svg
    // elements escape assigned markup, so assert on the seeded text
    expect(bareSvg.querySelector('title').textContent).to.include(
      'Test map',
    )
    element._getInfoNode(bareSvg, 'desc')
    // the shadow desc supplies the new desc's seeded markup; unlike an
    // html title (rcdata), a desc parses its markup into child elements
    expect(bareSvg.querySelector('desc').innerHTML).to.include('slot')
  })

  it('gets or generates element ids', async () => {
    const tagged = globalThis.document.createElement('div')
    tagged.setAttribute('id', 'known-id')
    expect(element._getId(tagged)).to.equal('known-id')
    const untagged = globalThis.document.createElement('div')
    const generated = element._getId(untagged)
    expect(generated).to.be.a('string')
    expect(untagged.getAttribute('id')).to.equal(generated)
  })
})

describe('lrndesign-imagemap-hotspot', () => {
  let hotspot
  beforeEach(async () => {
    hotspot = await fixture(html`
      <lrndesign-imagemap-hotspot
        hotspot-id="spot-a"
        label="Spot A"
        position="left"
      >
        Print details.
      </lrndesign-imagemap-hotspot>
    `)
  })

  it('is an instance of LrndesignImagemapHotspot with defaults', async () => {
    expect(hotspot).to.be.instanceOf(LrndesignImagemapHotspot)
    expect(LrndesignImagemapHotspot.tag).to.equal(
      'lrndesign-imagemap-hotspot',
    )
    expect(hotspot.hotspotId).to.equal('spot-a')
    expect(hotspot.getAttribute('hotspot-id')).to.equal('spot-a')
    expect(hotspot.label).to.equal('Spot A')
    expect(hotspot.position).to.equal('left')
  })

  it('renders a print-ready figure with heading and slots', async () => {
    expect(
      hotspot.shadowRoot.querySelector('figure.hotspot-print'),
    ).to.exist
    // the print sub-heading carries default-level=2 so it stays an h2 even
    // when the parent "heading" has not registered yet (e.g. standalone
    // usage), instead of flipping to a top-level h1 on upgrade timing
    const heading = hotspot.shadowRoot.querySelector(
      'figure.hotspot-print relative-heading h2',
    )
    expect(heading).to.exist
    expect(hotspot.shadowRoot.querySelector(
      'figure.hotspot-print relative-heading h1',
    )).to.not.exist
    expect(heading.textContent).to.equal('Spot A')
    expect(hotspot.shadowRoot.querySelector('#desc slot')).to.exist
    expect(
      hotspot.shadowRoot.querySelector('slot[name="svg"]'),
    ).to.exist
  })

  it('loads a printable svg and marks its hotspots', async () => {
    hotspot.loadSvg(svgText, ['spot-a', 'spot-b'])
    const svg = hotspot.querySelector('svg')
    expect(svg).to.exist
    // the print svg is labeled directly from the hotspot's own label since
    // shadow-root IDREFs cannot reach it from light DOM
    expect(svg.getAttribute('aria-label')).to.equal('Spot A')
    expect(getStoredAttr(svg, 'aria-labelledBy')).to.equal(null)
    expect(getStoredAttr(svg, 'aria-describedBy')).to.equal(null)
    expect(
      svg.querySelector('#spot-a').classList.contains('hotspot'),
    ).to.equal(true)
    // its own hotspot id is preselected
    expect(
      svg.querySelector('#spot-a').classList.contains('selected'),
    ).to.equal(true)
    expect(
      svg.querySelector('#spot-b').classList.contains('selected'),
    ).to.equal(false)
    // the printed svg lands in the hotspot's own svg slot by name
    expect(svg.getAttribute('slot')).to.equal('svg')
  })

  it('setParentHeading updates the printed sub-heading parent', async () => {
    // the selector matches the rendered relative-heading id="sub-heading"
    // so the public method actually resolves and updates its parent
    hotspot.setParentHeading('heading-x')
    const heading = hotspot.shadowRoot.querySelector('#sub-heading')
    expect(heading.parent).to.equal('heading-x')
    // the parent property reflects its attribute on the next update
    await heading.updateComplete
    expect(heading.getAttribute('parent')).to.equal('heading-x')
  })
})

describe('lrndesign-imagemap heading-slot branch', () => {
  // regression for the ChildPart crash: with no label, the heading renders
  // a slot inside relative-heading; relative-heading's updateContents used
  // to rewrite its own innerHTML wholesale, ejecting the imagemap's Lit
  // ChildPart markers, so re-renders (and branch switches) threw unhandled
  // 'ChildPart has no parentNode' errors that hung the whole test session
  it('renders a slotted heading and survives re-renders', async () => {
    const element = await fixture(html`
      <lrndesign-imagemap src="${svgDataUri}">
        <h2 slot="heading">Slotted map heading</h2>
        <div slot="desc"><p>Slotted map description.</p></div>
        <lrndesign-imagemap-hotspot hotspot-id="spot-a" label="Spot A">
          First hotspot details.
        </lrndesign-imagemap-hotspot>
      </lrndesign-imagemap>
    `)
    await aTimeout(300)
    const heading = element.shadowRoot.querySelector('#heading')
    expect(heading).to.exist
    // the slotted heading content renders through the heading slot and the
    // slot itself is left in place by updateContents
    const headingSlot = heading.querySelector('slot[name="heading"]')
    expect(headingSlot).to.exist
    expect(headingSlot.assignedElements()[0].textContent).to.equal(
      'Slotted map heading',
    )
    // re-renders (opening a hotspot) keep working across the upgrade
    element.openHotspot(element.hotspotDetails[0])
    await element.updateComplete
    expect(element.__activeHotspot.id).to.equal('spot-a')
    const popover = element.shadowRoot.querySelector('simple-popover')
    expect(popover.querySelector('h2').textContent).to.equal('Spot A')
    // switching the label branch re-commits the same child part safely
    element.label = 'Now labeled'
    await element.updateComplete
    expect(heading.querySelector('h1').textContent).to.equal('Now labeled')
  })
})
