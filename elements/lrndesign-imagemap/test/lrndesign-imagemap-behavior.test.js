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

// NOTE: this suite deliberately avoids an unlabeled (heading-slot branch)
// fixture. lrndesign-imagemap dynamically imports relative-heading at
// construct time; once upgraded, relative-heading's updateContents() rewrites
// its own innerHTML and ejects this element's Lit ChildPart markers when the
// no-label slot branch renders, throwing unhandled "ChildPart has no
// parentNode" errors that destabilize the whole test session. That
// interaction is a bug in the element (dynamically imported relative-heading
// performing innerHTML surgery inside a Lit template), not test flakiness to
// paper over, so the slot branch is left uncovered here rather than exercised.
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
    // BUG: lrndesign-imagemap.js:176-177 uses setAttribute with camelCase
    // names (aria-labelledBy / aria-describedBy). The DOM preserves that
    // casing, so the valid all-lowercase aria-labelledby / aria-describedby
    // never exist; getAttribute lowercases its query and therefore can never
    // even read the stored camelCase names; and an axe audit flags them as
    // invalid ARIA attributes. Exposed by 'loads the svg from its source and
    // slots it'.
    expect(svg.getAttribute('aria-labelledby')).to.not.exist
    expect(svg.getAttribute('aria-describedby')).to.not.exist
    // the mis-cased attributes still carry the generated info node ids
    expect(getStoredAttr(svg, 'aria-labelledBy')).to.equal(
      svg.querySelector('title').getAttribute('id'),
    )
    expect(getStoredAttr(svg, 'aria-describedBy')).to.equal(
      svg.querySelector('desc').getAttribute('id'),
    )
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
    // the interactive svg shapes are turned into buttons
    expect(first.hotspot.getAttribute('role')).to.equal('button')
    expect(first.hotspot.getAttribute('controls')).to.equal('figure')
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

  it('closeHotspot resets selection', async () => {
    element.openHotspot(element.hotspotDetails[0])
    await element.updateComplete
    // BUG: lrndesign-imagemap.js:266 calls this.__activeHotspot.focus() but
    // __activeHotspot is a plain hotspot detail object, not a DOM node, so
    // closeHotspot always throws after resetting the selection. Exposed by
    // 'closeHotspot resets selection'.
    expect(() => element.closeHotspot()).to.throw(TypeError)
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
    expect(bareSvg.querySelector('desc').getAttribute('id')).to.equal(descId)
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
    // BUG: the render outputs <h2>Spot A</h2> inside relative-heading, but
    // once the dynamically imported relative-heading upgrades, its
    // updateContents() rewrites that light DOM to <h1>Spot A</h1> (level 1
    // before the manager resolves parent="heading"), so the printed
    // subheading lands as a top-level h1 and the level flips depending on
    // upgrade timing. Assert on whichever heading survives. Exposed by
    // 'renders a print-ready figure with heading and slots'.
    const heading = hotspot.shadowRoot.querySelector(
      'figure.hotspot-print relative-heading h1, figure.hotspot-print relative-heading h2',
    )
    expect(heading).to.exist
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
    // BUG: lrndesign-imagemap-hotspot.js:86-87 uses setAttribute with
    // camelCase names (aria-labelledBy / aria-describedBy); the DOM
    // preserves that casing so the valid all-lowercase aria-labelledby /
    // aria-describedby never exist, getAttribute can never read the stored
    // names, and an axe audit flags them as invalid. Exposed by 'loads a
    // printable svg and marks its hotspots'.
    expect(getStoredAttr(svg, 'aria-labelledBy')).to.equal('sub-heading')
    expect(getStoredAttr(svg, 'aria-describedBy')).to.equal(
      'sub-heading desc',
    )
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
    // BUG: lrndesign-imagemap-hotspot.js:85 assigns the ENTIRE svg text to
    // the slot attribute (slot.slot = svg) instead of a slot name, so the
    // printed svg never actually lands in the hotspot's svg slot. Exposed
    // by 'loads a printable svg and marks its hotspots'.
    expect(svg.getAttribute('slot')).to.equal(svgText)
  })

  it('setParentHeading targets a heading that does not exist', async () => {
    // BUG: lrndesign-imagemap-hotspot.js:101 looks for #heading but the
    // render function outputs relative-heading id="sub-heading", so this
    // public method always throws a TypeError. Exposed by
    // 'setParentHeading targets a heading that does not exist'.
    expect(() => hotspot.setParentHeading('heading-x')).to.throw(TypeError)
  })
})
