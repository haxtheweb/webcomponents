import { fixture, expect, html } from '@open-wc/testing'

import '../lib/learning-component.js'
import {
  LearningComponent,
  iconFromPageType,
  learningComponentColors,
  learningComponentTypes,
} from '../lib/learning-component.js'

describe('learning-component', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('learning-component')).to.exist
  })

  it('has the expected static tag', () => {
    expect(LearningComponent.tag).to.equal('learning-component')
  })

  it('has default property values', async () => {
    const el = await fixture(html`<learning-component></learning-component>`)
    expect(el.type).to.equal('')
    expect(el.icon).to.equal(null)
    expect(el.title).to.equal(null)
    expect(el.subtitle).to.equal(null)
    expect(el.url).to.equal(null)
    expect(el.t.readMore).to.equal('Read More')
  })

  it('renders the header, title, subtitle, and content slots', async () => {
    const el = await fixture(html`
      <learning-component title="Objective" subtitle="Unit 1">
        <p>Learn things</p>
      </learning-component>
    `)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.header')).to.exist
    expect(el.shadowRoot.querySelector('.title').textContent).to.equal(
      'Objective',
    )
    expect(el.shadowRoot.querySelector('.sub-title').textContent).to.equal(
      'Unit 1',
    )
    expect(el.shadowRoot.querySelector('.content slot')).to.exist
    expect(el.querySelector('p').textContent).to.equal('Learn things')
    await expect(el).shadowDom.to.be.accessible()
  })

  it('applies type driven accent color, title, and icon on change', async () => {
    const el = await fixture(html`<learning-component></learning-component>`)
    el.type = 'read'
    await el.updateComplete
    expect(el.accentColor).to.equal(learningComponentColors['read'])
    expect(el.title).to.equal(learningComponentTypes['read'])
    expect(el.icon).to.equal(iconFromPageType('read'))
  })

  it('renders a read more button when a url is set', async () => {
    const el = await fixture(html`
      <learning-component
        title="Explore"
        url="https://example.com/more"
      >
        <p>Content</p>
      </learning-component>
    `)
    await el.updateComplete
    const content = el.shadowRoot.querySelector('.content')
    expect(content.classList.contains('urlPresent')).to.be.true
    const link = el.shadowRoot.querySelector('.urlbutton a')
    expect(link.getAttribute('href')).to.equal('https://example.com/more')
    expect(link.getAttribute('target')).to.equal('_blank')
    expect(link.getAttribute('rel')).to.equal('nofollow noopener')
    expect(
      el.shadowRoot.querySelector('.urlbutton simple-tooltip').textContent,
    ).to.equal('Read More')
    await expect(el).shadowDom.to.be.accessible()
  })

  it('exposes haxProperties with grid layout and type options', () => {
    const props = LearningComponent.haxProperties
    expect(props.type).to.equal('grid')
    expect(props.canScale).to.be.false
    expect(props.hideDefaultSettings).to.be.true
    expect(props.gizmo.title).to.equal('Learning Component')
    const configure = props.settings.configure
    expect(configure.length).to.equal(7)
    const typeSetting = configure.find((s) => s.property === 'type')
    expect(typeSetting.options['']).to.equal('')
    expect(typeSetting.options.read).to.equal(learningComponentTypes.read)
    expect(props.saveOptions.unsetAttributes).to.deep.equal(['t'])
    expect(props.demoSchema[0].tag).to.equal('learning-component')
    expect(props.demoSchema[0].properties.subtitle).to.equal('Unit 1')
  })
})
