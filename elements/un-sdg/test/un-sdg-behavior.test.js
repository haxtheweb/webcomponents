import { fixture, expect, html, elementUpdated } from '@open-wc/testing'
import { UnSdg, unSDGGoalData } from '../un-sdg.js'

describe('un-sdg behavior', () => {
  it('has sensible constructor defaults', async () => {
    const el = await fixture(html`<un-sdg></un-sdg>`)
    expect(el.goal).to.equal(1)
    // alt is derived from goal on the first update cycle
    expect(el.alt).to.equal('Goal 1: No Poverty')
    expect(el.colorOnly).to.be.false
    expect(el.loading).to.equal('lazy')
    expect(el.fetchpriority).to.equal('low')
    expect(UnSdg.tag).to.equal('un-sdg')
  })
  it('exposes haxProperties file url', () => {
    expect(UnSdg.haxProperties).to.include('lib/un-sdg.haxProperties.json')
  })
  it('renders the goal image with derived alt and oer metadata', async () => {
    const el = await fixture(html`<un-sdg goal="1"></un-sdg>`)
    const img = el.shadowRoot.querySelector('img')
    expect(img).to.exist
    expect(img.getAttribute('src')).to.include('goal-1.svg')
    expect(img.getAttribute('alt')).to.equal('Goal 1: No Poverty')
    expect(img.getAttribute('loading')).to.equal('lazy')
    expect(img.getAttribute('fetchpriority')).to.equal('low')
    expect(img.getAttribute('property')).to.equal('oer:image')
    const meta = el.shadowRoot.querySelector('meta')
    expect(meta.getAttribute('property')).to.equal('oer:name')
    expect(meta.getAttribute('content')).to.equal('No Poverty')
  })
  it('reflects the goal attribute and marks itself an oer:Topic', async () => {
    const el = await fixture(html`<un-sdg goal="5"></un-sdg>`)
    await elementUpdated(el)
    expect(el.getAttribute('goal')).to.equal('5')
    expect(el.getAttribute('typeof')).to.equal('oer:Topic')
    expect(el.shadowRoot.querySelector('img').getAttribute('alt')).to.equal(
      'Goal 5: Gender Equality',
    )
  })
  it('passes loading and fetchpriority through to the image', async () => {
    const el = await fixture(
      html`<un-sdg goal="2" loading="eager" fetchpriority="high"></un-sdg>`,
    )
    await elementUpdated(el)
    const img = el.shadowRoot.querySelector('img')
    expect(img.getAttribute('loading')).to.equal('eager')
    expect(img.getAttribute('fetchpriority')).to.equal('high')
  })
  it('renders a color block when color-only is set', async () => {
    const el = await fixture(html`<un-sdg goal="13" color-only></un-sdg>`)
    const div = el.shadowRoot.querySelector('div')
    expect(div).to.exist
    expect(div.getAttribute('style')).to.include('background-color: #3f7e44')
    expect(el.shadowRoot.querySelector('img')).to.not.exist
    expect(el.shadowRoot.querySelector('meta').getAttribute('content')).to.equal(
      'Climate Action',
    )
  })
  it('self-corrects invalid goals back to goal 1', async () => {
    const high = await fixture(html`<un-sdg goal="99"></un-sdg>`)
    await elementUpdated(high)
    expect(high.goal).to.equal(1)
    expect(high.getAttribute('goal')).to.equal('1')
    expect(high.shadowRoot.querySelector('img').getAttribute('src')).to.include(
      'goal-1.svg',
    )
    const zero = await fixture(html`<un-sdg goal="0"></un-sdg>`)
    await elementUpdated(zero)
    expect(zero.goal).to.equal(1)
    const negative = await fixture(html`<un-sdg goal="-3"></un-sdg>`)
    await elementUpdated(negative)
    expect(negative.goal).to.equal(1)
    expect(negative.shadowRoot.querySelector('img').getAttribute('src')).to.include(
      'goal-1.svg',
    )
  })
  it('re-derives alt when the goal property changes', async () => {
    const el = await fixture(html`<un-sdg goal="3"></un-sdg>`)
    el.goal = 17
    await elementUpdated(el)
    expect(el.alt).to.equal('Goal 17: Partnerships for the Goals')
    expect(el.shadowRoot.querySelector('img').getAttribute('alt')).to.equal(
      'Goal 17: Partnerships for the Goals',
    )
    expect(el.shadowRoot.querySelector('img').getAttribute('src')).to.include(
      'goal-17.svg',
    )
  })
  it('ships all 17 goal records with colors and images', () => {
    expect(unSDGGoalData.length).to.equal(17)
    expect(unSDGGoalData[0].name).to.equal('No Poverty')
    expect(unSDGGoalData[0].color).to.equal('#e5243b')
    expect(unSDGGoalData[0].image).to.include('goal-1.svg')
    expect(unSDGGoalData[16].name).to.equal('Partnerships for the Goals')
    expect(unSDGGoalData[16].image).to.include('goal-17.svg')
    unSDGGoalData.forEach((goal) => {
      expect(goal.color).to.match(/^#[0-9a-f]{6}$/)
      expect(goal.image).to.include('goal-')
    })
  })
  it('meets a11y standards in both render modes', async () => {
    const imgMode = await fixture(html`<un-sdg goal="6"></un-sdg>`)
    await expect(imgMode).shadowDom.to.be.accessible()
    const colorMode = await fixture(html`<un-sdg goal="6" color-only></un-sdg>`)
    await expect(colorMode).shadowDom.to.be.accessible()
  })
})
