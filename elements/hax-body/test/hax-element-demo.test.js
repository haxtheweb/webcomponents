import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import '../lib/hax-element-demo.js'
import { HaxElementDemo } from '../lib/hax-element-demo.js'

describe('hax-element-demo', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-element-demo></hax-element-demo>`)
    await el.updateComplete
  })

  it('instantiates with default props', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-element-demo')
    expect(el.renderTag).to.be.null
    expect(el.activePickerSchema).to.equal(-1)
    expect(el.gizmoTitle).to.equal('')
    expect(el.gizmoDescription).to.equal('')
    expect(el.gizmoIcon).to.equal('')
  })

  it('has static tag', () => {
    expect(HaxElementDemo.tag).to.equal('hax-element-demo')
  })

  it('renders preview-wrap slot', () => {
    const wrap = el.shadowRoot.querySelector('.preview-wrap')
    expect(wrap).to.exist
  })

  it('renders info section when gizmoTitle is set', async () => {
    el.gizmoTitle = 'Test Title'
    await el.updateComplete
    const info = el.shadowRoot.querySelector('.info')
    expect(info).to.exist
    const title = el.shadowRoot.querySelector('.title')
    expect(title).to.exist
  })

  it('does not render info section when no title or description', async () => {
    el.gizmoTitle = ''
    el.gizmoDescription = ''
    await el.updateComplete
    const info = el.shadowRoot.querySelector('.info')
    expect(info).to.be.null
  })

  it('truncates description over 200 chars', async () => {
    const longDesc = 'A'.repeat(250)
    el.gizmoDescription = longDesc
    await el.updateComplete
    const desc = el.shadowRoot.querySelector('.description')
    expect(desc).to.exist
    expect(desc.textContent).to.contain('...')
    expect(desc.textContent.length).to.be.lessThan(longDesc.length)
  })

  it('does not truncate description under 200 chars', async () => {
    el.gizmoDescription = 'Short desc'
    await el.updateComplete
    const desc = el.shadowRoot.querySelector('.description')
    expect(desc).to.exist
    expect(desc.textContent).to.equal('Short desc')
    expect(desc.textContent).to.not.contain('...')
  })

  it('renders icon when gizmoIcon is set', async () => {
    el.gizmoTitle = 'T'
    el.gizmoIcon = 'icons:add'
    await el.updateComplete
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon).to.exist
    expect(icon.getAttribute('icon')).to.equal('icons:add')
  })
})
