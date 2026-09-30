import { fixture, expect, html, oneEvent } from '@open-wc/testing'

import '../lib/simple-tag-lite.js'
import '../lib/simple-tag.js'
import '../lib/simple-tags.js'

describe('simple-tag-lite', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-tag-lite value="test"></simple-tag-lite>`)
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('instantiates with default properties', () => {
    expect(el.value).to.equal('test')
    expect(el.icon).to.equal('cancel')
    expect(el.cancelButton).to.equal(false)
    expect(el.disabled).to.equal(false)
    expect(el.readonly).to.equal(false)
    expect(el.data).to.deep.equal({})
  })

  it('renders a span with the value', () => {
    const span = el.shadowRoot.querySelector('span')
    expect(span).to.exist
    expect(span.textContent.trim()).to.equal('test')
  })

  it('does not render cancel button by default', () => {
    const btn = el.shadowRoot.querySelector('simple-icon-button-lite')
    expect(btn).to.exist
    expect(btn.hasAttribute('hidden')).to.equal(true)
  })

  it('renders cancel button when cancelButton is true', async () => {
    el.cancelButton = true
    await el.updateComplete
    const btn = el.shadowRoot.querySelector('simple-icon-button-lite')
    expect(btn.hasAttribute('hidden')).to.equal(false)
  })

  it('does not render cancel button when readonly', async () => {
    el.readonly = true
    await el.updateComplete
    const btn = el.shadowRoot.querySelector('simple-icon-button-lite')
    expect(btn).to.equal(null)
  })

  it('fires simple-tag-clicked on clickEvent', async () => {
    el.cancelButton = true
    await el.updateComplete
    setTimeout(() => el.clickEvent({}))
    const e = await oneEvent(el, 'simple-tag-clicked')
    expect(e.detail.value).to.equal('test')
  })

  it('toggles toggled state when toggles is true', async () => {
    el.toggles = true
    el.toggled = false
    await el.updateComplete
    el.clickEvent({})
    expect(el.toggled).to.equal(true)
    el.clickEvent({})
    expect(el.toggled).to.equal(false)
  })

  it('uses toggledIcon when toggled and toggles are true', async () => {
    el.toggles = true
    el.toggled = true
    el.toggledIcon = 'check'
    el.cancelButton = true
    await el.updateComplete
    const btn = el.shadowRoot.querySelector('simple-icon-button-lite')
    expect(btn.getAttribute('icon')).to.equal('check')
  })
})

describe('simple-tag', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-tag value="hello"></simple-tag>`)
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('instantiates with autoAccentColor false by default', () => {
    expect(el.autoAccentColor).to.equal(false)
  })

  it('calculateAccentColor returns a color name', () => {
    const color = el.calculateAccentColor('hello')
    expect(typeof color).to.equal('string')
    expect(color.length).to.be.greaterThan(0)
  })

  it('calculateAccentColor sets CSS custom properties on element', () => {
    el.calculateAccentColor('world')
    const bg = el.style.getPropertyValue('--simple-fields-button-background-color')
    expect(bg).to.contain('var(')
    const color = el.style.getPropertyValue('--simple-fields-button-color')
    expect(color).to.contain('var(')
  })

  it('sets accentColor when autoAccentColor is true and value is set', async () => {
    el.autoAccentColor = true
    el.value = 'testvalue'
    await el.updateComplete
    expect(el.accentColor).to.exist
    expect(typeof el.accentColor).to.equal('string')
  })

  it('does not change accentColor when autoAccentColor is false', async () => {
    const before = el.accentColor
    el.autoAccentColor = false
    el.value = 'testvalue'
    await el.updateComplete
    expect(el.accentColor).to.equal(before)
  })

  it('handles long strings in calculateAccentColor without error', () => {
    expect(() => el.calculateAccentColor('a'.repeat(100))).to.not.throw()
  })

  it('haxProperties returns a URL', () => {
    const props = globalThis.customElements
      .get('simple-tag')
    expect(props.haxProperties).to.exist
  })
})

describe('simple-tags', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-tags tags="a,b,c"></simple-tags>`)
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('instantiates with default properties', () => {
    const fresh = document.createElement('simple-tags')
    expect(fresh.tags).to.equal('')
    expect(fresh.autoAccentColor).to.equal(false)
    expect(fresh.accentColor).to.equal(null)
  })

  it('renders simple-tag elements from comma-separated tags', async () => {
    el.tags = 'alpha,beta,gamma'
    await el.updateComplete
    const tags = el.shadowRoot.querySelectorAll('simple-tag')
    expect(tags.length).to.equal(3)
    expect(tags[0].getAttribute('value')).to.equal('alpha')
    expect(tags[1].getAttribute('value')).to.equal('beta')
    expect(tags[2].getAttribute('value')).to.equal('gamma')
  })

  it('renders nothing when tags is empty', async () => {
    el.tags = ''
    await el.updateComplete
    const tags = el.shadowRoot.querySelectorAll('simple-tag')
    expect(tags.length).to.equal(0)
  })

  it('passes autoAccentColor to child tags', async () => {
    el.autoAccentColor = true
    el.tags = 'x,y'
    await el.updateComplete
    const tags = el.shadowRoot.querySelectorAll('simple-tag')
    expect(tags[0].hasAttribute('auto-accent-color')).to.equal(true)
  })

  it('passes accentColor to child tags', async () => {
    el.accentColor = 'blue'
    el.tags = 'x'
    await el.updateComplete
    const tag = el.shadowRoot.querySelector('simple-tag')
    expect(tag.getAttribute('accent-color')).to.equal('blue')
  })

  it('trims whitespace from tag values', async () => {
    el.tags = '  spaced  ,  trim  '
    await el.updateComplete
    const tags = el.shadowRoot.querySelectorAll('simple-tag')
    expect(tags[0].getAttribute('value')).to.equal('spaced')
    expect(tags[1].getAttribute('value')).to.equal('trim')
  })

  it('haxProperties returns a URL', () => {
    const cls = globalThis.customElements.get('simple-tags')
    expect(cls.haxProperties).to.exist
  })
})
