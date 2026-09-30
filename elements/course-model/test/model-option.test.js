import { fixture, expect, html } from '@open-wc/testing'

import '../lib/model-option.js'
import { ModelOption } from '../lib/model-option.js'
import '../course-model.js'

describe('model-option', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('model-option')).to.exist
  })

  it('has the expected static tag', () => {
    expect(ModelOption.tag).to.equal('model-option')
  })

  it('has default property values', async () => {
    const el = await fixture(html`<model-option></model-option>`)
    expect(el.title).to.equal('')
    expect(el.url).to.equal('')
    expect(el.src).to.equal('')
  })

  it('renders the option card with title and slot content', async () => {
    const el = await fixture(html`
      <model-option title="Astronaut Suit">
        <p>Explore the suit.</p>
      </model-option>
    `)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('a')).to.exist
    expect(el.shadowRoot.querySelector('#accent-color')).to.exist
    expect(
      el.shadowRoot.querySelector('#title h2').textContent,
    ).to.equal('Astronaut Suit')
    expect(el.textContent).to.include('Explore the suit.')
  })

  it('dispatches a composed model-select event on click', async () => {
    const el = await fixture(
      html`<model-option title="Moon Model" src="moon.gltf"></model-option>`,
    )
    await el.updateComplete
    let caught = null
    el.addEventListener('model-select', (e) => {
      caught = e
    })
    el.shadowRoot.querySelector('a').click()
    expect(caught).to.exist
    // the detail is the element itself so course-model can read src/title
    expect(caught.detail).to.exist
    expect(caught.detail.src).to.equal('moon.gltf')
    expect(caught.detail.title).to.equal('Moon Model')
    expect(caught.bubbles).to.be.true
    expect(caught.composed).to.be.true
  })

  it('drives a parent course-model through model-select', async () => {
    const parent = await fixture(html`
      <course-model title="Course" src="course.gltf">
        <model-option title="Rocket Model" src="rocket.gltf"></model-option>
      </course-model>
    `)
    await parent.updateComplete
    const option = parent.querySelector('model-option')
    option.shadowRoot.querySelector('a').click()
    await parent.updateComplete
    expect(parent.src).to.equal('rocket.gltf')
    expect(parent.title).to.equal('Rocket Model')
    expect(parent.visible).to.equal('model')
  })
})
