import { fixture, expect, html } from '@open-wc/testing'
import { PolarisStoryCard } from '../lib/polaris-story-card.js'

// direct lib import so coverage sees lib/polaris-story-card.js statements
describe('polaris-story-card', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`<polaris-story-card></polaris-story-card>`)
    await element.updateComplete
  })

  it('registers as a custom element', () => {
    expect(customElements.get('polaris-story-card')).to.exist
    expect(PolarisStoryCard.tag).to.equal('polaris-story-card')
  })

  it('has default property values', () => {
    expect(element.image).to.equal('')
    expect(element.label).to.equal('')
    expect(element.pillar).to.equal('')
    expect(element.link).to.equal('')
    expect(element.backgroundSize).to.equal('cover')
    expect(element.backgroundAttachment).to.equal('scroll')
    expect(element.editMode).to.equal(false)
  })

  it('renders the bare card without image or link wrappers', () => {
    const sr = element.shadowRoot
    expect(sr.querySelector('.wrapper') === null).to.equal(false)
    expect(sr.querySelector('.card-image') === null).to.equal(true)
    expect(sr.querySelector('a.link') === null).to.equal(true)
    expect(sr.querySelector('.label').textContent.trim()).to.equal('')
    expect(sr.querySelector('.label').textContent.trim()).to.equal('')
  })

  it('keeps the pillar layout box but hides it when empty', async () => {
    const pillar = element.shadowRoot.querySelector('.pillar')
    expect(pillar.classList.contains('pillar-hidden')).to.equal(true)
    element.pillar = 'Research'
    await element.updateComplete
    const pillar2 = element.shadowRoot.querySelector('.pillar')
    expect(pillar2.classList.contains('pillar-hidden')).to.equal(false)
    expect(pillar2.textContent.trim()).to.equal('Research')
  })

  it('renders the card image with role, label and background styles', async () => {
    element.image = '/files/story.jpg'
    element.label = 'A story about impact'
    element.pillar = 'Teaching'
    element.backgroundSize = 'contain'
    element.backgroundAttachment = 'fixed'
    await element.updateComplete
    const cardImage = element.shadowRoot.querySelector('.card-image')
    expect(cardImage === null).to.equal(false)
    expect(cardImage.getAttribute('role')).to.equal('img')
    // aria-label prefers label, then pillar, then the generic fallback
    expect(cardImage.getAttribute('aria-label')).to.equal('A story about impact')
    // no link means the decorative image is exposed
    expect(cardImage.getAttribute('aria-hidden')).to.equal('false')
    const style = cardImage.getAttribute('style')
    expect(style.includes('background-image: url(/files/story.jpg)')).to.equal(
      true,
    )
    expect(style.includes('background-size: contain')).to.equal(true)
    expect(style.includes('background-attachment: fixed')).to.equal(true)
    // aria-label falls back to pillar when label is empty
    element.label = ''
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('.card-image').getAttribute('aria-label'),
    ).to.equal('Teaching')
  })

  it('wraps the card in a link when link is set', async () => {
    element.link = '/story'
    element.label = 'Featured story'
    await element.updateComplete
    const a = element.shadowRoot.querySelector('a.link')
    expect(a === null).to.equal(false)
    expect(a.getAttribute('href')).to.equal('/story')
    expect(a.getAttribute('aria-label')).to.equal('Featured story')
    // a linked image is decorative (the anchor carries the name)
    const cardImage = element.shadowRoot.querySelector('.card-image')
    expect(cardImage === null).to.equal(true)
    element.image = '/files/story.jpg'
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('.card-image').getAttribute('aria-hidden'),
    ).to.equal('true')
    // aria-label falls back to pillar then a generic label
    element.label = ''
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('a.link').getAttribute('aria-label'),
    ).to.equal('Story card')
    element.pillar = 'Impact'
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('a.link').getAttribute('aria-label'),
    ).to.equal('Impact')
  })

  it('maps the background-size / background-attachment attributes', async () => {
    const populated = await fixture(
      html`<polaris-story-card
        image="/a.jpg"
        background-size="50% auto"
        background-attachment="local"
      ></polaris-story-card>`,
    )
    await populated.updateComplete
    expect(populated.backgroundSize).to.equal('50% auto')
    expect(populated.backgroundAttachment).to.equal('local')
  })

  it('blocks link navigation while in edit mode', () => {
    const evt = new Event('click', {
      cancelable: true,
      bubbles: true,
      composed: true,
    })
    element.editMode = true
    element._clickLink(evt)
    expect(evt.defaultPrevented).to.equal(true)
    const evt2 = new Event('click', {
      cancelable: true,
      bubbles: true,
      composed: true,
    })
    element.editMode = false
    element._clickLink(evt2)
    expect(evt2.defaultPrevented).to.equal(false)
  })

  it('exposes the hax hooks contract', () => {
    expect(element.haxHooks()).to.deep.equal({
      editModeChanged: 'haxeditModeChanged',
      activeElementChanged: 'haxactiveElementChanged',
    })
  })

  it('haxeditModeChanged toggles edit mode', () => {
    element.haxeditModeChanged(true)
    expect(element.editMode).to.equal(true)
    element.haxeditModeChanged(false)
    expect(element.editMode).to.equal(false)
  })

  it('haxactiveElementChanged syncs edit mode and returns false', () => {
    expect(element.haxactiveElementChanged(element, true)).to.equal(false)
    expect(element.editMode).to.equal(true)
    element.haxactiveElementChanged(element, false)
    expect(element.editMode).to.equal(false)
  })

  it('references its haxProperties schema by file URL', () => {
    expect(
      PolarisStoryCard.haxProperties.endsWith('polaris-story-card.haxProperties.json'),
    ).to.equal(true)
  })

  it('passes the a11y audit with content', async () => {
    const populated = await fixture(
      html`<polaris-story-card
        image="/files/story.jpg"
        label="A story about impact"
        pillar="Research"
        link="/story"
      ></polaris-story-card>`,
    )
    await populated.updateComplete
    await expect(populated).shadowDom.to.be.accessible({
      ignoredRules: ['color-contrast'],
    })
  })
})
